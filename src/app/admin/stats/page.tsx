"use client";

import Button from "@/components/ui/Button";
import { useAppContent } from "@/hooks/useRealTime";
import { updateStats } from "@/lib/db";
import { AppContentItem } from "@/types";
import { Edit2, Save } from "lucide-react";
import { useState } from "react";

export default function AdminStatsPage() {
  const { stats, loading } = useAppContent();
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<AppContentItem | null>(null);

  const handleSaveEdit = async (index: number) => {
    if (!editForm) return;
    const newStats = [...stats];
    newStats[index] = editForm;
    await updateStats(newStats);
    setIsEditing(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Manage Statistics
          </h1>
          <p className="text-foreground/50">
            Update the impact numbers shown in the hero section.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card border border-card-border rounded-2xl p-6 hover:shadow-lg transition-all"
            >
              {isEditing === index ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground/60 mb-1">
                        Value
                      </label>
                      <input
                        type="text"
                        value={editForm?.value}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm!,
                            value: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-background border border-card-border focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/60 mb-1">
                        Label
                      </label>
                      <input
                        type="text"
                        value={editForm?.label}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm!,
                            label: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-background border border-card-border focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsEditing(null)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => handleSaveEdit(index)}>
                      <Save size={16} className="mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </div>
                    <div className="text-foreground/50 font-medium">
                      {stat.label}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsEditing(index);
                      setEditForm(stat);
                    }}
                    className="p-3 rounded-xl bg-foreground/5 hover:bg-indigo-500/10 text-foreground/40 hover:text-indigo-500 transition-all"
                  >
                    <Edit2 size={20} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
