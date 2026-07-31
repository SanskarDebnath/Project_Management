import React, { useEffect, useState } from 'react';
import { auditService } from '../lib/api/audit-service';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { AuditLogItem } from '../types';
import { ShieldCheck, Search, Lock } from 'lucide-react';

export default function AuditTrailPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    auditService.getAuditLogs().then((res) => res.data && setLogs(res.data));
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.actor.toLowerCase().includes(filter.toLowerCase()) ||
      l.action.toLowerCase().includes(filter.toLowerCase()) ||
      l.module.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-500" />
            System Audit Trail & Security Logs (MOD-09)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Immutable ledger of state administrative actions and encryption verifications.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search audit logs..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
          />
        </div>
      </div>

      <Card className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden p-6">
        <CardHeader className="px-0 pt-0 pb-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <CardTitle className="text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-500" /> Cryptographic System Audit Ledger
          </CardTitle>
          <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold bg-cyan-50 dark:bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-200 dark:border-cyan-800">
            SHA-256 Validated
          </span>
        </CardHeader>
        <CardContent className="px-0 pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Log ID</th>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Actor</th>
                  <th className="p-3.5">Module</th>
                  <th className="p-3.5">Action</th>
                  <th className="p-3.5">IP Address</th>
                  <th className="p-3.5 rounded-r-xl">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-cyan-600 dark:text-cyan-400">{log.id}</td>
                    <td className="p-3.5 text-slate-500 dark:text-slate-400">{log.timestamp}</td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">{log.actor} <span className="text-[10px] text-slate-500 font-normal">({log.role})</span></td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300">{log.module}</td>
                    <td className="p-3.5"><StatusBadge status={log.action} /></td>
                    <td className="p-3.5 font-mono text-slate-500 dark:text-slate-400">{log.ipAddress}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">{log.details}</td>
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

