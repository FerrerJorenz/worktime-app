export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[var(--color-bg-dark)]/80 border-b border-[var(--color-border)]">
      <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">

        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-brand)] flex items-center justify-center text-[var(--color-bg-dark)] shadow-[0_0_15px_rgba(0,229,153,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-white tracking-tight">WorkTime</h1>
            <p className="text-xs text-[var(--color-text-secondary)] font-medium">Productivity Tracker</p>
          </div>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center gap-1">
            <li>
              <a href="#" className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-[var(--color-bg-input)] transition-all">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-input)] transition-all">
                Analytics
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-input)] transition-all">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500"></div>
                <span>Jorenz</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
