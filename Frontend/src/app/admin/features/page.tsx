"use client";

import Button from "@/components/ui/Button";
import { useAppContent } from "@/hooks/useRealTime";
import { updateFeatures } from "@/lib/db";
import { AppContentItem } from "@/types";
import {
  Edit2,
  Layout,
  MoveDown,
  MoveUp,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";

export default function AdminFeaturesPage() {
  const { features, loading } = useAppContent();
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<AppContentItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState<AppContentItem>({
    icon: "✨",
    title: "",
    description: "",
  });

  const handleSaveEdit = async (index: number) => {
    if (!editForm) return;
    const newFeatures = [...features];
    newFeatures[index] = editForm;
    await updateFeatures(newFeatures);
    setIsEditing(null);
  };

  const handleAdd = async () => {
    const newFeatures = [...features, newForm];
    await updateFeatures(newFeatures);
    setIsAdding(false);
    setNewForm({ icon: "✨", title: "", description: "" });
  };

  const handleDelete = async (index: number) => {
    if (!confirm("Are you sure you want to delete this feature?")) return;
    const newFeatures = features.filter((_, i) => i !== index);
    await updateFeatures(newFeatures);
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newFeatures = [...features];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= features.length) return;

    [newFeatures[index], newFeatures[newIndex]] = [
      newFeatures[newIndex],
      newFeatures[index],
    ];
    await updateFeatures(newFeatures);
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Manage Features
            </h1>
            <p className="text-foreground/50">
              Add, edit, or remove features displayed on the landing page.
            </p>
          </div>
          <Button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Add Feature
          </Button>
        </div>

        {isAdding && (
          <div className="mb-8 bg-card border-2 border-indigo-500/30 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">New Feature</h3>
              <button
                onClick={() => setIsAdding(false)}
                className="text-foreground/40 hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-foreground/60 mb-1">
                    Icon
                  </label>
                  <input
                    type="text"
                    value={newForm.icon}
                    onChange={(e) =>
                      setNewForm({ ...newForm, icon: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-background border border-card-border focus:border-indigo-500 outline-none transition-all text-2xl text-center"
                    placeholder="✨"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-foreground/60 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newForm.title}
                    onChange={(e) =>
                      setNewForm({ ...newForm, title: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-background border border-card-border focus:border-indigo-500 outline-none transition-all"
                    placeholder="Feature Title"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/60 mb-1">
                  Description
                </label>
                <textarea
                  value={newForm.description}
                  onChange={(e) =>
                    setNewForm({ ...newForm, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-background border border-card-border focus:border-indigo-500 outline-none transition-all min-h-[100px]"
                  placeholder="Short description of the feature..."
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="secondary" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd}>Create Feature</Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card border border-card-border rounded-2xl p-6 hover:shadow-lg transition-all"
            >
              {isEditing === index ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-foreground/60 mb-1">
                        Icon
                      </label>
                      <input
                        type="text"
                        value={editForm?.icon}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm!,
                            icon: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-background border border-card-border focus:border-indigo-500 outline-none transition-all text-2xl text-center"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-foreground/60 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editForm?.title}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm!,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-background border border-card-border focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/60 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editForm?.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm!,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-xl bg-background border border-card-border focus:border-indigo-500 outline-none transition-all min-h-[80px]"
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsEditing(null)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => handleSaveEdit(index)}>
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center text-2xl">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-foreground/60 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <button
                        disabled={index === 0}
                        onClick={() => handleMove(index, "up")}
                        className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/40 disabled:opacity-20 translate-y-0.5"
                      >
                        <MoveUp size={18} />
                      </button>
                      <button
                        disabled={index === features.length - 1}
                        onClick={() => handleMove(index, "down")}
                        className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/40 disabled:opacity-20 -translate-y-0.5"
                      >
                        <MoveDown size={18} />
                      </button>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setIsEditing(index);
                          setEditForm(feature);
                        }}
                        className="p-2 rounded-lg hover:bg-indigo-500/10 text-indigo-500 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {features.length === 0 && (
            <div className="text-center py-20 bg-card border border-dashed border-card-border rounded-2xl">
              <Layout size={48} className="mx-auto text-foreground/20 mb-4" />
              <p className="text-foreground/40">
                No features found. Add your first feature to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
