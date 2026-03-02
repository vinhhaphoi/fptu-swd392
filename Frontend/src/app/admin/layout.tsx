"use client";

import AdminRoute from "@/components/auth/AdminRoute";
import { Database, LayoutDashboard, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/stats", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/features", label: "App Features", icon: Settings },
    { href: "/admin/questions", label: "Tạo bộ đề (Upload)", icon: Database },
  ];

  return (
    <div className="w-64 bg-card border-r border-card-border flex flex-col pt-5 min-h-screen">
      <div className="px-4 mb-8">
        <h2 className="text-xs font-bold text-foreground/30 uppercase tracking-[0.2em] ml-2">
          Administration
        </h2>
      </div>
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 group ${
                isActive
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  size={20}
                  className={
                    isActive
                      ? "text-white"
                      : "text-foreground/40 group-hover:text-foreground"
                  }
                />
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminRoute>
      <div className="flex bg-background min-h-screen">
        <AdminSidebar />
        <div className="flex-1 min-h-screen pt-16 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </div>
    </AdminRoute>
  );
}
