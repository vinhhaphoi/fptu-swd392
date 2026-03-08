"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";

interface WritingEditorProps {
  taskType: "task1" | "task2";
  prompt: string;
  timeLimit: number; // in minutes
  minWords: number;
  onSubmit: (content: string, wordCount: number) => void;
  onSaveDraft: (content: string) => void;
  initialContent?: string;
}

export default function WritingEditor({
  taskType,
  prompt,
  timeLimit,
  minWords,
  onSubmit,
  onSaveDraft,
  initialContent = "",
}: WritingEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const wordCount = content.trim().split(/\s+/).filter((w) => w.length > 0).length;
  const isMinWordsMet = wordCount >= minWords;

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleFormat = (command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
  };

  const handleSubmit = () => {
    if (isMinWordsMet) {
      onSubmit(content, wordCount);
    }
  };

  const handleSaveDraft = () => {
    onSaveDraft(content);
  };

  return (
    <div className="space-y-6">
      {/* Timer and Word Count */}
      <div className="flex items-center justify-between bg-card border border-card-border rounded-xl p-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-foreground/60"
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
            <span
              className={`text-lg font-semibold ${
                timeRemaining < 300 ? "text-red-500" : "text-foreground"
              }`}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-foreground/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span
              className={`text-lg font-semibold ${
                isMinWordsMet ? "text-emerald-500" : "text-foreground/60"
              }`}
            >
              {wordCount} / {minWords} words
            </span>
          </div>
        </div>
      </div>

      {/* Prompt */}
      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-2">
          {taskType === "task1" ? "Task 1: Letter/Email Writing" : "Task 2: Essay Writing"}
        </h3>
        <p className="text-foreground/70 whitespace-pre-wrap">{prompt}</p>
      </div>

      {/* Formatting Toolbar */}
      <div className="flex items-center gap-2 bg-card border border-card-border rounded-xl p-3">
        <button
          onClick={() => {
            handleFormat("bold");
            setIsBold(!isBold);
          }}
          className={`p-2 rounded-lg hover:bg-foreground/5 transition-colors ${
            isBold ? "bg-indigo-500/10 text-indigo-500" : "text-foreground/60"
          }`}
          title="Bold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18h12M6 6h12"
            />
          </svg>
        </button>
        <button
          onClick={() => {
            handleFormat("italic");
            setIsItalic(!isItalic);
          }}
          className={`p-2 rounded-lg hover:bg-foreground/5 transition-colors ${
            isItalic ? "bg-indigo-500/10 text-indigo-500" : "text-foreground/60"
          }`}
          title="Italic"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        </button>
        <button
          onClick={() => {
            handleFormat("underline");
            setIsUnderline(!isUnderline);
          }}
          className={`p-2 rounded-lg hover:bg-foreground/5 transition-colors ${
            isUnderline ? "bg-indigo-500/10 text-indigo-500" : "text-foreground/60"
          }`}
          title="Underline"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5h14M5 9h14M5 13h14M5 17h14"
            />
          </svg>
        </button>
      </div>

      {/* Editor */}
      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div
          ref={editorRef}
          contentEditable
          className="min-h-[400px] p-6 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
          }}
          onInput={(e) => {
            const text = e.currentTarget.textContent || "";
            setContent(text);
          }}
          suppressContentEditableWarning
        >
          {initialContent || ""}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={handleSaveDraft}>
          Save Draft
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isMinWordsMet}
          className="flex-1"
        >
          Submit {taskType === "task1" ? "Letter" : "Essay"}
        </Button>
      </div>

      {!isMinWordsMet && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-amber-500">
          You need at least {minWords} words to submit. Currently: {wordCount} words.
        </div>
      )}
    </div>
  );
}
