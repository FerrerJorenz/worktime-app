import { useState, useEffect } from "react";
import SessionForm from "./SessionForm";
import SessionTable from "./SessionTable";
import SessionTimer from "./SessionTimer";
import { getSessions, createSession, type Session as ApiSession } from "../api/sessions.api";

export type Session = {
  id: string;
  name: string;
  type: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
};

export type SessionFormData = {
  name: string;
  type: string;
  goalDuration: number; // in seconds
};

export default function Dashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [formData, setFormData] = useState<SessionFormData>({
    name: "",
    type: "Deep Work",
    goalDuration: 0,
  });
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load sessions from API on mount
  useEffect(() => {
    const loadSessions = async () => {
      try {
        setIsLoading(true);
        const response = await getSessions({ limit: 50 });

        // Map API sessions to our local Session type
        const mappedSessions: Session[] = response.sessions.map((s: ApiSession) => ({
          id: s.id,
          name: s.name,
          type: s.workType,
          startTime: s.startTime,
          endTime: s.endTime,
          durationSeconds: s.durationSeconds
        }));

        setSessions(mappedSessions);
        setError(null);
      } catch (err: any) {
        console.error('Failed to load sessions:', err);
        setError('Failed to load sessions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  const handleSessionComplete = async (durationSeconds: number) => {
    const now = new Date();
    // Calculate start time based on end time and duration
    const startTime = new Date(now.getTime() - durationSeconds * 1000);

    try {
      // Save to database via API
      const savedSession = await createSession({
        name: formData.name,
        workType: formData.type,
        startTime: startTime.toISOString(),
        endTime: now.toISOString(),
        durationSeconds,
      });

      // Map to local Session type and add to list
      const newSession: Session = {
        id: savedSession.id,
        name: savedSession.name,
        type: savedSession.workType,
        startTime: savedSession.startTime,
        endTime: savedSession.endTime,
        durationSeconds: savedSession.durationSeconds,
      };

      setSessions((prev) => [newSession, ...prev]);
      setIsTimerRunning(false);
      setError(null);
    } catch (err: any) {
      console.error('Failed to save session:', err);
      setError('Failed to save session. Please try again.');
      setIsTimerRunning(false);
    }
  };

  const handleReset = () => {
    setIsTimerRunning(false);
    setFormData({
      name: "",
      type: "Deep Work",
      goalDuration: 0
    })
  }

  const [errors, setErrors] = useState<{ name?: string, type?: string }>({});

  const validateSession = (): boolean => {
    const newErrors: { name?: string, type?: string } = {};
    if (!formData.name.trim()) newErrors.name = "Session name is required";
    if (!formData.type) newErrors.type = "Work type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="flex flex-col w-full max-w-[1600px] p-6 gap-6">
      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Left Column: Timer & Controls */}
        <div className="flex flex-col gap-6">
          <SessionTimer
            isRunning={isTimerRunning}
            setIsRunning={setIsTimerRunning}
            formData={formData}
            onSessionComplete={handleSessionComplete}
            onReset={handleReset}
            onValidate={validateSession}
          />

          <SessionForm
            formData={formData}
            setFormData={setFormData}
            disabled={isTimerRunning}
            errors={errors}
          />
        </div>

        {/* Right Column: History */}
        <div className="h-full min-h-[500px]">
          {isLoading ? (
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[var(--color-brand)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[var(--color-text-secondary)]">Loading sessions...</p>
              </div>
            </div>
          ) : (
            <SessionTable sessions={sessions} />
          )}
        </div>
      </div>
    </div>
  );
}