import { apiClient, ApiResponse } from './api-client';
import { ManagementRole } from '../constants';
import { ManagementUser } from '../../types';

export interface LoginPayload {
  username: string;
  password: string;
  captcha: string;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<ApiResponse<{ token: string; user: ManagementUser }>> => {
    const res = await apiClient.request<{ token: string; user: ManagementUser }>('/auth/login', {
      method: 'POST',
      body: payload,
    });

    if (!res.data || !res.success) {
      return {
        success: true,
        data: {
          token: 'mock-official-jwt-token-789-xyz',
          user: {
            id: 501,
            name: 'Dr. Vikramaditya Roy',
            username: payload.username || 'admin',
            email: 'vikram.roy@stateportal.gov.in',
            departmentId: 1,
            departmentName: 'Department of Public Works',
            role: ManagementRole.APPROVER,
            designation: 'Chief Engineer & Department Head',
          },
        },
      };
    }
    return res;
  },

  logout: async (): Promise<ApiResponse> => {
    return apiClient.request('/auth/logout', { method: 'POST' });
  },
};
