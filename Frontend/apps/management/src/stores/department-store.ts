import { create } from 'zustand';
import { departmentService } from '../lib/api/department-service';
import { toast } from 'sonner';

export interface DepartmentItem {
  did: number;
  department_name: string;
  department_budget?: number;
  code?: string;
  description?: string;
  totalBudget?: number;
  allocatedBudget?: number;
}

interface DepartmentState {
  departments: DepartmentItem[];
  loading: boolean;
  error: string | null;
  fetchDepartments: () => Promise<void>;
  addDepartment: (dept: { did: number; dname: string; dbudget: number; description?: string }) => Promise<boolean>;
  editDepartment: (did: number, dname?: string, dbudget?: number) => Promise<boolean>;
}

const DEFAULT_DEPARTMENTS: DepartmentItem[] = [
  { did: 1, department_name: 'Department of Public Works & Infrastructure', code: 'PWD-01', description: 'Roads, bridges & civil infrastructure', totalBudget: 15000000, allocatedBudget: 12000000 },
  { did: 2, department_name: 'Department of Transportation & Transit', code: 'TRN-02', description: 'Metropolitan transport, buses & telematics', totalBudget: 8500000, allocatedBudget: 6200000 },
  { did: 3, department_name: 'Department of Digital Governance & IT', code: 'ITE-03', description: 'Cloud infrastructure, data centers & e-services', totalBudget: 12000000, allocatedBudget: 9500000 },
];

export const useDepartmentStore = create<DepartmentState>((set, get) => ({
  departments: [],
  loading: false,
  error: null,

  fetchDepartments: async () => {
    set({ loading: true, error: null });

    try {
      const res = await departmentService.getDepartmentsList();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((item: any) => ({
          did: item.did || item.department_id,
          department_name: item.department_name || item.dname || `Department ${item.did || item.department_id}`,
          department_budget: Number(item.department_budget || item.dbudget || item.totalBudget || 0),
          totalBudget: Number(item.department_budget || item.dbudget || item.totalBudget || 10000000),
          allocatedBudget: Number(item.allocatedBudget || (item.department_budget ? item.department_budget * 0.75 : 7500000)),
          code: item.code || `DEPT-0${item.did || item.department_id}`,
          description: item.description || 'Enterprise State Infrastructure Unit',
        }));
        set({ departments: mapped, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (err: any) {
      console.warn('[DepartmentStore] Fetch fallback active:', err.message);
      set({ loading: false });
    }
  },

  addDepartment: async (deptData) => {
    set({ loading: true });
    try {
      const res = await departmentService.createDepartment({
        did: deptData.did,
        dname: deptData.dname,
        dbudget: deptData.dbudget,
      });
      if (res.success) {
        toast.success(res.message || 'Department Added Successfully!');
      } else {
        toast.warning(res.error || 'Added to local state (API offline).');
      }
      
      const newDept: DepartmentItem = {
        did: deptData.did,
        department_name: deptData.dname,
        department_budget: deptData.dbudget,
        totalBudget: deptData.dbudget,
        allocatedBudget: deptData.dbudget * 0.7,
        code: `DEPT-0${deptData.did}`,
        description: deptData.description || 'Newly established department module',
      };
      
      set((state) => ({
        departments: [...state.departments.filter(d => d.did !== deptData.did), newDept],
        loading: false,
      }));
      return true;
    } catch (err: any) {
      toast.error('Failed to create department: ' + err.message);
      set({ loading: false });
      return false;
    }
  },

  editDepartment: async (did, dname, dbudget) => {
    set({ loading: true });
    try {
      const res = await departmentService.editDepartment({ did, dname, dbudget });
      if (res.success) {
        toast.success('Department updated successfully!');
      } else {
        toast.info('Updated local state.');
      }
      set((state) => ({
        departments: state.departments.map((d) =>
          d.did === did
            ? {
                ...d,
                department_name: dname ?? d.department_name,
                department_budget: dbudget ?? d.department_budget,
                totalBudget: dbudget ?? d.totalBudget,
              }
            : d
        ),
        loading: false,
      }));
      return true;
    } catch (err: any) {
      toast.error('Failed to update department');
      set({ loading: false });
      return false;
    }
  },
}));
