"use client";

import { useEffect, useState } from "react";

interface TimerProps {
  timeRemaining: number;
  onTimeUp?: () => void;
}

export default function Timer({ timeRemaining, onTimeUp }: TimerProps) {
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    // Warning at 5 minutes
    setIsWarning(timeRemaining <= 300);
    // Critical at 1 minute
    setIsCritical(timeRemaining <= 60);

    if (timeRemaining === 0 && onTimeUp) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getBackgroundColor = () => {
    if (isCritical) return "bg-red-500/20 border-red-500/50";
    if (isWarning) return "bg-amber-500/20 border-amber-500/50";
    return "bg-slate-800/50 border-slate-700/50";
  };

  const getTextColor = () => {
    if (isCritical) return "text-red-400";
    if (isWarning) return "text-amber-400";
    return "text-white";
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-2 rounded-xl border backdrop-blur-sm
        transition-all duration-300
        ${getBackgroundColor()}
        ${isCritical ? "animate-pulse" : ""}
      `}
    >
      <svg
        className={`w-5 h-5 ${getTextColor()}`}
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
      <span className={`font-mono text-lg font-bold ${getTextColor()}`}>
        {formatTime(timeRemaining)}
      </span>
      {isWarning && (
        <span className="text-xs text-slate-400">
          {isCritical ? "Time almost up!" : "Less than 5 min"}
        </span>
      )}
    </div>
  );
}
