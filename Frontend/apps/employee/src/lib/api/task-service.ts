import { apiClient, ApiResponse } from './api-client';
import { TaskItem } from '../../types';

export const taskService = {
  getTasks: async (): Promise<ApiResponse<TaskItem[]>> => {
    const res = await apiClient.request<TaskItem[]>('/tasks/my-tasks', { method: 'GET' });
    if (!res.data) {
      return {
        success: true,
        data: [
          {
            id: 'TSK-101',
            title: 'Implement AES-256 API Payload Encryption Layer',
            description: 'Secure native fetch requests with client-side AES-256 encryption & dynamic captcha.',
            projectId: 1,
            projectName: 'State E-Governance Highway Expansion',
            priority: 'HIGH',
            status: 'COMPLETED',
            dueDate: '2026-08-05',
            estimatedHours: 16,
            loggedHours: 16,
          },
          {
            id: 'TSK-102',
            title: 'Build Dual-Application Monorepo Structure',
            description: 'Set up Vite monorepo with employee and management applications.',
            projectId: 1,
            projectName: 'State E-Governance Highway Expansion',
            priority: 'URGENT',
            status: 'IN_PROGRESS',
            dueDate: '2026-08-01',
            estimatedHours: 24,
            loggedHours: 18,
          },
          {
            id: 'TSK-103',
            title: 'Optimize Database Query Indexes for Work Orders',
            description: 'Add composite indexes on work_order_id and project_id in PostgreSQL.',
            projectId: 2,
            projectName: 'Smart City Water Distribution Infrastructure',
            priority: 'MEDIUM',
            status: 'TODO',
            dueDate: '2026-08-10',
            estimatedHours: 12,
            loggedHours: 0,
          },
        ],
      };
    }
    return res;
  },

  updateTaskStatus: async (taskId: string, status: string): Promise<ApiResponse> => {
    return apiClient.request(`/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: { status },
    });
  },
};
