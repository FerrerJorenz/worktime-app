import { useState, useEffect } from "react";

export default function SessionTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [workType, setWorkType] = useState("");
  const [goalSeconds, setGoalSeconds] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(0);

const timerOptions = [
  { label: "5 seconds", seconds: 5},
  { label: "30 minutes", seconds: 30 * 60 },
  { label: "1 hour", seconds: 60 * 60 },
  { label: "2 hours", seconds: 2 * 60 * 60 },
  { label: "3 hours", seconds: 3 * 60 * 60 },
];

  // Timer Logic
useEffect(() => {
  if (!isRunning || seconds === 0) return;

  const interval = setInterval(() => {
    setSeconds((prev) => {
      if (prev > 0) return prev - 1;

      clearInterval(interval);
      setIsRunning(false);

      setGoalSeconds(0);

      return 0;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [isRunning, seconds]);

 // Circle Progress Logic
const radius = 50;
const circumference = 2 * Math.PI * radius;
const offset =
  goalSeconds > 0
    ? circumference - (seconds / goalSeconds) * circumference
    : circumference;

    const formatTime = (sec: number) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};


  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120"> //
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#eee"
          strokeWidth="10"
          fill="transparent"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#4ade80"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
      </svg>
        <div className="mt-2 text-xl font-bold">{formatTime(seconds)}</div>
      <div className="mt-2 mb-6">
        {!isRunning ? (
          <button
            onClick={() => {
              if (goalSeconds === 0) {
                setError("Please select a session duration.");
                return;
              }

              if (!sessionName.trim()) {
                setError("Please enter a session name.");
                return;
              }

              if (!workType) {
                setError("Please select a work type.");
                return;
              }

              setError("");
              setIsRunning(true);

              // Clear form
              setSessionName("");
              setWorkType("");
              setSelectedDuration(0);


            }}
            className="bg-green-600 text-white p-2 rounded mr-2"
          >
            Start
          </button>
        ) : (
          <button
            onClick={() => setIsRunning(false)}
            className="bg-red-600 text-white p-2 rounded mr-2"
          >
            Stop
          </button>
        )}
        <button
            onClick={() => {
              setSeconds(0);
              setGoalSeconds(0);
              setSelectedDuration(0);
              setSessionName("");
              setWorkType("");
              setIsRunning(false);
            }}
            className="bg-gray-600 text-white p-2 rounded"
          >
            Reset
        </button>

      </div>
      <div className="flex">

    <label className= "text-lg ml-4">Session Task: </label>
            <input type="text" 
            className="border p-2 ml-4" placeholder="Session Task Name"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            />

    <label className= "text-lg ml-4">Session Duration: </label>
                <select
        value={selectedDuration}
        onChange={(e) => {
          const selected = Number(e.target.value);
          setSelectedDuration(selected);
          setSeconds(selected);   // countdown starts from this
          setGoalSeconds(selected); // store actual goal for progress
        }}
        className="border p-2 ml-4"
      >
        <option className="bg-white text-black" value={0}>Select Duration </option>
        {timerOptions.map((opt) => (
          <option key={opt.seconds} value={opt.seconds} className="bg-white text-black">
            {opt.label}
          </option>
        ))}
      </select>


          <label className= "text-lg ml-4">Work Type: </label>
        <select 
        value={workType} 
        className="border p-2 ml-4" 
        onChange={(e) => setWorkType(e.target.value)}>
            <option value="" className="bg-white text-black">Select Type</option>
            <option value="Deep" className="bg-white text-black">Deep Work</option>
            <option value="Light" className="bg-white text-black">Light Work</option>
            <option value="Study" className="bg-white text-black">Study</option>
        </select>
      </div>
              
        {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
