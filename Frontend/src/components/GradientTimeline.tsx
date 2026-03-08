"use client";

import React from "react";

export interface GradientTimelineStep {
  id: number;
  status: "completed" | "in_progress" | "upcoming";
  color?: string;
}

export interface GradientTimelineProps {
  steps: GradientTimelineStep[];
  currentStepIndex: number;
  showLabels?: boolean;
  className?: string;
}

const DEFAULT_COLORS = [
  "#60a5fa",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#f87171",
  "#a78bfa",
];

const DEFAULT_LABELS = ["A1", "A2", "B1", "B2", "C1", "C2", "C3"];

function getCircleStyle(
  status: GradientTimelineStep["status"],
  color: string
): {
  size: number;
  border: string;
  background: string;
  boxShadow: string;
  opacity: number;
  strokeDasharray?: string;
} {
  switch (status) {
    case "completed":
      return {
        size: 24,
        border: `3px solid ${color}`,
        background: "white",
        boxShadow: "none",
        opacity: 1,
      };
    case "in_progress":
      return {
        size: 28,
        border: `4px solid ${color}`,
        background: "white",
        boxShadow: `0 2px 8px rgba(0,0,0,0.15)`,
        opacity: 1,
      };
    case "upcoming":
      return {
        size: 20,
        border: `2px dashed ${color}`,
        background: "transparent",
        boxShadow: "none",
        opacity: 0.6,
      };
  }
}

const GradientTimeline: React.FC<GradientTimelineProps> = ({
  steps,
  currentStepIndex,
  showLabels = false,
  className = "",
}) => {
  const stepsWithColors = steps.map((step, idx) => ({
    ...step,
    color: step.color ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
  }));

  const gradientStops = stepsWithColors
    .map((s, i) => {
      const pct = steps.length > 1 ? (i / (steps.length - 1)) * 100 : 0;
      return `${s.color} ${pct.toFixed(2)}%`;
    })
    .join(", ");

  return (
    <div
      className={`relative w-full overflow-x-auto rounded-2xl border border-gray-200/80 bg-white p-6 mb-4 transition-shadow duration-300 hover:shadow-md ${className}`}
      style={{
        minHeight: 88,
        boxShadow: "0 4px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)",
      }}
    >
      {/* Gradient line */}
      <div
        className="absolute top-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${gradientStops})`,
          left: "40px",
          right: "40px",
          height: "8px",
        }}
      />

      {/* Circles container - same horizontal span as line */}
      <div
        className="absolute top-1/2 flex -translate-y-1/2 justify-between"
        style={{
          left: "40px",
          right: "40px",
          zIndex: 2,
        }}
      >
        {stepsWithColors.map((step, idx) => {
          const style = getCircleStyle(step.status, step.color!);
          return (
            <div
              key={step.id}
              className="flex flex-col items-center transition-transform duration-300 hover:scale-110 hover:cursor-pointer"
              style={{
                marginLeft: idx === 0 ? 0 : "-4px",
                marginRight: idx === steps.length - 1 ? 0 : "-4px",
              }}
            >
              <div
                className="flex flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 ease-out"
                style={{
                  width: style.size,
                  height: style.size,
                  minWidth: style.size,
                  minHeight: style.size,
                  border: style.border,
                  background: style.background,
                  boxShadow:
                    step.status === "in_progress"
                      ? `${style.boxShadow}, 0 2px 12px rgba(0,0,0,0.08)`
                      : step.status === "completed"
                        ? "0 2px 8px rgba(0,0,0,0.1)"
                        : style.boxShadow,
                  opacity: style.opacity,
                  strokeDasharray: style.strokeDasharray,
                }}
                title={
                  step.status === "completed"
                    ? "Completed"
                    : step.status === "in_progress"
                      ? "In progress"
                      : "Upcoming"
                }
              >
                {step.status === "completed" && (
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke={step.color}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 6l3 3 5-6" />
                  </svg>
                )}
                {step.status === "in_progress" && (
                  <div
                    className="rounded-full"
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: step.color,
                    }}
                  />
                )}
                {step.status === "upcoming" && (
                  <div
                    className="rounded-full border"
                    style={{
                      width: 6,
                      height: 6,
                      borderColor: step.color,
                      backgroundColor: "transparent",
                    }}
                  />
                )}
              </div>
              {showLabels && (
                <span
                  className="mt-1.5 text-xs font-medium"
                  style={{ color: "#6b7280" }}
                >
                  {DEFAULT_LABELS[idx] ?? `Step ${idx + 1}`}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GradientTimeline;

export const mockGradientTimelineData: GradientTimelineStep[] = [
  { id: 1, status: "completed", color: "#60a5fa" },
  { id: 2, status: "completed", color: "#8b5cf6" },
  { id: 3, status: "in_progress", color: "#06b6d4" },
  { id: 4, status: "in_progress", color: "#10b981" },
  { id: 5, status: "in_progress", color: "#f59e0b" },
  { id: 6, status: "upcoming", color: "#f87171" },
  { id: 7, status: "upcoming", color: "#a78bfa" },
];
