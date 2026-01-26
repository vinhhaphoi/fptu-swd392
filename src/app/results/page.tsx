"use client";

import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { SKILLS_DATA, SkillType } from "@/types";
import Link from "next/link";
import { useState } from "react";

// Sample results data
const sampleResults = [
  {
    id: "r1",
    testTitle: "VSTEP B2 Listening Practice Test 1",
    skill: "listening" as SkillType,
    level: "B2",
    score: 28,
    totalScore: 35,
    completedAt: new Date(Date.now() - 86400000),
    duration: 35,
  },
  {
    id: "r2",
    testTitle: "VSTEP B2 Reading Practice Test 1",
    skill: "reading" as SkillType,
    level: "B2",
    score: 32,
    totalScore: 40,
    completedAt: new Date(Date.now() - 172800000),
    duration: 52,
  },
  {
    id: "r3",
    testTitle: "VSTEP B2 Writing Practice Test 1",
    skill: "writing" as SkillType,
    level: "B2",
    score: 75,
    totalScore: 100,
    completedAt: new Date(Date.now() - 259200000),
    duration: 58,
  },
];

export default function ResultsPage() {
  const { user, loading } = useAuth();
  const [results, setResults] = useState(sampleResults);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-emerald-400";
    if (percentage >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBg = (percentage: number) => {
    if (percentage >= 80) return "bg-emerald-500/20 border-emerald-500/30";
    if (percentage >= 60) return "bg-amber-500/20 border-amber-500/30";
    return "bg-red-500/20 border-red-500/30";
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
              📊
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Sign In to View Results
            </h1>
            <p className="text-slate-400 mb-6">
              Please sign in to view your test results and track your progress.
            </p>
            <Link href="/auth/login">
              <Button fullWidth>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate overall stats
  const totalTests = results.length;
  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce((acc, r) => acc + (r.score / r.totalScore) * 100, 0) /
            results.length,
        )
      : 0;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">My Results</h1>
          <p className="text-slate-400">
            Track your progress and review past test results
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <div className="text-3xl font-bold text-white mb-1">
              {totalTests}
            </div>
            <div className="text-slate-400">Tests Completed</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <div
              className={`text-3xl font-bold ${getScoreColor(averageScore)} mb-1`}
            >
              {averageScore}%
            </div>
            <div className="text-slate-400">Average Score</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <div className="text-3xl font-bold text-indigo-400 mb-1">B2</div>
            <div className="text-slate-400">Current Level</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <div className="text-3xl font-bold text-purple-400 mb-1">7</div>
            <div className="text-slate-400">Day Streak</div>
          </div>
        </div>

        {/* Skill Progress */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-semibold text-white mb-6">
            Skill Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(Object.keys(SKILLS_DATA) as SkillType[]).map((skill) => {
              const data = SKILLS_DATA[skill];
              const skillResults = results.filter((r) => r.skill === skill);
              const avgScore =
                skillResults.length > 0
                  ? Math.round(
                      skillResults.reduce(
                        (acc, r) => acc + (r.score / r.totalScore) * 100,
                        0,
                      ) / skillResults.length,
                    )
                  : 0;

              return (
                <div key={skill} className="bg-slate-900/50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${data.color} flex items-center justify-center text-xl`}
                    >
                      {data.icon}
                    </div>
                    <span className="font-medium text-white">{data.name}</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">
                    {avgScore}%
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${data.color} transition-all`}
                      style={{ width: `${avgScore}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    {skillResults.length} tests completed
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Results */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">
            Recent Test Results
          </h2>

          {results.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Results Yet
              </h3>
              <p className="text-slate-400 mb-6">
                Complete your first test to see your results here.
              </p>
              <Link href="/practice">
                <Button>Start Practicing</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => {
                const percentage = Math.round(
                  (result.score / result.totalScore) * 100,
                );
                const skillData = SKILLS_DATA[result.skill];

                return (
                  <div
                    key={result.id}
                    className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-indigo-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${skillData.color} flex items-center justify-center text-2xl`}
                        >
                          {skillData.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">
                            {result.testTitle}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                            <span>Level {result.level}</span>
                            <span>•</span>
                            <span>{result.duration} min</span>
                            <span>•</span>
                            <span>
                              {result.completedAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`px-4 py-2 rounded-xl border ${getScoreBg(percentage)}`}
                      >
                        <div
                          className={`text-2xl font-bold ${getScoreColor(percentage)}`}
                        >
                          {percentage}%
                        </div>
                        <div className="text-xs text-slate-400">
                          {result.score}/{result.totalScore}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
