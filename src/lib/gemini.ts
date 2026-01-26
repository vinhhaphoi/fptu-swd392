import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const schema = {
    description: "List of extracted questions",
    type: SchemaType.ARRAY,
    items: {
        type: SchemaType.OBJECT,
        properties: {
            content: {
                type: SchemaType.STRING,
                description: "The text of the question",
                nullable: false,
            },
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

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
        responseMimeType: "application/json",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responseSchema: schema as any,
    },
});

export async function detectQuestions(file: File) {
    if (!apiKey) {
        throw new Error("Gemini API key is not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file.");
    }

    // Convert File to base64
    const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = (reader.result as string).split(",")[1];
            resolve(base64);
        };
        reader.readAsDataURL(file);
    });

    const prompt = "Extract all VSTEP practice questions from this document. Identify multiple choice questions and essays. For multiple choice questions, provide the options and the correct answer if available.";

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
