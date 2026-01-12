import type { Session } from "./Dashboard";

type Props = {
    sessions: Session[];
}

export default function SessionTable({ sessions }: Props) {

    return (
        <div className="overflow-x-auto mb-6">
            <table className="min-w-full border">
                <caption className="mb-3">Work Sessions</caption>
                <thead className="bg-gray-600">
                    <tr>
                        <th className="p-3 border">Session Name</th>
                        <th className="p-3 border">Start Time</th>
                        <th className="p-3 border">End Time</th>
                        <th className="p-3 border">Work Type</th>
                        <th className="p-3 border">Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.length > 0 ? (
                        sessions.map((s, i) => {
                            const start = new Date(s.startTime);
                            const end = new Date(s.endTime);

                            const diffMs = end.getTime() - start.getTime();

                            const hours = Math.floor(diffMs / (1000 * 60 * 60));
                            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                            const duration = `${hours}h ${minutes}m`;

                            return (
                                <tr key={i} className="text-center">
                                    <td className="p-3 border">{s.sessionName}</td>
                                    <td className="p-3 border">{s.startTime}</td>
                                    <td className="p-3 border">{s.endTime}</td>
                                    <td className="p-3 border">{s.workType}</td>
                                    <td className="p-3 border">{duration}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={5} className="p-3 border text-center">No sessions recorded.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
