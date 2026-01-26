"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUsers } from "@/hooks/useRealTime";
import { deleteUser, updateUser } from "@/lib/db";
import { User } from "@/types";
import {
  Calendar,
  Check,
  Mail,
  Shield,
  Trash2,
  User as UserIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function UserManagementPage() {
  const { users, loading } = useUsers();
  const { user: currentUser } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<User["role"]>("member");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleRoleUpdate = async (uid: string) => {
    setActionLoading(uid);
    try {
      await updateUser(uid, { role: newRole });
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (uid: string) => {
    if (uid === currentUser?.uid) return;
    if (!confirm("Are you sure you want to delete this user?")) return;

    setActionLoading(uid);
    try {
      await deleteUser(uid);
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date: Date | string | number | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <UserIcon className="text-indigo-500" size={32} />
          User Management
        </h1>
        <p className="text-foreground/40">
          Manage your platform&apos;s users, assign roles, and handle accounts.
        </p>
      </div>

      <div className="bg-card border border-card-border rounded-[32px] overflow-hidden shadow-xl shadow-indigo-500/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-card-border bg-foreground/[0.02]">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-foreground/40">
                  User
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-foreground/40">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-foreground/40">
                  Created
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-foreground/40 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {users.map((u) => (
                <tr
                  key={u.uid}
                  className="hover:bg-foreground/[0.01] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-indigo-500/10 flex items-center justify-center shrink-0">
                        {u.photoURL ? (
                          <Image
                            src={u.photoURL}
                            alt={u.displayName || "User"}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <span className="font-bold text-indigo-500">
                            {u.displayName?.[0] || u.email?.[0] || "?"}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">
                          {u.displayName || "No Name"}
                          {u.uid === currentUser?.uid && (
                            <span className="ml-2 text-[10px] bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-foreground/40 flex items-center gap-1">
                          <Mail size={12} />
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === u.uid ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={newRole}
                          onChange={(e) =>
                            setNewRole(e.target.value as User["role"])
                          }
                          className="bg-background border border-card-border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="member">Member</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => handleRoleUpdate(u.uid)}
                          disabled={actionLoading === u.uid}
                          className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(u.uid);
                          setNewRole(u.role || "member");
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-105 ${
                          u.role === "admin"
                            ? "bg-indigo-500/10 text-indigo-500"
                            : u.role === "moderator"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-foreground/5 text-foreground/40"
                        }`}
                      >
                        <Shield size={12} />
                        {u.role || "Member"}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground/60 flex items-center gap-1.5">
                      <Calendar size={14} className="text-foreground/20" />
                      {formatDate(u.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(u.uid)}
                      disabled={
                        u.uid === currentUser?.uid || actionLoading === u.uid
                      }
                      className="p-2 text-foreground/20 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all disabled:opacity-0 disabled:pointer-events-none"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
