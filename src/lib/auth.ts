import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
    User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Sign up with email and password
export async function signUp(email: string, password: string, displayName: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Use a default avatar if none exists
    const photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff`;

    // Update Firebase Auth profile
    await updateProfile(user, {
        displayName,
        photoURL
    });

    // Create/Update user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        photoURL: photoURL,
        lastLogin: serverTimestamp(),
        createdAt: serverTimestamp(),
        targetLevel: "B2",
    }, { merge: true });

    return user;
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Update last login
    await setDoc(doc(db, "users", userCredential.user.uid), {
        lastLogin: serverTimestamp(),
    }, { merge: true });

    return userCredential.user;
}

// Sign in with Google
export async function signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Always update Firestore with latest info from Google
    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: serverTimestamp(),
        // Only set createdAt if it doesn't exist
        updatedAt: serverTimestamp(),
    }, { merge: true });

    // Ensure createdAt exists
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.data()?.createdAt) {
        await setDoc(doc(db, "users", user.uid), {
            createdAt: serverTimestamp(),
            targetLevel: "B2",
        }, { merge: true });
    }

    return user;
}

// Sign out
export async function signOut() {
    await firebaseSignOut(auth);
}

// Auth state observer
export function onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}

// Get current user
export function getCurrentUser() {
    return auth.currentUser;
}
