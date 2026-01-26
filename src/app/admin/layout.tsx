import AdminRoute from "@/components/auth/AdminRoute";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminRoute>{children}</AdminRoute>;
}
