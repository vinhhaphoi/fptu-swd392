"use client";

import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { LEVELS, SKILLS_DATA } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MockExamPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<string>("B2");
  const [isStarting, setIsStarting] = useState(false);

  const handleStartExam = () => {
    setIsStarting(true);
    // In production, create a mock exam session
    setTimeout(() => {
      router.push(`/practice/listening/mock-${selectedLevel.toLowerCase()}`);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen py-20 bg-background">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-card border border-card-border rounded-[32px] p-8 shadow-xl shadow-indigo-500/5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl mb-6 shadow-lg">
              🔒
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Sign In Required
            </h1>
            <p className="text-foreground/60 mb-6">
              Please sign in to access mock exams and save your progress.
            </p>
            <Link href="/auth/login">
              <Button fullWidth>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
            Full Mock Exam
          </h1>
          <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
            Experience a complete VSTEP examination with all 4 skills. This mock
            exam simulates the actual test conditions.
          </p>
        </div>

        {/* Level Selection */}
        <div className="bg-card border border-card-border rounded-[32px] p-8 mb-8 shadow-xl shadow-indigo-500/5">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Select Your Target Level
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group ${
                  selectedLevel === level
                    ? "border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/10"
                    : "border-card-border bg-foreground/[0.02] hover:border-indigo-500/30"
                }`}
              >
                <div
                  className={`text-3xl font-black mb-1 transition-colors ${
                    selectedLevel === level
                      ? "text-indigo-500"
                      : "text-foreground"
                  }`}
                >
                  {level}
                </div>
                <div
                  className={`text-sm font-medium transition-colors ${
                    selectedLevel === level
                      ? "text-indigo-500/70"
                      : "text-foreground/40"
                  }`}
                >
                  {level === "B1" && "Intermediate"}
                  {level === "B2" && "Upper Intermediate"}
                  {level === "C1" && "Advanced"}
                </div>
                {selectedLevel === level && (
                  <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-500 flex items-center justify-center rounded-bl-xl text-white">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Exam Structure */}
        <div className="bg-card border border-card-border rounded-[32px] p-8 mb-8 shadow-xl shadow-indigo-500/5">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Exam Structure
          </h2>

          <div className="space-y-4">
            {(Object.keys(SKILLS_DATA) as Array<keyof typeof SKILLS_DATA>).map(
              (skill, index) => {
                const data = SKILLS_DATA[skill];
                return (
                  <div
                    key={skill}
                    className="flex items-center gap-4 p-5 bg-foreground/[0.02] border border-card-border rounded-2xl hover:bg-foreground/[0.04] transition-colors"
                  >
                    <div className="text-2xl font-black text-foreground/10 w-8">
                      {index + 1}
                    </div>
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${data.color} flex items-center justify-center text-2xl shadow-lg ring-4 ring-background`}
                    >
                      {data.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground text-lg">
                        {data.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest">
                          {data.questions} Questions
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-500 text-[10px] font-black uppercase tracking-widest">
                          {data.duration} Minutes
                        </span>
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>

          <div className="mt-8 p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl flex items-center justify-between">
            <span className="text-foreground/70 font-semibold">
              Total Exam Duration
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-indigo-500">
                {Object.values(SKILLS_DATA).reduce(
                  (acc, skill) => acc + skill.duration,
                  0,
                )}
              </span>
              <span className="text-sm font-bold text-indigo-500/70 uppercase">
                minutes
              </span>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-[32px] p-8 mb-8">
          <h3 className="text-lg font-bold text-amber-500 mb-4 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            Before You Begin
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Quiet environment with stable internet",
              "Check headphones for Listening section",
              "Test microphone for Speaking section",
              "Timer cannot be paused once started",
            ].map((note, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-background/50 border border-amber-500/10"
              >
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-foreground/70 text-sm font-medium leading-tight">
                  {note}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={handleStartExam}
            loading={isStarting}
            className="px-16 py-8 text-xl h-auto rounded-2xl shadow-xl shadow-indigo-500/20"
          >
            Start Mock Exam ({selectedLevel})
          </Button>
          <p className="text-foreground/40 text-sm mt-4 font-medium italic">
            * You can take this exam multiple times. Your best score will be
            recorded.
          </p>
        </div>
      </div>
    </div>
  );
}
