"use client";

import {
  signOut as authSignOut,
  onAuthChange,
  signIn,
  signInWithGoogle,
  signUp,
} from "@/lib/auth";
import { subscribeToUser, updateLastLogin } from "@/lib/db";
import { User as DbUser } from "@/types";
import { User as FirebaseUser } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: FirebaseUser | null;
  userData: DbUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<FirebaseUser>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<FirebaseUser>;
  signInWithGoogle: () => Promise<FirebaseUser>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isModerator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      if (!user) {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.uid) {
      updateLastLogin(user.uid);
      const unsubscribe = subscribeToUser(user.uid, (data) => {
        setUserData(data as DbUser);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleSignOut = async () => {
    await authSignOut();
    setUser(null);
    setUserData(null);
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut: handleSignOut,
    isAdmin: userData?.role === "admin",
    isModerator: userData?.role === "admin" || userData?.role === "moderator",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
