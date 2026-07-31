import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/auth-store';
import { useDepartmentStore } from '../stores/department-store';
import { useProjectStore } from '../stores/project-store';
import { useWorkOrderStore } from '../stores/work-order-store';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Building2, DollarSign, FolderKanban, TrendingUp, ShieldCheck, FileCheck2, Activity } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user, activeRole } = useAuthStore();
  const { departments, fetchDepartments } = useDepartmentStore();
  const { projects, fetchProjects } = useProjectStore();
  const { workOrders, fetchWorkOrders } = useWorkOrderStore();

  useEffect(() => {
    fetchDepartments();
    fetchProjects();
    fetchWorkOrders();
  }, [fetchDepartments, fetchProjects, fetchWorkOrders]);

  const totalBudget = departments.reduce((acc, curr) => acc + (curr.totalBudget || curr.department_budget || 0), 0);
  const totalAllocated = departments.reduce((acc, curr) => acc + (curr.allocatedBudget || (curr.department_budget ? curr.department_budget * 0.75 : 0)), 0);

  return (
    <div className="space-y-8">
      {/* Executive Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-blue-950 dark:bg-slate-900 border border-blue-900 dark:border-slate-800 p-8 shadow-md text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-900 text-blue-200 text-xs font-bold border border-blue-700">
              Active Mode: {activeRole}
            </span>
            <span className="text-xs text-blue-200">Government of India — Central Oversight System</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-2 tracking-tight">Executive Management Overview</h1>
          <p className="text-xs text-blue-100 dark:text-slate-300 mt-1 max-w-xl">
            Real-time project tracking, department budget caps, and multi-tier action control center.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-900/90 dark:bg-slate-800/80 px-4 py-2.5 rounded-xl border border-blue-800 dark:border-slate-700">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-100">Session Security Active</span>
        </div>
      </motion.div>


      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-cyan-500 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Total State Budget</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">{formatCurrency(totalBudget)}</p>
            </div>
            <div className="p-3 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Allocated Budget</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">{formatCurrency(totalAllocated)}</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-500 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Active Departments</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{departments.length}</p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-indigo-500 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Infrastructure Projects</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{projects.length}</p>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <FolderKanban className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Overview */}
        <Card className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Building2 className="w-4 h-4 text-cyan-500" /> State Department Budget Caps
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pt-3 space-y-3">
            {departments.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs font-semibold">
                No departments currently registered in database.
              </div>
            ) : (
              departments.map((dept) => (
                <div key={dept.did} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">{dept.code || `DEPT-0${dept.did}`}</span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{dept.department_name}</h4>
                    </div>
                    <StatusBadge status="ACTIVE" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{dept.description}</p>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-400">Total: {formatCurrency(dept.totalBudget || dept.department_budget || 0)}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">Allocated: {formatCurrency(dept.allocatedBudget || (dept.department_budget ? dept.department_budget * 0.75 : 0))}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <FolderKanban className="w-4 h-4 text-indigo-500" /> Infrastructure Projects (MOD-03)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pt-3 space-y-3">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs font-semibold">
                No projects currently registered in database.
              </div>
            ) : (
              projects.map((proj) => (
                <div key={proj.project_id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">PROJ-#{proj.project_id}</span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{proj.project_name}</h4>
                    </div>
                    <StatusBadge status={proj.project_status || 'IN_PROGRESS'} />
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Officer: <strong className="text-slate-900 dark:text-slate-200">{proj.officer_name || proj.officer_id}</strong></span>
                    <span>Budget: <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(proj.project_budget || 0)}</strong></span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>

  );
}

