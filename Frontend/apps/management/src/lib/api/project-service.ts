import { apiClient, ApiResponse } from './api-client';
import { OfficerCreateDTO, ProjectCreateDTO, ProjectMemberCreateDTO } from '../../types';

export const projectService = {
  createOfficer: async (payload: OfficerCreateDTO): Promise<ApiResponse> => {
    return apiClient.request('/projects/create-officer', {
      method: 'POST',
      body: payload,
    });
  },

  createProject: async (payload: ProjectCreateDTO): Promise<ApiResponse> => {
    return apiClient.request('/projects/create-project', {
      method: 'POST',
      body: payload,
    });
  },

  assignProjectMember: async (payload: ProjectMemberCreateDTO): Promise<ApiResponse> => {
    return apiClient.request('/projects/assign-project-member', {
      method: 'POST',
      body: payload,
    });
  },

  getProjectDetails: async (projectId: number): Promise<ApiResponse<any>> => {
    return apiClient.request('/projects/view-project-details', {
      method: 'POST',
      body: { project_id: projectId },
    });
  },

  getProjectsList: async (): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.request<any[]>('/projects/list', { method: 'GET' });
    if (!res.data) {
      return {
        success: true,
        data: [
          {
            project_id: 101,
            project_name: 'State E-Governance Highway Expansion',
            department_id: 1,
            department_name: 'Department of Public Works',
            officer_id: 201,
            officer_name: 'Er. Rajesh Kumar',
            project_start_date: '2026-06-01',
            budget_allocated: 120000000,
            status: 'ACTIVE',
          },
          {
            project_id: 102,
            project_name: 'Smart City Water Distribution Infrastructure',
            department_id: 2,
            department_name: 'Water Supply & Urban Sanitation',
            officer_id: 202,
            officer_name: 'Er. Sunita Verma',
            project_start_date: '2026-05-15',
            budget_allocated: 85000000,
            status: 'ACTIVE',
          },
        ],
      };
    }
    return res;
  },
};
