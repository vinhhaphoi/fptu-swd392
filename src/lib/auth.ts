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

    // Update profile
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        targetLevel: "B2",
    });

    return user;
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}

// Sign in with Google
export async function signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user document exists
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
        // Create user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
            targetLevel: "B2",
        });
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
