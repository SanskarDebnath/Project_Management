import React, { useEffect, useState } from 'react';
import { attendanceService } from '../lib/api/attendance-service';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { AttendanceRecord } from '../types';
import { Clock, LogIn, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function AttendancePage() {
  const [logs, setLogs] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    attendanceService.getAttendanceLogs().then((res) => res.data && setLogs(res.data));
  }, []);

  const handleCheckIn = async () => {
    const res = await attendanceService.checkIn('Office Portal Check-in');
    if (res.success) toast.success('Logged check-in time successfully');
  };

  const handleCheckOut = async () => {
    const res = await attendanceService.checkOut();
    if (res.success) toast.success('Logged check-out time successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Attendance & Shift Logs</h1>
          <p className="text-xs text-slate-500">Record daily check-in and check-out timestamps.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleCheckIn} variant="primary">
            <LogIn className="w-4 h-4 mr-2" /> Check In
          </Button>
          <Button onClick={handleCheckOut} variant="outline">
            <LogOut className="w-4 h-4 mr-2" /> Check Out
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs uppercase font-semibold">
                <tr>
                  <th className="p-3.5">Log ID</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Check In</th>
                  <th className="p-3.5">Check Out</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="p-3.5 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{log.id}</td>
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">{log.date}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">{log.checkInTime}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">{log.checkOutTime || '--'}</td>
                    <td className="p-3.5"><StatusBadge status={log.status} /></td>
                    <td className="p-3.5 text-xs text-slate-500">{log.notes || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
