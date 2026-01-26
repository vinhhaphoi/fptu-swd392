import { SKILLS_DATA, SkillType } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";

// Sample tests data - in production, this would come from Firebase
const sampleTests = {
  listening: [
    {
      id: "l1",
      title: "VSTEP B2 Listening Practice Test 1",
      level: "B2",
      questions: 35,
      duration: 40,
      attempts: 1250,
    },
    {
      id: "l2",
      title: "VSTEP B1 Listening Practice Test 1",
      level: "B1",
      questions: 35,
      duration: 40,
      attempts: 890,
    },
    {
      id: "l3",
      title: "VSTEP C1 Listening Practice Test 1",
      level: "C1",
      questions: 35,
      duration: 40,
      attempts: 456,
    },
    {
      id: "l4",
      title: "VSTEP B2 Listening Practice Test 2",
      level: "B2",
      questions: 35,
      duration: 40,
      attempts: 780,
    },
  ],
  reading: [
    {
      id: "r1",
      title: "VSTEP B2 Reading Practice Test 1",
      level: "B2",
      questions: 40,
      duration: 60,
      attempts: 1340,
    },
    {
      id: "r2",
      title: "VSTEP B1 Reading Practice Test 1",
      level: "B1",
      questions: 40,
      duration: 60,
      attempts: 920,
    },
    {
      id: "r3",
      title: "VSTEP C1 Reading Practice Test 1",
      level: "C1",
      questions: 40,
      duration: 60,
      attempts: 380,
    },
    {
      id: "r4",
      title: "VSTEP B2 Reading Practice Test 2",
      level: "B2",
      questions: 40,
      duration: 60,
      attempts: 650,
    },
  ],
  writing: [
    {
      id: "w1",
      title: "VSTEP B2 Writing Practice Test 1",
      level: "B2",
      questions: 2,
      duration: 60,
      attempts: 890,
    },
    {
      id: "w2",
      title: "VSTEP B1 Writing Practice Test 1",
      level: "B1",
      questions: 2,
      duration: 60,
      attempts: 670,
    },
    {
      id: "w3",
      title: "VSTEP C1 Writing Practice Test 1",
      level: "C1",
      questions: 2,
      duration: 60,
      attempts: 290,
    },
  ],
  speaking: [
    {
      id: "s1",
      title: "VSTEP B2 Speaking Practice Test 1",
      level: "B2",
      questions: 3,
      duration: 15,
      attempts: 560,
    },
    {
      id: "s2",
      title: "VSTEP B1 Speaking Practice Test 1",
      level: "B1",
      questions: 3,
      duration: 15,
      attempts: 430,
    },
    {
      id: "s3",
      title: "VSTEP C1 Speaking Practice Test 1",
      level: "C1",
      questions: 3,
      duration: 15,
      attempts: 210,
    },
  ],
};

interface PageProps {
  params: Promise<{ skill: string }>;
}

export default async function SkillPage({ params }: PageProps) {
  const { skill } = await params;

  // Validate skill
  if (!["listening", "reading", "writing", "speaking"].includes(skill)) {
    notFound();
  }

  const skillData = SKILLS_DATA[skill as SkillType];
  const tests = sampleTests[skill as SkillType];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
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
              <h1 className="text-3xl font-bold text-white">
                {skillData.name} Practice
              </h1>
              <p className="text-slate-400">{skillData.description}</p>
            </div>
          </div>
        </div>

        {/* Skill Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="text-slate-400 text-sm mb-1">Duration</div>
            <div className="text-2xl font-bold text-white">
              {skillData.duration} min
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="text-slate-400 text-sm mb-1">Questions</div>
            <div className="text-2xl font-bold text-white">
              {skillData.questions}
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="text-slate-400 text-sm mb-1">Parts</div>
            <div className="text-2xl font-bold text-white">
              {skillData.parts.length}
            </div>
          </div>
        </div>

        {/* Skill Parts */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 mb-10">
          <h2 className="text-lg font-semibold text-white mb-4">
            Test Structure
          </h2>
          <div className="space-y-3">
            {skillData.parts.map((part, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0"
              >
                <span className="text-slate-300">{part.name}</span>
                <span className="text-slate-400 text-sm">
                  {part.questions} questions
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tests List */}
        <h2 className="text-xl font-semibold text-white mb-6">
          Available Tests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.map((test) => (
            <Link
              key={test.id}
              href={`/practice/${skill}/${test.id}`}
              className="group bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${
                      test.level === "C1"
                        ? "bg-purple-500/20 text-purple-400"
                        : test.level === "B2"
                          ? "bg-indigo-500/20 text-indigo-400"
                          : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    Level {test.level}
                  </span>
                  <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    {test.title}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center group-hover:bg-indigo-500 transition-all">
                  <svg
                    className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors"
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
              <div className="flex items-center gap-4 text-sm text-slate-400">
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
                  {test.questions} questions
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {test.attempts.toLocaleString()} attempts
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
