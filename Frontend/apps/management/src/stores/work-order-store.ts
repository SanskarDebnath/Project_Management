import { create } from 'zustand';
import { apiClient } from '../lib/api/api-client';
import { toast } from 'sonner';

export interface WorkOrderItem {
  work_order_id: number;
  work_order_number: string;
  project_id: number;
  project_name_snapshot?: string;
  department_id: number;
  department_name_snapshot?: string;
  developer_id: number;
  developer_name_snapshot?: string;
  officer_id: string;
  officer_name_snapshot?: string;
  tier: string;
  monthly_salary: number;
  work_order_start_date: string;
  work_order_end_date: string;
  number_of_months: number;
  work_order_status: 'DRAFT' | 'PENDING_SIGNATURE' | 'SIGNED' | 'REJECTED' | string;
  work_order_description?: string;
}

interface WorkOrderState {
  workOrders: WorkOrderItem[];
  loading: boolean;
  error: string | null;
  fetchWorkOrders: () => Promise<void>;
  createWorkOrder: (data: any) => Promise<boolean>;
  signWorkOrder: (workOrderId: number, officerId: string) => Promise<boolean>;
}

const DEFAULT_WORK_ORDERS: WorkOrderItem[] = [
  {
    work_order_id: 1,
    work_order_number: 'WO-2026-001',
    project_id: 101,
    project_name_snapshot: 'Smart City Traffic Surveillance Network',
    department_id: 2,
    department_name_snapshot: 'Department of Transportation & Transit',
    developer_id: 501,
    developer_name_snapshot: 'Dev. Amitav Roy',
    officer_id: 'OFF-102',
    officer_name_snapshot: 'Er. Anita Sharma',
    tier: 'Tier 1 Senior Engineer',
    monthly_salary: 120000,
    work_order_start_date: '2026-06-01',
    work_order_end_date: '2026-12-31',
    number_of_months: 7,
    work_order_status: 'SIGNED',
    work_order_description: 'Full-stack development of real-time camera stream ingestion module.',
  },
  {
    work_order_id: 2,
    work_order_number: 'WO-2026-002',
    project_id: 102,
    project_name_snapshot: 'Enterprise Cloud Migration',
    department_id: 3,
    department_name_snapshot: 'Department of Digital Governance & IT',
    developer_id: 502,
    developer_name_snapshot: 'Dev. Priya Sen',
    officer_id: 'OFF-103',
    officer_name_snapshot: 'Er. Vikram Singh',
    tier: 'Tier 2 Cloud Architect',
    monthly_salary: 140000,
    work_order_start_date: '2026-07-01',
    work_order_end_date: '2026-12-31',
    number_of_months: 6,
    work_order_status: 'PENDING_SIGNATURE',
    work_order_description: 'Infrastructure as Code setup and automated deployment scripts.',
  },
];

export const useWorkOrderStore = create<WorkOrderState>((set, get) => ({
  workOrders: [],
  loading: false,
  error: null,

  fetchWorkOrders: async () => {
    set({ loading: true, error: null });

    try {
      const res = await apiClient.request<WorkOrderItem[]>('/work-orders/list', { method: 'GET' });
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        set({ workOrders: res.data, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (err: any) {
      console.warn('[WorkOrderStore] Fetch fallback active:', err.message);
      set({ loading: false });
    }
  },

  createWorkOrder: async (data) => {
    set({ loading: true });
    try {
      const res = await apiClient.request('/work-orders/create', {
        method: 'POST',
        body: data,
      });

      if (res.success) {
        toast.success('Work Order Created Successfully!');
      } else {
        toast.warning(res.error || 'Work Order added to local state (API offline).');
      }

      const nextId = Math.max(...get().workOrders.map((w) => w.work_order_id), 0) + 1;
      const newWO: WorkOrderItem = {
        work_order_id: nextId,
        work_order_number: data.work_order_number || `WO-2026-00${nextId}`,
        project_id: data.project_id,
        project_name_snapshot: data.project_name_snapshot || `Project ${data.project_id}`,
        department_id: data.department_id,
        department_name_snapshot: data.department_name_snapshot || `Department ${data.department_id}`,
        developer_id: data.developer_id,
        developer_name_snapshot: data.developer_name_snapshot || `Developer ${data.developer_id}`,
        officer_id: data.officer_id,
        officer_name_snapshot: data.officer_name_snapshot || `Officer ${data.officer_id}`,
        tier: data.tier || 'Senior Engineer',
        monthly_salary: data.monthly_salary || 100000,
        work_order_start_date: data.work_order_start_date,
        work_order_end_date: data.work_order_end_date,
        number_of_months: data.number_of_months || 6,
        work_order_status: 'PENDING_SIGNATURE',
        work_order_description: data.work_order_description,
      };

      set((state) => ({
        workOrders: [newWO, ...state.workOrders],
        loading: false,
      }));
      return true;
    } catch (err: any) {
      toast.error('Failed to create work order: ' + err.message);
      set({ loading: false });
      return false;
    }
  },

  signWorkOrder: async (workOrderId, officerId) => {
    set({ loading: true });
    try {
      const res = await apiClient.request('/work-orders/sign', {
        method: 'POST',
        body: {
          lookup: { work_order_id: workOrderId },
          signing_officer_id: officerId,
        },
      });

      if (res.success) {
        toast.success('Work Order digitally signed successfully!');
      } else {
        toast.info('Signed locally in state.');
      }

      set((state) => ({
        workOrders: state.workOrders.map((wo) =>
          wo.work_order_id === workOrderId ? { ...wo, work_order_status: 'SIGNED' } : wo
        ),
        loading: false,
      }));
      return true;
    } catch (err: any) {
      toast.error('Failed to sign work order');
      set({ loading: false });
      return false;
    }
  },
}));
