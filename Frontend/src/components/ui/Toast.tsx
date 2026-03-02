"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect } from "react";

export interface ToastProps {
  message: string;
  type: "success" | "error";
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  visible,
  onDismiss,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [visible, duration, onDismiss]);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4"
      role="alert"
    >
      <div
        className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg border ${
          type === "success"
            ? "bg-emerald-500/95 text-white border-emerald-400/30"
            : "bg-red-500/95 text-white border-red-400/30"
        }`}
      >
        {type === "success" ? (
          <CheckCircle2 size={24} />
        ) : (
          <AlertCircle size={24} />
        )}
        <p className="font-semibold">{message}</p>
      </div>
    </div>
  );
}
