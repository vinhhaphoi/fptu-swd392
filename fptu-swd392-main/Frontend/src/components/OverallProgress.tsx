"use client";


export interface ProgressLevelBreakdown {
  level: string;
  status: "completed" | "current" | "locked";
  score: number;
  exercises: number;
}

export interface ProgressData {
  completedExercises: number;
  totalExercises: number;
  currentLevel: string;
  overallProgress: number;
  estimatedHoursToNextLevel: number;
  levelBreakdown: ProgressLevelBreakdown[];
}

interface OverallProgressProps {
  data: ProgressData;
  className?: string;
}

// Màu riêng cho từng level — dùng cho cả line segment và circle
const LEVEL_COLORS: Record<string, string> = {
  B1: "#06b6d4",
  B2: "#64748b",
  C1: "#475569",
};

export default function OverallProgress({ data, className = "" }: OverallProgressProps) {
  const {
    completedExercises,
    totalExercises,
    currentLevel,
    overallProgress,
    estimatedHoursToNextLevel,
    levelBreakdown,
  } = data;
  const segmentCount = Math.max(1, levelBreakdown.length - 1);
  const filledIndex = levelBreakdown.findIndex((l) => l.status === "current");
  const filledCount = filledIndex >= 0 ? filledIndex + 1 : levelBreakdown.filter((l) => l.status === "completed").length;

  return (
    <div className={`rounded-2xl bg-foreground/5 p-1 md:p-1 mb-6 ${className}`}>
      <div
        className="rounded-xl bg-card p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] md:p-6"
      >
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
            {overallProgress}%
          </span>
        </div>
      </div>

      {/* Content Section - 3 columns */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-0 mb-6">
        <div className="flex flex-1 flex-col items-center text-center sm:border-r border-foreground/10 sm:py-0 py-3 sm:py-0">
          <span className="mb-2 text-xs font-medium uppercase tracking-wide text-foreground/60">
            Completed
          </span>
          <span className="text-base font-semibold md:text-lg text-foreground">
            {completedExercises}/{totalExercises} exercises
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center text-center sm:border-r border-foreground/10 sm:py-0 py-3 sm:py-0">
          <span className="mb-2 text-xs font-medium uppercase tracking-wide text-foreground/60">
            Current Level
          </span>
          <span className="text-base font-semibold md:text-lg text-foreground">
            {currentLevel}
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center text-center sm:py-0 py-3 sm:py-0">
          <span className="mb-2 text-xs font-medium uppercase tracking-wide text-foreground/60">
            Time to Next
          </span>
          <span className="text-base font-semibold md:text-lg text-foreground">
            ~{estimatedHoursToNextLevel} hours
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 h-px w-full bg-foreground/10" />

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="h-2 w-full overflow-hidden rounded bg-foreground/10">
          <div
            className="h-full rounded transition-[width] duration-500 ease-out bg-gradient-to-r from-indigo-500 to-purple-500"
            style={{ width: `${Math.min(100, overallProgress)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-foreground/60">
          Progress: {overallProgress}%
        </p>
      </div>

      {/* Level Timeline: mỗi đoạn line + circle dùng màu của từng level */}
      <div className="relative mt-8 flex items-end justify-between gap-0 overflow-x-auto px-2 pb-2 md:justify-between">
        {/* Track nền */}
        <div
          className="absolute left-6 right-6 top-5 h-2 rounded-full md:left-10 md:right-10 bg-foreground/15 z-0"
        />
        {/* Từng đoạn line: màu theo level tương ứng */}
        {levelBreakdown.slice(0, -1).map((item, index) => {
          const isFilled = index < filledCount;
          const segmentColor = LEVEL_COLORS[item.level] ?? "#64748b";
          const leftPct = (index / segmentCount) * 100;
          const widthPct = 100 / segmentCount;
          return (
            <div
              key={`seg-${item.level}`}
              className="absolute top-5 h-2 rounded-full transition-opacity duration-500"
              style={{
                left: `calc(1.5rem + (100% - 3rem) * ${leftPct / 100})`,
                width: `calc((100% - 3rem) * ${widthPct / 100})`,
                backgroundColor: isFilled ? segmentColor : "transparent",
                zIndex: 1,
              }}
            />
          );
        })}

        {levelBreakdown.map((item, index) => {
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
                  ({item.score})
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

export const mockProgressData: ProgressData = {
  completedExercises: 5,
  totalExercises: 50,
  currentLevel: "B1",
  overallProgress: 10,
  estimatedHoursToNextLevel: 10,
  levelBreakdown: [
    { level: "B1", status: "current", score: 6.2, exercises: 5 },
    { level: "B2", status: "locked", score: 0, exercises: 0 },
    { level: "C1", status: "locked", score: 0, exercises: 0 },
  ],
};
