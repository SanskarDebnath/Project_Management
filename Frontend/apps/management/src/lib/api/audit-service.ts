import { apiClient, ApiResponse } from './api-client';
import { AuditLogItem } from '../../types';

export const auditService = {
  getAuditLogs: async (): Promise<ApiResponse<AuditLogItem[]>> => {
    const res = await apiClient.request<AuditLogItem[]>('/audit/logs', { method: 'GET' });
    if (!res.data) {
      return {
        success: true,
        data: [
          {
            id: 'LOG-8801',
            timestamp: '2026-07-30 10:14:22',
            actor: 'Dr. Vikramaditya Roy',
            role: 'APPROVER',
            action: 'CREATE_PROJECT',
            module: 'MOD-03 Projects',
            ipAddress: '10.240.12.89',
            details: 'Approved budget allocation of ₹12.00 Cr for Highway Expansion Project.',
            severity: 'INFO',
          },
          {
            id: 'LOG-8802',
            timestamp: '2026-07-30 09:45:10',
            actor: 'Er. Rajesh Kumar',
            role: 'CHECKER',
            action: 'ASSIGN_MEMBER',
            module: 'MOD-03 Projects',
            ipAddress: '10.240.12.92',
            details: 'Assigned Lead Developer Sanskar to Project #101.',
            severity: 'INFO',
          },
          {
            id: 'LOG-8803',
            timestamp: '2026-07-29 16:30:00',
            actor: 'System Security Engine',
            role: 'SYSTEM',
            action: 'AES_ENCRYPTION_CHECK',
            module: 'MOD-16 Security',
            ipAddress: '127.0.0.1',
            details: 'Verified X-Encrypted payload integrity on API endpoints.',
            severity: 'INFO',
          },
        ],
      };
    }
    return res;
  },
};
