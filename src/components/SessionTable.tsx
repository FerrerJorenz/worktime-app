import type { Session } from "./Dashboard";

type Props = {
    sessions: Session[];
}

export default function SessionTable({ sessions }: Props) {

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        if (h > 0) return `${h}h ${m}m ${s}s`;
        if (m > 0) return `${m}m ${s}s`;
        return `${s}s`;
    };

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleString(undefined, {
            weekday: 'short',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    return (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--color-brand)] flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    Session History
                    <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-brand)] text-[var(--color-bg-dark)]">
                        {sessions.length}
                    </span>
                </h2>
            </div>

            <div className="overflow-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#1f232b] sticky top-0 z-10">
                        <tr>
                            <th className="p-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Session Name</th>
                            <th className="p-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Time</th>
                            <th className="p-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Work Type</th>
                            <th className="p-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider text-right">Duration</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {sessions.length > 0 ? (
                            sessions.map((s) => (
                                <tr key={s.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                                    <td className="p-4 text-white font-medium">{s.name}</td>
                                    <td className="p-4 text-[var(--color-text-secondary)] text-sm">{formatDate(s.startTime)}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-bg-input)] text-white border border-[var(--color-border)]
                                            ${s.type === 'Deep Work' ? 'bg-purple-900/30 text-purple-300 border-purple-800' : ''}
                                            ${s.type === 'Light Work' ? 'bg-yellow-900/30 text-yellow-300 border-yellow-800' : ''}
                                            ${s.type === 'Coding' ? 'bg-blue-900/30 text-blue-300 border-blue-800' : ''}
                                        `}>
                                            {s.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-mono text-[var(--color-brand)]">
                                        {formatDuration(s.durationSeconds)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-[var(--color-text-secondary)]">
                                        <div className="w-16 h-16 bg-[var(--color-bg-input)] rounded-full flex items-center justify-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                        </div>
                                        <p className="text-lg font-medium text-white mb-1">No sessions yet</p>
                                        <p className="text-sm max-w-xs">Start your first work session by entering a name and clicking the Start button.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
