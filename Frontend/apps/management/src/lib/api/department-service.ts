import { apiClient, ApiResponse } from './api-client';
import { DepartmentDTO } from '../../types';

export const departmentService = {
  createDepartment: async (payload: DepartmentDTO): Promise<ApiResponse> => {
    return apiClient.request('/department/add-department', {
      method: 'POST',
      body: payload,
    });
  },

  viewDepartment: async (did: number): Promise<ApiResponse<DepartmentDTO>> => {
    return apiClient.request('/department/view-department', {
      method: 'POST',
      body: { did },
    });
  },

  editDepartment: async (payload: Partial<DepartmentDTO>): Promise<ApiResponse> => {
    return apiClient.request('/department/edit-department', {
      method: 'POST',
      body: payload,
    });
  },

  getDepartmentsList: async (): Promise<ApiResponse<DepartmentDTO[]>> => {
    return apiClient.request<DepartmentDTO[]>('/department/list', { method: 'GET' });
  },

};
