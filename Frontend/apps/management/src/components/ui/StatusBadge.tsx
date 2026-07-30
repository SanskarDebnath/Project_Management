import React from 'react';
import { cn } from '../../lib/utils';

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getBadgeStyle = (stat: string) => {
    switch (stat.toUpperCase()) {
      case 'APPROVED':
      case 'COMPLETED':
      case 'ACTIVE':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'CHECKER_VERIFIED':
      case 'IN_PROGRESS':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'SUBMITTED':
      case 'PENDING':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'REJECTED':
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border',
        getBadgeStyle(status),
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status.replace(/_/g, ' ')}
    </span>
  );
};
