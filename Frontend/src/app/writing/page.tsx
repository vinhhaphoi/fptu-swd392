"use client";

import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { WRITING_TASKS } from "@/data/writingTasks";
import type { ExamLevel } from "@/types/exam";
import { Clock, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const LEVELS: ExamLevel[] = ["B1", "B2", "C1"];

export default function WritingPage() {
  const { user, loading } = useAuth();
  const [filterLevel, setFilterLevel] = useState<ExamLevel | "all">("all");

  const filteredTasks =
    filterLevel === "all"
      ? WRITING_TASKS
      : WRITING_TASKS.filter((t) => t.level === filterLevel);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen py-20 bg-background">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-card border border-card-border rounded-[32px] p-8 shadow-xl shadow-indigo-500/5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-3xl mb-6 shadow-lg">
              ✍️
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Đăng nhập để luyện viết
            </h1>
            <p className="text-foreground/60 mb-6">
              Vui lòng đăng nhập để lưu bài viết và nhận chấm điểm từ AI.
            </p>
            <Link href="/auth/login">
              <Button fullWidth>Đăng nhập</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              ✍️
            </span>
            Writing Practice
          </h1>
          <p className="text-foreground/60">
            Luyện kỹ năng viết với các đề bài theo chuẩn CEFR. Chọn đề và bắt đầu viết.
          </p>
        </div>

        {/* Level Filter */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="text-foreground/40 text-sm">Lọc theo level:</span>
          <button
            onClick={() => setFilterLevel("all")}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
              filterLevel === "all"
                ? "bg-indigo-500 text-white"
                : "bg-card border border-card-border text-foreground/70 hover:bg-foreground/5"
            }`}
          >
            Tất cả
          </button>
          {LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                filterLevel === level
                  ? "bg-indigo-500 text-white"
                  : "bg-card border border-card-border text-foreground/70 hover:bg-foreground/5"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Task Cards */}
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <Link
              key={task.id}
              href={`/writing/${task.id}`}
              className="block bg-card border border-card-border rounded-2xl p-6 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span
                    className={`inline-block px-2 py-1 rounded-lg text-xs font-bold mb-2 ${
                      task.level === "C1"
                        ? "bg-purple-500/20 text-purple-400"
                        : task.level === "B2"
                          ? "bg-indigo-500/20 text-indigo-400"
                          : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {task.level}
                  </span>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-indigo-500 transition-colors mb-1">
                    {task.title}
                  </h3>
                  <p className="text-sm text-foreground/60 line-clamp-2 mb-3">
                    {task.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-foreground/40">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {task.timeLimit} phút
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText size={14} />
                      {task.minWords}-{task.maxWords} từ
                    </span>
                    <span className="capitalize">{task.type}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center group-hover:bg-indigo-500 transition-all shrink-0">
                  <svg
                    className="w-5 h-5 text-foreground/40 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
