import React, { useEffect, useState } from 'react';
import { departmentService } from '../lib/api/department-service';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { DepartmentDTO } from '../types';
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export default function BudgetsPage() {
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);

  useEffect(() => {
    departmentService.getDepartmentsList().then((res) => res.data && setDepartments(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Budget Tracking & Allocations (MOD-02)</h1>
        <p className="text-xs text-slate-400">Department budget caps, utilized funds, and variance tracking.</p>
      </div>

      <div className="space-y-4">
        {departments.map((dept) => {
          const percentUsed = Math.min(100, Math.round((dept.allocatedBudget / dept.totalBudget) * 100));
          return (
            <Card key={dept.did} className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400">{dept.code}</span>
                  <h3 className="text-lg font-bold text-slate-100">{dept.department_name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-semibold">Total Sanctioned Budget</p>
                  <p className="text-xl font-extrabold text-cyan-400">{formatCurrency(dept.totalBudget)}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-semibold">
                  <span>Utilized: {formatCurrency(dept.allocatedBudget)} ({percentUsed}%)</span>
                  <span>Remaining: {formatCurrency(dept.totalBudget - dept.allocatedBudget)}</span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${percentUsed}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
