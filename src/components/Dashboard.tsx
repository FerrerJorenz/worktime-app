import { useState } from "react";
import SessionForm from "./SessionForm";
import SessionTable from "./SessionTable";
import SessionTimer from "./SessionTimer";

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

  const handleSessionComplete = (durationSeconds: number) => {
    const now = new Date();
    // Calculate start time based on end time and duration
    const startTime = new Date(now.getTime() - durationSeconds * 1000);

    const newSession: Session = {
      id: crypto.randomUUID(),
      name: formData.name,
      type: formData.type,
      startTime: startTime.toISOString(),
      endTime: now.toISOString(),
      durationSeconds,
    };

    setSessions((prev) => [newSession, ...prev]);
    setIsTimerRunning(false);
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
          <SessionTable sessions={sessions} />
        </div>
      </div>
    </div>
  );
}