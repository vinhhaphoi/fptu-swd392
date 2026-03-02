import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from "firebase/firestore";
import { db, isFirebaseEnabled } from "./firebase";

/**
 * Firestore chỉ dùng để lưu dữ liệu (tests, questions, examSets, ...).
 * Auth bằng Backend, tài khoản trong bảng profile — không dùng Firebase Auth.
 */
import type { ExamLevel, ExamSet, ExamSkill } from "@/types/exam";

// Types
export interface Test {
    id: string;
    title: string;
    level: "B1" | "B2" | "C1";
    skill: "listening" | "reading" | "writing" | "speaking";
    duration: number;
    totalQuestions: number;
    description?: string;
    createdAt?: Date;
}

export interface Question {
    id: string;
    testId: string;
    type: "mcq" | "essay" | "recording";
    content: string;
    options?: string[];
    correctAnswer?: string;
    audioUrl?: string;
    imageUrl?: string;
    order: number;
    passage?: string;
}

export interface TestResult {
    id: string;
    userId: string;
    testId: string;
    score: number;
    totalScore: number;
    answers: Answer[];
    completedAt: Date;
    level: string;
    skill: string;
}

export interface Answer {
    questionId: string;
    answer: string;
    isCorrect?: boolean;
}

export interface UserProgress {
    userId: string;
    skill: string;
    testsCompleted: number;
    averageScore: number;
    lastActivity: Date;
}

// Get all tests
export async function getTests(skill?: string, level?: string) {
  if (!isFirebaseEnabled || !db) return [];
  let q = collection(db, "tests");
    const constraints: Parameters<typeof query>[1][] = [];

    if (skill) {
        constraints.push(where("skill", "==", skill));
    }
    if (level) {
        constraints.push(where("level", "==", level));
    }

    const querySnapshot = await getDocs(
        constraints.length > 0 ? query(q, ...constraints) : q
    );

    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Test[];
}

// Get single test
export async function getTest(testId: string) {
  if (!isFirebaseEnabled || !db) return null;
  const testDoc = await getDoc(doc(db, "tests", testId));
    if (!testDoc.exists()) return null;
    return { id: testDoc.id, ...testDoc.data() } as Test;
}

// Get questions for a test
export async function getQuestions(testId: string) {
  if (!isFirebaseEnabled || !db) return [];
  const q = query(
        collection(db, "questions"),
        where("testId", "==", testId),
        orderBy("order")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Question[];
}

// Save test result
export async function saveTestResult(result: Omit<TestResult, "id" | "completedAt">) {
  if (!isFirebaseEnabled || !db) return "";
  const docRef = await addDoc(collection(db, "testResults"), {
        ...result,
        completedAt: serverTimestamp(),
    });
    return docRef.id;
}

// Get user's test results
export async function getUserResults(userId: string, limitCount: number = 10) {
  if (!isFirebaseEnabled || !db) return [];
  const q = query(
        collection(db, "testResults"),
        where("userId", "==", userId),
        orderBy("completedAt", "desc"),
        limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as TestResult[];
}

// Get user progress by skill
export async function getUserProgress(userId: string) {
  if (!isFirebaseEnabled || !db) return [];
  const q = query(collection(db, "progress"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
    })) as UserProgress[];
}

// --- Exam Sets (Upload → Create flow) ---

export async function createExamSet(examSet: Omit<ExamSet, "id">): Promise<string> {
  if (!isFirebaseEnabled || !db) throw new Error("Firebase is not configured");
  const { questions, ...examData } = examSet;
    const docRef = await addDoc(collection(db, "examSets"), {
        ...examData,
        questions,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function updateExamSet(
    id: string,
    data: Partial<Omit<ExamSet, "id" | "questions">> & { questions?: ExamSet["questions"] }
): Promise<void> {
  if (!isFirebaseEnabled || !db) return;
  const ref = doc(db, "examSets", id);
    await updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

export async function getExamSets(filters?: {
    level?: ExamLevel;
    skill?: ExamSkill;
    status?: string;
}): Promise<ExamSet[]> {
  if (!isFirebaseEnabled || !db) return [];
  let q = collection(db, "examSets");
    const constraints: Parameters<typeof query>[1][] = [];

    if (filters?.level) {
        constraints.push(where("level", "==", filters.level));
    }
    if (filters?.skill) {
        constraints.push(where("skill", "==", filters.skill));
    }
    if (filters?.status) {
        constraints.push(where("status", "==", filters.status));
    }

    const querySnapshot = await getDocs(
        constraints.length > 0 ? query(q, ...constraints) : q
    );

    return querySnapshot.docs.map((d) => {
        const data = d.data();
        return {
            id: d.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() ?? data.createdAt,
            updatedAt: data.updatedAt?.toDate?.() ?? data.updatedAt,
        } as ExamSet;
    });
}

export async function getExamSet(id: string): Promise<ExamSet | null> {
  if (!isFirebaseEnabled || !db) return null;
  const docRef = await getDoc(doc(db, "examSets", id));
    if (!docRef.exists()) return null;
    const data = docRef.data();
    return {
        id: docRef.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ?? data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() ?? data.updatedAt,
    } as ExamSet;
}

export async function deleteExamSet(id: string): Promise<void> {
  if (!isFirebaseEnabled || !db) return;
  await deleteDoc(doc(db, "examSets", id));
}

// Update user progress
export async function updateUserProgress(
    userId: string,
    skill: string,
    score: number
) {
  if (!isFirebaseEnabled || !db) return;
  const progressRef = doc(db, "progress", `${userId}_${skill}`);
    const progressDoc = await getDoc(progressRef);

    if (progressDoc.exists()) {
        const data = progressDoc.data();
        const newTestsCompleted = (data.testsCompleted || 0) + 1;
        const newAverage =
            ((data.averageScore || 0) * (data.testsCompleted || 0) + score) /
            newTestsCompleted;

        await updateDoc(progressRef, {
            testsCompleted: newTestsCompleted,
            averageScore: newAverage,
            lastActivity: serverTimestamp(),
        });
    } else {
        await addDoc(collection(db, "progress"), {
            userId,
            skill,
            testsCompleted: 1,
            averageScore: score,
            lastActivity: serverTimestamp(),
        });
    }
}
