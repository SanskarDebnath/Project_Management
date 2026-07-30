import React from 'react';
import { useAuthStore } from '../../stores/auth-store';
import { useAccessibility } from '../../hooks/useAccessibility';
import { ManagementRole } from '../../lib/constants';
import { EMPLOYEE_URL } from '../../lib/config';
import { Sun, Moon, LogOut, Shield, ExternalLink, UserCheck, ShieldAlert } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, activeRole, setActiveRole, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useAccessibility();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-6 py-3 flex items-center justify-between shadow-xl">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-cyan-500/20">
          MG
        </div>
        <div>
          <h1 className="font-bold text-sm text-slate-100 leading-tight">
            PM-SYS Enterprise Portal
          </h1>
          <p className="text-[11px] text-cyan-400 font-semibold tracking-wide">
            Management & Budget Control
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Role Switcher Pill */}
        <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700 flex items-center gap-1">
          <button
            onClick={() => setActiveRole(ManagementRole.CHECKER)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeRole === ManagementRole.CHECKER
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Checker Mode
          </button>
          <button
            onClick={() => setActiveRole(ManagementRole.APPROVER)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeRole === ManagementRole.APPROVER
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Approver Mode
          </button>
        </div>

        <a
          href={EMPLOYEE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
        >
          Employee Portal <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-slate-100">{user.name}</p>
              <p className="text-[10px] text-cyan-400 font-semibold">{user.designation}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-rose-400 hover:bg-rose-950/50 transition-colors"
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
