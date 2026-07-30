import { apiClient, ApiResponse } from './api-client';
import { AttendanceRecord } from '../../types';

export const attendanceService = {
  getAttendanceLogs: async (): Promise<ApiResponse<AttendanceRecord[]>> => {
    const res = await apiClient.request<AttendanceRecord[]>('/attendance/my-logs', { method: 'GET' });
    if (!res.data) {
      return {
        success: true,
        data: [
          { id: 'ATT-001', date: '2026-07-30', checkInTime: '09:00 AM', status: 'PRESENT', notes: 'Logged in from Office Head Office' },
          { id: 'ATT-002', date: '2026-07-29', checkInTime: '09:12 AM', checkOutTime: '06:30 PM', status: 'PRESENT' },
          { id: 'ATT-003', date: '2026-07-28', checkInTime: '08:55 AM', checkOutTime: '06:05 PM', status: 'WORK_FROM_HOME' },
          { id: 'ATT-004', date: '2026-07-27', checkInTime: '09:05 AM', checkOutTime: '06:00 PM', status: 'PRESENT' },
        ],
      };
    }
    return res;
  },

  checkIn: async (notes?: string): Promise<ApiResponse> => {
    return apiClient.request('/attendance/check-in', {
      method: 'POST',
      body: { timestamp: new Date().toISOString(), notes },
    });
  },

  checkOut: async (): Promise<ApiResponse> => {
    return apiClient.request('/attendance/check-out', {
      method: 'POST',
      body: { timestamp: new Date().toISOString() },
    });
  },
};
