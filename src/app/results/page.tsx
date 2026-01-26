"use client";

import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useAllUserResults } from "@/hooks/useRealTime";
import { SKILLS_DATA, SkillType } from "@/types";
import Link from "next/link";

export default function ResultsPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const { results, loading: resultsLoading } = useAllUserResults(
    user?.uid || null,
  );

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

  if (authLoading || resultsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="text-foreground/40 font-bold uppercase text-[10px] tracking-widest animate-pulse">
            Loading your progress...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen py-20 bg-background">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-card border border-card-border rounded-[32px] p-8 shadow-xl shadow-indigo-500/5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl mb-6 shadow-lg">
              📊
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Sign In to View Results
            </h1>
            <p className="text-foreground/60 mb-6">
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

  const formatDate = (
    date: Date | { toDate: () => Date } | string | number | undefined,
  ) => {
    if (!date) return "N/A";
    const d = (date as any).toDate
      ? (date as any).toDate()
      : new Date(date as any);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-foreground mb-2 tracking-tight">
            My Results
          </h1>
          <p className="text-foreground/60 text-lg">
            Track your progress and review past test results
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            {
              label: "Tests Completed",
              value: totalTests,
              color: "text-foreground",
            },
            {
              label: "Average Score",
              value: `${averageScore}%`,
              color: getScoreColor(averageScore),
            },
            {
              label: "Target Level",
              value: userData?.targetLevel || "B2",
              color: "text-indigo-500",
            },
            {
              label: "Longest Streak",
              value: userData?.longestStreak || 0,
              color: "text-purple-500",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-card border border-card-border rounded-3xl p-6 shadow-xl shadow-indigo-500/5"
            >
              <div
                className={`text-4xl font-black ${stat.color} mb-1 tracking-tight`}
              >
                {stat.value}
              </div>
              <div className="text-foreground/40 font-bold uppercase text-[10px] tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Skill Progress Overview */}
        <div className="bg-card border border-card-border rounded-[32px] p-8 mb-10 shadow-xl shadow-indigo-500/5">
          <h2 className="text-xl font-bold text-foreground mb-8">
            Skill Progress Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <div
                  key={skill}
                  className="bg-foreground/[0.02] border border-card-border rounded-2xl p-5 hover:bg-foreground/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${data.color} flex items-center justify-center text-2xl shadow-lg ring-4 ring-background`}
                    >
                      {data.icon}
                    </div>
                    <span className="font-bold text-foreground">
                      {data.name}
                    </span>
                  </div>
                  <div className="text-3xl font-black text-foreground mb-3">
                    {avgScore}%
                  </div>
                  <div className="h-2.5 bg-foreground/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${data.color} transition-all duration-1000`}
                      style={{ width: `${avgScore}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mt-3 flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-foreground/20" />
                    {skillResults.length} tests completed
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Results */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-6">
            Recent Test History
          </h2>

          {results.length === 0 ? (
            <div className="bg-card border border-card-border rounded-[40px] p-16 text-center shadow-xl shadow-indigo-500/5">
              <div className="text-6xl mb-6">📝</div>
              <h3 className="text-2xl font-black text-foreground mb-2">
                No Results Yet
              </h3>
              <p className="text-foreground/60 mb-8 max-w-sm mx-auto">
                Complete your first test to see your detailed score breakdown
                and progress tracking here.
              </p>
              <Link href="/practice">
                <Button size="lg" className="px-10 rounded-xl">
                  Start Practicing
                </Button>
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
                    className="bg-card border border-card-border rounded-2xl p-6 hover:border-indigo-500/30 transition-all group hover:scale-[1.01] hover:shadow-2xl hover:shadow-indigo-500/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${skillData.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}
                        >
                          {skillData.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground text-lg group-hover:text-indigo-500 transition-colors">
                            {result.testTitle || "Unknown Test"}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="px-2 py-0.5 rounded-md bg-foreground/5 text-foreground/40 text-[10px] font-black uppercase tracking-widest">
                              Level {result.level}
                            </span>
                            <span className="text-foreground/20 text-xs">
                              •
                            </span>
                            <span className="text-foreground/40 text-xs font-semibold">
                              {result.duration || skillData.duration} min
                            </span>
                            <span className="text-foreground/20 text-xs">
                              •
                            </span>
                            <span className="text-foreground/40 text-xs font-semibold">
                              {formatDate(result.completedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`px-6 py-3 rounded-2xl border transition-all text-center min-w-[100px] ${getScoreBg(percentage)}`}
                      >
                        <div
                          className={`text-3xl font-black ${getScoreColor(percentage)}`}
                        >
                          {percentage}%
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">
                          {result.score}/{result.totalScore} pts
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
