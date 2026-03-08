"use client";

import OverallProgress, { mockProgressData } from "@/components/OverallProgress";
import SkillHeader from "@/components/skills/SkillHeader";
import ProgressBar from "@/components/skills/ProgressBar";
import ExerciseCard from "@/components/skills/ExerciseCard";
import { SKILLS_DATA, SkillType } from "@/types";
import { useState, useMemo } from "react";
import Link from "next/link";

const LEVELS_FILTER = ["B1", "B2", "C1"] as const;

// Mock data for speaking exercises
const MOCK_SPEAKING_EXERCISES = [
  {
    id: "s1",
    title: "Social Interaction - Introducing Yourself",
    level: "B1" as const,
    skill: "speaking" as SkillType,
    duration: 2,
    totalQuestions: 1,
    description: "Introduce yourself and talk about your background",
  },
  {
    id: "s2",
    title: "Solution Discussion - Problem Solving",
    level: "B2" as const,
    skill: "speaking" as SkillType,
    duration: 3,
    totalQuestions: 1,
    description: "Discuss solutions to a given problem",
  },
  {
    id: "s3",
    title: "Topic Development - Opinion Essay",
    level: "C1" as const,
    skill: "speaking" as SkillType,
    duration: 5,
    totalQuestions: 1,
    description: "Develop and express your opinion on a topic",
  },
];

export default function SpeakingPracticePage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  // Use mock data only - no Firebase dependency so UI always renders
  const skillData = SKILLS_DATA.speaking;
  const allExercises = MOCK_SPEAKING_EXERCISES;
  const recentResults: Array<{ id: string; testId: string; skill: SkillType; testTitle?: string; score: number; totalScore: number; completedAt: Date }> = [];
  const speakingProgress = {
    userId: "",
    skill: "speaking" as SkillType,
    testsCompleted: 0,
    averageScore: 0,
    lastActivity: new Date(),
  };

  const filteredExercises =
    selectedLevel === "all"
      ? allExercises
      : allExercises.filter((ex) => ex.level === selectedLevel);

  const recentActivity = recentResults
    .filter((r) => r.skill === "speaking")
    .slice(0, 5)
    .map((result) => ({
      ...result,
      title: result.testTitle || "Speaking Exercise",
    }));

  const completedIds = new Set(
    recentResults.filter((r) => r.skill === "speaking").map((r) => r.testId),
  );
  const recommendations = allExercises
    .filter((ex) => !completedIds.has(ex.id))
    .slice(0, 3);

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OverallProgress data={mockProgressData} />

        {/* Header */}
        <SkillHeader skill="speaking" skillData={skillData} />

        {/* Statistics */}
        <ProgressBar
          skill="speaking"
          completed={speakingProgress.testsCompleted}
          total={allExercises.length}
          currentLevel={
            speakingProgress.averageScore >= 80
              ? "C1"
              : speakingProgress.averageScore >= 60
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
              skill="speaking"
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
                    href={`/practice/speaking/${rec.id}`}
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
