import { useState } from "react";
import SessionForm from "./SessionForm"
import SessionTable from "./SessionTable"
import SessionTimer from "./SessionTimer"

export type Session = {
  sessionName: string;
  startTime: string;
  endTime: string;
  workType: string;
}

export default function Dashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);

  const addSession = (session: Session) => {
    setSessions((prev) => [...prev, session]);
  }

  return (
    <div className="ml-6">
      <SessionTimer></SessionTimer>
      <SessionTable sessions={sessions} />   
      <SessionForm onAddSession={addSession} />
      
    </div>
  )
}