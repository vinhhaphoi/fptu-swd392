"use client";

import {
  AuthUser,
  backendLogin,
  backendRegister,
  fetchCurrentProfile,
  signOutBackend,
  UserProfile,
} from "@/lib/auth";
import { getStoredToken } from "@/lib/apiClient";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: AuthUser | null;
  userData: UserProfile | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<AuthUser>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
    targetLevelCode?: string,
  ) => Promise<AuthUser>;
  signInWithGoogle: () => Promise<AuthUser>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isModerator: boolean;
  isBlocked: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSignOut = async () => {
    await signOutBackend();
    setUser(null);
    setUserData(null);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const token = getStoredToken();
        if (!token) {
          setLoading(false);
          return;
        }

        const profile = await fetchCurrentProfile();
        const mappedUser: AuthUser = {
          uid: profile.id,
          email: profile.email,
          displayName: profile.name,
        };

        setUser(mappedUser);
        setUserData(profile);
      } catch (err) {
        console.error("Failed to restore auth session:", err);
        await handleSignOut();
      } finally {
        setLoading(false);
      }
    }
    void init();
  }, []);

  useEffect(() => {
    if (userData && !userData.isActive) {
      void handleSignOut();
    }
  }, [userData]);

  const handleSignIn = async (
    identifier: string,
    password: string,
  ): Promise<AuthUser> => {
    const { user: authUser, profile } = await backendLogin(identifier, password);
    setUser(authUser);
    setUserData(profile);
    return authUser;
  };

  const handleSignUp = async (
    email: string,
    password: string,
    displayName: string,
    targetLevelCode: string = "B2",
  ): Promise<AuthUser> => {
    const { user: authUser, profile } = await backendRegister(
      email,
      password,
      displayName,
      targetLevelCode,
    );
    setUser(authUser);
    setUserData(profile);
    return authUser;
  };

  const handleSignInWithGoogle = async (): Promise<AuthUser> => {
    throw new Error("Google sign-in is not supported in backend auth mode.");
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signInWithGoogle: handleSignInWithGoogle,
    signOut: handleSignOut,
    isAdmin: userData?.role === "Admin",
    isModerator:
      userData?.role === "Admin" || userData?.role === "Manager",
    isBlocked: userData ? !userData.isActive : false,
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
