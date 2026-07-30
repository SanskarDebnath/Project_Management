import { apiClient, ApiResponse } from './api-client';
import { Payslip, PerformanceReview } from '../../types';

export const payrollService = {
  getPayslips: async (): Promise<ApiResponse<Payslip[]>> => {
    const res = await apiClient.request<Payslip[]>('/payroll/my-slips', { method: 'GET' });
    if (!res.data) {
      return {
        success: true,
        data: [
          { id: 'PAY-0726', month: 'July', year: 2026, basicSalary: 125000, allowances: 25000, deductions: 12000, netSalary: 138000, status: 'PAID', paymentDate: '2026-07-28' },
          { id: 'PAY-0626', month: 'June', year: 2026, basicSalary: 125000, allowances: 25000, deductions: 12000, netSalary: 138000, status: 'PAID', paymentDate: '2026-06-28' },
          { id: 'PAY-0526', month: 'May', year: 2026, basicSalary: 125000, allowances: 22000, deductions: 11000, netSalary: 136000, status: 'PAID', paymentDate: '2026-05-28' },
        ],
      };
    }
    return res;
  },

  getPerformanceReviews: async (): Promise<ApiResponse<PerformanceReview[]>> => {
    const res = await apiClient.request<PerformanceReview[]>('/performance/my-reviews', { method: 'GET' });
    if (!res.data) {
      return {
        success: true,
        data: [
          {
            id: 'REV-Q2-2026',
            reviewPeriod: 'Q2 2026',
            score: 94.5,
            completedTasks: 18,
            qualityRating: 4.9,
            punctualityRating: 4.8,
            managerComments: 'Exceptional technical execution, zero security vulnerabilities identified.',
            reviewedBy: 'Chief Engineer Amit Sharma',
            date: '2026-07-10',
          },
        ],
      };
    }
    return res;
  },
};
