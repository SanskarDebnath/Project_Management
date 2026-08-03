import React from 'react';
import { Outlet } from 'react-router-dom';

export const PublicLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center p-4 md:p-6 overflow-hidden">
      {/* Background ambient lighting blobs */}
      <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] bg-blue-500/15 dark:bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-amber-400/15 dark:bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Fullscreen Soft Backdrop Blur Layer */}
      <div className="absolute inset-0 backdrop-blur-xl bg-slate-100/60 dark:bg-slate-950/80 pointer-events-none z-0" />

      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <Outlet />
      </div>

      {/* PREVIOUS LAYOUT PRESERVED IN COMMENTS PER USER RULE:
      <div className="relative min-h-screen bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center p-4 md:p-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-blue-600/25 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-amber-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 backdrop-blur-2xl bg-slate-950/75 pointer-events-none z-0" />
        <div className="relative z-10 w-full flex flex-col items-center justify-center">
          <Outlet />
        </div>
      </div>
      */}
    </div>
  );
};


