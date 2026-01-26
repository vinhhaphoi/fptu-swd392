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
      <div className="min-h-screen py-20">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl mb-6">
              🔒
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Sign In Required
            </h1>
            <p className="text-slate-400 mb-6">
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
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Full Mock Exam
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Experience a complete VSTEP examination with all 4 skills. This mock
            exam simulates the actual test conditions.
          </p>
        </div>

        {/* Level Selection */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            Select Your Target Level
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  selectedLevel === level
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-slate-700 bg-slate-900/50 hover:border-slate-600"
                }`}
              >
                <div
                  className={`text-3xl font-bold mb-2 ${
                    selectedLevel === level ? "text-indigo-400" : "text-white"
                  }`}
                >
                  {level}
                </div>
                <div className="text-slate-400 text-sm">
                  {level === "B1" && "Intermediate"}
                  {level === "B2" && "Upper Intermediate"}
                  {level === "C1" && "Advanced"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Exam Structure */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            Exam Structure
          </h2>

          <div className="space-y-4">
            {(Object.keys(SKILLS_DATA) as Array<keyof typeof SKILLS_DATA>).map(
              (skill, index) => {
                const data = SKILLS_DATA[skill];
                return (
                  <div
                    key={skill}
                    className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl"
                  >
                    <div className="text-2xl font-bold text-slate-500 w-8">
                      {index + 1}
                    </div>
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${data.color} flex items-center justify-center text-xl`}
                    >
                      {data.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{data.name}</h3>
                      <p className="text-sm text-slate-400">
                        {data.questions} questions • {data.duration} minutes
                      </p>
                    </div>
                  </div>
                );
              },
            )}
          </div>

          <div className="mt-6 p-4 bg-slate-900/50 rounded-xl flex items-center justify-between">
            <span className="text-slate-300 font-medium">Total Duration</span>
            <span className="text-xl font-bold text-indigo-400">
              {Object.values(SKILLS_DATA).reduce(
                (acc, skill) => acc + skill.duration,
                0,
              )}{" "}
              minutes
            </span>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-8">
          <h3 className="font-medium text-amber-400 mb-3 flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Before You Begin
          </h3>
          <ul className="text-slate-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              Ensure you have a quiet environment with a stable internet
              connection
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              Check your headphones/speakers are working for the Listening
              section
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              Test your microphone for the Speaking section
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              The timer cannot be paused once the exam starts
            </li>
          </ul>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={handleStartExam}
            loading={isStarting}
            className="px-12"
          >
            Start Mock Exam ({selectedLevel})
          </Button>
          <p className="text-slate-500 text-sm mt-4">
            You can take this exam multiple times. Your best score will be
            recorded.
          </p>
        </div>
      </div>
    </div>
  );
}
