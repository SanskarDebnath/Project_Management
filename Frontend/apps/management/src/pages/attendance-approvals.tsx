import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle2, XCircle, Clock, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function AttendanceApprovalsPage() {
  const [logs, setLogs] = useState([
    { id: 'LOG-901', employeeName: 'Sanskar Debnath (Lead Developer)', date: '2026-07-31', checkIn: '09:00 AM', status: 'PENDING_APPROVAL', notes: 'Remote cloud deployment check-in' },
    { id: 'LOG-902', employeeName: 'Ananya Sharma (Senior Engineer)', date: '2026-07-31', checkIn: '09:15 AM', status: 'PENDING_APPROVAL', notes: 'On-site telematics field verification' },
    { id: 'LOG-903', employeeName: 'Rohan Gupta (QA Specialist)', date: '2026-07-31', checkIn: '09:30 AM', status: 'PENDING_APPROVAL', notes: 'Bridge sensor automated diagnostics' },
  ]);

  /* Legacy action handler commented out below for reference:
  const handleAction = (id: string, action: 'APPROVE' | 'REJECT') => { ... }
  */

  const handleAction = (id: string, action: 'APPROVE' | 'REJECT') => {
    setLogs(logs.filter((l) => l.id !== id));
    toast.success(`Attendance log ${id} ${action === 'APPROVE' ? 'Approved' : 'Rejected'}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Clock className="w-6 h-6 text-cyan-500" />
          Attendance Verification Queue (MOD-06)
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review employee shift logs, geo-fenced check-ins, and verify exception requests.
        </p>
      </div>

      <Card className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden p-6">
        <CardHeader className="px-0 pt-0 pb-4 border-b border-slate-200 dark:border-slate-800">
          <CardTitle className="text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            Pending Attendance Verification Requests ({logs.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pt-4">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-semibold">
              All attendance verification requests processed cleanly.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Log ID</th>
                    <th className="p-3.5">Employee Name</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Check In Time</th>
                    <th className="p-3.5">Verification Notes</th>
                    <th className="p-3.5 text-right rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-cyan-600 dark:text-cyan-400">{log.id}</td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">{log.employeeName}</td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">{log.date}</td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300 font-semibold">{log.checkIn}</td>
                      <td className="p-3.5 text-slate-500 dark:text-slate-400">{log.notes}</td>
                      <td className="p-3.5 text-right space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleAction(log.id, 'APPROVE')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAction(log.id, 'REJECT')}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

