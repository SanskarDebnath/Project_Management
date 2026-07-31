import { create } from 'zustand';
import { projectService } from '../lib/api/project-service';
import { toast } from 'sonner';

export interface ProjectItem {
  project_id: number;
  project_uuid?: string;
  project_name: string;
  department_id: number;
  department_name?: string;
  officer_id: string | number;
  officer_name?: string;
  project_start_date?: string;
  project_expected_end_date?: string;
  project_budget: number;
  project_status: 'PLANNED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED' | string;
  project_description?: string;
}

interface ProjectState {
  projects: ProjectItem[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (project: {
    project_name: string;
    project_budget: number;
    project_status: string;
    department_id: number;
    officer_id: string;
    project_start_date?: string;
    project_expected_end_date?: string;
    project_description?: string;
  }) => Promise<boolean>;
}

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    project_id: 101,
    project_name: 'Smart City Traffic Surveillance Network',
    department_id: 2,
    department_name: 'Department of Transportation & Transit',
    officer_id: 'OFF-102',
    officer_name: 'Er. Anita Sharma',
    project_start_date: '2026-06-01',
    project_expected_end_date: '2026-12-31',
    project_budget: 4500000,
    project_status: 'IN_PROGRESS',
    project_description: 'Deployment of AI traffic management & automated toll collection system.',
  },
  {
    project_id: 102,
    project_name: 'Enterprise Cloud Migration & Data Center Revamp',
    department_id: 3,
    department_name: 'Department of Digital Governance & IT',
    officer_id: 'OFF-103',
    officer_name: 'Er. Vikram Singh',
    project_start_date: '2026-05-15',
    project_expected_end_date: '2027-03-31',
    project_budget: 3200000,
    project_status: 'IN_PROGRESS',
    project_description: 'Migrating state infrastructure to hybrid cloud environment.',
  },
  {
    project_id: 103,
    project_name: 'Metropolitan Bridge Infrastructure Overhaul',
    department_id: 1,
    department_name: 'Department of Public Works & Infrastructure',
    officer_id: 'OFF-101',
    officer_name: 'Er. Rajesh Kumar',
    project_start_date: '2026-08-01',
    project_expected_end_date: '2027-08-01',
    project_budget: 6800000,
    project_status: 'PLANNED',
    project_description: 'Structural reinforcement and sensor installation for city bridges.',
  },
];

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });

    try {
      const res = await projectService.getProjectsList();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((item: any) => ({
          project_id: item.project_id,
          project_uuid: item.project_uuid,
          project_name: item.project_name,
          department_id: item.department_id,
          department_name: item.department_name || (item.department_id === 1 ? 'Public Works' : item.department_id === 2 ? 'Transit' : 'Digital IT'),
          officer_id: item.officer_id,
          officer_name: item.officer_name || `Officer ${item.officer_id}`,
          project_start_date: item.project_start_date || '2026-06-01',
          project_expected_end_date: item.project_expected_end_date || '2026-12-31',
          project_budget: Number(item.project_budget || item.budget_allocated || 0),
          project_status: item.project_status || item.status || 'IN_PROGRESS',
          project_description: item.project_description || 'State project initiative',
        }));
        set({ projects: mapped, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (err: any) {
      console.warn('[ProjectStore] Fetch fallback active:', err.message);
      set({ loading: false });
    }
  },

  createProject: async (projectData) => {
    set({ loading: true });
    try {
      const res = await projectService.createProject({
        project_name: projectData.project_name,
        project_budget: projectData.project_budget,
        project_status: projectData.project_status,
        department_id: projectData.department_id,
        officer_id: projectData.officer_id,
        project_start_date: projectData.project_start_date,
        project_expected_end_date: projectData.project_expected_end_date,
        project_description: projectData.project_description,
      });

      if (res.success) {
        toast.success(res.message || 'Project Created Successfully!');
      } else {
        toast.warning(res.error || 'Project added to local state (API offline).');
      }

      const nextId = Math.max(...get().projects.map((p) => p.project_id), 100) + 1;
      const newProj: ProjectItem = {
        project_id: nextId,
        project_name: projectData.project_name,
        department_id: projectData.department_id,
        department_name: projectData.department_id === 1 ? 'Department of Public Works' : projectData.department_id === 2 ? 'Transportation & Transit' : 'Digital Governance & IT',
        officer_id: projectData.officer_id,
        officer_name: `Officer ${projectData.officer_id}`,
        project_start_date: projectData.project_start_date || new Date().toISOString().split('T')[0],
        project_expected_end_date: projectData.project_expected_end_date,
        project_budget: projectData.project_budget,
        project_status: projectData.project_status || 'PLANNED',
        project_description: projectData.project_description,
      };

      set((state) => ({
        projects: [newProj, ...state.projects],
        loading: false,
      }));
      return true;
    } catch (err: any) {
      toast.error('Failed to create project: ' + err.message);
      set({ loading: false });
      return false;
    }
  },
}));
