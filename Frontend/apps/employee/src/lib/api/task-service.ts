import { apiClient, ApiResponse } from './api-client';
import { TaskItem } from '../../types';

export const taskService = {
  getTasks: async (): Promise<ApiResponse<TaskItem[]>> => {
    return apiClient.request<TaskItem[]>('/tasks/my-tasks', { method: 'GET' });
  },


  updateTaskStatus: async (taskId: string, status: string): Promise<ApiResponse> => {
    return apiClient.request(`/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: { status },
    });
  },
};
