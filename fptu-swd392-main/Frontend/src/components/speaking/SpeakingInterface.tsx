"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";

interface SpeakingInterfaceProps {
  prompt: string;
  timeLimit: number; // in seconds
  onSubmit: (audioBlob: Blob, duration: number) => void;
}

export default function SpeakingInterface({
  prompt,
  timeLimit,
  onSubmit,
}: SpeakingInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Request microphone permission
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop()); // Stop immediately
        setHasPermission(true);
      } catch (error) {
        console.error("Microphone permission denied:", error);
        setHasPermission(false);
      }
    };
    requestPermission();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= timeLimit) {
            stopRecording();
            return timeLimit;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Failed to start recording. Please check your microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playRecording = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSubmit = () => {
    if (audioBlob) {
      onSubmit(audioBlob, recordingTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (hasPermission === false) {
    return (
      <div className="bg-card border border-card-border rounded-xl p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Microphone Permission Required
        </h3>
        <p className="text-foreground/60 mb-6">
          Please allow microphone access to record your speaking practice.
        </p>
        <Button onClick={() => window.location.reload()}>Reload Page</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Prompt */}
      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-2">Speaking Prompt</h3>
        <p className="text-foreground/70 whitespace-pre-wrap">{prompt}</p>
      </div>

      {/* Recording Interface */}
      <div className="bg-card border border-card-border rounded-xl p-8">
        <div className="text-center space-y-6">
          {/* Timer */}
          <div className="flex items-center justify-center">
            <div
              className={`text-6xl font-bold ${
                isRecording ? "text-red-500 animate-pulse" : "text-foreground"
              }`}
            >
              {formatTime(recordingTime)}
            </div>
          </div>

          {/* Recording Button */}
          {!audioBlob ? (
            <div className="flex flex-col items-center gap-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={hasPermission === null}
                  className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center text-white hover:shadow-lg transition-all animate-pulse"
                >
                  <div className="w-12 h-12 rounded bg-white" />
                </button>
              )}
              <p className="text-foreground/60">
                {isRecording
                  ? "Recording... Click to stop"
                  : "Click to start recording"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={playRecording}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white hover:shadow-lg transition-all"
                >
                  {isPlaying ? (
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-8 h-8 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => {
                    setAudioBlob(null);
                    setAudioUrl(null);
                    setRecordingTime(0);
                    setIsPlaying(false);
                  }}
                  className="px-6 py-3 rounded-xl border border-card-border text-foreground/70 hover:bg-foreground/5 transition-all"
                >
                  Record Again
                </button>
              </div>
              <p className="text-foreground/60">Duration: {formatTime(recordingTime)}</p>
            </div>
          )}

          {/* Hidden Audio Element */}
          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
            />
          )}
        </div>
      </div>

      {/* Submit Button */}
      {audioBlob && (
        <div className="flex justify-center">
          <Button onClick={handleSubmit} size="lg">
            Submit Recording
          </Button>
        </div>
      )}
    </div>
  );
}
