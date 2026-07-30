import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/auth-store';
import { departmentService } from '../lib/api/department-service';
import { projectService } from '../lib/api/project-service';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { Building2, DollarSign, FolderKanban, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { ManagementRole } from '../lib/constants';

export default function DashboardPage() {
  const { user, activeRole } = useAuthStore();
  const [departments, setDepartments] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    departmentService.getDepartmentsList().then((res) => res.data && setDepartments(res.data));
    projectService.getProjectsList().then((res) => res.data && setProjects(res.data));
  }, []);

  const totalBudget = departments.reduce((acc, curr) => acc + (curr.totalBudget || 0), 0);
  const totalAllocated = departments.reduce((acc, curr) => acc + (curr.allocatedBudget || 0), 0);

  return (
    <div className="space-y-8">
      {/* Executive Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 p-8 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
              Active Mode: {activeRole}
            </span>
            <span className="text-xs text-slate-400">Department of Public Works</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-2 tracking-tight">Executive Management Overview</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-time project tracking, department allocations, and multi-tier approval control center.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-cyan-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400 font-semibold">Total State Budget</p>
              <p className="text-2xl font-bold text-slate-100 mt-1">{formatCurrency(totalBudget)}</p>
            </div>
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400 font-semibold">Allocated Budget</p>
              <p className="text-2xl font-bold text-slate-100 mt-1">{formatCurrency(totalAllocated)}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400 font-semibold">Active Departments</p>
              <p className="text-2xl font-bold text-slate-100 mt-1">{departments.length}</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400 font-semibold">Active Projects</p>
              <p className="text-2xl font-bold text-slate-100 mt-1">{projects.length}</p>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <FolderKanban className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" /> State Department Budget Caps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {departments.map((dept) => (
              <div key={dept.did} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">{dept.code}</span>
                    <h4 className="text-sm font-bold text-slate-100">{dept.department_name}</h4>
                  </div>
                  <StatusBadge status="ACTIVE" />
                </div>
                <p className="text-xs text-slate-400">{dept.description}</p>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Total: {formatCurrency(dept.totalBudget)}</span>
                  <span className="text-emerald-400">Allocated: {formatCurrency(dept.allocatedBudget)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-purple-400" /> Infrastructure Projects (MOD-03)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.project_id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 font-bold">PROJ-#{proj.project_id}</span>
                    <h4 className="text-sm font-bold text-slate-100">{proj.project_name}</h4>
                  </div>
                  <StatusBadge status={proj.status} />
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                  <span>Officer: <strong className="text-slate-200">{proj.officer_name}</strong></span>
                  <span>Budget: <strong className="text-emerald-400">{formatCurrency(proj.budget_allocated)}</strong></span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
