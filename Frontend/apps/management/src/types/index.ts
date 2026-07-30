import { ManagementRole } from '../lib/constants';

export interface ManagementUser {
  id: number;
  name: string;
  username: string;
  email: string;
  role: ManagementRole;
  departmentId: number;
  departmentName: string;
  designation: string;
}

export interface DepartmentDTO {
  did?: number;
  department_name: string;
  code: string;
  description: string;
  totalBudget: number;
  allocatedBudget: number;
}

export interface OfficerCreateDTO {
  officer_name: string;
  department_id: number;
  officer_status?: string;
}

export interface ProjectCreateDTO {
  project_name: string;
  department_id: number;
  officer_id: number;
  project_start_date: string;
  budget_allocated: number;
}

export interface ProjectMemberCreateDTO {
  project_id: number;
  developer_id: number;
  assigned_by_officer: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  module: string;
  ipAddress: string;
  details: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface DepartmentAnalyticsReport {
  departmentName: string;
  totalBudgetAllocated: number;
  totalSpent: number;
  activeProjectsCount: number;
  completedProjectsCount: number;
  officersCount: number;
  developersCount: number;
}
