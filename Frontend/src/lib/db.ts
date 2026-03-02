import { AppContentItem, User as DbUser, Question, SKILLS_DATA, SkillType, Test, TestResult, UserProgress } from "@/types";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where
} from "firebase/firestore";
import { db, isFirebaseEnabled } from "./firebase";

function noOpUnsubscribe() {
  return () => {};
}

/**
 * Listen to app statistics (active learners, tests, etc.)
 */
export function subscribeToStats(callback: (stats: AppContentItem[]) => void) {
  if (!isFirebaseEnabled || !db) {
    callback([]);
    return noOpUnsubscribe();
  }
  return onSnapshot(doc(db, "app_content", "stats"), (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      callback((data.items || []) as AppContentItem[]);
    } else {
      callback([]);
    }
  });
}

/**
 * Listen to app features
 */
export function subscribeToFeatures(callback: (features: AppContentItem[]) => void) {
  if (!isFirebaseEnabled || !db) {
    callback([]);
    return noOpUnsubscribe();
  }
  return onSnapshot(doc(db, "app_content", "features"), (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      callback((data.items || []) as AppContentItem[]);
    } else {
      callback([]);
    }
  });
}

/**
 * Update app statistics
 */
export async function updateStats(stats: AppContentItem[]) {
  if (!isFirebaseEnabled || !db) return;
  const statsRef = doc(db, "app_content", "stats");
  await setDoc(statsRef, { items: stats }, { merge: true });
}

/**
 * Update app features
 */
export async function updateFeatures(features: AppContentItem[]) {
  if (!isFirebaseEnabled || !db) return;
  const featuresRef = doc(db, "app_content", "features");
  await setDoc(featuresRef, { items: features }, { merge: true });
}

/**
 * Listen to skill metadata (descriptions, durations, parts)
 */
export function subscribeToSkills(callback: (skills: typeof SKILLS_DATA) => void) {
  if (!isFirebaseEnabled || !db) {
    callback(SKILLS_DATA);
    return noOpUnsubscribe();
  }
  return onSnapshot(collection(db, "skills"), (snapshot) => {
        const skills: Record<string, unknown> = {};
        snapshot.forEach((doc) => {
            skills[doc.id] = doc.data();
        });
        if (Object.keys(skills).length >= 4) {
            callback(skills as unknown as typeof SKILLS_DATA);
        } else {
            // Fallback to local data if firestore is empty
            callback(SKILLS_DATA);
        }
    });
}

/**
 * Listen to tests for a specific skill
 */
export function subscribeToTests(skill: SkillType, callback: (tests: Test[]) => void) {
  if (!isFirebaseEnabled || !db) {
    callback([]);
    return noOpUnsubscribe();
  }
  const q = query(
        collection(db, "tests"),
        where("skill", "==", skill),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const tests: Test[] = [];
        snapshot.forEach((doc) => {
            tests.push({ id: doc.id, ...doc.data() } as Test);
        });
        callback(tests);
    });
}

/**
 * Listen to questions for a specific test
 */
export function subscribeToQuestions(testId: string, callback: (questions: Question[]) => void) {
  if (!isFirebaseEnabled || !db) {
    callback([]);
    return noOpUnsubscribe();
  }
  const q = query(
        collection(db, "questions"),
        where("testId", "==", testId),
        orderBy("order", "asc")
    );

    return onSnapshot(q, (snapshot) => {
        const questions: Question[] = [];
        snapshot.forEach((doc) => {
            questions.push({ id: doc.id, ...doc.data() } as Question);
        });
        callback(questions);
    });
}

/**
 * Save test result for a user
 */
export async function saveTestResult(result: Omit<TestResult, "id" | "completedAt">) {
  if (!isFirebaseEnabled || !db) return ".";
  const resultRef = collection(db, "results");
    const docRef = await addDoc(resultRef, {
        ...result,
        completedAt: serverTimestamp(),
    });

    // Also update user progress
    const progressRef = doc(db, "user_progress", `${result.userId}_${result.skill}`);
    // This is a simplified progress update
    await setDoc(progressRef, {
        userId: result.userId,
        skill: result.skill,
        lastActivity: serverTimestamp(),
    }, { merge: true });

    return docRef.id;
}

/**
 * Listen to user results
 */
export function subscribeToUserResults(userId: string, callback: (results: TestResult[]) => void, limitCount: number = 20) {
  if (!isFirebaseEnabled || !db) {
    callback([]);
    return noOpUnsubscribe();
  }
  const q = query(
        collection(db, "results"),
        where("userId", "==", userId),
        orderBy("completedAt", "desc"),
        limit(limitCount)
    );

    return onSnapshot(q, (snapshot) => {
        const results: TestResult[] = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            results.push({
                id: doc.id,
                ...data,
                completedAt: data.completedAt?.toDate() || new Date()
            } as TestResult);
        });
        callback(results);
    });
}

/**
 * Update user's last login timestamp
 */
export async function updateLastLogin(uid: string) {
  if (!isFirebaseEnabled || !db) return;
  const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        lastLogin: serverTimestamp()
    });
}

/**
 * Listen to user progress across all skills
 */
export function subscribeToUserProgress(userId: string, callback: (progress: Record<string, UserProgress>) => void) {
  if (!isFirebaseEnabled || !db) {
    callback({});
    return noOpUnsubscribe();
  }
  const q = query(
        collection(db, "user_progress"),
        where("userId", "==", userId)
    );

    return onSnapshot(q, (snapshot) => {
        const progress: Record<string, UserProgress> = {};
        snapshot.forEach((doc) => {
            const data = doc.data();
            progress[data.skill] = data as UserProgress;
        });
        callback(progress);
    });
}
/**
 * Listen to a specific user document
 */
export function subscribeToUser(uid: string, callback: (user: unknown) => void) {
  if (!isFirebaseEnabled || !db) {
    callback(null);
    return noOpUnsubscribe();
  }
  return onSnapshot(doc(db, "users", uid), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null);
    }
  });
}
/**
 * Listen to all users (Admin only)
 */
export function subscribeToAllUsers(callback: (users: DbUser[]) => void) {
  if (!isFirebaseEnabled || !db) {
    callback([]);
    return noOpUnsubscribe();
  }
  const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
        const users: DbUser[] = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            users.push({
                ...data,
                uid: doc.id,
                createdAt: data.createdAt?.toDate(),
                lastLogin: data.lastLogin?.toDate(),
            } as DbUser);
        });
        callback(users);
    });
}

/**
 * Update user information (Admin only)
 */
export async function updateUser(uid: string, data: Partial<DbUser>) {
  if (!isFirebaseEnabled || !db) return;
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, data as Record<string, unknown>);
}

/**
 * Delete a user (Admin only)
 */
export async function deleteUser(uid: string) {
  if (!isFirebaseEnabled || !db) return;
  const userRef = doc(db, "users", uid);
  await deleteDoc(userRef);
}
