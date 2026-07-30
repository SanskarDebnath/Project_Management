import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { AuthenticatedLayout } from './layouts/AuthenticatedLayout';
import { ProtectedRoute, PublicOnlyRoute } from './components/shared/ProtectedRoute';
import { useAuthStore } from './stores/auth-store';
import { Toaster } from 'sonner';

const LoginPage = lazy(() => import('./pages/login'));
const DashboardPage = lazy(() => import('./pages/dashboard'));
const TasksPage = lazy(() => import('./pages/tasks'));
const AttendancePage = lazy(() => import('./pages/attendance'));
const WorkOrdersPage = lazy(() => import('./pages/work-orders'));
const PerformancePage = lazy(() => import('./pages/performance'));
const PayrollPage = lazy(() => import('./pages/payroll'));
const ProfilePage = lazy(() => import('./pages/profile'));

export default function App() {
  const { hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>
          </Route>

          {/* Authenticated Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AuthenticatedLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/work-orders" element={<WorkOrdersPage />} />
              <Route path="/performance" element={<PerformancePage />} />
              <Route path="/payroll" element={<PayrollPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
