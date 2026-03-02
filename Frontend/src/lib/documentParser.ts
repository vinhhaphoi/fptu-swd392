import type {
  ExamLevel,
  ExamQuestion,
  ExamSet,
  ExamSkill,
  RawGeminiOutput,
} from "@/types/exam";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_CHARS = 30000;

export interface ExamMetadata {
  title: string;
  level: ExamLevel;
  skill: ExamSkill;
  duration: number;
  description?: string;
  sourceFileName?: string;
}

// 1. Validate raw output from Gemini
export function validateRawOutput(raw: RawGeminiOutput): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!raw.title || typeof raw.title !== "string") {
    errors.push("Thiếu tiêu đề bộ đề (title)");
  }

  if (!raw.questions || !Array.isArray(raw.questions)) {
    errors.push("Thiếu hoặc sai định dạng danh sách câu hỏi (questions)");
    return { valid: false, errors };
  }

  if (raw.questions.length === 0) {
    errors.push("Danh sách câu hỏi không được rỗng");
  }

  raw.questions.forEach((q, idx) => {
    if (!q.question || typeof q.question !== "string") {
      errors.push(`Câu ${idx + 1}: Thiếu nội dung câu hỏi (question)`);
    }
    if (!q.type || typeof q.type !== "string") {
      errors.push(`Câu ${idx + 1}: Thiếu loại câu hỏi (type)`);
    }
    const ans = q.correctAnswer ?? q.answer;
    if (!ans || typeof ans !== "string") {
      errors.push(`Câu ${idx + 1}: Thiếu đáp án đúng (correctAnswer)`);
    }
    if (q.points === undefined || q.points === null || typeof q.points !== "number") {
      errors.push(`Câu ${idx + 1}: Thiếu điểm (points)`);
    }
    if (q.type === "multiple_choice") {
      if (!q.options || !Array.isArray(q.options)) {
        errors.push(`Câu ${idx + 1}: Câu trắc nghiệm cần có options (mảng 4 đáp án)`);
      } else if (q.options.length !== 4) {
        errors.push(`Câu ${idx + 1}: Câu trắc nghiệm cần đúng 4 đáp án`);
      } else {
        const correct = q.correctAnswer ?? q.answer ?? "";
        const found = q.options.some(
          (opt) => opt === correct || opt.trim() === correct.trim()
        );
        if (!found) {
          errors.push(
            `Câu ${idx + 1}: Đáp án đúng phải nằm trong danh sách options`
          );
        }
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

// 2. Map raw to structured ExamSet
export function mapRawToStructured(
  raw: RawGeminiOutput,
  meta: ExamMetadata
): ExamSet {
  const questions: ExamQuestion[] = (raw.questions ?? []).map((q, idx) => ({
    id: crypto.randomUUID(),
    order: q.order ?? idx + 1,
    type: normalizeQuestionType(q.type),
    question: q.question ?? "",
    options: q.options,
    correctAnswer: (q.correctAnswer ?? q.answer ?? "").trim(),
    explanation: q.explanation,
    points: typeof q.points === "number" ? q.points : 1,
    needsReview: q.needsReview ?? false,
  }));

  const totalQuestions = questions.length;
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return {
    title: raw.title ?? meta.title,
    level: meta.level,
    skill: meta.skill,
    duration: meta.duration,
    description: meta.description,
    questions,
    totalQuestions,
    totalPoints,
    sourceFileName: meta.sourceFileName,
    status: "draft",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function normalizeQuestionType(
  type?: string
): "multiple_choice" | "true_false" | "fill_in_blank" | "short_answer" | "essay" {
  const t = (type ?? "").toLowerCase().replace(/\s/g, "_");
  if (["multiple_choice", "mcq", "multiplechoice"].includes(t))
    return "multiple_choice";
  if (["true_false", "truefalse", "đúng_sai"].includes(t)) return "true_false";
  if (["fill_in_blank", "fillinblank"].includes(t)) return "fill_in_blank";
  if (["short_answer", "shortanswer"].includes(t)) return "short_answer";
  if (["essay", "tự_luận"].includes(t)) return "essay";
  return "multiple_choice";
}

// 3. Extract text from file (PDF, DOCX, TXT)
export async function extractTextFromFile(file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File vượt quá giới hạn 10MB. Vui lòng chọn file nhỏ hơn.");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (ext === "txt") {
    return extractTextFromTxt(file);
  }
  if (ext === "docx" || ext === "doc") {
    return extractTextFromDocx(file);
  }
  if (ext === "pdf") {
    return extractTextFromPdf(file);
  }

  throw new Error(
    "Định dạng file không được hỗ trợ. Chỉ chấp nhận PDF, DOCX, TXT."
  );
}

function extractTextFromTxt(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve((reader.result as string) || "");
    };
    reader.onerror = () => reject(new Error("Không thể đọc file TXT."));
    reader.readAsText(file, "UTF-8");
  });
}

async function extractTextFromDocx(file: File): Promise<string> {
  try {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || "";
  } catch {
    throw new Error("Không thể đọc file DOCX. Vui lòng thử file khác.");
  }
}

async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const { getDocument } = await import("pdfjs-dist");
    const arrayBuffer = await file.arrayBuffer();

    const loadingTask = getDocument({ data: arrayBuffer });
    const doc = await loadingTask.promise;
    const numPages = doc.numPages;
    const texts: string[] = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await doc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ");
      texts.push(pageText);
    }

    return texts.join("\n\n");
  } catch {
    throw new Error("Không thể đọc file PDF. Vui lòng thử file khác.");
  }
}

// 4. Chunk text if too long
export function chunkTextIfNeeded(
  text: string,
  maxChars: number = MAX_CHARS
): string {
  if (text.length <= maxChars) return text;

  const cutAt = text.lastIndexOf("\n", maxChars);
  const cutPoint = cutAt > maxChars * 0.5 ? cutAt : maxChars;
  const kept = text.slice(0, cutPoint);

  return `${kept}\n\n[... nội dung được rút gọn (${text.length - cutPoint} ký tự đã bỏ) ...]`;
}
