import React, { useEffect, useState } from 'react';
import { auditService } from '../lib/api/audit-service';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { AuditLogItem } from '../types';
import { ShieldCheck, Search } from 'lucide-react';

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">System Audit Trail & Security Logs (MOD-09)</h1>
          <p className="text-xs text-slate-400">Immutable ledger of state administrative actions and encryption verifications.</p>
        </div>
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search audit logs..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> Cryptographic System Audit Ledger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-300 text-xs uppercase font-semibold">
                <tr>
                  <th className="p-3.5">Log ID</th>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Actor</th>
                  <th className="p-3.5">Module</th>
                  <th className="p-3.5">Action</th>
                  <th className="p-3.5">IP Address</th>
                  <th className="p-3.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="p-3.5 font-mono text-xs text-cyan-400 font-bold">{log.id}</td>
                    <td className="p-3.5 text-xs text-slate-400">{log.timestamp}</td>
                    <td className="p-3.5 font-semibold text-slate-100">{log.actor} ({log.role})</td>
                    <td className="p-3.5 text-xs text-slate-300">{log.module}</td>
                    <td className="p-3.5"><StatusBadge status={log.action} /></td>
                    <td className="p-3.5 font-mono text-xs text-slate-400">{log.ipAddress}</td>
                    <td className="p-3.5 text-xs text-slate-300">{log.details}</td>
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
