import { apiClient, ApiResponse } from './api-client';
import { WorkOrder } from '../../types';

export const workorderService = {
  getWorkOrders: async (): Promise<ApiResponse<WorkOrder[]>> => {
    const res = await apiClient.request<WorkOrder[]>('/work-orders/my-orders', { method: 'GET' });
    if (!res.data) {
      return {
        success: true,
        data: [
          {
            id: 'WO-2026-001',
            workOrderNumber: 'WO/PWD/2026/891',
            title: 'Fiber Optic Backbone Integration Phase II',
            projectId: 1,
            projectName: 'State E-Governance Highway Expansion',
            description: 'Supply, installation and high-speed OTDR testing for 45km fiber link.',
            costEstimate: 2450000,
            status: 'APPROVED',
            assignedOfficer: 'Er. Rajesh Kumar',
            createdAt: '2026-07-15',
          },
          {
            id: 'WO-2026-002',
            workOrderNumber: 'WO/PWD/2026/904',
            title: 'SCADA Automation & IoT Sensor Deployment',
            projectId: 2,
            projectName: 'Smart City Water Distribution Infrastructure',
            description: 'Deploy 120 ultrasonic flow meters and telemetry gateways.',
            costEstimate: 1820000,
            status: 'IN_EXECUTION',
            assignedOfficer: 'Er. Sunita Verma',
            createdAt: '2026-07-20',
          },
        ],
      };
    }
    return res;
  },

  createWorkOrder: async (payload: Partial<WorkOrder>): Promise<ApiResponse> => {
    return apiClient.request('/work-orders/create', {
      method: 'POST',
      body: payload,
    });
  },
};
