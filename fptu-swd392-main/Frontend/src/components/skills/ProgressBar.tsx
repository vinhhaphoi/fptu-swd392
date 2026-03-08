"use client";

import { SkillType } from "@/types";

interface ProgressBarProps {
  skill: SkillType;
  completed: number;
  total: number;
  currentLevel?: "B1" | "B2" | "C1";
  skillColor: string;
}

const LEVELS = ["B1", "B2", "C1"] as const;

// Màu riêng cho từng level — dùng cho line segment và circle
const LEVEL_COLORS: Record<string, string> = {
  B1: "#06b6d4",
  B2: "#64748b",
  C1: "#475569",
};

export default function ProgressBar({
  skill,
  completed,
  total,
  currentLevel = "B1",
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const currentLevelIndex = LEVELS.indexOf(currentLevel);

  // Build level breakdown to match OverallProgress: completed / current / locked
  const levelBreakdown = LEVELS.map((level, index) => ({
    level,
    status:
      index < currentLevelIndex
        ? ("completed" as const)
        : index === currentLevelIndex
          ? ("current" as const)
          : ("locked" as const),
    score: index < currentLevelIndex ? 7 + index * 0.3 : 0,
    exercises: 10,
  }));

  const filledCount = currentLevelIndex + 1;
  const filledPercent =
    total > 0 ? Math.min(100, (filledCount / LEVELS.length) * 100) : 0;

  return (
    <div className="rounded-2xl bg-foreground/5 p-1 mb-6">
      <div className="rounded-xl bg-card p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-2xl" aria-hidden>
          📊
        </span>
        <div className="flex-1 flex items-center justify-between">
          <h2 className="text-lg font-semibold md:text-xl text-foreground">
            Overall Progress
          </h2>
          <span className="text-base font-semibold md:text-lg text-indigo-600">
            {percentage}%
          </span>
        </div>
      </div>

      {/* 3 cột thống kê */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-0 mb-6">
        <div className="flex flex-1 flex-col items-center text-center sm:border-r border-foreground/10 sm:py-0 py-3">
          <span className="mb-2 text-xs font-medium uppercase tracking-wide text-foreground/60">
            Completed
          </span>
          <span className="text-base font-semibold md:text-lg text-foreground">
            {completed}/{total} exercises
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center text-center sm:border-r border-foreground/10 sm:py-0 py-3">
          <span className="mb-2 text-xs font-medium uppercase tracking-wide text-foreground/60">
            Current Level
          </span>
          <span className="text-base font-semibold md:text-lg text-foreground">
            {currentLevel}
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center text-center sm:py-0 py-3">
          <span className="mb-2 text-xs font-medium uppercase tracking-wide text-foreground/60">
            Time to Next
          </span>
          <span className="text-base font-semibold md:text-lg text-foreground">
            ~10 hours
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 h-px w-full bg-foreground/10" />

      {/* Mini progress bar */}
      <div className="mb-2">
        <div className="h-2 w-full overflow-hidden rounded bg-foreground/10">
          <div
            className="h-full rounded transition-[width] duration-500 ease-out bg-gradient-to-r from-indigo-500 to-purple-500"
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-foreground/60">
          Progress: {percentage}%
        </p>
      </div>

      {/* Level timeline */}
      <div className="relative mt-8 flex items-end justify-between gap-0 overflow-x-auto px-2 pb-2 md:justify-between">
        {/* Track */}
        <div
          className="absolute left-6 right-6 top-5 h-2 rounded-full md:left-10 md:right-10 bg-foreground/15 z-0"
        />
        {/* Từng đoạn line: màu theo level */}
        {levelBreakdown.slice(0, -1).map((item, index) => {
          const isFilled = index < filledCount;
          const segmentColor = LEVEL_COLORS[item.level] ?? "#64748b";
          const segmentCount = Math.max(1, levelBreakdown.length - 1);
          const leftPct = (index / segmentCount) * 100;
          const widthPct = 100 / segmentCount;
          return (
            <div
              key={`seg-${item.level}`}
              className="absolute top-5 h-2 rounded-full transition-opacity duration-500 md:left-10"
              style={{
                left: `calc(1.5rem + (100% - 3rem) * ${leftPct / 100})`,
                width: `calc((100% - 3rem) * ${widthPct / 100})`,
                backgroundColor: isFilled ? segmentColor : "transparent",
                zIndex: 1,
              }}
            />
          );
        })}

        {levelBreakdown.map((item) => {
          const isCompleted = item.status === "completed";
          const isCurrent = item.status === "current";
          const isLocked = item.status === "locked";
          const levelColor = LEVEL_COLORS[item.level] ?? "#64748b";
          const borderColor = isLocked ? "#475569" : (isCurrent ? "#0891b2" : levelColor);

          return (
            <div
              key={item.level}
              className="relative z-10 flex flex-col items-center flex-shrink-0 flex-1"
            >
              <div
                className={`
                  flex items-center justify-center rounded-full border-2 text-sm font-bold
                  transition-all duration-300 ease-out hover:scale-105
                  ${isCurrent ? "h-12 w-12 md:h-14 md:w-14 animate-overall-progress-pulse" : "h-8 w-8 md:h-9 md:w-9"}
                `}
                style={{
                  backgroundColor: levelColor,
                  color: "white",
                  borderColor,
                  borderWidth: isCurrent ? 3 : 2,
                  boxShadow: isLocked
                    ? "0 2px 6px rgba(0,0,0,0.3)"
                    : isCurrent
                      ? "0 4px 12px rgba(0,0,0,0.25)"
                      : `0 2px 10px ${levelColor}80`,
                }}
                title={
                  isLocked
                    ? "Locked"
                    : isCurrent
                      ? "Current level"
                      : `Completed (${item.score})`
                }
              >
                {isLocked ? (
                  <span className="text-[10px]">🔒</span>
                ) : (
                  item.level
                )}
              </div>
              {isCompleted && (
                <span className="mt-1.5 text-[11px] font-medium text-indigo-500">
                  ({item.score.toFixed(1)})
                </span>
              )}
              {isCurrent && (
                <>
                  <span className="mt-1.5 text-[12px] font-bold text-foreground">
                    {item.level}
                  </span>
                  <span className="mt-0.5 text-[11px] font-medium text-cyan-600">
                    Current
                  </span>
                </>
              )}
              {isLocked && (
                <span className="mt-1.5 text-[11px] text-foreground/50">
                  {item.level}
                </span>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
