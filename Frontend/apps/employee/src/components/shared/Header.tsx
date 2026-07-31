import React, { useState } from 'react';
import { useAuthStore } from '../../stores/auth-store';
import { useAccessibility } from '../../hooks/useAccessibility';
import { Sun, Moon, LogOut, ExternalLink, User, AlertTriangle } from 'lucide-react';
import { MANAGEMENT_URL } from '../../lib/config';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useAccessibility();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-3 flex items-center justify-between shadow-sm dark:shadow-xl transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-900 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-xs shadow-sm">
            GOI
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-tight">
              PROJECT & BUDGET MANAGEMENT SYSTEM
            </h1>
            <p className="text-[11px] text-blue-700 dark:text-blue-400 font-bold tracking-wide">
              Government of India — Employee Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={MANAGEMENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
          >
            Management Portal <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 flex items-center gap-1 text-xs font-semibold"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden md:inline">Dark</span>
              </>
            )}
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
                onClick={() => setShowLogoutModal(true)}
                className="p-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/60 rounded-xl text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Confirm Logout</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Are you sure you want to end your session?</p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-sm"
              >
                Yes, Log Out
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs py-2.5 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


