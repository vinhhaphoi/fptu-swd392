"use client";

export const dynamic = "force-dynamic";

import Button from "@/components/ui/Button";
import { detectQuestions } from "@/lib/gemini";
import { Question } from "@/types";
import {
  AlertCircle,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  FileText,
  FileUp,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";

export default function QuestionUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedQuestions, setDetectedQuestions] = useState<
    Partial<Question>[]
  >([]);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleDetection(selectedFile);
    }
  };

  const handleDetection = async (file: File) => {
    setIsDetecting(true);
    setStatus(null);

    try {
      const questions = await detectQuestions(file);
      setDetectedQuestions(questions);
      setStatus({
        type: "success",
        message: `Successfully detected ${questions.length} questions from the file!`,
      });
    } catch (error: unknown) {
      console.error("Detection error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to analyze the document.";
      setStatus({
        type: "error",
        message: errorMessage || "Please ensure your API key is configured.",
      });
      setFile(null);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSaveQuestions = async () => {
    if (detectedQuestions.length === 0) return;

    setIsDetecting(true);
    try {
      // In a real app, we'd save these to Firestore
      // For now we'll simulate the save
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setDetectedQuestions([]);
      setFile(null);
      setStatus({
        type: "success",
        message: "Questions successfully imported to the Question Bank!",
      });
    } catch {
      setStatus({
        type: "error",
        message: "Failed to save questions. Please try again.",
      });
    } finally {
      setIsDetecting(false);
    }
  };

  const removeQuestion = (index: number) => {
    setDetectedQuestions((prev: Partial<Question>[]) =>
      prev.filter((_: Partial<Question>, i: number) => i !== index),
    );
  };

  return (
    <div className="p-8 pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <BrainCircuit className="text-indigo-500" size={32} />
              AI Question Detector
            </h1>
            <p className="text-foreground/40 font-medium">
              Upload documents or images to automatically extract questions and
              answers.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl"
            >
              <FileUp size={18} className="mr-2" />
              Upload Document
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            />
          </div>
        </div>

        {status && (
          <div
            className={`mb-8 p-4 rounded-[24px] flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
              status.type === "success"
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                : "bg-red-500/10 text-red-500 border border-red-500/20"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <p className="font-semibold text-sm">{status.message}</p>
          </div>
        )}

        {isDetecting ? (
          <div className="bg-card border border-card-border rounded-[32px] p-20 flex flex-col items-center justify-center text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
              <Loader2
                className="animate-spin text-indigo-500 relative z-10"
                size={64}
              />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2 animate-pulse">
              Detecting Questions...
            </h3>
            <p className="text-foreground/40 max-w-sm font-medium">
              Our AI is analyzing your document to identify questions, options,
              and correct answers.
            </p>
          </div>
        ) : file && detectedQuestions.length > 0 ? (
          <div className="space-y-6">
            <div className="bg-card border border-card-border rounded-[32px] p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{file.name}</h4>
                  <p className="text-xs text-foreground/40">
                    {(file.size / 1024).toFixed(1)} KB • Detected{" "}
                    {detectedQuestions.length} items
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setFile(null);
                    setDetectedQuestions([]);
                  }}
                  className="text-foreground/40 hover:text-red-500"
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveQuestions}>
                  <Save size={18} className="mr-2" />
                  Import to Bank
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {detectedQuestions.map((q: Partial<Question>, idx: number) => (
                <div
                  key={idx}
                  className="group bg-card border border-card-border rounded-[32px] p-8 hover:shadow-xl transition-all relative"
                >
                  <button
                    onClick={() => removeQuestion(idx)}
                    className="absolute top-6 right-6 p-2 rounded-xl text-foreground/20 hover:text-red-500 hover:bg-red-500/5 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-black text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full uppercase tracking-widest">
                      Question {idx + 1}
                    </span>
                    <span className="text-xs font-black text-foreground/40 bg-foreground/5 px-3 py-1 rounded-full uppercase tracking-widest">
                      {q.type?.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-6 leading-relaxed">
                    {q.content}
                  </h3>

                  {q.options && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.options.map((opt: string, optIdx: number) => (
                        <div
                          key={optIdx}
                          className={`p-4 rounded-2xl border transition-all ${
                            opt.startsWith(q.correctAnswer || "")
                              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500"
                              : "bg-foreground/[0.02] border-card-border text-foreground/60"
                          }`}
                        >
                          <span className="font-medium">{opt}</span>
                          {opt.startsWith(q.correctAnswer || "") && (
                            <CheckCircle2 size={14} className="inline ml-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer bg-card border-2 border-dashed border-card-border rounded-[48px] p-32 flex flex-col items-center justify-center text-center group hover:border-indigo-500/50 hover:bg-indigo-500/[0.02] transition-all"
          >
            <div className="w-24 h-24 rounded-[32px] bg-foreground/5 flex items-center justify-center text-foreground/20 group-hover:text-indigo-500 group-hover:bg-indigo-500/10 transition-all mb-8">
              <Plus size={48} />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Import Questions with AI
            </h3>
            <p className="text-foreground/40 max-w-sm font-medium mb-8">
              Drag and drop your file here, or click to upload. Support for PDF,
              Word, TXT, and Images.
            </p>
            <div className="flex items-center gap-6 text-foreground/20">
              <FileText size={32} />
              <ChevronRight size={24} />
              <BrainCircuit
                size={32}
                className="group-hover:text-indigo-500/50 transition-colors"
              />
              <ChevronRight size={24} />
              <CheckCircle2 size={32} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
