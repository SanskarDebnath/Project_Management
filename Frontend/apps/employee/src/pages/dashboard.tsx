import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/auth-store';
import { taskService } from '../lib/api/task-service';
import { attendanceService } from '../lib/api/attendance-service';
import { workorderService } from '../lib/api/workorder-service';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { CheckSquare, Clock, FileText, Activity, TrendingUp, ShieldCheck } from 'lucide-react';
import { TaskItem, AttendanceRecord, WorkOrder } from '../types';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  useEffect(() => {
    taskService.getTasks().then((res) => res.data && setTasks(res.data));
    attendanceService.getAttendanceLogs().then((res) => res.data && setAttendance(res.data));
    workorderService.getWorkOrders().then((res) => res.data && setWorkOrders(res.data));
  }, []);

  const handleQuickCheckIn = async () => {
    const res = await attendanceService.checkIn('Dashboard Quick Check-in');
    if (res.success) {
      toast.success('Successfully checked in for today!');
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-blue-900 dark:bg-slate-900 border border-blue-800 dark:border-slate-800 p-8 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div>
          <span className="px-3 py-1 rounded-full bg-blue-950 text-blue-200 text-xs font-bold border border-blue-700">
            Government of India — Employee Workspace
          </span>
          <h1 className="text-3xl font-extrabold mt-2 tracking-tight">Welcome back, {user?.name || 'Employee'}!</h1>
          <p className="text-sm text-blue-100 dark:text-slate-300 mt-1 max-w-xl">
            {user?.designation || 'Senior Software Engineer'} — Active project tracking and task execution workspace.
          </p>
        </div>
        <Button onClick={handleQuickCheckIn} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl shadow border-0 text-xs">

          <Clock className="w-4 h-4 mr-1.5 text-indigo-600" /> Mark Today's Check-in
        </Button>
      </motion.div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-indigo-500 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Active Tasks</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{tasks.length}</p>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <CheckSquare className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Attendance Log</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">98.5%</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-500 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Work Orders</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{workOrders.length}</p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-violet-500 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Performance Score</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">94.5 / 100</p>
            </div>
            <div className="p-3 bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Task & Work Order Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <Card className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <CardHeader className="px-0 pt-0 pb-4">
            <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Activity className="w-4 h-4 text-indigo-500" /> High Priority Assigned Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pt-0 space-y-3">
            {tasks.slice(0, 3).map((task, idx) => (
              <div key={task.id || `task-${idx}`} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{task.title}</h4>
                  <StatusBadge status={task.status || 'IN_PROGRESS'} />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{task.description}</p>
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Project: <strong className="text-slate-900 dark:text-slate-200">{task.projectName}</strong></span>
                  <span>Due: <strong className="text-indigo-600 dark:text-indigo-400">{task.dueDate}</strong></span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Assigned Work Orders */}
        <Card className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <CardHeader className="px-0 pt-0 pb-4">
            <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <FileText className="w-4 h-4 text-amber-500" /> Issued Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pt-0 space-y-3">
            {workOrders.map((wo, idx) => (
              <div key={wo.id || `wo-${idx}`} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">{wo.workOrderNumber || `WO-${idx + 1}`}</span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{wo.title}</h4>
                  </div>
                  <StatusBadge status={wo.status || 'APPROVED'} />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{wo.description}</p>
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Officer: <strong className="text-slate-900 dark:text-slate-200">{wo.assignedOfficer || 'Unassigned'}</strong></span>
                  <span>Est: <strong className="text-emerald-600 dark:text-emerald-400">₹{((wo.costEstimate || 0) / 100000).toFixed(2)} Lakhs</strong></span>
                </div>
              </div>
            ))}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}

