"use client";

import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(identifier, password);
      router.push("/practice");
    } catch (err: unknown) {
      console.error("Sign in error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
      router.push("/practice");
    } catch (err: unknown) {
      console.error("Google sign in error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Không thể đăng nhập bằng Google.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] z-10" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] animate-in fade-in zoom-in duration-500">
        {/* Decorative Top Link */}
        <div className="flex justify-center mb-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-2xl italic">V</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Vinhhaphoi
              </span>
              <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-semibold">
                Excellence in English
              </span>
            </div>
          </Link>
        </div>

        {/* Main Login Card */}
        <div className="bg-card/40 backdrop-blur-2xl border border-card-border rounded-[32px] p-8 sm:p-10 shadow-2xl shadow-indigo-500/5">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Welcome Back
            </h1>
            <p className="text-foreground/50 text-sm">
              Elevate your VSTEP score with smarter practice.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm animate-in slide-in-from-top-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground/40 uppercase tracking-wider ml-1">
                Email or Username
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-indigo-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@example.com or username"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-background/50 border border-card-border focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-foreground/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-semibold text-foreground/40 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs text-indigo-500 hover:text-indigo-400 font-medium"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-indigo-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-background/50 border border-card-border focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-foreground/20"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-card-border accent-indigo-500 cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-xs text-foreground/40 cursor-pointer select-none"
              >
                Keep me signed in for 30 days
              </label>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              className="py-4 text-base font-bold shadow-xl shadow-indigo-500/20"
            >
              Sign In
              <ArrowRight
                size={18}
                className="ml-2 group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-card-border" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold text-foreground/30">
              <span className="px-4 bg-transparent backdrop-blur-md">
                Secure Social Auth
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl border border-card-border bg-background/30 hover:bg-background/60 hover:border-indigo-500/30 transition-all group"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-semibold text-foreground/70 group-hover:text-foreground">
                Continue with Google
              </span>
            </button>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 text-sm">
            <span className="text-foreground/40">New to Vinhhaphoi?</span>
            <Link
              href="/auth/register"
              className="font-bold text-indigo-500 hover:text-indigo-400 transition-colors"
            >
              Join for Free
            </Link>
          </div>
        </div>

        {/* Trust Footer */}
        <div className="mt-8 flex items-center justify-center gap-6 text-[10px] uppercase tracking-widest font-bold text-foreground/20">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} />
            <span>Encrypted Connection</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
            <span>Systems Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
