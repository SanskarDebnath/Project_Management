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
      case 'PRESENT':
      case 'PAID':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400';
      case 'IN_PROGRESS':
      case 'IN_EXECUTION':
      case 'WORK_FROM_HOME':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400';
      case 'SUBMITTED':
      case 'IN_REVIEW':
      case 'HALF_DAY':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-400';
      case 'REJECTED':
      case 'ABSENT':
        return 'bg-rose-500/10 text-rose-600 border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-400';
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/30 dark:bg-slate-500/20 dark:text-slate-400';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        getBadgeStyle(status),
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status.replace(/_/g, ' ')}
    </span>
  );
};
