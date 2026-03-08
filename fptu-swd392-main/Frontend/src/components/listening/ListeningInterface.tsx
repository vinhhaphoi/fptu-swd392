"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import Timer from "@/components/exam/Timer";

interface Question {
  id: string;
  content: string;
  options: string[];
  correctAnswer?: string;
  order: number;
}

interface ListeningInterfaceProps {
  audioUrl: string;
  questions: Question[];
  timeLimit: number; // in seconds
  transcript?: string;
  onSubmit: (answers: Record<string, string>) => void;
}

export default function ListeningInterface({
  audioUrl,
  questions,
  timeLimit,
  transcript,
  onSubmit,
}: ListeningInterfaceProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [replayCount, setReplayCount] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const maxReplays = 2;

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio.ended && replayCount >= maxReplays) {
        alert(`You have reached the maximum number of replays (${maxReplays})`);
        return;
      }
      if (audio.ended) {
        audio.currentTime = 0;
        setReplayCount((prev) => prev + 1);
      }
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSpeedChange = (speed: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = speed;
    setPlaybackRate(speed);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  return (
    <div className="space-y-6">
      {/* Timer and Submit */}
      <div className="flex items-center justify-between bg-card border border-card-border rounded-xl p-4">
        <div className="flex items-center gap-4">
          <Timer timeRemaining={timeRemaining} onTimeUp={handleSubmit} />
          <span className="text-foreground/60 text-sm">
            {answeredCount} / {questions.length} answered
          </span>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!allAnswered}
          variant={allAnswered ? "primary" : "secondary"}
        >
          Submit Answers
        </Button>
      </div>

      {/* Audio Player */}
      <div className="bg-card border border-card-border rounded-xl p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-foreground mb-2">
            Listen and answer questions below
          </h3>
          <p className="text-sm text-foreground/60">
            Replays remaining: {maxReplays - replayCount} / {maxReplays}
          </p>
        </div>

        {/* Audio Controls */}
        <div className="space-y-4">
          {/* Play/Pause Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={togglePlay}
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
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-foreground/60">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Volume */}
            <div className="flex items-center gap-2 flex-1 min-w-[150px]">
              <svg
                className="w-5 h-5 text-foreground/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Speed Control */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground/60">Speed:</span>
              {[0.75, 1, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    playbackRate === speed
                      ? "bg-indigo-500 text-white"
                      : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Transcript Toggle */}
            {transcript && (
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="px-4 py-2 rounded-lg bg-foreground/5 text-foreground/70 hover:bg-foreground/10 transition-colors text-sm font-medium"
              >
                {showTranscript ? "Hide" : "Show"} Transcript
              </button>
            )}
          </div>

          {/* Transcript */}
          {showTranscript && transcript && (
            <div className="mt-4 p-4 bg-foreground/5 rounded-lg border border-card-border">
              <h4 className="font-medium text-foreground mb-2">Transcript:</h4>
              <p className="text-sm text-foreground/70 whitespace-pre-wrap">{transcript}</p>
            </div>
          )}
        </div>

        {/* Hidden Audio Element */}
        <audio ref={audioRef} src={audioUrl} />
      </div>

      {/* Questions */}
      <div className="bg-card border border-card-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Questions</h3>
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="space-y-3">
              <p className="font-medium text-foreground">
                {index + 1}. {question.content}
              </p>
              <div className="space-y-2">
                {question.options.map((option, optIndex) => {
                  const optionLabel = String.fromCharCode(65 + optIndex); // A, B, C, D
                  const isSelected = answers[question.id] === optionLabel;
                  return (
                    <label
                      key={optIndex}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-500/10"
                          : "border-card-border hover:border-indigo-500/30 hover:bg-foreground/5"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={optionLabel}
                        checked={isSelected}
                        onChange={() => handleAnswer(question.id, optionLabel)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <span className="font-medium text-foreground mr-2">
                          {optionLabel}.
                        </span>
                        <span className="text-foreground/80">{option}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
