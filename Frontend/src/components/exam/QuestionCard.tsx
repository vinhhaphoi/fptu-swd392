"use client";

import { Answer, Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  answer: Answer | undefined;
  onAnswer: (answer: string) => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  answer,
  onAnswer,
}: QuestionCardProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 text-sm font-medium">
          Question {questionNumber} of {totalQuestions}
        </span>
        {question.partNumber && (
          <span className="text-slate-400 text-sm">
            Part {question.partNumber}
          </span>
        )}
      </div>

      {/* Passage (for reading questions) */}
      {question.passage && (
        <div className="mb-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700/30">
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {question.passage}
          </p>
        </div>
      )}

      {/* Question Content */}
      <div className="mb-6">
        <p className="text-lg text-white font-medium leading-relaxed">
          {question.content}
        </p>
      </div>

      {/* Image (if any) */}
      {question.imageUrl && (
        <div className="mb-6">
          <img
            src={question.imageUrl}
            alt="Question"
            className="max-w-full h-auto rounded-xl"
          />
        </div>
      )}

      {/* Answer Options (MCQ) */}
      {question.type === "mcq" && question.options && (
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
            const isSelected = answer?.answer === optionLetter;

            return (
              <button
                key={index}
                onClick={() => onAnswer(optionLetter)}
                className={`
                  w-full flex items-start gap-4 p-4 rounded-xl border text-left
                  transition-all duration-200
                  ${
                    isSelected
                      ? "bg-indigo-500/20 border-indigo-500 text-white"
                      : "bg-slate-900/30 border-slate-700/50 text-slate-300 hover:bg-slate-700/30 hover:border-slate-600"
                  }
                `}
              >
                <span
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center font-medium shrink-0
                    ${isSelected ? "bg-indigo-500 text-white" : "bg-slate-700 text-slate-400"}
                  `}
                >
                  {optionLetter}
                </span>
                <span className="pt-1">{option}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Essay Input (Writing) */}
      {question.type === "essay" && (
        <div className="space-y-3">
          <textarea
            value={answer?.answer || ""}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder="Write your answer here..."
            rows={12}
            className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
          />
          <div className="flex justify-between text-sm text-slate-400">
            <span>
              Word count:{" "}
              {answer?.answer
                ? answer.answer.trim().split(/\s+/).filter(Boolean).length
                : 0}
            </span>
            <span>
              Minimum: {question.content.includes("120") ? "120" : "250"} words
            </span>
          </div>
        </div>
      )}

      {/* Recording Input (Speaking) */}
      {question.type === "recording" && (
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-700/50 text-center">
          <div className="mb-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
          </div>
          <p className="text-slate-300 mb-4">
            Click to start recording your answer
          </p>
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
            Start Recording
          </button>
        </div>
      )}
    </div>
  );
}
