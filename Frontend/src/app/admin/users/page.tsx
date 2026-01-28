"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUsers } from "@/hooks/useRealTime";
import { deleteUser, updateUser } from "@/lib/db";
import { User } from "@/types";
import {
  Ban,
  Calendar,
  Check,
  CheckCircle2,
  Mail,
  Shield,
  Trash2,
  UserCog,
  User as UserIcon,
  UserX,
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

  const handleUpdateStatus = async (
    uid: string,
    status: User["status"],
    isBlocked: boolean = false,
  ) => {
    if (uid === currentUser?.uid) return;
    setActionLoading(uid);
    try {
      await updateUser(uid, { status, isBlocked });
    } catch (error) {
      console.error("Failed to update status:", error);
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
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-foreground/40">
                  Status
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
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        u.role === "admin"
                          ? "bg-indigo-500/10 text-indigo-500"
                          : u.role === "moderator"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-foreground/5 text-foreground/40"
                      }`}
                    >
                      <Shield size={12} />
                      {u.role || "Member"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground/60 flex items-center gap-1.5">
                      <Calendar size={14} className="text-foreground/20" />
                      {formatDate(u.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        u.isBlocked
                          ? "bg-red-500/10 text-red-500 border-red-500/20"
                          : u.status === "restricted"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      }`}
                    >
                      {u.isBlocked ? "Blocked" : u.status || "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {editingId === u.uid ? (
                        <div className="flex items-center gap-1 bg-background border border-card-border p-1 rounded-xl shadow-lg animate-in zoom-in-95">
                          <select
                            value={newRole}
                            onChange={(e) =>
                              setNewRole(e.target.value as User["role"])
                            }
                            className="bg-transparent border-none outline-none px-2 py-1 text-xs font-bold uppercase tracking-widest text-foreground"
                          >
                            <option value="member">Member</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                          <div className="flex gap-1 ml-1 pr-1">
                            <button
                              onClick={() => handleRoleUpdate(u.uid)}
                              disabled={actionLoading === u.uid}
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(u.uid);
                              setNewRole(u.role || "member");
                            }}
                            title="Change User Role"
                            className="p-2 text-foreground/60 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-xl transition-all"
                          >
                            <UserCog size={18} />
                          </button>

                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                u.uid,
                                u.isBlocked ? "active" : "blocked",
                                !u.isBlocked,
                              )
                            }
                            disabled={
                              u.uid === currentUser?.uid ||
                              actionLoading === u.uid
                            }
                            title={
                              u.uid === currentUser?.uid
                                ? "You cannot block yourself"
                                : u.isBlocked
                                  ? "Unblock User"
                                  : "Block User"
                            }
                            className={`p-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${
                              u.isBlocked
                                ? "text-emerald-500 hover:bg-emerald-500/10"
                                : "text-amber-500 hover:bg-amber-500/10"
                            }`}
                          >
                            {u.isBlocked ? (
                              <CheckCircle2 size={18} />
                            ) : (
                              <Ban size={18} />
                            )}
                          </button>

                          <button
                            onClick={() =>
                              handleUpdateStatus(u.uid, "restricted", false)
                            }
                            disabled={
                              u.uid === currentUser?.uid ||
                              actionLoading === u.uid ||
                              u.status === "restricted"
                            }
                            title={
                              u.uid === currentUser?.uid
                                ? "You cannot restrict yourself"
                                : "Restrict User"
                            }
                            className="p-2 text-foreground/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                          >
                            <UserX size={18} />
                          </button>

                          <button
                            onClick={() => handleDelete(u.uid)}
                            disabled={
                              u.uid === currentUser?.uid ||
                              actionLoading === u.uid
                            }
                            title={
                              u.uid === currentUser?.uid
                                ? "You cannot delete yourself"
                                : "Delete User"
                            }
                            className="p-2 text-foreground/20 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all disabled:opacity-10 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
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
