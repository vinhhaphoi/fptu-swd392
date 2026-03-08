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
import { db } from "./firebase";

/**
 * Listen to app statistics (active learners, tests, etc.)
 */
export function subscribeToStats(callback: (stats: AppContentItem[]) => void) {
    return onSnapshot(
        doc(db, "app_content", "stats"),
        (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                callback((data.items || []) as AppContentItem[]);
            } else {
                callback([]);
            }
        },
        (error) => {
            console.warn("Firestore permission error for stats:", error);
            callback([]);
        }
    );
}

/**
 * Listen to app features
 */
export function subscribeToFeatures(callback: (features: AppContentItem[]) => void) {
    return onSnapshot(
        doc(db, "app_content", "features"),
        (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                callback((data.items || []) as AppContentItem[]);
            } else {
                callback([]);
            }
        },
        (error) => {
            console.warn("Firestore permission error for features:", error);
            callback([]);
        }
    );
}

/**
 * Update app statistics
 */
export async function updateStats(stats: AppContentItem[]) {
    const statsRef = doc(db, "app_content", "stats");
    await setDoc(statsRef, { items: stats }, { merge: true });
}

/**
 * Update app features
 */
export async function updateFeatures(features: AppContentItem[]) {
    const featuresRef = doc(db, "app_content", "features");
    await setDoc(featuresRef, { items: features }, { merge: true });
}

/**
 * Listen to skill metadata (descriptions, durations, parts)
 */
export function subscribeToSkills(callback: (skills: typeof SKILLS_DATA) => void) {
    return onSnapshot(
        collection(db, "skills"),
        (snapshot) => {
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
        },
        (error) => {
            console.warn("Firestore permission error for skills:", error);
            // Use fallback data on permission error
            callback(SKILLS_DATA);
        }
    );
}

/**
 * Listen to tests for a specific skill
 */
export function subscribeToTests(skill: SkillType, callback: (tests: Test[]) => void) {
    const q = query(
        collection(db, "tests"),
        where("skill", "==", skill),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(
        q,
        (snapshot) => {
            const tests: Test[] = [];
            snapshot.forEach((doc) => {
                tests.push({ id: doc.id, ...doc.data() } as Test);
            });
            callback(tests);
        },
        (error) => {
            console.warn("Firestore permission error for tests:", error);
            callback([]);
        }
    );
}

/**
 * Listen to questions for a specific test
 */
export function subscribeToQuestions(testId: string, callback: (questions: Question[]) => void) {
    const q = query(
        collection(db, "questions"),
        where("testId", "==", testId),
        orderBy("order", "asc")
    );

    return onSnapshot(
        q,
        (snapshot) => {
            const questions: Question[] = [];
            snapshot.forEach((doc) => {
                questions.push({ id: doc.id, ...doc.data() } as Question);
            });
            callback(questions);
        },
        (error) => {
            console.warn("Firestore permission error for questions:", error);
            callback([]);
        }
    );
}

/**
 * Save test result for a user
 */
export async function saveTestResult(result: Omit<TestResult, "id" | "completedAt">) {
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
    if (!userId) {
        callback([]);
        return () => {};
    }
    const q = query(
        collection(db, "results"),
        where("userId", "==", userId),
        orderBy("completedAt", "desc"),
        limit(limitCount)
    );

    return onSnapshot(
        q,
        (snapshot) => {
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
        },
        (error) => {
            console.warn("Firestore permission error for user results:", error);
            callback([]);
        }
    );
}

/**
 * Update user's last login timestamp
 */
export async function updateLastLogin(uid: string) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        lastLogin: serverTimestamp()
    });
}

/**
 * Listen to user progress across all skills
 */
export function subscribeToUserProgress(userId: string, callback: (progress: Record<string, UserProgress>) => void) {
    if (!userId) {
        callback({});
        return () => {};
    }
    const q = query(
        collection(db, "user_progress"),
        where("userId", "==", userId)
    );

    return onSnapshot(
        q,
        (snapshot) => {
            const progress: Record<string, UserProgress> = {};
            snapshot.forEach((doc) => {
                const data = doc.data();
                progress[data.skill] = data as UserProgress;
            });
            callback(progress);
        },
        (error) => {
            console.warn("Firestore permission error for user progress:", error);
            callback({});
        }
    );
}
/**
 * Listen to a specific user document
 */
export function subscribeToUser(uid: string, callback: (user: unknown) => void) {
    if (!uid) {
        callback(null);
        return () => {};
    }
    return onSnapshot(
        doc(db, "users", uid),
        (doc) => {
            if (doc.exists()) {
                callback(doc.data());
            } else {
                callback(null);
            }
        },
        (error) => {
            console.warn("Firestore permission error for user:", error);
            callback(null);
        }
    );
}
/**
 * Listen to all users (Admin only)
 */
export function subscribeToAllUsers(callback: (users: DbUser[]) => void) {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    return onSnapshot(
        q,
        (snapshot) => {
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
        },
        (error) => {
            console.warn("Firestore permission error for all users:", error);
            callback([]);
        }
    );
}

/**
 * Update user information (Admin only)
 */
export async function updateUser(uid: string, data: Partial<DbUser>) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data as Record<string, unknown>);
}

/**
 * Delete a user (Admin only)
 */
export async function deleteUser(uid: string) {
    const userRef = doc(db, "users", uid);
    await deleteDoc(userRef);
}
