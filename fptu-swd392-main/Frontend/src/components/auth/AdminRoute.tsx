"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, isModerator, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isModerator)) {
      router.push("/");
    }
  }, [user, isModerator, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user || !isModerator) {
    return null;
  }

  return <>{children}</>;
}
