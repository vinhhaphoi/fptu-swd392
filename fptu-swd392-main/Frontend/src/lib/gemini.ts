import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const DEFAULT_MODEL = "gemini-2.0-flash";

/** Kiểm tra đã cấu hình API key chưa */
export function isGeminiConfigured(): boolean {
    return Boolean(apiKey?.trim());
}

/** Lấy model Gemini dùng chung cho generate text (không schema) */
export function getTextModel(modelName: string = DEFAULT_MODEL) {
    return genAI.getGenerativeModel({ model: modelName });
}

/**
 * Generate text từ prompt (dùng cho chat, gợi ý, tóm tắt, v.v.)
 * Ví dụ: generateText("Giải thích ngắn gọn thì hiện tại đơn trong tiếng Anh.")
 */
export async function generateText(
    prompt: string,
    options?: { model?: string; systemInstruction?: string }
): Promise<string> {
    if (!apiKey) {
        throw new Error(
            "Gemini API key chưa cấu hình. Thêm NEXT_PUBLIC_GEMINI_API_KEY vào .env.local (lấy key tại https://aistudio.google.com/apikey)."
        );
    }
    const modelConfig: { model: string; systemInstruction?: string } = {
        model: options?.model ?? DEFAULT_MODEL,
    };
    if (options?.systemInstruction) {
        modelConfig.systemInstruction = options.systemInstruction;
    }
    const m = genAI.getGenerativeModel(modelConfig);
    const result = await m.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

/**
 * Gửi nội dung text + file (ảnh/PDF) lên Gemini và nhận text trả lời.
 * Hữu ích cho: mô tả ảnh, đọc tài liệu, OCR, v.v.
 */
export async function generateFromTextAndFile(
    prompt: string,
    file: File,
    options?: { model?: string }
): Promise<string> {
    if (!apiKey) {
        throw new Error(
            "Gemini API key chưa cấu hình. Thêm NEXT_PUBLIC_GEMINI_API_KEY vào .env.local."
        );
    }
    const base64Data = await fileToBase64(file);
    const model = getTextModel(options?.model ?? DEFAULT_MODEL);
    const result = await model.generateContent([
        prompt,
        {
            inlineData: {
                data: base64Data,
                mimeType: file.type || "application/octet-stream",
            },
        },
    ]);
    const response = await result.response;
    return response.text();
}

async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = (reader.result as string)?.split(",")[1];
            resolve(base64 ?? "");
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

// --- Structured output (JSON) cho detect questions ---
const questionsSchema = {
    description: "List of extracted questions",
    type: SchemaType.ARRAY,
    items: {
        type: SchemaType.OBJECT,
        properties: {
            content: { type: SchemaType.STRING, description: "The text of the question", nullable: false },
            type: {
                type: SchemaType.STRING,
                description: "Type of question: mcq or essay",
                enum: ["mcq", "essay"],
                nullable: false,
            },
            options: {
                type: SchemaType.ARRAY,
                description: "List of options for MCQ (e.g. ['A. option1', 'B. option2'])",
                items: { type: SchemaType.STRING },
                nullable: true,
            },
            correctAnswer: {
                type: SchemaType.STRING,
                description: "The correct option identifier (e.g. 'A', 'B', 'C', or 'D')",
                nullable: true,
            },
            partNumber: {
                type: SchemaType.NUMBER,
                description: "The part number of the test",
                nullable: true,
            },
        },
        required: ["content", "type"],
    },
};

/** Trích xuất câu hỏi từ file (PDF, Word, ảnh) dùng Gemini – giữ tương thích với admin/questions */
export async function detectQuestions(file: File) {
    if (!apiKey) {
        throw new Error(
            "Gemini API key chưa cấu hình. Thêm NEXT_PUBLIC_GEMINI_API_KEY vào .env.local (lấy tại https://aistudio.google.com/apikey)."
        );
    }
    const base64Data = await fileToBase64(file);
    const model = genAI.getGenerativeModel({
        model: DEFAULT_MODEL,
        generationConfig: {
            responseMimeType: "application/json",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            responseSchema: questionsSchema as any,
        },
    });
    const prompt =
        "Extract all VSTEP practice questions from this document. Identify multiple choice questions and essays. For multiple choice questions, provide the options and the correct answer if available.";
    const result = await model.generateContent([
        prompt,
        {
            inlineData: {
                data: base64Data,
                mimeType: file.type || "application/pdf",
            },
        },
    ]);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
}
