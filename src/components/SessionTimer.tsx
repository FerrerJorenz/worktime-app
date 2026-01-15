import { useState, useEffect } from "react";
import type { SessionFormData } from "./Dashboard";

type Props = {
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  formData: SessionFormData;
  onSessionComplete: (duration: number) => void;
  onReset: () => void;
  onValidate: () => boolean;
};

export default function SessionTimer({
  isRunning,
  setIsRunning,
  formData,
  onSessionComplete,
  onReset,
  onValidate
}: Props) {
  const [seconds, setSeconds] = useState(0);

  // Stopwatch Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  const calculateProgress = () => {
    if (formData.goalDuration === 0) return 0;
    return Math.min((seconds / formData.goalDuration) * 100, 100);
  };

  const handleStart = () => {
    if (onValidate()) {
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    onSessionComplete(seconds);
    setSeconds(0);
  };

  const handleResetClick = () => {
    setSeconds(0);
    onReset();
  };

  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-lg h-full min-h-[400px]">

      {/* Background radial gradient effect */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-[radial-gradient(ellipse_at_center,_var(--color-brand)_0%,_transparent_70%)] opacity-10 pointer-events-none"></div>

      <div className="flex items-center gap-2 mb-8 text-[var(--color-brand)] font-medium bg-[rgba(0,229,153,0.1)] px-4 py-1.5 rounded-full border border-[rgba(0,229,153,0.2)]">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
        <span>Session Timer</span>
      </div>

      <div className="relative mb-10 group">
        {/* Progress Ring */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Simple visual ring for now, can be SVG for real progress */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="var(--color-bg-input)"
              strokeWidth="8"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="var(--color-brand)"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - calculateProgress() / 100)}
              className="transition-all duration-1000 ease-linear"
              strokeLinecap="round"
              style={{ opacity: formData.goalDuration > 0 ? 1 : 0 }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-7xl font-mono font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(0,229,153,0.3)] tabular-nums">
              {formatTime(seconds)}
            </div>
            {formData.goalDuration > 0 && (
              <div className="mt-2 text-sm font-medium text-[var(--color-text-secondary)] flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                Goal: {formatTime(formData.goalDuration)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-xs z-10">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex-1 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-[var(--color-bg-dark)] py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,153,0.4)] hover:shadow-[0_0_30px_rgba(0,229,153,0.6)] active:translate-y-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            Start Session
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
            Stop
          </button>
        )}

        <button
          onClick={handleResetClick}
          className="px-4 py-4 rounded-xl bg-[var(--color-bg-input)] text-[var(--color-text-secondary)] hover:text-white hover:bg-[#374151] border border-[var(--color-border)]"
          title="Reset"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v6h6" /><path d="M21 12A9 9 0 0 0 6 5.3L3 8" /><path d="M21 22v-6h-6" /><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" /></svg>
        </button>
      </div>
    </div>
  );
}
