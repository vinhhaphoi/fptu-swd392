"use client";

import Button from "@/components/ui/Button";
import { db, isFirebaseEnabled } from "@/lib/firebase";
import { SKILLS_DATA } from "@/types";
import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { useState } from "react";

export default function SeedPage() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const seedData = async () => {
    if (!isFirebaseEnabled || !db) {
      setStatus(
        "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_API_KEY (and other NEXT_PUBLIC_FIREBASE_*) to .env.local to use this feature."
      );
      return;
    }
    setLoading(true);
    setStatus("Seeding...");
    try {
      const batch = writeBatch(db);

      // 1. Seed Stats
      const statsRef = doc(db, "app_content", "stats");
      batch.set(statsRef, {
        items: [
          { value: "10,000+", label: "Active Learners" },
          { value: "500+", label: "Practice Tests" },
          { value: "95%", label: "Success Rate" },
          { value: "24/7", label: "Available" },
        ],
      });

      // 2. Seed Features
      const featuresRef = doc(db, "app_content", "features");
      batch.set(featuresRef, {
        items: [
          {
            icon: "🎯",
            title: "Real Exam Simulation",
            description:
              "Experience authentic VSTEP test conditions with timed mock exams that mirror the actual test format.",
          },
          {
            icon: "📊",
            title: "Progress Tracking",
            description:
              "Monitor your improvement with detailed analytics and personalized performance insights.",
          },
          {
            icon: "🎧",
            title: "4 Skills Practice",
            description:
              "Master Listening, Reading, Writing, and Speaking with specialized practice modules.",
          },
          {
            icon: "⚡",
            title: "Instant Feedback",
            description:
              "Get immediate scoring and explanations to understand your mistakes and improve faster.",
          },
        ],
      });

      // 3. Seed Skills
      Object.entries(SKILLS_DATA).forEach(([id, data]) => {
        const skillRef = doc(db, "skills", id);
        batch.set(skillRef, data);
      });

      // 4. Seed some sample tests
      const sampleTests = [
        {
          id: "l1",
          title: "VSTEP B2 Listening Practice Test 1",
          level: "B2",
          skill: "listening",
          totalQuestions: 35,
          duration: 40,
          createdAt: serverTimestamp(),
        },
        {
          id: "r1",
          title: "VSTEP B2 Reading Practice Test 1",
          level: "B2",
          skill: "reading",
          totalQuestions: 40,
          duration: 60,
          createdAt: serverTimestamp(),
        },
      ];

      sampleTests.forEach((test) => {
        const testRef = doc(db, "tests", test.id);
        batch.set(testRef, test);
      });

      // 5. Seed questions for L1
      const questions = [
        {
          id: "q1",
          testId: "l1",
          type: "mcq",
          content: "What is the main purpose of the announcement?",
          options: [
            "To inform about a schedule change",
            "To announce a new policy",
            "To introduce a new employee",
            "To remind about a deadline",
          ],
          correctAnswer: "A",
          order: 1,
          partNumber: 1,
          skill: "listening",
        },
        {
          id: "q2",
          testId: "l1",
          type: "mcq",
          content: "When will the event take place?",
          options: [
            "Next Monday",
            "Next Wednesday",
            "This Friday",
            "This Saturday",
          ],
          correctAnswer: "C",
          order: 2,
          partNumber: 1,
          skill: "listening",
        },
      ];

      questions.forEach((q) => {
        const qRef = doc(db, "questions", q.id);
        batch.set(qRef, q);
      });

      await batch.commit();
      setStatus("Success! Data seeded to Firebase.");
    } catch (error: unknown) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      setStatus("Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto bg-card p-8 rounded-[32px] border border-card-border shadow-2xl">
        <h1 className="text-2xl font-bold mb-4 text-foreground text-center">
          Firebase Seeding Tool
        </h1>
        <p className="text-foreground/60 mb-8 text-center text-sm">
          This will populate your Firestore collections with initial content
          (stats, features, skills, and sample tests).
        </p>
        <Button
          fullWidth
          onClick={seedData}
          loading={loading}
          disabled={!isFirebaseEnabled}
          className="rounded-2xl py-4"
        >
          {isFirebaseEnabled ? "Push Data to Firebase" : "Firebase not configured"}
        </Button>
        {status && (
          <div
            className={`mt-6 p-4 rounded-xl text-center text-sm ${status.includes("Error") ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"}`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
