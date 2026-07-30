import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, DollarSign, FolderKanban, CheckCircle2, Award, ShieldCheck, BarChart3 } from 'lucide-react';
import { useAuthStore } from '../../stores/auth-store';
import { ManagementRole } from '../../lib/constants';

export const Sidebar: React.FC = () => {
  const { activeRole } = useAuthStore();

  const navItems = [
    { label: 'Executive Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Departments (MOD-01)', path: '/departments', icon: Building2 },
    { label: 'Budgets (MOD-02)', path: '/budgets', icon: DollarSign },
    { label: 'Projects (MOD-03)', path: '/projects', icon: FolderKanban },
    { label: 'Attendance Approvals', path: '/attendance-approvals', icon: CheckCircle2 },
    { label: 'Performance Appraisal', path: '/performance-management', icon: Award },
    { label: 'Audit Log (MOD-09)', path: '/audit-trail', icon: ShieldCheck },
    { label: 'Analytics & Reports', path: '/analytics-reports', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur-md min-h-[calc(100vh-57px)] p-4 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="px-3 mb-3 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Navigation</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
            activeRole === ManagementRole.APPROVER ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'
          }`}>
            {activeRole}
          </span>
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
        <p className="text-xs font-bold text-cyan-400">Security Encrypted</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Role-gated action approvals & audit logging enabled.</p>
      </div>
    </aside>
  );
};
