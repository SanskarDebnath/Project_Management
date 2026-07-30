import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/auth-store';
import { taskService } from '../lib/api/task-service';
import { attendanceService } from '../lib/api/attendance-service';
import { workorderService } from '../lib/api/workorder-service';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { CheckSquare, Clock, FileText, ArrowRight, Activity, TrendingUp } from 'lucide-react';
import { TaskItem, AttendanceRecord, WorkOrder } from '../types';
import { toast } from 'sonner';

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
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
            Department of Public Works
          </span>
          <h1 className="text-3xl font-extrabold mt-2 tracking-tight">Welcome, {user?.name}!</h1>
          <p className="text-sm text-indigo-100 mt-1 max-w-xl">
            {user?.designation} — Active project tracking and task execution dashboard.
          </p>
        </div>
        <Button onClick={handleQuickCheckIn} className="bg-white text-indigo-900 hover:bg-slate-100 font-bold px-6 py-3 shadow-lg">
          <Clock className="w-4 h-4 mr-2" /> Mark Today's Check-in
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-indigo-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 font-semibold">Active Tasks</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{tasks.length}</p>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 rounded-xl">
              <CheckSquare className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 font-semibold">Attendance Log</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">98.5%</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 font-semibold">Work Orders</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{workOrders.length}</p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-violet-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 font-semibold">Performance Score</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">94.5 / 100</p>
            </div>
            <div className="p-3 bg-violet-50 dark:bg-violet-950/60 text-violet-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Task & Work Order Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" /> High Priority Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{task.title}</h4>
                  <StatusBadge status={task.status} />
                </div>
                <p className="text-xs text-slate-500">{task.description}</p>
                <div className="flex justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/40 dark:border-slate-800">
                  <span>Project: {task.projectName}</span>
                  <span>Due: {task.dueDate}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Assigned Work Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" /> Active Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {workOrders.map((wo) => (
              <div key={wo.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">{wo.workOrderNumber}</span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{wo.title}</h4>
                  </div>
                  <StatusBadge status={wo.status} />
                </div>
                <p className="text-xs text-slate-500">{wo.description}</p>
                <div className="flex justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/40 dark:border-slate-800">
                  <span>Officer: {wo.assignedOfficer}</span>
                  <span>Est: ₹{(wo.costEstimate / 100000).toFixed(2)} Lakhs</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
