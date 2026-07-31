import React from 'react';
import { useAuthStore } from '../stores/auth-store';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { User, Mail, Shield, Building, Award } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Employee Profile</h1>
        <p className="text-xs text-slate-500">System account credentials and organizational attribution.</p>
      </div>

      <Card className="space-y-6">
        <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-20 h-20 rounded-2xl bg-blue-900 text-amber-400 border border-amber-500/40 flex items-center justify-center font-extrabold text-2xl shadow-md">
            {user?.name.charAt(0) || 'E'}
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{user?.name}</h2>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{user?.designation}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Role: {user?.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3">
            <Mail className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold">Email Address</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.email}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3">
            <Building className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold">Department</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.departmentName}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
