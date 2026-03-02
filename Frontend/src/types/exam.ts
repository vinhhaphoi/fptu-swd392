// Exam types for Upload → Create Exam Set flow

export type ExamLevel = "B1" | "B2" | "C1";

export type ExamSkill =
  | "listening"
  | "reading"
  | "writing"
  | "speaking";

export type QuestionType =
  | "multiple_choice" // Trắc nghiệm 4 đáp án
  | "true_false" // Đúng/Sai
  | "fill_in_blank" // Điền vào chỗ trống
  | "short_answer" // Trả lời ngắn
  | "essay"; // Tự luận (dùng cho writing)

export interface ExamQuestion {
  id: string;
  order: number;
  type: QuestionType;
  question: string;
  options?: string[]; // Cho multiple_choice
  correctAnswer: string;
  explanation?: string;
  points: number;
  needsReview?: boolean; // Flag nếu AI không chắc chắn
}

export interface ExamSet {
  id?: string;
  title: string;
  level: ExamLevel;
  skill: ExamSkill;
  duration: number; // Phút
  description?: string;
  questions: ExamQuestion[];
  totalQuestions: number;
  totalPoints: number;
  sourceFileName?: string; // Tên file gốc đã upload
  status: "draft" | "published";
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
}

// Raw output từ Gemini — chưa validate
export interface RawGeminiOutput {
  title?: string;
  questions?: Array<{
    order?: number;
    question?: string;
    type?: string;
    options?: string[];
    answer?: string;
    correctAnswer?: string;
    explanation?: string;
    points?: number;
    needsReview?: boolean;
  }>;
}
