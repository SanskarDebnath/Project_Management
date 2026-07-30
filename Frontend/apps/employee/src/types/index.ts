export interface EmployeeUser {
  id: number;
  name: string;
  username: string;
  email: string;
  departmentId: number;
  departmentName: string;
  role: 'DEVELOPER' | 'OFFICER' | 'ENGINEER';
  designation: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  projectId: number;
  projectName: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED';
  dueDate: string;
  estimatedHours: number;
  loggedHours: number;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'ON_LEAVE' | 'WORK_FROM_HOME';
  notes?: string;
}

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  title: string;
  projectId: number;
  projectName: string;
  description: string;
  costEstimate: number;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'IN_EXECUTION' | 'COMPLETED' | 'REJECTED';
  assignedOfficer: string;
  createdAt: string;
}

export interface PerformanceReview {
  id: string;
  reviewPeriod: string;
  score: number;
  completedTasks: number;
  qualityRating: number;
  punctualityRating: number;
  managerComments: string;
  reviewedBy: string;
  date: string;
}

export interface Payslip {
  id: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'PAID' | 'PROCESSING';
  paymentDate: string;
}
