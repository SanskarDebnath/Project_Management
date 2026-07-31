import { apiClient, ApiResponse } from './api-client';
import { WorkOrder } from '../../types';

export const workorderService = {
  getWorkOrders: async (): Promise<ApiResponse<WorkOrder[]>> => {
    return apiClient.request<WorkOrder[]>('/work-orders/my-orders', { method: 'GET' });
  },


  createWorkOrder: async (payload: Partial<WorkOrder>): Promise<ApiResponse> => {
    return apiClient.request('/work-orders/create', {
      method: 'POST',
      body: payload,
    });
  },
};
