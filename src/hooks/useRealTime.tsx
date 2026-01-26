"use client";

import {
  subscribeToFeatures,
  subscribeToQuestions,
  subscribeToSkills,
  subscribeToStats,
  subscribeToTests,
  subscribeToUserProgress,
  subscribeToUserResults,
} from "@/lib/db";
import {
  AppContentItem,
  Question,
  SKILLS_DATA,
  SkillType,
  Test,
  TestResult,
  UserProgress,
} from "@/types";
import { useEffect, useState } from "react";

export function useAppContent() {
  const [stats, setStats] = useState<AppContentItem[]>([]);
  const [features, setFeatures] = useState<AppContentItem[]>([]);
  const [skills, setSkills] = useState<typeof SKILLS_DATA>(SKILLS_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubStats = subscribeToStats((data) => setStats(data));
    const unsubFeatures = subscribeToFeatures((data) => setFeatures(data));
    const unsubSkills = subscribeToSkills((data) => {
      setSkills(data);
      setLoading(false);
    });

    return () => {
      unsubStats();
      unsubFeatures();
      unsubSkills();
    };
  }, []);

  return { stats, features, skills, loading };
}

export function useTests(skill: SkillType) {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToTests(skill, (data) => {
      setTests(data);
      setLoading(false);
    });
    return () => unsub();
  }, [skill]);

  return { tests, loading };
}

export function useQuestions(testId: string) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!testId) return;
    const unsub = subscribeToQuestions(testId, (data) => {
      setQuestions(data);
      setLoading(false);
    });
    return () => unsub();
  }, [testId]);

  return { questions, loading };
}

export function useUserStatus(userId: string | null) {
  const [progress, setProgress] = useState<Record<string, UserProgress>>({});
  const [recentResults, setRecentResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(!!userId);

  useEffect(() => {
    if (!userId) return;

    const unsubProgress = subscribeToUserProgress(userId, (data) =>
      setProgress(data),
    );
    const unsubResults = subscribeToUserResults(userId, (data) => {
      setRecentResults(data);
      setLoading(false);
    });

    return () => {
      unsubProgress();
      unsubResults();
    };
  }, [userId]);

  return { progress, recentResults, loading };
}
