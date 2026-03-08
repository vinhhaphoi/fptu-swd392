"use client";

import React from "react";

export interface TimelineStep {
  round: string;
  title: string;
  date: string;
  status: "completed" | "in_progress" | "upcoming";
}

export interface TimelineRow {
  id: number;
  steps: TimelineStep[];
  currentStepIndex: number;
}

interface MultipleTimelineProgressProps {
  timelines: TimelineRow[];
  className?: string;
}

const COLORS = {
  green: "#3FCF97",
  greenBorder: "#218A5D",
  greenBadgeBg: "#D6FAE8",
  greenBadgeText: "#218A5D",
  blue: "#5993F5",
  blueBorder: "#3866BF",
  blueBadgeBg: "#D3E7FF",
  blueBadgeText: "#3866BF",
  gray: "#7A7A7A",
  grayBorder: "#5A5A5A",
  grayDashed: "#7A7A7A",
  textWhite: "#ffffff",
  textMuted: "#9ca3af",
  textUpcoming: "#AAAAAA",
  textUpcomingDate: "#C0C0C0",
  cardBg: "#2D2D2D",
  cardBorder: "#3a3a3a",
} as const;

function TimelineRowCard({ row }: { row: TimelineRow }) {
  const { steps } = row;
  const totalSteps = steps.length;
  const segmentCount = Math.max(1, totalSteps - 1);

  return (
    <div
      className="rounded-2xl border p-6 mb-4 last:mb-0 transition-shadow duration-300 hover:shadow-lg"
      style={{
        backgroundColor: COLORS.cardBg,
        borderColor: COLORS.cardBorder,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15), 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      <div className="relative flex items-start justify-between px-1 overflow-x-auto min-w-0">
        {/* Segment: green (completed), blue (in progress → next), dashed grey (upcoming) */}
        {steps.slice(0, -1).map((_, index) => {
          const current = steps[index];
          const next = steps[index + 1];
          const widthPercent = 100 / segmentCount;
          const left = (index / segmentCount) * 100;
          let segmentEl: React.ReactElement | null = null;
          if (current.status === "completed" && (next?.status === "completed" || next?.status === "in_progress")) {
            segmentEl = (
              <div
                key={index}
                className="absolute top-5 h-1 rounded-full transition-[width] duration-[0.8s] ease-out"
                style={{ left: `${left}%`, width: `${widthPercent}%`, backgroundColor: COLORS.green, zIndex: 1 }}
              />
            );
          } else if (current.status === "in_progress") {
            segmentEl = (
              <div
                key={index}
                className="absolute top-5 h-1 rounded-full transition-[width] duration-[0.8s] ease-out"
                style={{ left: `${left}%`, width: `${widthPercent}%`, backgroundColor: COLORS.blue, zIndex: 1 }}
              />
            );
          } else {
            segmentEl = (
              <div
                key={index}
                className="absolute top-5 h-1 rounded-full z-[0]"
                style={{
                  left: `${left}%`,
                  width: `${widthPercent}%`,
                  background: `repeating-linear-gradient(90deg, ${COLORS.grayDashed} 0, ${COLORS.grayDashed} 6px, transparent 6px, transparent 12px)`,
                }}
              />
            );
          }
          return segmentEl;
        })}

        {steps.map((step, index) => {
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "in_progress";
          const isUpcoming = step.status === "upcoming";

          return (
            <div
              key={index}
              className="flex flex-col items-center flex-1 min-w-0 flex-shrink-0"
              style={{ minWidth: "72px", maxWidth: `${100 / totalSteps}%` }}
            >
              <div
                className={`
                  flex flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ease-out
                  ${isCurrent ? "h-11 w-11 animate-timeline-pulse" : "h-10 w-10"}
                  hover:scale-110
                `}
                style={{
                  backgroundColor: isCompleted ? COLORS.green : isCurrent ? COLORS.blue : COLORS.gray,
                  borderColor: isCompleted ? COLORS.greenBorder : isCurrent ? COLORS.blueBorder : COLORS.grayBorder,
                  borderStyle: "solid",
                  borderWidth: isCurrent ? 3 : 2,
                  boxShadow: isCompleted
                    ? "0 2px 8px rgba(63, 207, 151, 0.35)"
                    : isCurrent
                      ? "0 2px 12px rgba(89, 147, 245, 0.45)"
                      : "0 1px 4px rgba(0,0,0,0.2)",
                }}
              >
                {isCompleted && (
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {isCurrent && (
                  <span className="text-white text-base leading-none" aria-hidden>⚡</span>
                )}
                {isUpcoming && null}
              </div>

              <div className="mt-3 w-full text-center px-0.5">
                <div
                  className="text-[11px] font-bold uppercase tracking-wide"
                  style={{ color: isUpcoming ? COLORS.textUpcoming : COLORS.textWhite }}
                >
                  {step.round}
                </div>
                <div
                  className="mt-0.5 text-[13px] font-normal leading-tight mx-auto max-w-[100px]"
                  style={{ color: isUpcoming ? COLORS.textUpcoming : COLORS.textWhite }}
                >
                  {step.title}
                </div>
                <div
                  className="mt-0.5 text-[11px]"
                  style={{ color: isUpcoming ? COLORS.textUpcomingDate : COLORS.textMuted }}
                >
                  {step.date}
                </div>
                {step.status === "completed" && (
                  <span
                    className="mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide"
                    style={{ backgroundColor: COLORS.greenBadgeBg, color: COLORS.greenBadgeText }}
                  >
                    Completed
                  </span>
                )}
                {step.status === "in_progress" && (
                  <span
                    className="mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide"
                    style={{ backgroundColor: COLORS.blueBadgeBg, color: COLORS.blueBadgeText }}
                  >
                    In progress
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

export default function MultipleTimelineProgress({
  timelines,
  className = "",
}: MultipleTimelineProgressProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {timelines.map((row, index) => (
        <div
          key={row.id}
          className="animate-fade-in-timeline"
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          <TimelineRowCard row={row} />
        </div>
      ))}
    </div>
  );
}

export const mockMultipleTimelineData: TimelineRow[] = [
  {
    id: 1,
    currentStepIndex: 1,
    steps: [
      { round: "ROUND 1", title: "Proposal Submissions", date: "2023-12-01", status: "completed" },
      { round: "ROUND 2", title: "Participants Preselection", date: "2024-02-01", status: "in_progress" },
      { round: "ROUND 3", title: "Best And Final Submissions", date: "2024-02-15", status: "upcoming" },
      { round: "ROUND 4", title: "LOI", date: "2024-03-01", status: "upcoming" },
      { round: "FINAL ROUND", title: "Lease Execution", date: "2024-04-01", status: "upcoming" },
    ],
  },
  {
    id: 2,
    currentStepIndex: 2,
    steps: [
      { round: "ROUND 1", title: "Proposal Submissions", date: "2023-12-01", status: "completed" },
      { round: "ROUND 2", title: "Participants Preselection", date: "2024-02-01", status: "completed" },
      { round: "ROUND 3", title: "Best And Final Submissions", date: "2024-02-15", status: "in_progress" },
      { round: "ROUND 4", title: "LOI", date: "2024-03-01", status: "upcoming" },
      { round: "FINAL ROUND", title: "Lease Execution", date: "2024-04-01", status: "upcoming" },
    ],
  },
  {
    id: 3,
    currentStepIndex: 3,
    steps: [
      { round: "ROUND 1", title: "Proposal Submissions", date: "2023-12-01", status: "completed" },
      { round: "ROUND 2", title: "Participants Preselection", date: "2024-02-01", status: "completed" },
      { round: "ROUND 3", title: "Best And Final Submissions", date: "2024-02-15", status: "completed" },
      { round: "ROUND 4", title: "LOI", date: "2024-03-01", status: "in_progress" },
      { round: "FINAL ROUND", title: "Lease Execution", date: "2024-04-01", status: "upcoming" },
    ],
  },
  {
    id: 4,
    currentStepIndex: 4,
    steps: [
      { round: "ROUND 1", title: "Proposal Submissions", date: "2023-12-01", status: "completed" },
      { round: "ROUND 2", title: "Participants Preselection", date: "2024-02-01", status: "completed" },
      { round: "ROUND 3", title: "Best And Final Submissions", date: "2024-02-15", status: "completed" },
      { round: "ROUND 4", title: "LOI", date: "2024-03-01", status: "completed" },
      { round: "FINAL ROUND", title: "Lease Execution", date: "2024-04-01", status: "in_progress" },
    ],
  },
];
