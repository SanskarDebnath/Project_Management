import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AttendanceApprovalsPage() {
  const [logs, setLogs] = useState([
    { id: 'LOG-901', employeeName: 'Sanskar (Developer)', date: '2026-07-30', checkIn: '09:00 AM', status: 'PENDING_APPROVAL', notes: 'Remote deployment check-in' },
    { id: 'LOG-902', employeeName: 'Ananya Sharma (Engineer)', date: '2026-07-30', checkIn: '09:15 AM', status: 'PENDING_APPROVAL', notes: 'On-site field verification' },
  ]);

  const handleAction = (id: string, action: 'APPROVE' | 'REJECT') => {
    setLogs(logs.filter((l) => l.id !== id));
    toast.success(`Attendance log ${id} ${action === 'APPROVE' ? 'Approved' : 'Rejected'}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Attendance Verification Queue (MOD-06)</h1>
        <p className="text-xs text-slate-400">Review employee shift logs and verify attendance exceptions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pending Attendance Verification Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-300 text-xs uppercase font-semibold">
                <tr>
                  <th className="p-3.5">Log ID</th>
                  <th className="p-3.5">Employee Name</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Check In Time</th>
                  <th className="p-3.5">Notes</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="p-3.5 font-mono text-xs text-cyan-400 font-bold">{log.id}</td>
                    <td className="p-3.5 font-semibold text-slate-100">{log.employeeName}</td>
                    <td className="p-3.5 text-slate-300">{log.date}</td>
                    <td className="p-3.5 text-slate-300">{log.checkIn}</td>
                    <td className="p-3.5 text-xs text-slate-400">{log.notes}</td>
                    <td className="p-3.5 text-right space-x-2">
                      <Button size="sm" variant="success" onClick={() => handleAction(log.id, 'APPROVE')}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleAction(log.id, 'REJECT')}>Reject</Button>
                    </td>
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
