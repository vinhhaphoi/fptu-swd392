const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

if (!API_BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    "NEXT_PUBLIC_API_BASE_URL is not set. Backend API calls will fail.",
  );
}

const TOKEN_KEY = "auth_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  requireAuth = false,
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (requireAuth) {
    const token = getStoredToken();
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const body = await response.json();

      if (body) {
        const detail = (body as { detail?: string }).detail;
        const baseMessage = (body as { message?: string }).message;
        const errors = (body as { errors?: Record<string, string[]> }).errors;

        if (errors && Object.keys(errors).length > 0) {
          const allMessages = Object.values(errors).flat();
          message = allMessages.join(" | ");
        } else if (baseMessage && detail) {
          message = `${baseMessage}: ${detail}`;
        } else if (baseMessage) {
          message = baseMessage;
        } else if (detail) {
          message = detail;
        }

        // eslint-disable-next-line no-console
        console.error("API error response", {
          path,
          status: response.status,
          body,
        });
      }
    } catch {
      // ignore JSON parse errors
    }

    throw new Error(message);
  }

  // Some endpoints may return empty body
  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

