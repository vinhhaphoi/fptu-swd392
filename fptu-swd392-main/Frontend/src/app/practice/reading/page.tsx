"use client";

import OverallProgress, { mockProgressData } from "@/components/OverallProgress";
import SkillHeader from "@/components/skills/SkillHeader";
import ProgressBar from "@/components/skills/ProgressBar";
import ExerciseCard from "@/components/skills/ExerciseCard";
import { SKILLS_DATA, SkillType } from "@/types";
import { useState } from "react";
import Link from "next/link";

const LEVELS_FILTER = ["B1", "B2", "C1"] as const;

// Mock data for reading exercises
const MOCK_READING_EXERCISES = [
  {
    id: "r1",
    title: "Climate Change and Its Effects",
    level: "B1" as const,
    skill: "reading" as SkillType,
    duration: 20,
    totalQuestions: 10,
    description: "Read about climate change and answer comprehension questions",
  },
  {
    id: "r2",
    title: "The History of Technology",
    level: "B2" as const,
    skill: "reading" as SkillType,
    duration: 25,
    totalQuestions: 12,
    description: "Explore the evolution of technology through history",
  },
  {
    id: "r3",
    title: "Modern Education Systems",
    level: "C1" as const,
    skill: "reading" as SkillType,
    duration: 30,
    totalQuestions: 15,
    description: "Analyze different approaches to modern education",
  },
];

export default function ReadingPracticePage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  const skillData = SKILLS_DATA.reading;
  const allExercises = MOCK_READING_EXERCISES;
  const recentResults: Array<{ id: string; testId: string; skill: SkillType; testTitle?: string; score: number; totalScore: number; completedAt: Date }> = [];
  const readingProgress = {
    userId: "",
    skill: "reading" as SkillType,
    testsCompleted: 0,
    averageScore: 0,
    lastActivity: new Date(),
  };

  const filteredExercises =
    selectedLevel === "all"
      ? allExercises
      : allExercises.filter((ex) => ex.level === selectedLevel);

  const recentActivity = recentResults
    .filter((r) => r.skill === "reading")
    .slice(0, 5)
    .map((result) => ({
      ...result,
      title: result.testTitle || "Reading Exercise",
    }));

  const completedIds = new Set(
    recentResults.filter((r) => r.skill === "reading").map((r) => r.testId),
  );
  const recommendations = allExercises
    .filter((ex) => !completedIds.has(ex.id))
    .slice(0, 3);

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OverallProgress data={mockProgressData} />

        {/* Header */}
        <SkillHeader skill="reading" skillData={skillData} />

        {/* Statistics */}
        <ProgressBar
          skill="reading"
          completed={readingProgress.testsCompleted}
          total={allExercises.length}
          currentLevel={
            readingProgress.averageScore >= 80
              ? "C1"
              : readingProgress.averageScore >= 60
                ? "B2"
                : "B1"
          }
          skillColor={skillData.color}
        />

        {/* Level Filter */}
        <div className="flex items-center gap-3 mb-6 mt-10">
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

        {/* Exercises List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              test={exercise}
              skill="reading"
              status={
                recentResults.some((r) => r.testId === exercise.id)
                  ? "completed"
                  : "not_started"
              }
              score={
                recentResults.find((r) => r.testId === exercise.id)
                  ? Math.round(
                      (recentResults.find((r) => r.testId === exercise.id)!.score /
                        recentResults.find((r) => r.testId === exercise.id)!
                          .totalScore) *
                        100,
                    )
                  : undefined
              }
            />
          ))}
        </div>

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
                    href={`/practice/reading/${rec.id}`}
                    className="block p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors"
                  >
                    <p className="text-sm font-medium text-foreground">{rec.title}</p>
                    <p className="text-xs text-foreground/40 mt-1">
                      Level {rec.level} • {rec.duration} min • {rec.totalQuestions} questions
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
