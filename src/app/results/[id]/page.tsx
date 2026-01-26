"use client";

export const runtime = "edge";

import Button from "@/components/ui/Button";
import { SKILLS_DATA, SkillType } from "@/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ResultDetailPage() {
  const searchParams = useSearchParams();
  const skill = (searchParams.get("skill") || "listening") as SkillType;
  const scoreParam = searchParams.get("score") || "80";
  const score = parseInt(scoreParam);

  const skillData = SKILLS_DATA[skill];

  const getScoreMessage = (score: number) => {
    if (score >= 90) return { text: "Excellent!", color: "text-emerald-400" };
    if (score >= 80) return { text: "Great Job!", color: "text-emerald-400" };
    if (score >= 70) return { text: "Good Work!", color: "text-amber-400" };
    if (score >= 60)
      return { text: "Keep Practicing!", color: "text-amber-400" };
    return { text: "Need More Practice", color: "text-red-400" };
  };

  const message = getScoreMessage(score);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Card */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center">
          {/* Confetti Animation Placeholder */}
          <div className="relative mb-8">
            <div
              className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${skillData.color} flex items-center justify-center text-6xl shadow-2xl animate-pulse-glow`}
            >
              {skillData.icon}
            </div>
          </div>

          <h1 className={`text-3xl font-bold mb-2 ${message.color}`}>
            {message.text}
          </h1>
          <p className="text-slate-400 mb-8">
            You&apos;ve completed the {skillData.name} test
          </p>

          {/* Score Circle */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-slate-700"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${score * 5.52} 552`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-white">{score}%</span>
              <span className="text-slate-400">Score</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-900/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-emerald-400">28</div>
              <div className="text-xs text-slate-400">Correct</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-red-400">7</div>
              <div className="text-xs text-slate-400">Incorrect</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">35:42</div>
              <div className="text-xs text-slate-400">Time</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/practice/${skill}`} className="flex-1">
              <Button variant="secondary" fullWidth>
                Practice Again
              </Button>
            </Link>
            <Link href="/results" className="flex-1">
              <Button fullWidth>View All Results</Button>
            </Link>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Recommended Next Steps
          </h2>
          <div className="space-y-3">
            <Link
              href="/practice/reading"
              className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl hover:bg-slate-700/50 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-xl">
                📖
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">Practice Reading</h3>
                <p className="text-sm text-slate-400">
                  Continue with another skill
                </p>
              </div>
              <svg
                className="w-5 h-5 text-slate-400"
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
            </Link>
            <Link
              href="/mock-exam"
              className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl hover:bg-slate-700/50 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xl">
                🎯
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">Take Mock Exam</h3>
                <p className="text-sm text-slate-400">
                  Test all 4 skills together
                </p>
              </div>
              <svg
                className="w-5 h-5 text-slate-400"
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
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
