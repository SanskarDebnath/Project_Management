import React, { useState } from 'react';
import { useAuthStore } from '../../stores/auth-store';
import { useAccessibility } from '../../hooks/useAccessibility';
import { ManagementRole } from '../../lib/constants';
import { EMPLOYEE_URL } from '../../lib/config';
import { Sun, Moon, LogOut, ExternalLink, AlertTriangle } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, activeRole, setActiveRole, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useAccessibility();
  const [modeInfoModal, setModeInfoModal] = useState<'CHECKER' | 'APPROVER' | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  return (
    <>
      {/* ... Existing header JSX below ... */}
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
              Government of India — Departmental Control Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Role Switcher Pill with Info Trigger */}
          <div className="bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1">
            <div className="flex items-center">
              <button
                onClick={() => {
                  setActiveRole(ManagementRole.CHECKER);
                  setModeInfoModal('CHECKER');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeRole === ManagementRole.CHECKER
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Checker Mode
              </button>
            </div>

            <div className="flex items-center">
              <button
                onClick={() => {
                  setActiveRole(ManagementRole.APPROVER);
                  setModeInfoModal('APPROVER');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeRole === ManagementRole.APPROVER
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Approver Mode
              </button>
            </div>
          </div>

          <a
            href={EMPLOYEE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Employee Portal <ExternalLink className="w-3.5 h-3.5" />
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
                <p className="text-[10px] text-blue-700 dark:text-cyan-400 font-semibold">{user.designation}</p>
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

      {/* Mode Information Modal */}
      {modeInfoModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex justify-between items-start pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  modeInfoModal === 'CHECKER' ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                }`}>
                  Governance Role — {modeInfoModal} MODE
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {modeInfoModal === 'CHECKER' ? 'Checker Verification Mode' : 'Approver Sanction Mode'}
                </h3>
              </div>
              <button
                onClick={() => setModeInfoModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {modeInfoModal === 'CHECKER' ? (
                <>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    <strong>Primary Responsibility:</strong> First-Stage Verification & Compliance Audit.
                  </p>
                  <ul className="list-disc pl-4 space-y-1.5 text-slate-600 dark:text-slate-400">
                    <li>Inspect detailed project allocations, work order estimates, and financial vouchers.</li>
                    <li>Verify employee attendance logs and geo-fenced exception requests.</li>
                    <li>Append audit notes and flag discrepancies prior to executive sanction.</li>
                    <li>Non-binding stage: Prepares verified records for final departmental approval.</li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    <strong>Primary Responsibility:</strong> Executive Sanction & Binding Authorization.
                  </p>
                  <ul className="list-disc pl-4 space-y-1.5 text-slate-600 dark:text-slate-400">
                    <li>Sanction state funds and execute binding budget cap adjustments.</li>
                    <li>Digitally sign work order contracts with SHA-256 cryptographic verification.</li>
                    <li>Authorize or reject attendance exception requests and project milestone sign-offs.</li>
                    <li>Binding stage: Final state authority for departmental expenditure and policy execution.</li>
                  </ul>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setModeInfoModal(null)}
                className="bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm"
              >
                Acknowledge & Continue
              </button>
            </div>
          </div>
        </div>
      )}

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



