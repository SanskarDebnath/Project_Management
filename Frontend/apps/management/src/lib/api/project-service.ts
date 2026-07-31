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
    return apiClient.request<any[]>('/projects/list', { method: 'GET' });
  },

};
