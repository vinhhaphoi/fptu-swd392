"use client";

import OverallProgress, { mockProgressData } from "@/components/OverallProgress";
import SkillHeader from "@/components/skills/SkillHeader";
import ProgressBar from "@/components/skills/ProgressBar";
import { SKILLS_DATA, SkillType } from "@/types";
import Link from "next/link";
import { useState, useMemo } from "react";

const LEVELS_FILTER = ["B1", "B2", "C1"] as const;

// Mock data for writing exercises
const MOCK_WRITING_EXERCISES = {
  task1: [
    {
      id: "w1-t1",
      title: "Formal Letter: Job Application",
      level: "B1" as const,
      skill: "writing" as SkillType,
      duration: 20,
      totalQuestions: 1,
      description: "Write a formal letter applying for a job position",
      prompt: "You saw an advertisement for a part-time job at a local library. Write a formal letter to the manager applying for this position.",
    },
    {
      id: "w2-t1",
      title: "Informal Email: Apology",
      level: "B2" as const,
      skill: "writing" as SkillType,
      duration: 20,
      totalQuestions: 1,
      description: "Write an informal email apologizing to a friend",
      prompt: "You missed your friend's birthday party. Write an email apologizing and explaining what happened.",
    },
    {
      id: "w3-t1",
      title: "Formal Letter: Complaint",
      level: "C1" as const,
      skill: "writing" as SkillType,
      duration: 20,
      totalQuestions: 1,
      description: "Write a formal letter complaining about poor service",
      prompt: "You recently stayed at a hotel and experienced poor service. Write a formal letter of complaint to the hotel manager.",
    },
  ],
  task2: [
    {
      id: "w1-t2",
      title: "Opinion Essay: Technology",
      level: "B1" as const,
      skill: "writing" as SkillType,
      duration: 40,
      totalQuestions: 1,
      description: "Write an opinion essay about technology",
      prompt: "Some people think that technology makes our lives more complicated. Others believe it makes life easier. What is your opinion?",
    },
    {
      id: "w2-t2",
      title: "Argumentative Essay: Education",
      level: "B2" as const,
      skill: "writing" as SkillType,
      duration: 40,
      totalQuestions: 1,
      description: "Write an argumentative essay about education",
      prompt: "Do you agree or disagree with the following statement: 'Online learning is more effective than traditional classroom learning.'",
    },
    {
      id: "w3-t2",
      title: "Discussion Essay: Environment",
      level: "C1" as const,
      skill: "writing" as SkillType,
      duration: 40,
      totalQuestions: 1,
      description: "Write a discussion essay about environmental issues",
      prompt: "Discuss the advantages and disadvantages of renewable energy sources. Give your own opinion.",
    },
  ],
};

const ALL_WRITING_EXERCISES = [
  ...MOCK_WRITING_EXERCISES.task1.map((ex) => ({ ...ex, type: "task1" as const })),
  ...MOCK_WRITING_EXERCISES.task2.map((ex) => ({ ...ex, type: "task2" as const })),
];

