"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Toast from "@/components/ui/Toast";
import {
  chunkTextIfNeeded,
  extractTextFromFile,
  mapRawToStructured,
  validateRawOutput,
} from "@/lib/documentParser";
import type { ExamMetadata } from "@/lib/documentParser";
import { createExamSet } from "@/lib/firestore";
import { extractExamFromDocument } from "@/lib/gemini";
import type {
  ExamLevel,
  ExamQuestion,
  ExamSet,
  ExamSkill,
} from "@/types/exam";
import { SKILLS_DATA } from "@/types";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { useCallback, useState } from "react";

const ACCEPT_FILES = ".pdf,.docx,.doc,.txt";
const MAX_SIZE_MB = 10;

export default function QuestionUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [examSet, setExamSet] = useState<ExamSet | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    type: "success" | "error";
    message: string;
  }>({ visible: false, type: "success", message: "" });

  // Config form state
  const [config, setConfig] = useState({
    title: "",
    level: "B2" as ExamLevel,
    skill: "reading" as ExamSkill,
    questionCount: 20,
    duration: 60,
    description: "",
  });

  const showToast = useCallback(
    (type: "success" | "error", message: string) => {
      setToast({ visible: true, type, message });
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f && isValidFile(f)) {
        setFile(f);
        setConfig((c) => ({
          ...c,
          title: c.title || `Bộ đề từ ${f.name.replace(/\.[^.]+$/, "")}`,
          duration:
            SKILLS_DATA[c.skill]?.duration ?? c.duration,
        }));
      }
    },
    [config.skill]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f && isValidFile(f)) {
        setFile(f);
        setConfig((c) => ({
          ...c,
          title: c.title || `Bộ đề từ ${f.name.replace(/\.[^.]+$/, "")}`,
          duration: SKILLS_DATA[c.skill]?.duration ?? c.duration,
        }));
      }
    },
    [config.skill]
  );

  const isValidFile = (f: File) => {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx", "doc", "txt"].includes(ext ?? "")) {
      showToast("error", "Chỉ chấp nhận file PDF, DOCX, TXT.");
      return false;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      showToast("error", `File vượt quá ${MAX_SIZE_MB}MB.`);
      return false;
    }
    return true;
  };

  const handleExtract = useCallback(async () => {
    if (!file) {
      showToast("error", "Vui lòng chọn file trước.");
      return;
    }

    setIsExtracting(true);
    setValidationErrors([]);
    setExamSet(null);

    try {
      const text = await extractTextFromFile(file);
      const chunked = chunkTextIfNeeded(text);
      const raw = await extractExamFromDocument(
        chunked,
        config.level,
        config.skill,
        config.questionCount
      );

      const { valid, errors } = validateRawOutput(raw);
      if (!valid) {
        setValidationErrors(errors);
        showToast("error", `Có ${errors.length} lỗi validation. Vui lòng kiểm tra.`);
        setIsExtracting(false);
        return;
      }

      const meta: ExamMetadata = {
        title: config.title || raw.title || "Bộ đề mới",
        level: config.level,
        skill: config.skill,
        duration: config.duration,
        description: config.description || undefined,
        sourceFileName: file.name,
      };

      const structured = mapRawToStructured(raw, meta);
      setExamSet(structured);
      setExpandedQuestion(0);
      showToast("success", `Đã trích xuất ${structured.questions.length} câu hỏi.`);
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Không thể trích xuất đề thi."
      );
    } finally {
      setIsExtracting(false);
    }
  }, [file, config, showToast]);

  const updateQuestion = useCallback((index: number, updates: Partial<ExamQuestion>) => {
    setExamSet((prev) => {
      if (!prev) return prev;
      const qs = [...prev.questions];
      qs[index] = { ...qs[index], ...updates };
      const totalPoints = qs.reduce((s, q) => s + q.points, 0);
      return { ...prev, questions: qs, totalPoints };
    });
  }, []);

  const removeQuestion = useCallback((index: number) => {
    setExamSet((prev) => {
      if (!prev) return prev;
      const qs = prev.questions.filter((_, i) => i !== index);
      const totalPoints = qs.reduce((s, q) => s + q.points, 0);
      return {
        ...prev,
        questions: qs,
        totalQuestions: qs.length,
        totalPoints,
      };
    });
    setShowDeleteConfirm(null);
  }, []);

  const addManualQuestion = useCallback(() => {
    const newQ: ExamQuestion = {
      id: crypto.randomUUID(),
      order: (examSet?.questions.length ?? 0) + 1,
      type: "multiple_choice",
      question: "",
      options: ["A. ", "B. ", "C. ", "D. "],
      correctAnswer: "A. ",
      points: config.level === "B1" ? 1 : config.level === "B2" ? 2 : 3,
      needsReview: true,
    };
    setExamSet((prev) => {
      if (!prev) return prev;
      const qs = [...prev.questions, newQ];
      const totalPoints = qs.reduce((s, q) => s + q.points, 0);
      return {
        ...prev,
        questions: qs,
        totalQuestions: qs.length,
        totalPoints,
      };
    });
    setExpandedQuestion(examSet?.questions.length ?? 0);
  }, [examSet, config.level]);

  const handleSave = useCallback(
    async (status: "draft" | "published") => {
      if (!examSet || examSet.questions.length === 0) {
        showToast("error", "Không có câu hỏi để lưu.");
        return;
      }

      setIsSaving(true);
      try {
        const toSave = { ...examSet, status };
        await createExamSet(toSave);
        showToast(
          "success",
          status === "published"
            ? "Đã xuất bản bộ đề thành công!"
            : "Đã lưu nháp thành công!"
        );
        setExamSet(null);
        setFile(null);
      } catch {
        showToast("error", "Lưu thất bại. Vui lòng thử lại.");
      } finally {
        setIsSaving(false);
      }
    },
    [examSet, showToast]
  );

  const needsReviewCount = examSet?.questions.filter((q) => q.needsReview).length ?? 0;

  return (
    <div className="p-6 md:p-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <FileText className="text-indigo-500" size={28} />
            Tạo Bộ Đề Từ Tài Liệu
          </h1>
          <p className="text-foreground/60 mb-8">
            Upload PDF, DOCX hoặc TXT (tối đa {MAX_SIZE_MB}MB) → AI trích xuất → Chỉnh sửa → Lưu
          </p>

          {/* BƯỚC 1 & 2 */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Upload */}
            <div className="bg-card border border-card-border rounded-2xl p-6">
              <h2 className="font-bold text-foreground mb-4">BƯỚC 1: Upload File</h2>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
                className="border-2 border-dashed border-card-border rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
              >
                <input
                  id="file-input"
                  type="file"
                  accept={ACCEPT_FILES}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload size={40} className="mx-auto mb-3 text-foreground/40" />
                <p className="text-foreground font-medium">
                  {file ? file.name : "Kéo thả hoặc click để chọn"}
                </p>
                <p className="text-sm text-foreground/40 mt-1">
                  PDF, DOCX, TXT • Max {MAX_SIZE_MB}MB
                </p>
              </div>
            </div>

            {/* Config */}
            <div className="bg-card border border-card-border rounded-2xl p-6">
              <h2 className="font-bold text-foreground mb-4">BƯỚC 2: Cấu hình</h2>
              <div className="space-y-4">
                <Input
                  label="Tiêu đề bộ đề"
                  value={config.title}
                  onChange={(e) => setConfig((c) => ({ ...c, title: e.target.value }))}
                  placeholder="VD: Đề Reading B2 - Chủ đề môi trường"
                />
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Level
                  </label>
                  <div className="flex gap-2">
                    {(["B1", "B2", "C1"] as ExamLevel[]).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setConfig((c) => ({ ...c, level: l }))}
                        className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
                          config.level === l
                            ? "bg-indigo-500 text-white"
                            : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Kỹ năng
                  </label>
                  <select
                    value={config.skill}
                    onChange={(e) =>
                      setConfig((c) => ({
                        ...c,
                        skill: e.target.value as ExamSkill,
                        duration: SKILLS_DATA[e.target.value as ExamSkill]?.duration ?? 60,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-card border border-card-border text-foreground"
                  >
                    <option value="reading">Reading</option>
                    <option value="listening">Listening</option>
                    <option value="writing">Writing</option>
                    <option value="speaking">Speaking</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Số câu hỏi"
                    type="number"
                    min={1}
                    max={50}
                    value={config.questionCount}
                    onChange={(e) =>
                      setConfig((c) => ({
                        ...c,
                        questionCount: Math.max(1, parseInt(e.target.value) || 10),
                      }))
                    }
                  />
                  <Input
                    label="Thời gian (phút)"
                    type="number"
                    min={5}
                    value={config.duration}
                    onChange={(e) =>
                      setConfig((c) => ({
                        ...c,
                        duration: Math.max(5, parseInt(e.target.value) || 60),
                      }))
                    }
                  />
                </div>
                <Input
                  label="Mô tả (tùy chọn)"
                  value={config.description}
                  onChange={(e) => setConfig((c) => ({ ...c, description: e.target.value }))}
                  placeholder="Mô tả ngắn về bộ đề"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <Button
              onClick={handleExtract}
              disabled={!file || isExtracting}
              loading={isExtracting}
              className="min-w-[200px]"
            >
              {isExtracting ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Đang phân tích tài liệu...
                </>
              ) : (
                <>
                  <Upload size={20} className="mr-2" />
                  Trích xuất với AI
                </>
              )}
            </Button>
          </div>

          {isExtracting && (
            <div className="mb-8">
              <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 animate-pulse"
                  style={{ width: "60%" }}
                />
              </div>
              <p className="text-sm text-foreground/60 mt-2 text-center">
                Đang phân tích tài liệu...
              </p>
            </div>
          )}

          {validationErrors.length > 0 && (
            <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-red-500 mb-2">Lỗi validation:</p>
                <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
                  {validationErrors.slice(0, 5).map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                  {validationErrors.length > 5 && (
                    <li>... và {validationErrors.length - 5} lỗi khác</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* BƯỚC 3: Preview */}
          {examSet && examSet.questions.length > 0 && (
            <div className="bg-card border border-card-border rounded-2xl p-6 mb-8">
              <h2 className="font-bold text-foreground mb-4">
                BƯỚC 3: Preview & Chỉnh sửa
              </h2>

              <div className="space-y-4">
                {examSet.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className={`rounded-2xl border overflow-hidden transition-all ${
                      q.needsReview
                        ? "border-amber-500/40 bg-amber-500/5"
                        : "border-card-border bg-foreground/[0.02]"
                    }`}
                  >
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer"
                      onClick={() =>
                        setExpandedQuestion(expandedQuestion === idx ? null : idx)
                      }
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded-lg">
                          Câu {idx + 1}
                        </span>
                        {q.needsReview && (
                          <span className="text-xs font-bold text-amber-500 bg-amber-500/20 px-2 py-1 rounded-lg flex items-center gap-1">
                            <AlertCircle size={12} /> Cần review
                          </span>
                        )}
                        <span className="text-sm text-foreground/60 truncate max-w-[200px]">
                          {(q.question || "").slice(0, 50)}
                          {(q.question || "").length > 50 ? "..." : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuestion(idx, { needsReview: !q.needsReview });
                          }}
                          className="p-2 rounded-lg hover:bg-foreground/10 text-foreground/60"
                          title="Đánh dấu cần review"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(showDeleteConfirm === idx ? null : idx);
                          }}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                        {expandedQuestion === idx ? (
                          <ChevronUp size={20} className="text-foreground/40" />
                        ) : (
                          <ChevronDown size={20} className="text-foreground/40" />
                        )}
                      </div>
                    </div>

                    {showDeleteConfirm === idx && (
                      <div className="px-4 pb-4 flex items-center gap-3">
                        <span className="text-sm text-foreground/60">
                          Xóa câu này?
                        </span>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => removeQuestion(idx)}
                        >
                          Xóa
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowDeleteConfirm(null)}
                        >
                          Hủy
                        </Button>
                      </div>
                    )}

                    {expandedQuestion === idx && showDeleteConfirm !== idx && (
                      <div className="px-4 pb-4 pt-0 space-y-3 border-t border-card-border">
                        <div>
                          <label className="text-xs font-medium text-foreground/60">
                            Nội dung câu hỏi
                          </label>
                          <textarea
                            value={q.question}
                            onChange={(e) =>
                              updateQuestion(idx, { question: e.target.value })
                            }
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-background border border-card-border text-foreground text-sm"
                            rows={3}
                          />
                        </div>
                        {q.options && (
                          <div>
                            <label className="text-xs font-medium text-foreground/60">
                              Đáp án
                            </label>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                              {q.options.map((opt, oi) => (
                                <input
                                  key={oi}
                                  value={opt}
                                  onChange={(e) => {
                                    const opts = [...(q.options ?? [])];
                                    opts[oi] = e.target.value;
                                    updateQuestion(idx, { options: opts });
                                  }}
                                  className="px-3 py-2 rounded-lg bg-background border border-card-border text-foreground text-sm"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        <div>
                          <label className="text-xs font-medium text-foreground/60">
                            Đáp án đúng
                          </label>
                          <input
                            value={q.correctAnswer}
                            onChange={(e) =>
                              updateQuestion(idx, { correctAnswer: e.target.value })
                            }
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-background border border-card-border text-foreground text-sm"
                          />
                        </div>
                        {q.explanation && (
                          <div>
                            <label className="text-xs font-medium text-foreground/60">
                              Giải thích
                            </label>
                            <textarea
                              value={q.explanation}
                              onChange={(e) =>
                                updateQuestion(idx, { explanation: e.target.value })
                              }
                              className="w-full mt-1 px-3 py-2 rounded-xl bg-background border border-card-border text-foreground text-sm"
                              rows={2}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addManualQuestion}
                className="mt-4 flex items-center gap-2 text-indigo-500 hover:text-indigo-400 font-medium"
              >
                <Plus size={18} />
                Thêm câu thủ công
              </button>

              <div className="mt-6 pt-4 border-t border-card-border flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-foreground/60">
                  Tổng: {examSet.totalQuestions} câu | {examSet.totalPoints} điểm
                  {needsReviewCount > 0 && (
                    <span className="text-amber-500 ml-2">
                      | ⚠️ {needsReviewCount} câu cần review
                    </span>
                  )}
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => handleSave("draft")}
                    disabled={isSaving}
                    loading={isSaving}
                  >
                    <Save size={18} className="mr-2" />
                    Lưu nháp
                  </Button>
                  <Button
                    onClick={() => handleSave("published")}
                    disabled={isSaving}
                    loading={isSaving}
                  >
                    Xuất bản
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onDismiss={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </div>
  );
}
