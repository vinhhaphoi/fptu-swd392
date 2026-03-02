import { SKILLS_DATA, SkillType } from "@/types";
import Link from "next/link";

interface SkillCardProps {
  skill: SkillType;
  progress?: number;
  testsCompleted?: number;
}

export default function SkillCard({
  skill,
  progress = 0,
  testsCompleted = 0,
}: SkillCardProps) {
  const data = SKILLS_DATA[skill];
  // Writing skill → trang luyện essay với AI chấm điểm
  const href = skill === "writing" ? "/writing" : `/practice/${skill}`;

  return (
    <Link href={href}>
      <div className="group relative overflow-hidden bg-card backdrop-blur-sm border border-card-border rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/10">
        {/* Background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${data.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
        />

        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${data.color} flex items-center justify-center text-3xl shadow-lg mb-4`}
        >
          {data.icon}
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-foreground mb-2">{data.name}</h3>
        <p className="text-foreground/60 text-sm mb-4">{data.description}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-foreground/40 mb-4">
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
            {data.duration} min
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
            {data.questions} questions
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground/50">Progress</span>
            <span className="text-indigo-500 font-medium">{progress}%</span>
          </div>
          <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${data.color} transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
          {testsCompleted > 0 && (
            <p className="text-xs text-foreground/40">
              {testsCompleted} tests completed
            </p>
          )}
        </div>

        {/* Arrow - Moved to top right to avoid overlapping progress bar */}
        <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-indigo-500 transition-all duration-300 shadow-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4">
          <svg
            className="w-4 h-4 text-foreground/40 group-hover:text-white group-hover:translate-x-0.5 transition-all"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
