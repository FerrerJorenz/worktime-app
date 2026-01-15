import type { SessionFormData } from "./Dashboard";

type Props = {
    formData: SessionFormData;
    setFormData: (data: SessionFormData) => void;
    disabled: boolean;
    errors?: { name?: string, type?: string };
}

export default function SessionForm({ formData, setFormData, disabled, errors }: Props) {

    // Quick options for goal duration
    const goalOptions = [
        { label: "None", value: 0 },
        { label: "25 min", value: 25 * 60 },
        { label: "45 min", value: 45 * 60 },
        { label: "1 hour", value: 60 * 60 },
    ];

    const workTypes = ["Deep Work", "Light Work", "Meeting", "Study", "Coding"];

    return (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[var(--color-brand)] mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                Session Details
            </h2>

            <div className="space-y-4">
                {/* Session Name */}
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                        Session Name
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={disabled}
                        placeholder="What are you working on?"
                        className={`w-full px-4 py-3 bg-[var(--color-bg-input)] border rounded-xl outline-none text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed
                            ${errors?.name
                                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                : "border-[var(--color-border)] focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)]"
                            }`}
                    />
                    {errors?.name ? (
                        <p className="text-xs text-red-500 mt-1 ml-1">{errors.name}</p>
                    ) : (
                        !formData.name && <p className="text-xs text-[var(--color-text-secondary)] mt-1 ml-1">Enter a session name to start the timer</p>
                    )}
                </div>

                {/* Work Type */}
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                        Work Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {workTypes.map((type) => (
                            <button
                                key={type}
                                type="button"
                                disabled={disabled}
                                onClick={() => setFormData({ ...formData, type })}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.type === type
                                    ? "bg-[var(--color-brand)] text-[var(--color-bg-dark)] shadow-[0_0_10px_rgba(0,229,153,0.3)]"
                                    : "bg-[var(--color-bg-input)] text-[var(--color-text-secondary)] hover:bg-[#374151]"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {type === "Deep Work" && "🧠 "}
                                {type === "Light Work" && "🌤️ "}
                                {type === "Study" && "📚 "}
                                {type === "Coding" && "💻 "}
                                {type === "Meeting" && "👥 "}
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Goal Duration */}
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                        Goal Duration (optional)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            min="0"
                            disabled={disabled}
                            value={Math.floor(formData.goalDuration / 60)}
                            onChange={(e) => setFormData({ ...formData, goalDuration: Math.max(0, parseInt(e.target.value) * 60 || 0) })}
                            className="w-full pl-4 pr-16 py-3 bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-xl focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] outline-none text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] text-sm">minutes</span>
                    </div>

                    {/* Quick Selects */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {goalOptions.map(opt => (
                            <button
                                key={opt.label}
                                type="button"
                                disabled={disabled}
                                onClick={() => setFormData({ ...formData, goalDuration: opt.value })}
                                className={`px-3 py-1 rounded-md text-xs border transition-all ${formData.goalDuration === opt.value
                                    ? "border-[var(--color-brand)] text-[var(--color-brand)] bg-[rgba(0,229,153,0.1)]"
                                    : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[#374151]"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}