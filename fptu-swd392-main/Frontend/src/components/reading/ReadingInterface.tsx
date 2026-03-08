"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import Timer from "@/components/exam/Timer";

interface Question {
  id: string;
  content: string;
  options: string[];
  correctAnswer?: string;
  order: number;
}

interface ReadingInterfaceProps {
  passage: string;
  questions: Question[];
  timeLimit: number; // in seconds
  onSubmit: (answers: Record<string, string>) => void;
}

export default function ReadingInterface({
  passage,
  questions,
  timeLimit,
  onSubmit,
}: ReadingInterfaceProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [selectedText, setSelectedText] = useState("");
  const [highlightedText, setHighlightedText] = useState<string[]>([]);
  const passageRef = useRef<HTMLDivElement>(null);

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

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString());
    }
  };

  const handleHighlight = () => {
    if (selectedText) {
      setHighlightedText((prev) => [...prev, selectedText]);
      setSelectedText("");
    }
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  return (
    <div className="space-y-6">
      {/* Timer */}
      <div className="flex items-center justify-between bg-card border border-card-border rounded-xl p-4">
        <div className="flex items-center gap-4">
          <Timer timeRemaining={timeRemaining} onTimeUp={handleSubmit} />
          <span className="text-foreground/60 text-sm">
            {answeredCount} / {questions.length} answered
          </span>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!allAnswered}
          variant={allAnswered ? "primary" : "secondary"}
        >
          Submit Answers
        </Button>
      </div>

      {/* Reading Interface - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Passage */}
        <div className="bg-card border border-card-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Reading Passage</h3>
            <div className="flex gap-2">
              <button
                onClick={handleHighlight}
                disabled={!selectedText}
                className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 text-sm font-medium hover:bg-indigo-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Highlight selected text"
              >
                Highlight
              </button>
              <button
                onClick={() => setHighlightedText([])}
                className="px-3 py-1.5 rounded-lg bg-foreground/5 text-foreground/60 text-sm font-medium hover:bg-foreground/10 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
          <div
            ref={passageRef}
            className="prose prose-invert max-w-none text-foreground/90"
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
            }}
            onMouseUp={handleTextSelection}
          >
            {passage.split(" ").map((word, index) => {
              const isHighlighted = highlightedText.some((ht) =>
                word.includes(ht.split(" ")[0]),
              );
              return (
                <span
                  key={index}
                  className={isHighlighted ? "bg-yellow-500/30 px-1 rounded" : ""}
                >
                  {word}{" "}
                </span>
              );
            })}
          </div>
        </div>

        {/* Right Column - Questions */}
        <div className="bg-card border border-card-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Questions</h3>
          <div className="space-y-6 max-h-[600px] overflow-y-auto">
            {questions.map((question, index) => (
              <div key={question.id} className="space-y-3">
                <p className="font-medium text-foreground">
                  {index + 1}. {question.content}
                </p>
                <div className="space-y-2">
                  {question.options.map((option, optIndex) => {
                    const optionLabel = String.fromCharCode(65 + optIndex); // A, B, C, D
                    const isSelected = answers[question.id] === optionLabel;
                    return (
                      <label
                        key={optIndex}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-500/10"
                            : "border-card-border hover:border-indigo-500/30 hover:bg-foreground/5"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={optionLabel}
                          checked={isSelected}
                          onChange={() => handleAnswer(question.id, optionLabel)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-foreground mr-2">
                            {optionLabel}.
                          </span>
                          <span className="text-foreground/80">{option}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