export default function WritingPracticePage() {
  const [activeTab, setActiveTab] = useState<"task1" | "task2" | "mock">("task1");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  const skillData = SKILLS_DATA.writing;
  const writingProgress = {
    userId: "",
    skill: "writing" as SkillType,
    testsCompleted: 0,
    averageScore: 0,
    lastActivity: new Date(),
  };
  const recentResults: Array<{ id: string; testId: string; skill: SkillType; testTitle?: string; score: number; totalScore: number; completedAt: Date }> = [];
  const allExercises = ALL_WRITING_EXERCISES;

  const filteredExercises = useMemo(() => {
    const byTab = allExercises.filter((ex) =>
      activeTab === "task1" ? ex.type === "task1" : ex.type === "task2",
    );
    if (selectedLevel === "all") return byTab;
    return byTab.filter((ex) => ex.level === selectedLevel);
  }, [allExercises, selectedLevel, activeTab]);

  const recentActivity = recentResults
    .filter((r) => r.skill === "writing")
    .slice(0, 5)
    .map((result) => ({
      ...result,
      title: result.testTitle || "Writing Exercise",
    }));

  const completedIds = new Set(
    recentResults.filter((r) => r.skill === "writing").map((r) => r.testId),
  );
  const recommendations = allExercises
    .filter((ex) => !completedIds.has(ex.id))
    .slice(0, 3);

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OverallProgress data={mockProgressData} />

        {/* Header */}
        <SkillHeader skill="writing" skillData={skillData} />

        {/* Statistics */}
        <ProgressBar
          skill="writing"
          completed={writingProgress.testsCompleted}
          total={allExercises.length}
          currentLevel={
            writingProgress.averageScore >= 80
              ? "C1"
              : writingProgress.averageScore >= 60
                ? "B2"
                : "B1"
          }
          skillColor={skillData.color}
        />

        {/* Tabs */}
        <div className="mt-10 mb-6">
          <div className="flex flex-wrap gap-2 border-b border-card-border">
            <button
              onClick={() => setActiveTab("task1")}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "task1"
                  ? "border-indigo-500 text-indigo-500"
                  : "border-transparent text-foreground/60 hover:text-foreground"
              }`}
            >
              Task 1 - Letter Writing
            </button>
            <button
              onClick={() => setActiveTab("task2")}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "task2"
                  ? "border-indigo-500 text-indigo-500"
                  : "border-transparent text-foreground/60 hover:text-foreground"
              }`}
            >
              Task 2 - Essay Writing
            </button>
            <button
              onClick={() => setActiveTab("mock")}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "mock"
                  ? "border-indigo-500 text-indigo-500"
                  : "border-transparent text-foreground/60 hover:text-foreground"
              }`}
            >
              Full Mock Exam
            </button>
          </div>
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-foreground/40 text-sm">Filter by level:</span>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedLevel("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedLevel === "all"
                  ? "bg-indigo-500 text-white shadow-lg"
                  : "bg-card border border-card-border text-foreground/70 hover:bg-foreground/5"
              }`}
            >
              All Levels
            </button>
            {LEVELS_FILTER.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedLevel === level
                    ? "bg-indigo-500 text-white shadow-lg"
                    : "bg-card border border-card-border text-foreground/70 hover:bg-foreground/5"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {activeTab === "mock" ? (
          <div className="bg-card border border-card-border rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Full Mock Exam
            </h2>
            <p className="text-foreground/60 mb-6 max-w-xl mx-auto">
              Take a complete VSTEP Writing exam with both Task 1 (Letter/Email) and Task 2 (Essay).
              Total time: 60 minutes.
            </p>
            <Link
              href="/practice/writing/mock"
              className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:shadow-lg transition-all"
            >
              Start Full Exam
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {filteredExercises.map((exercise) => (
              <Link
                key={exercise.id}
                href={`/practice/writing/${exercise.id}?type=${exercise.type}`}
                className="group block bg-card rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${
                        exercise.level === "C1"
                          ? "bg-purple-500/20 text-purple-600"
                          : exercise.level === "B2"
                            ? "bg-indigo-500/20 text-indigo-600"
                            : "bg-emerald-500/20 text-emerald-600"
                      }`}
                    >
                      Level {exercise.level}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-indigo-500 transition-colors mb-1">
                      {exercise.title}
                    </h3>
                    {exercise.description && (
                      <p className="text-foreground/60 text-sm">{exercise.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-foreground/40">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
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
                    {exercise.duration} min
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-card-border">
                  <span className="text-sm font-medium text-indigo-500 group-hover:text-indigo-400">
                    Start Writing →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Recent Activity & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-card rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Recent Activity
            </h3>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between py-2 border-b border-card-border last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {activity.title}
                      </p>
                      <p className="text-xs text-foreground/40">
                        {new Date(activity.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-500">
                        {Math.round((activity.score / activity.totalScore) * 100)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-foreground/40 text-sm">No recent activity</p>
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-card rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Recommended Next
            </h3>
            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <Link
                    key={rec.id}
                    href={`/practice/writing/${rec.id}?type=${rec.type}`}
                    className="block p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors"
                  >
                    <p className="text-sm font-medium text-foreground">{rec.title}</p>
                    <p className="text-xs text-foreground/40 mt-1">
                      Level {rec.level} • {rec.duration} min
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-foreground/40 text-sm">
                Great job! You've completed all exercises.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
