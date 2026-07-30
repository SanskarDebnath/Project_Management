import React from 'react';
import { useAuthStore } from '../../stores/auth-store';
import { useAccessibility } from '../../hooks/useAccessibility';
import { Sun, Moon, LogOut, ExternalLink, ShieldCheck, User } from 'lucide-react';
import { MANAGEMENT_URL } from '../../lib/config';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useAccessibility();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
          PM
        </div>
        <div>
          <h1 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-tight">
            PM-SYS Enterprise Portal
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Employee Workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <a
          href={MANAGEMENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 hover:bg-indigo-100 transition-colors"
        >
          Management Portal <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{user.designation}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-semibold text-xs">
              <User className="w-4 h-4" />
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
