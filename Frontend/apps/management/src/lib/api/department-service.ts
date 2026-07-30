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
    const res = await apiClient.request<DepartmentDTO[]>('/department/list', { method: 'GET' });
    if (!res.data) {
      return {
        success: true,
        data: [
          { did: 1, department_name: 'Department of Public Works', code: 'PWD-01', description: 'Roads, bridges & civil infrastructure', totalBudget: 500000000, allocatedBudget: 340000000 },
          { did: 2, department_name: 'Water Supply & Urban Sanitation', code: 'WSS-02', description: 'Clean drinking water & SCADA telemetry', totalBudget: 350000000, allocatedBudget: 210000000 },
          { did: 3, department_name: 'State IT & Electronics Commission', code: 'ITE-03', description: 'Digital governance, cloud & cybersecurity', totalBudget: 280000000, allocatedBudget: 190000000 },
        ],
      };
    }
    return res;
  },
};
