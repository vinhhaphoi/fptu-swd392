import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const hasFirebaseConfig =
  !!firebaseConfig.apiKey &&
  !!firebaseConfig.authDomain &&
  !!firebaseConfig.projectId &&
  !!firebaseConfig.appId;

// Initialize Firebase (guarded so builds without env don't crash)
const app =
  hasFirebaseConfig && getApps().length === 0
    ? initializeApp(firebaseConfig)
    : hasFirebaseConfig
      ? getApps()[0]
      : null;

export const auth = app
  ? getAuth(app)
  : (null as unknown as ReturnType<typeof getAuth>);
export const db = app
  ? getFirestore(app)
  : (null as unknown as ReturnType<typeof getFirestore>);
export const storage = app
  ? getStorage(app)
  : (null as unknown as ReturnType<typeof getStorage>);
export default app;
