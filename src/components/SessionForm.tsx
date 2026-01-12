import { useState } from "react"
import type { Session } from "./Dashboard"

type Props = {
    onAddSession: (session: Session) => void
}
export default function SessionForm({ onAddSession }: Props) {
    const [sessionName, setSessionName] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [workType, setWorkType] = useState("");
    const [error, setError] = useState(""); 

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!sessionName ||!startTime || !endTime || !workType) {
            alert("Please fill in all fields.");
            return;
        }

        const session = {
            name: sessionName,
            start: startTime,
            end: endTime,
            type: workType, 
        }

        
        console.log("Session saved:", session);

    if (new Date(endTime) <= new Date(startTime)) {
    setError("End time must be after start time");

    setTimeout(() => {
      setError("");
    }, 2000);

    return;
  }


    setError("");

        onAddSession({
            sessionName: sessionName,
            startTime: startTime,
            endTime: endTime,
            workType: workType,
        });

        setSessionName("");
        setStartTime("");
        setEndTime("");
        setWorkType("");
    }

    return (
     <form onSubmit={handleSubmit} className="mb-6">
          {error && <p className="text-red-600 mb-2">{error}</p>}

        <label className= "text-sm ml-4">Session Task: </label>
            <input type="text" 
            className="border p-2 ml-4" placeholder="Session Task Name"
            onChange={(e) => setSessionName(e.target.value)}
            />
 
        <label className= "text-sm ml-4">Start Time: </label>
            <input 
            type="datetime-local" 
            className="border p-2 ml-4" 
            onChange={(e)=> setStartTime(e.target.value)}
            />

        <label className= "text-sm ml-4">End Time: </label>
            <input 
            type="datetime-local" 
            className="border p-2 ml-4" 
            onChange={(e)=> setEndTime(e.target.value)}/>
        
          <label className= "text-sm ml-4">Work Type: </label>
        <select 
        value={workType} 
        className="border p-2 ml-4" 
        onChange={(e) => setWorkType(e.target.value)}>
            <option value="" className="bg-white text-black">Select Type</option>
            <option value="Deep" className="bg-white text-black">Deep Work</option>
            <option value="Light" className="bg-white text-black">Light Work</option>
            <option value="Study" className="bg-white text-black">Study</option>
        </select>

        <button type="submit" className="ml-6">Save Session</button>
     </form>
            )
}