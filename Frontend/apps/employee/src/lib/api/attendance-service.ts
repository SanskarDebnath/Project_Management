import { apiClient, ApiResponse } from './api-client';
import { AttendanceRecord } from '../../types';

export const attendanceService = {
  getAttendanceLogs: async (): Promise<ApiResponse<AttendanceRecord[]>> => {
    return apiClient.request<AttendanceRecord[]>('/attendance/my-logs', { method: 'GET' });
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
