"use client";

export const runtime = "edge";

import { useAppContent, useTests } from "@/hooks/useRealTime";
import { SkillType } from "@/types";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";

export default function SkillPage() {
  const params = useParams();
  const skill = params.skill as string;

  // Validate skill
  if (!["listening", "reading", "writing", "speaking"].includes(skill)) {
    notFound();
  }

  const { skills, loading: contentLoading } = useAppContent();
  const { tests, loading: testsLoading } = useTests(skill as SkillType);

  if (contentLoading || testsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const skillData = skills[skill as SkillType];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 text-foreground/40 hover:text-foreground mb-4 transition-colors"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Practice
          </Link>

          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${skillData.color} flex items-center justify-center text-3xl shadow-lg`}
            >
              {skillData.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {skillData.name} Practice
              </h1>
              <p className="text-foreground/60">{skillData.description}</p>
            </div>
          </div>
        </div>

        {/* Skill Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-card border border-card-border rounded-xl p-4">
            <div className="text-foreground/40 text-sm mb-1">Duration</div>
            <div className="text-2xl font-bold text-foreground">
              {skillData.duration} min
            </div>
          </div>
          <div className="bg-card border border-card-border rounded-xl p-4">
            <div className="text-foreground/40 text-sm mb-1">Questions</div>
            <div className="text-2xl font-bold text-foreground">
              {skillData.questions}
            </div>
          </div>
          <div className="bg-card border border-card-border rounded-xl p-4">
            <div className="text-foreground/40 text-sm mb-1">Parts</div>
            <div className="text-2xl font-bold text-foreground">
              {skillData.parts.length}
            </div>
          </div>
        </div>

        {/* Skill Parts */}
        <div className="bg-card border border-card-border rounded-xl p-6 mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Test Structure
          </h2>
          <div className="space-y-3">
            {skillData.parts.map((part, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-card-border last:border-0"
              >
                <span className="text-foreground/80">{part.name}</span>
                <span className="text-foreground/40 text-sm">
                  {part.questions} questions
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tests List */}
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Available Tests
        </h2>
        {tests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tests.map((test) => (
              <Link
                key={test.id}
                href={`/practice/${skill}/${test.id}`}
                className="group bg-card border border-card-border rounded-xl p-6 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${
                        test.level === "C1"
                          ? "bg-purple-500/20 text-purple-600"
                          : test.level === "B2"
                            ? "bg-indigo-500/20 text-indigo-600"
                            : "bg-emerald-500/20 text-emerald-600"
                      }`}
                    >
                      Level {test.level}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-indigo-500 transition-colors">
                      {test.title}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-indigo-500 transition-all">
                    <svg
                      className="w-5 h-5 text-foreground/40 group-hover:text-white transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
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
                    {test.duration} min
                  </span>
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
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {test.totalQuestions || 0} questions
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card border border-card-border rounded-xl">
            <p className="text-foreground/40">
              No tests available for this skill yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
