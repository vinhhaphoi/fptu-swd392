"use client";

import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { WRITING_TASKS } from "@/data/writingTasks";
import { gradeWritingWithAI } from "@/lib/gemini";
import type { ExamLevel } from "@/types/exam";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  Save,
  Send,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const AUTOSAVE_KEY = "writing_draft";
const AUTOSAVE_INTERVAL = 30000; // 30 seconds

export default function WritingEditorPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  const { user, loading } = useAuth();

  const task = WRITING_TASKS.find((t) => t.id === taskId);

  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Awaited<ReturnType<typeof gradeWritingWithAI>> | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load draft from localStorage
  useEffect(() => {
    if (!taskId) return;
    const key = `${AUTOSAVE_KEY}_${taskId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const { content: c, savedAt } = JSON.parse(saved);
        setContent(c || "");
        setLastSaved(savedAt ? new Date(savedAt) : null);
      } catch {
        // ignore
      }
    }
  }, [taskId]);

  // Word count
  useEffect(() => {
    const words = content
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
    setWordCount(words.length);
  }, [content]);

  // Autosave
  useEffect(() => {
    if (!taskId || !content.trim()) return;
    const key = `${AUTOSAVE_KEY}_${taskId}`;
    const t = setInterval(() => {
      localStorage.setItem(
        key,
        JSON.stringify({ content, savedAt: new Date().toISOString() })
      );
      setLastSaved(new Date());
    }, AUTOSAVE_INTERVAL);
    return () => clearInterval(t);
  }, [taskId, content]);

  const handleManualSave = useCallback(() => {
    if (!taskId) return;
    const key = `${AUTOSAVE_KEY}_${taskId}`;
    localStorage.setItem(
      key,
      JSON.stringify({ content, savedAt: new Date().toISOString() })
    );
    setLastSaved(new Date());
  }, [taskId, content]);

  const handleSubmit = useCallback(async () => {
    if (!task || !user) return;
    if (wordCount < task.minWords) {
      alert(`Vui lòng viết ít nhất ${task.minWords} từ. Hiện tại: ${wordCount} từ.`);
      return;
    }

    setIsGrading(true);
    setFeedback(null);

    try {
      const taskDesc = `${task.title}\n\n${task.description}\n\n${task.requirements}`;
      const result = await gradeWritingWithAI(
        taskDesc,
        content,
        task.level,
        task.minWords
      );
      setFeedback(result);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Không thể chấm điểm. Vui lòng thử lại.");
    } finally {
      setIsGrading(false);
    }
  }, [task, user, content, wordCount]);

  const handleReset = useCallback(() => {
    setContent("");
    setFeedback(null);
    if (taskId) {
      localStorage.removeItem(`${AUTOSAVE_KEY}_${taskId}`);
    }
    setLastSaved(null);
  }, [taskId]);

  const handleNewTask = useCallback(() => {
    const sameLevel = WRITING_TASKS.filter((t) => t.level === task?.level);
    const others = sameLevel.filter((t) => t.id !== taskId);
    if (others.length > 0) {
      const random = others[Math.floor(Math.random() * others.length)];
      router.push(`/writing/${random.id}`);
    } else {
      router.push("/writing");
    }
  }, [task, taskId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground/60 mb-4">Vui lòng đăng nhập để luyện viết.</p>
          <Link href="/auth/login">
            <Button>Đăng nhập</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground/60 mb-4">Không tìm thấy đề bài.</p>
          <Link href="/writing">
            <Button>Quay lại</Button>
          </Link>
        </div>
      </div>
    );
  }

  const wordColor =
    wordCount < task.minWords
      ? "text-red-500"
      : wordCount >= task.minWords && wordCount <= task.maxWords
        ? "text-emerald-500"
        : "text-amber-500";

  const progressPercent = Math.min(
    100,
    (wordCount / task.minWords) * 100
  );

  return (
    <div className="min-h-screen py-6 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link
            href="/writing"
            className="inline-flex items-center gap-2 text-foreground/40 hover:text-foreground transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </Link>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-lg text-sm font-bold ${
                task.level === "C1"
                  ? "bg-purple-500/20 text-purple-400"
                  : task.level === "B2"
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "bg-emerald-500/20 text-emerald-400"
              }`}
            >
              {task.level}
            </span>
            <span className="text-foreground/40 text-sm">
              {task.timeLimit} phút
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[2fr_3fr] gap-6">
          {/* Left: Task */}
          <div className="bg-card border border-card-border rounded-2xl p-6 h-fit lg:sticky lg:top-24">
            <h2 className="font-bold text-foreground mb-4">📋 ĐỀ BÀI</h2>
            <div className="space-y-4 text-foreground/90">
              <p className="leading-relaxed">{task.description}</p>
              <div>
                <h4 className="font-semibold text-foreground mb-2">📌 Yêu cầu:</h4>
                <p className="text-sm leading-relaxed">{task.requirements}</p>
                <ul className="mt-2 text-sm text-foreground/70 space-y-1">
                  <li>• Tối thiểu: {task.minWords} từ</li>
                  <li>• Tối đa: {task.maxWords} từ</li>
                  <li>• Thời gian: {task.timeLimit} phút</li>
                </ul>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center gap-2 text-indigo-500 font-medium"
                >
                  {showHints ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  💡 Gợi ý cấu trúc
                </button>
                {showHints && (
                  <ul className="mt-2 pl-4 list-disc text-sm text-foreground/70 space-y-1">
                    {task.hints.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Right: Editor */}
          <div className="space-y-6">
            <div className="bg-card border border-card-border rounded-2xl p-6">
              <h2 className="font-bold text-foreground mb-4">✍️ BÀI LÀM CỦA BẠN</h2>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Bắt đầu viết tại đây..."
                className="w-full min-h-[300px] px-4 py-3 rounded-xl bg-background border border-card-border text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-y"
                disabled={!!feedback}
              />

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className={`font-semibold ${wordColor}`}>
                    Word count: {wordCount}/{task.minWords}
                  </span>
                  <div className="mt-1 h-1.5 w-32 bg-foreground/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        progressPercent >= 100 ? "bg-emerald-500" : "bg-indigo-500"
                      }`}
                      style={{ width: `${Math.min(100, progressPercent)}%` }}
                    />
                  </div>
                </div>
                {lastSaved && (
                  <p className="text-xs text-foreground/40">
                    Đã lưu tự động lúc {lastSaved.toLocaleTimeString("vi-VN")}
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  onClick={handleManualSave}
                  disabled={!!feedback}
                >
                  <Save size={18} className="mr-2" />
                  Lưu nháp
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={wordCount < task.minWords || isGrading || !!feedback}
                  loading={isGrading}
                >
                  {isGrading ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Đang chấm điểm...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} className="mr-2" />
                      Nhờ AI chấm điểm
                    </>
                  )}
                </Button>
                {feedback && (
                  <>
                    <Button variant="outline" onClick={handleReset}>
                      <RefreshCw size={18} className="mr-2" />
                      Viết lại
                    </Button>
                    <Button variant="ghost" onClick={handleNewTask}>
                      Đề khác
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* AI Feedback */}
            {feedback && (
              <div className="bg-card border border-card-border rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="font-bold text-foreground mb-4">📊 KẾT QUẢ CHẤM ĐIỂM</h2>

                <div className="mb-6">
                  <div className="text-3xl font-bold text-indigo-500 mb-1">
                    {feedback.overallScore.toFixed(1)}/9
                  </div>
                  <p className="text-sm text-foreground/60">Level: {task.level}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Task Achievement", key: "taskAchievement" as const },
                    { label: "Coherence", key: "coherenceCohesion" as const },
                    { label: "Lexical", key: "lexicalResource" as const },
                    { label: "Grammar", key: "grammaticalRange" as const },
                  ].map(({ label, key }) => (
                    <div
                      key={key}
                      className="bg-background rounded-xl p-3 border border-card-border"
                    >
                      <div className="text-xs text-foreground/50 mb-1">{label}</div>
                      <div className="text-xl font-bold text-foreground">
                        {feedback.scores[key].toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {feedback.strengths.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-emerald-500 mb-2">✅ Điểm mạnh:</h4>
                      <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
                        {feedback.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {feedback.improvements.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-amber-500 mb-2">⚠️ Cần cải thiện:</h4>
                      <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
                        {feedback.improvements.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {feedback.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-indigo-500 mb-2">💡 Gợi ý:</h4>
                      <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
                        {feedback.suggestions.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {feedback.sampleAnswer && (
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setShowSample(!showSample)}
                      className="flex items-center gap-2 text-indigo-500 font-medium"
                    >
                      {showSample ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      📖 Bài mẫu tham khảo
                    </button>
                    {showSample && (
                      <div className="mt-3 p-4 rounded-xl bg-foreground/5 border border-card-border text-sm whitespace-pre-wrap text-foreground/90">
                        {feedback.sampleAnswer}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
