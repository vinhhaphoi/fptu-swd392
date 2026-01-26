import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDYrmh4fw-qlxtlWWeEhw8AXJyLDus4wHM",
    authDomain: "vinhhaphoi-swd392.firebaseapp.com",
    projectId: "vinhhaphoi-swd392",
    storageBucket: "vinhhaphoi-swd392.firebasestorage.app",
    messagingSenderId: "859215783127",
    appId: "1:859215783127:web:e8e6fac3aee086f47a3c92",
    measurementId: "G-L3F9667FYL"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
