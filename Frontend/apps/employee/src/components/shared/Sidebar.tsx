import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Clock, FileText, Award, DollarSign, User } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Attendance Log', path: '/attendance', icon: Clock },
    { label: 'Work Orders', path: '/work-orders', icon: FileText },
    /* Uncreated backend modules commented out per user instruction:
    { label: 'Performance Review', path: '/performance', icon: Award },
    { label: 'Payroll & Slips', path: '/payroll', icon: DollarSign },
    */
    { label: 'My Profile', path: '/profile', icon: User },
  ];


  return (
    <aside className="w-64 border-r border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md min-h-[calc(100vh-57px)] p-4 flex flex-col justify-between">
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Navigation</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <p className="text-xs font-bold text-blue-900 dark:text-blue-200">Need Help?</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Contact IT Support Desk for access requests.</p>
      </div>

    </aside>
  );
};
