import { apiFetch, clearStoredToken, setStoredToken } from "./apiClient";

/**
 * Auth bằng Backend (JWT). Tài khoản lưu trong bảng profile trên Backend.
 * Frontend gọi API login/register → nhận token → gọi /api/user/profile để lấy UserProfile.
 */

export interface AuthResponse {
  token: string;
  userId: string;
  username: string;
  email: string;
  role: string;
  expiresAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  targetLevelId?: number;
  targetLevelName?: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
}

// Minimal user shape used by the frontend
export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
}

const LEVEL_CODE_TO_ID: Record<string, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

function mapAuthResponseToUser(
  auth: AuthResponse,
  profile?: UserProfile,
): AuthUser {
  return {
    uid: auth.userId,
    email: auth.email,
    displayName: profile?.name || auth.username,
  };
}

export async function backendLogin(
  identifier: string,
  password: string,
): Promise<{ auth: AuthResponse; profile: UserProfile; user: AuthUser }> {
  const auth = await apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      username: identifier,
      password,
    }),
  });

  setStoredToken(auth.token);

  const profile = await apiFetch<UserProfile>("/api/user/profile", {}, true);

  return { auth, profile, user: mapAuthResponseToUser(auth, profile) };
}

export async function backendRegister(
  email: string,
  password: string,
  name: string,
  targetLevelCode: string = "B2",
): Promise<{ auth: AuthResponse; profile: UserProfile; user: AuthUser }> {
  const targetLevelId = LEVEL_CODE_TO_ID[targetLevelCode] ?? LEVEL_CODE_TO_ID.B2;
  // Derive a backend-friendly username from email local-part
  const emailLocalPart = email.split("@")[0] ?? "user";
  let username = emailLocalPart.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, "_");
  // Collapse multiple underscores and trim from ends
  username = username.replace(/_{2,}/g, "_").replace(/^_+|_+$/g, "");
  if (username.length < 3) {
    username = `user_${Date.now()}`;
  }
  if (username.length > 50) {
    username = username.slice(0, 50);
  }

  const auth = await apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      username,
      email,
      phoneNumber: null,
      password,
      targetLevelId,
    }),
  });

  setStoredToken(auth.token);

  const profile = await apiFetch<UserProfile>("/api/user/profile", {}, true);

  return { auth, profile, user: mapAuthResponseToUser(auth, profile) };
}

export async function fetchCurrentProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>("/api/user/profile", {}, true);
}

export async function signOutBackend() {
  clearStoredToken();
}

