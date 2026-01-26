import SkillCard from "@/components/ui/SkillCard";
import { LEVELS } from "@/types";
import Link from "next/link";

export default function PracticePage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Practice Tests
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Choose a skill to practice. Each section contains multiple tests
            designed to help you prepare for the VSTEP examination.
          </p>
        </div>

        {/* Level Filter */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="text-slate-400 text-sm">Filter by level:</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium">
              All Levels
            </button>
            {LEVELS.map((level) => (
              <button
                key={level}
                className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm font-medium hover:bg-slate-700/50 transition-all"
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <SkillCard skill="listening" />
          <SkillCard skill="reading" />
          <SkillCard skill="writing" />
          <SkillCard skill="speaking" />
        </div>

        {/* Mock Exam CTA */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready for a Full Mock Exam?
          </h2>
          <p className="text-slate-400 mb-6 max-w-xl mx-auto">
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
