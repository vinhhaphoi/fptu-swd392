import { Test } from "@/types";
import Link from "next/link";

interface ExerciseCardProps {
  test: Test;
  skill: string;
  status?: "completed" | "in_progress" | "not_started";
  score?: number;
}

export default function ExerciseCard({
  test,
  skill,
  status = "not_started",
  score,
}: ExerciseCardProps) {
  const statusColors = {
    completed: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
    in_progress: "bg-amber-500/20 text-amber-600 border-amber-500/30",
    not_started: "bg-foreground/5 text-foreground/40 border-card-border",
  };

  const statusLabels = {
    completed: "Completed",
    in_progress: "In Progress",
    not_started: "Not Started",
  };

  const levelColors = {
    C1: "bg-purple-500/20 text-purple-600",
    B2: "bg-indigo-500/20 text-indigo-600",
    B1: "bg-emerald-500/20 text-emerald-600",
  };

  return (
    <Link
      href={`/practice/${skill}/${test.id}`}
      className="group block bg-card rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-medium ${levelColors[test.level] || levelColors.B1}`}
            >
              Level {test.level}
            </span>
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-medium border ${statusColors[status]}`}
            >
              {statusLabels[status]}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-foreground group-hover:text-indigo-600 transition-colors mb-1">
            {test.title}
          </h3>
          {test.description && (
            <p className="text-foreground/60 text-base mb-3">{test.description}</p>
          )}
        </div>
        <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-indigo-500 transition-all">
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

      <div className="flex items-center gap-4 text-sm text-foreground/60 mb-4">
        <span className="flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {test.duration} min
        </span>
        <span className="flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {test.totalQuestions || 0} questions
        </span>
        {status === "completed" && score !== undefined && (
          <span className="ml-auto text-emerald-500 font-medium">
            Score: {score}%
          </span>
        )}
      </div>
      <div className="pt-4 mt-4 border-t border-foreground/10">
        <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
          Start →
        </span>
      </div>
    </Link>
  );
}
