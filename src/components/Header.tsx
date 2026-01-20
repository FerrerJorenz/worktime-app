import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full bg-[var(--color-bg-card)] border-b border-[var(--color-border)] sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-brand)] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,229,153,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-bg-dark)]">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">WorkTime</h1>
            <p className="text-xs text-[var(--color-text-secondary)]">Productivity Tracker</p>
          </div>
        </div>

        {/* User Info and Logout */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">{user.email}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-brand)] to-purple-500 rounded-full flex items-center justify-center text-[var(--color-bg-dark)] font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[var(--color-bg-input)] hover:bg-[#374151] text-[var(--color-text-secondary)] hover:text-white border border-[var(--color-border)] rounded-lg transition-all flex items-center gap-2"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
