import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/shared/Header';
import { Sidebar } from '../components/shared/Sidebar';

export const AuthenticatedLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
