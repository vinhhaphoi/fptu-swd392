"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useAllUserResults } from "@/hooks/useRealTime";
import { LEVELS, SKILLS_DATA, SkillType, TestResult } from "@/types";
import {
  Award,
  BookOpen,
  Calendar,
  Camera,
  Clock,
  Flame,
  LogOut,
  Shield,
  Target,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user, userData, loading: authLoading, signOut } = useAuth();
  const { results, loading: resultsLoading } = useAllUserResults(
    user?.uid || null,
  );
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    targetLevel: "B1" as "B1" | "B2" | "C1",
  });
  const [hasSync, setHasSync] = useState(false);

  useEffect(() => {
    if (userData && !hasSync) {
      // Use setTimeout to avoid cascading render warning in React 19
      const timer = setTimeout(() => {
        setFormData({
          displayName: userData.displayName || "",
          targetLevel: (userData.targetLevel as "B1" | "B2" | "C1") || "B1",
        });
        setHasSync(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [userData, hasSync]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || (resultsLoading && results.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Safe date formatter
  const formatDate = (date: unknown) => {
    if (!date) return "January 2026";
    try {
      if (date instanceof Date) {
        return date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      }
      if (typeof date === "object" && date !== null && "seconds" in date) {
        return new Date(
          (date as { seconds: number }).seconds * 1000,
        ).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      }
      return "January 2026";
    } catch {
      return "January 2026";
    }
  };

  // Calculate real stats from results
  const testsCompleted = results.length;
  const totalSeconds = results.reduce((acc, r) => acc + (r.duration || 0), 0);
  const studyTime =
    totalSeconds > 3600
      ? `${Math.floor(totalSeconds / 3600)}h ${Math.floor((totalSeconds % 3600) / 60)}m`
      : `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`;

  // Simple streak calculation
  const calculateStreak = (results: TestResult[]) => {
    if (!results.length) return 0;
    const sortedDates = results
      .map((r) => new Date(r.completedAt).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i);

    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(new Date().getTime() - 86400000).toDateString();

    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) return 0;

    for (let i = 0; i < sortedDates.length; i++) {
      streak++;
      // If there's a next date, check if it's strictly the day before
      if (i + 1 < sortedDates.length) {
        const current = new Date(sortedDates[i]).getTime();
        const next = new Date(sortedDates[i + 1]).getTime();
        const oneDay = 86400000;
        if (current - next > oneDay + 1000) break; // More than 24h gap (approx)
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak(results);

  const stats = {
    testsCompleted,
    studyTime,
    currentStreak,
    longestStreak: Math.max(
      currentStreak,
      userData?.longestStreak || currentStreak,
    ),
    joinDate: formatDate(userData?.createdAt),
    lastLogin: formatDate(userData?.lastLogin),
    level: userData?.targetLevel || "B2",
  };

  // Calculate real skill progress
  const skillProgress = (Object.keys(SKILLS_DATA) as SkillType[]).map(
    (skill) => {
      const skillResults = results.filter((r) => r.skill === skill);
      const avgScore = skillResults.length
        ? Math.round(
            skillResults.reduce((acc, r) => acc + r.score, 0) /
              skillResults.length,
          )
        : 0;
      return { skill, avgScore };
    },
  );

  const achievements = [
    {
      icon: "🎯",
      title: "First Test",
      description: "Completed your first practice test",
      earned: results.length > 0,
    },
    {
      icon: "🔥",
      title: "7 Day Streak",
      description: "Study 7 days in a row",
      earned: currentStreak >= 7,
    },
    {
      icon: "🏆",
      title: `${stats.level} Master`,
      description: `Score 80%+ on a ${stats.level} test`,
      earned: results.some((r) => r.level === stats.level && r.score >= 80),
    },
    {
      icon: "⚡",
      title: "All-Rounder",
      description: "Take a test in all 4 skills",
      earned: new Set(results.map((r) => r.skill)).size >= 4,
    },
  ];

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-card/50 backdrop-blur-xl border border-card-border rounded-[32px] p-8 mb-8 shadow-xl shadow-indigo-500/5">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-background shadow-2xl bg-indigo-500/10 flex items-center justify-center">
                {userData?.photoURL || user.photoURL ? (
                  <Image
                    src={userData?.photoURL || user.photoURL!}
                    alt="Profile"
                    width={112}
                    height={112}
                    className="object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-4xl font-bold">
                    {userData?.displayName?.[0] || user.displayName?.[0] || "V"}
                  </div>
                )}
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg hover:bg-indigo-600 hover:scale-110 transition-all duration-300">
                <Camera size={18} />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-foreground mb-1">
                {userData?.displayName || user.displayName || "VSTEP Learner"}
              </h1>
              <p className="text-foreground/40 mb-6 font-medium">
                {userData?.email || user.email}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-500 text-xs font-bold uppercase tracking-wider">
                  <Target size={14} />
                  Level {stats.level}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-wider">
                  <Flame size={14} />
                  {stats.currentStreak} day streak
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-wider">
                  <Shield size={14} />
                  {userData?.role || "Member"}
                </div>
                <div className="flex items-center gap-1.5 text-foreground/30 text-xs font-medium ml-1">
                  <Clock size={14} />
                  Last active {stats.lastLogin}
                </div>
                <div className="flex items-center gap-1.5 text-foreground/30 text-xs font-medium ml-1">
                  <Calendar size={14} />
                  Member since {stats.joinDate}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-2xl px-6"
              >
                Edit Profile
              </Button>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="rounded-2xl px-6 text-red-500 hover:bg-red-500/10 hover:text-red-600"
              >
                <LogOut size={18} className="mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <div className="bg-card border border-card-border rounded-[32px] p-8 mb-8 animate-in slide-in-from-top-4 duration-300">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Edit Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                placeholder="How should we call you?"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                className="rounded-2xl"
              />
              <div className="space-y-2 text-left">
                <label className="text-xs font-semibold text-foreground/40 uppercase tracking-widest ml-1">
                  Target Proficiency Level
                </label>
                <select
                  value={formData.targetLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetLevel: e.target.value as "B1" | "B2" | "C1",
                    })
                  }
                  className="w-full px-4 py-4 rounded-2xl bg-background border border-card-border text-foreground focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium"
                >
                  {LEVELS.map((level) => (
                    <option key={level} value={level}>
                      VSTEP Level {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <Button
                onClick={() => setIsEditing(false)}
                className="rounded-2xl px-8"
              >
                Save Changes
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsEditing(false)}
                className="rounded-2xl px-8"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-left">
          <div className="bg-card border border-card-border rounded-3xl p-6 transition-all hover:border-indigo-500/30 group">
            <div className="text-4xl font-black text-foreground mb-1 group-hover:scale-110 transition-transform origin-left">
              {stats.testsCompleted}
            </div>
            <div className="text-foreground/40 text-xs font-bold uppercase tracking-widest">
              Tests Completed
            </div>
          </div>
          <div className="bg-card border border-card-border rounded-3xl p-6 transition-all hover:border-indigo-500/30 group">
            <div className="text-4xl font-black text-indigo-500 mb-1 group-hover:scale-110 transition-transform origin-left">
              {stats.studyTime}
            </div>
            <div className="text-foreground/40 text-xs font-bold uppercase tracking-widest">
              Study Time
            </div>
          </div>
          <div className="bg-card border border-card-border rounded-3xl p-6 transition-all hover:border-indigo-500/30 group">
            <div className="text-4xl font-black text-emerald-500 mb-1 group-hover:scale-110 transition-transform origin-left">
              {stats.currentStreak}
            </div>
            <div className="text-foreground/40 text-xs font-bold uppercase tracking-widest">
              Current Streak
            </div>
          </div>
          <div className="bg-card border border-card-border rounded-3xl p-6 transition-all hover:border-indigo-500/30 group">
            <div className="text-4xl font-black text-amber-500 mb-1 group-hover:scale-110 transition-transform origin-left">
              {stats.longestStreak}
            </div>
            <div className="text-foreground/40 text-xs font-bold uppercase tracking-widest">
              Longest Streak
            </div>
          </div>
        </div>

        {/* Skill Progress */}
        <div className="bg-card border border-card-border rounded-[32px] p-8 mb-8 text-left">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <BookOpen size={20} className="text-indigo-500" />
            Learning Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skillProgress.map(({ skill, avgScore }) => {
              const data = SKILLS_DATA[skill];
              return (
                <div key={skill} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${data.color} flex items-center justify-center text-xl shadow-lg shadow-indigo-500/10`}
                      >
                        {data.icon}
                      </div>
                      <span className="font-bold text-foreground">
                        {data.name}
                      </span>
                    </div>
                    <span className="text-sm font-black text-foreground/40">
                      {avgScore}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-foreground/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${data.color} transition-all duration-1000`}
                      style={{ width: `${avgScore}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-card border border-card-border rounded-[32px] p-8 text-left">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Award size={20} className="text-amber-500" />
            Milestones & Badges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center gap-5 p-5 rounded-2xl border transition-all ${
                  achievement.earned
                    ? "bg-foreground/[0.02] border-indigo-500/10"
                    : "bg-transparent border-card-border opacity-40 grayscale"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${
                    achievement.earned
                      ? "bg-indigo-500/10 shadow-inner"
                      : "bg-foreground/5"
                  }`}
                >
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground leading-tight">
                    {achievement.title}
                  </h3>
                  <p className="text-xs text-foreground/40 font-medium mt-1">
                    {achievement.description}
                  </p>
                </div>
                {achievement.earned && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-emerald-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
