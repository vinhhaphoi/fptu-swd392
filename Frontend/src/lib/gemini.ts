import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { ExamLevel, ExamSkill, RawGeminiOutput } from "@/types/exam";

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

// --- Exam extraction (text-based) ---

const EXAM_EXTRACTION_SCHEMA = {
    description: "Extracted exam with questions",
    type: SchemaType.OBJECT,
    properties: {
        title: {
            type: SchemaType.STRING,
            description: "Title of the exam set",
            nullable: false,
        },
        questions: {
            type: SchemaType.ARRAY,
            description: "List of questions",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    order: { type: SchemaType.NUMBER, nullable: false },
                    type: {
                        type: SchemaType.STRING,
                        enum: ["multiple_choice", "true_false", "fill_in_blank", "short_answer", "essay"],
                        nullable: false,
                    },
                    question: { type: SchemaType.STRING, nullable: false },
                    options: {
                        type: SchemaType.ARRAY,
                        items: { type: SchemaType.STRING },
                        nullable: true,
                    },
                    correctAnswer: { type: SchemaType.STRING, nullable: false },
                    explanation: { type: SchemaType.STRING, nullable: true },
                    points: { type: SchemaType.NUMBER, nullable: false },
                    needsReview: { type: SchemaType.BOOLEAN, nullable: true },
                },
                required: ["order", "type", "question", "correctAnswer", "points"],
            },
            nullable: false,
        },
    },
    required: ["title", "questions"],
};

const examModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
        responseMimeType: "application/json",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responseSchema: EXAM_EXTRACTION_SCHEMA as any,
    },
});

export const EXAM_EXTRACTION_PROMPT = (
    level: ExamLevel,
    skill: ExamSkill,
    questionCount: number = 20
) => `
Bạn là chuyên gia tạo đề thi tiếng Anh chuẩn CEFR.

Hãy phân tích nội dung tài liệu được cung cấp và tạo ra ${questionCount} câu hỏi theo đúng yêu cầu sau:

**Cấp độ:** ${level} (CEFR)
**Kỹ năng:** ${skill}
**Số câu:** ${questionCount}

**Quy tắc bắt buộc:**
- Trả về ĐÚNG định dạng JSON với 2 field: "title" (string) và "questions" (array)
- Mỗi câu hỏi phải có đủ: order, type, question, correctAnswer, points
- correctAnswer phải là chuỗi khớp chính xác với một trong các options (nếu là multiple_choice)
- points: B1 = 1 điểm/câu, B2 = 2 điểm/câu, C1 = 3 điểm/câu
- Nếu bạn không chắc về câu hỏi nào, đặt needsReview = true
- type phải là một trong: multiple_choice, true_false, fill_in_blank, short_answer, essay

**Ví dụ format JSON:**
{
  "title": "Tên bộ đề phù hợp với nội dung",
  "questions": [
    {
      "order": 1,
      "type": "multiple_choice",
      "question": "Nội dung câu hỏi?",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A. ...",
      "explanation": "Giải thích tại sao đáp án đúng",
      "points": ${level === "B1" ? 1 : level === "B2" ? 2 : 3},
      "needsReview": false
    }
  ]
}

**Nội dung tài liệu:**
`;

export async function extractExamFromDocument(
    fileContent: string,
    level: ExamLevel,
    skill: ExamSkill,
    questionCount: number = 20
): Promise<RawGeminiOutput> {
    if (!apiKey) {
        throw new Error(
            "Gemini API key chưa được cấu hình. Vui lòng thêm NEXT_PUBLIC_GEMINI_API_KEY vào file .env.local."
        );
    }

    const prompt =
        EXAM_EXTRACTION_PROMPT(level, skill, questionCount) + fileContent;

    try {
        const result = await examModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const parsed = JSON.parse(text) as RawGeminiOutput;

        if (!parsed.questions || !Array.isArray(parsed.questions)) {
            throw new Error("Phản hồi từ AI không đúng định dạng. Thiếu danh sách câu hỏi.");
        }

        return parsed;
    } catch (err) {
        if (err instanceof SyntaxError) {
            throw new Error(
                "Không thể phân tích phản hồi từ AI. Vui lòng thử lại với tài liệu khác."
            );
        }
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        throw new Error("Đã xảy ra lỗi khi trích xuất đề thi. Vui lòng thử lại.");
    }
}

// --- Writing grading ---

export interface WritingGradeResult {
    scores: {
        taskAchievement: number;
        coherenceCohesion: number;
        lexicalResource: number;
        grammaticalRange: number;
    };
    overallScore: number;
    strengths: string[];
    improvements: string[];
    suggestions: string[];
    sampleAnswer?: string;
}

const WRITING_GRADE_SCHEMA = {
    description: "Writing assessment result",
    type: SchemaType.OBJECT,
    properties: {
        scores: {
            type: SchemaType.OBJECT,
            properties: {
                taskAchievement: { type: SchemaType.NUMBER },
                coherenceCohesion: { type: SchemaType.NUMBER },
                lexicalResource: { type: SchemaType.NUMBER },
                grammaticalRange: { type: SchemaType.NUMBER },
            },
            required: ["taskAchievement", "coherenceCohesion", "lexicalResource", "grammaticalRange"],
        },
        overallScore: { type: SchemaType.NUMBER },
        strengths: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        improvements: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        suggestions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        sampleAnswer: { type: SchemaType.STRING, nullable: true },
    },
    required: ["scores", "overallScore", "strengths", "improvements", "suggestions"],
};

const writingGradeModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
        responseMimeType: "application/json",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responseSchema: WRITING_GRADE_SCHEMA as any,
    },
});

export async function gradeWritingWithAI(
    taskDescription: string,
    userAnswer: string,
    level: ExamLevel,
    minWords: number
): Promise<WritingGradeResult> {
    if (!apiKey) {
        throw new Error(
            "Gemini API key chưa được cấu hình. Vui lòng thêm NEXT_PUBLIC_GEMINI_API_KEY vào file .env.local."
        );
    }

    const prompt = `Bạn là giám khảo chấm bài viết tiếng Anh theo tiêu chí IELTS/CEFR.

**Đề bài:**
${taskDescription}

**Yêu cầu tối thiểu:** ${minWords} từ

**Bài làm của thí sinh:**
${userAnswer}

**Cấp độ mục tiêu:** ${level}

Hãy chấm điểm theo 4 tiêu chí (mỗi tiêu chí 0-9):
1. Task Achievement (hoàn thành yêu cầu đề bài)
2. Coherence & Cohesion (mạch lạc, liên kết)
3. Lexical Resource (từ vựng)
4. Grammatical Range & Accuracy (ngữ pháp)

Trả về JSON với: scores (4 tiêu chí), overallScore (trung bình làm tròn 0.5), strengths (mảng string), improvements (mảng string), suggestions (mảng string), sampleAnswer (bài mẫu tham khảo, optional).`;

    try {
        const result = await writingGradeModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return JSON.parse(text) as WritingGradeResult;
    } catch (err) {
        if (err instanceof SyntaxError) {
            throw new Error("Không thể phân tích kết quả chấm điểm. Vui lòng thử lại.");
        }
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        throw new Error("Đã xảy ra lỗi khi chấm bài. Vui lòng thử lại.");
    }
}
