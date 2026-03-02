"use client";

import SkillCard from "@/components/ui/SkillCard";
import { useAuth } from "@/hooks/useAuth";
import { useAppContent, useUserStatus } from "@/hooks/useRealTime";
import { LEVELS, SkillType } from "@/types";
import { FileUp } from "lucide-react";
import Link from "next/link";

export default function PracticePage() {
  const { user, isModerator } = useAuth();
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
            <button className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/20">
              All Levels
            </button>
            {LEVELS.map((level) => (
              <button
                key={level}
                className="px-4 py-2 rounded-lg bg-card border border-card-border text-foreground/70 text-sm font-medium hover:bg-foreground/5 transition-all"
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

        {/* Tạo bộ đề - Admin only */}
        {isModerator && (
          <Link
            href="/admin/questions"
            className="block mb-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 hover:border-indigo-500/40 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500/30">
                  <FileUp size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-foreground">Tạo bộ đề từ tài liệu</h3>
                  <p className="text-sm text-foreground/60">
                    Upload PDF/DOCX/TXT → AI trích xuất → Chỉnh sửa → Lưu Firestore
                  </p>
                </div>
              </div>
              <span className="text-indigo-500 font-medium group-hover:underline">
                Vào trang tạo đề →
              </span>
            </div>
          </Link>
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
            className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
          >
            Start Mock Exam
          </Link>
        </div>
      </div>
    </div>
  );
}
