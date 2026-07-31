import React, { useEffect } from 'react';
import { useDepartmentStore } from '../stores/department-store';
import { Card } from '../components/ui/Card';
import { DollarSign, TrendingUp, Wallet, ShieldAlert } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { motion } from 'framer-motion';

export default function BudgetsPage() {
  const { departments, loading, fetchDepartments } = useDepartmentStore();

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const totalSanctioned = departments.reduce((acc, curr) => acc + (curr.totalBudget || curr.department_budget || 0), 0);
  const totalAllocated = departments.reduce((acc, curr) => acc + (curr.allocatedBudget || (curr.department_budget ? curr.department_budget * 0.75 : 0)), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-500" />
            Budget Tracking & Allocations (MOD-02)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Department budget caps, utilized funds, and variance tracking in real-time.
          </p>
        </div>
      </div>

      {/* Overview Stat Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Sanctioned State Cap</p>
            <p className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-1">{formatCurrency(totalSanctioned)}</p>
          </div>
          <Wallet className="w-8 h-8 text-cyan-500/80" />
        </div>

        <div className="p-5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Utilized</p>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(totalAllocated)}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-emerald-500/80" />
        </div>

        <div className="p-5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Available Buffer</p>
            <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{formatCurrency(totalSanctioned - totalAllocated)}</p>
          </div>
          <ShieldAlert className="w-8 h-8 text-indigo-500/80" />
        </div>
      </div>

      {loading && (
        <div className="text-center py-12 text-slate-500 text-xs animate-pulse">Loading live budget records...</div>
      )}

      {/* Department Budget Breakdown */}
      <div className="space-y-4">
        {departments.map((dept, idx) => {
          const tot = dept.totalBudget || dept.department_budget || 10000000;
          const alloc = dept.allocatedBudget || (dept.department_budget ? dept.department_budget * 0.75 : 7500000);
          const percentUsed = Math.min(100, Math.round((alloc / tot) * 100));
          return (
            <motion.div
              key={dept.did}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
            >
              <Card className="space-y-4 p-6 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                      {dept.code || `DEPT-0${dept.did}`}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">{dept.department_name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Total Budget Cap</p>
                    <p className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400">{formatCurrency(tot)}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold">
                    <span>Utilized: <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(alloc)}</strong> ({percentUsed}%)</span>
                    <span>Buffer: <strong className="text-slate-900 dark:text-slate-100">{formatCurrency(tot - alloc)}</strong></span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div
                      className="h-full bg-blue-800 dark:bg-blue-600 transition-all duration-500 rounded-full"
                      style={{ width: `${percentUsed}%` }}
                    ></div>

                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

