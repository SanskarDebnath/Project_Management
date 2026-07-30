import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ type = 'info', title, children, className }) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-950/40 border-emerald-800 text-emerald-200',
          icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-950/40 border-amber-800 text-amber-200',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        };
      case 'error':
        return {
          bg: 'bg-rose-950/40 border-rose-800 text-rose-200',
          icon: <AlertCircle className="w-5 h-5 text-rose-400" />,
        };
      default:
        return {
          bg: 'bg-cyan-950/40 border-cyan-800 text-cyan-200',
          icon: <Info className="w-5 h-5 text-cyan-400" />,
        };
    }
  };

  const style = getAlertStyles();

  return (
    <div className={cn('p-4 rounded-xl border flex items-start gap-3 text-sm', style.bg, className)}>
      <div className="shrink-0 mt-0.5">{style.icon}</div>
      <div>
        {title && <h4 className="font-bold mb-1">{title}</h4>}
        <div className="text-xs leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
