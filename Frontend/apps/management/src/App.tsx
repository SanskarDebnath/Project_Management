import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { AuthenticatedLayout } from './layouts/AuthenticatedLayout';
import { ProtectedRoute, PublicOnlyRoute } from './components/shared/ProtectedRoute';
import { useAuthStore } from './stores/auth-store';
import { Toaster } from 'sonner';

const LoginPage = lazy(() => import('./pages/login'));
const DashboardPage = lazy(() => import('./pages/dashboard'));
const DepartmentsPage = lazy(() => import('./pages/departments'));
const BudgetsPage = lazy(() => import('./pages/budgets'));
const ProjectsPage = lazy(() => import('./pages/projects'));
const AttendanceApprovalsPage = lazy(() => import('./pages/attendance-approvals'));
const PerformanceManagementPage = lazy(() => import('./pages/performance-management'));
const AuditTrailPage = lazy(() => import('./pages/audit-trail'));
const AnalyticsReportsPage = lazy(() => import('./pages/analytics-reports'));

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
          <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
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
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/budgets" element={<BudgetsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/attendance-approvals" element={<AttendanceApprovalsPage />} />
              {/* Uncreated backend modules commented out per user instruction:
              <Route path="/performance-management" element={<PerformanceManagementPage />} />
              <Route path="/audit-trail" element={<AuditTrailPage />} />
              <Route path="/analytics-reports" element={<AnalyticsReportsPage />} />
              */}

            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
