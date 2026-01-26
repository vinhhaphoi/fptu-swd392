"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { LEVELS, SKILLS_DATA, SkillType } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    targetLevel: "B2",
  });

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  // Mock data for demonstration
  const stats = {
    testsCompleted: 15,
    studyTime: "12h 30m",
    currentStreak: 7,
    longestStreak: 14,
    joinDate: "January 2026",
    level: "B2",
  };

  const achievements = [
    {
      icon: "🎯",
      title: "First Test",
      description: "Completed your first practice test",
      earned: true,
    },
    {
      icon: "🔥",
      title: "7 Day Streak",
      description: "Study 7 days in a row",
      earned: true,
    },
    {
      icon: "🏆",
      title: "B2 Master",
      description: "Score 80%+ on all B2 tests",
      earned: false,
    },
    {
      icon: "⚡",
      title: "Speed Demon",
      description: "Complete a test in half the time",
      earned: false,
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={
                  user.photoURL ||
                  `https://ui-avatars.com/api/?name=${user.displayName || "User"}&background=6366f1&color=fff&size=128`
                }
                alt="Profile"
                className="w-24 h-24 rounded-2xl object-cover"
              />
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white hover:bg-indigo-600 transition-colors">
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
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-white mb-1">
                {user.displayName || "VSTEP Learner"}
              </h1>
              <p className="text-slate-400 mb-4">{user.email}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 text-sm font-medium">
                  Level {stats.level}
                </span>
                <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                  🔥 {stats.currentStreak} day streak
                </span>
                <span className="text-slate-500 text-sm">
                  Member since {stats.joinDate}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsEditing(!isEditing)}
              >
                Edit Profile
              </Button>
              <Button variant="ghost" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">
              Edit Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Display Name"
                placeholder="Enter your name"
                value={formData.displayName || user.displayName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Target Level
                </label>
                <select
                  value={formData.targetLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, targetLevel: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                >
                  {LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">
              {stats.testsCompleted}
            </div>
            <div className="text-slate-400 text-sm">Tests Completed</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-indigo-400 mb-1">
              {stats.studyTime}
            </div>
            <div className="text-slate-400 text-sm">Study Time</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-1">
              {stats.currentStreak}
            </div>
            <div className="text-slate-400 text-sm">Current Streak</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-amber-400 mb-1">
              {stats.longestStreak}
            </div>
            <div className="text-slate-400 text-sm">Longest Streak</div>
          </div>
        </div>

        {/* Skill Progress */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Skill Progress
          </h2>
          <div className="space-y-4">
            {(Object.keys(SKILLS_DATA) as SkillType[]).map((skill) => {
              const data = SKILLS_DATA[skill];
              const progress = Math.floor(Math.random() * 40 + 40); // Demo random progress

              return (
                <div key={skill} className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${data.color} flex items-center justify-center text-xl shrink-0`}
                  >
                    {data.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-white">
                        {data.name}
                      </span>
                      <span className="text-slate-400">{progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${data.color}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-xl ${
                  achievement.earned
                    ? "bg-slate-900/50"
                    : "bg-slate-900/30 opacity-50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    achievement.earned ? "bg-indigo-500/20" : "bg-slate-800"
                  }`}
                >
                  {achievement.icon}
                </div>
                <div>
                  <h3 className="font-medium text-white">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {achievement.description}
                  </p>
                </div>
                {achievement.earned && (
                  <svg
                    className="w-6 h-6 text-emerald-400 ml-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
