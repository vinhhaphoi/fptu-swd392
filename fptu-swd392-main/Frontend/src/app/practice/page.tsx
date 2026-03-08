"use client";

import SkillCard from "@/components/ui/SkillCard";
import { useAuth } from "@/hooks/useAuth";
import { useAppContent, useUserStatus } from "@/hooks/useRealTime";
import { LEVELS, SkillType } from "@/types";
import Link from "next/link";

export default function PracticePage() {
  const { user } = useAuth();
  const { skills, loading: contentLoading } = useAppContent();
  const { progress, loading: progressLoading } = useUserStatus(
    user?.uid || null,
  );

  const loading = contentLoading || progressLoading;

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Practice Tests
          </h1>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Choose a skill to practice. Each section contains multiple tests
            designed to help you prepare for the VSTEP examination.
          </p>
        </div>

        {/* Level Filter */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="text-foreground/40 text-sm">Filter by level:</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium shadow-lg">
              All Levels
            </button>
            {LEVELS.map((level) => (
              <button
                key={level}
                className="px-4 py-2 rounded-lg bg-card text-foreground/70 text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:bg-foreground/5 transition-all"
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {Object.keys(skills).map((skill) => (
              <SkillCard
                key={skill}
                skill={skill as SkillType}
                progress={progress[skill]?.averageScore || 0}
                testsCompleted={progress[skill]?.testsCompleted || 0}
              />
            ))}
          </div>
        )}

        {/* Mock Exam CTA */}
        <div className="bg-card border border-card-border rounded-2xl p-8 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready for a Full Mock Exam?
          </h2>
          <p className="text-foreground/60 mb-6 max-w-xl mx-auto">
            Take a complete VSTEP mock exam with all 4 skills. Experience the
            real test format and timing.
          </p>
          <Link
            href="/mock-exam"
            className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:shadow-lg transition-all"
          >
            Start Mock Exam
          </Link>
        </div>
      </div>
    </div>
  );
}
