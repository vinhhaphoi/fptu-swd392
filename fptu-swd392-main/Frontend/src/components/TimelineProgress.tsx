"use client";

export interface TimelineStep {
  round: string;
  title: string;
  date: string;
  status: "completed" | "in_progress" | "upcoming";
  description?: string | null;
}

interface TimelineProgressProps {
  steps: TimelineStep[];
  currentStep?: number;
  className?: string;
}

export default function TimelineProgress({
  steps,
  currentStep,
  className = "",
}: TimelineProgressProps) {
  return (
    <div
      className={`rounded-xl border border-card-border bg-card p-6 shadow-sm mb-6 ${className}`}
    >
      {/* Desktop: Horizontal timeline */}
      <div className="hidden md:block">
        {/* Line row: line + circles on top */}
        <div className="relative flex items-start justify-between px-2">
          {/* Full line: dashed (upcoming) */}
          <div
            className="absolute left-0 right-0 top-5 h-0.5 -z-0"
            style={{
              background: "repeating-linear-gradient(90deg, #d1d5db 0, #d1d5db 6px, transparent 6px, transparent 12px)",
            }}
          />
          {/* Solid green segments: from start up to and including segment before next upcoming */}
          {steps.length > 1 &&
            steps.slice(0, -1).map((step, index) => {
              const isSolid = step.status === "completed" || step.status === "in_progress";
              if (!isSolid) return null;
              const segmentCount = steps.length - 1;
              const widthPercent = 100 / segmentCount;
              const left = (index / segmentCount) * 100;
              return (
                <div
                  key={index}
                  className="absolute top-5 h-0.5 -z-[1] bg-[#10b981]"
                  style={{
                    left: `${left}%`,
                    width: `${widthPercent}%`,
                  }}
                />
              );
            })}

          {steps.map((step, index) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "in_progress";
            const isUpcoming = step.status === "upcoming";

            return (
              <div
                key={index}
                className="flex flex-col items-center flex-1 min-w-0"
                style={{ maxWidth: "20%" }}
              >
                {/* Circle */}
                <div
                  className={`
                    flex flex-shrink-0 items-center justify-center rounded-full border-2 transition-transform duration-200
                    ${isCurrent ? "h-12 w-12 animate-timeline-pulse" : "h-10 w-10"}
                    hover:scale-110 cursor-default
                  `}
                  style={{
                    backgroundColor: isCompleted
                      ? "#10b981"
                      : isCurrent
                        ? "#6366f1"
                        : "#d1d5db",
                    borderColor: isCompleted
                      ? "#059669"
                      : isCurrent
                        ? "#4f46e5"
                        : "#9ca3af",
                    borderStyle: isUpcoming ? "dashed" : "solid",
                    borderWidth: isCurrent ? 3 : 2,
                    boxShadow: isCurrent ? "0 4px 12px rgba(0,0,0,0.2)" : undefined,
                  }}
                  title={step.description || step.title}
                >
                  {isCompleted && (
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isCurrent && (
                    <span className="text-white text-lg leading-none" aria-hidden>⚡</span>
                  )}
                  {isUpcoming && (
                    <span className="text-[#6b7280] text-sm font-medium">○</span>
                  )}
                </div>

                {/* Content below */}
                <div className="mt-4 w-full text-center px-1">
                  <div
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{ color: "var(--foreground)", opacity: isUpcoming ? 0.7 : 1 }}
                  >
                    {step.round}
                  </div>
                  <div
                    className="mt-1 text-sm font-semibold"
                    style={{ color: "var(--foreground)", opacity: isUpcoming ? 0.8 : 1 }}
                  >
                    {step.title}
                  </div>
                  <div
                    className="mt-0.5 text-xs"
                    style={{ color: "#6b7280" }}
                  >
                    {step.date}
                  </div>
                  {step.status !== "upcoming" && (
                    <span
                      className="mt-2 inline-block rounded px-2 py-0.5 text-[11px] font-medium"
                      style={
                        isCompleted
                          ? { backgroundColor: "#dcfce7", color: "#166534" }
                          : { backgroundColor: "#dbeafe", color: "#1e40af" }
                      }
                    >
                      {isCompleted ? "Completed" : "In progress"}
                    </span>
                  )}
                  {step.status === "upcoming" && (
                    <span
                      className="mt-2 inline-block rounded px-2 py-0.5 text-[11px] font-medium"
                      style={{ backgroundColor: "#f3f4f6", color: "#6b7280" }}
                    >
                      Upcoming
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: Vertical timeline */}
      <div className="md:hidden space-y-0">
        {steps.map((step, index) => {
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "in_progress";
          const isUpcoming = step.status === "upcoming";
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex gap-4">
              {/* Left: line + circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex flex-shrink-0 items-center justify-center rounded-full border-2
                    ${isCurrent ? "h-12 w-12 animate-timeline-pulse" : "h-10 w-10"}
                  `}
                  style={{
                    backgroundColor: isCompleted
                      ? "#10b981"
                      : isCurrent
                        ? "#6366f1"
                        : "#d1d5db",
                    borderColor: isCompleted
                      ? "#059669"
                      : isCurrent
                        ? "#4f46e5"
                        : "#9ca3af",
                    borderStyle: isUpcoming ? "dashed" : "solid",
                    borderWidth: isCurrent ? 3 : 2,
                  }}
                >
                  {isCompleted && (
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isCurrent && (
                    <span className="text-white text-lg leading-none">⚡</span>
                  )}
                  {isUpcoming && (
                    <span className="text-[#6b7280] text-sm font-medium">○</span>
                  )}
                </div>
                {!isLast && (
                  <div
                    className="mt-1 w-0.5 flex-1 min-h-[2rem]"
                    style={{
                      backgroundColor: isUpcoming ? "transparent" : "#10b981",
                      backgroundImage: isUpcoming
                        ? "repeating-linear-gradient(180deg, #d1d5db 0, #d1d5db 4px, transparent 4px, transparent 8px)"
                        : undefined,
                    }}
                  />
                )}
              </div>

              {/* Right: content */}
              <div className="flex-1 pb-6">
                <div
                  className="text-xs font-bold uppercase tracking-wide"
                  style={{ color: "var(--foreground)", opacity: isUpcoming ? 0.7 : 1 }}
                >
                  {step.round}
                </div>
                <div
                  className="mt-1 text-sm font-semibold"
                  style={{ color: "var(--foreground)", opacity: isUpcoming ? 0.8 : 1 }}
                >
                  {step.title}
                </div>
                <div className="mt-0.5 text-xs text-[#6b7280]">{step.date}</div>
                {(step.status === "completed" || step.status === "in_progress") && (
                  <span
                    className="mt-2 inline-block rounded px-2 py-0.5 text-[11px] font-medium"
                    style={
                      isCompleted
                        ? { backgroundColor: "#dcfce7", color: "#166534" }
                        : { backgroundColor: "#dbeafe", color: "#1e40af" }
                    }
                  >
                    {isCompleted ? "Completed" : "In progress"}
                  </span>
                )}
                {step.status === "upcoming" && (
                  <span
                    className="mt-2 inline-block rounded px-2 py-0.5 text-[11px] font-medium text-[#6b7280]"
                    style={{ backgroundColor: "#f3f4f6" }}
                  >
                    Upcoming
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const mockTimelineData: TimelineStep[] = [
  {
    round: "ROUND 1",
    title: "Proposal Submissions",
    date: "2023-12-01",
    status: "completed",
    description: "Completed",
  },
  {
    round: "ROUND 2",
    title: "Participants Preselection",
    date: "2024-02-01",
    status: "completed",
    description: "Completed",
  },
  {
    round: "ROUND 3",
    title: "Best And Final Submissions",
    date: "2024-02-15",
    status: "in_progress",
    description: "In progress",
  },
  {
    round: "ROUND 4",
    title: "LOI",
    date: "2024-03-01",
    status: "upcoming",
    description: null,
  },
  {
    round: "FINAL ROUND",
    title: "Lease Execution",
    date: "2024-04-01",
    status: "upcoming",
    description: null,
  },
];
