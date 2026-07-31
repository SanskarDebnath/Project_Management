import React, { useEffect, useState } from 'react';
import { useProjectStore } from '../stores/project-store';
import { useDepartmentStore } from '../stores/department-store';
import { projectService } from '../lib/api/project-service';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { FolderKanban, Plus, UserPlus, Search, Calendar, DollarSign, UserCheck } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function ProjectsPage() {
  const { projects, loading, fetchProjects, createProject } = useProjectStore();
  const { departments, fetchDepartments } = useDepartmentStore();

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showOfficerModal, setShowOfficerModal] = useState(false);
  const [search, setSearch] = useState('');

  const [projectForm, setProjectForm] = useState({
    project_name: '',
    department_id: 1,
    officer_id: 'OFF-101',
    project_start_date: new Date().toISOString().split('T')[0],
    project_expected_end_date: '2026-12-31',
    project_budget: 5000000,
    project_status: 'IN_PROGRESS',
    project_description: '',
  });

  const [officerForm, setOfficerForm] = useState({
    officer_id: 'OFF-' + Math.floor(Math.random() * 900 + 100),
    officer_name: '',
    department_id: 1,
    officer_designation: 'Senior Project Officer',
    officer_email: '',
    officer_status: true,
  });

  useEffect(() => {
    fetchProjects();
    fetchDepartments();
  }, [fetchProjects, fetchDepartments]);

  const filteredProjects = projects.filter(
    (p) =>
      p.project_name.toLowerCase().includes(search.toLowerCase()) ||
      (p.officer_name && p.officer_name.toLowerCase().includes(search.toLowerCase())) ||
      (p.department_name && p.department_name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreateProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createProject({
      project_name: projectForm.project_name,
      project_budget: Number(projectForm.project_budget),
      project_status: projectForm.project_status,
      department_id: Number(projectForm.department_id),
      officer_id: projectForm.officer_id,
      project_start_date: projectForm.project_start_date,
      project_expected_end_date: projectForm.project_expected_end_date,
      project_description: projectForm.project_description,
    });
    if (success) {
      setShowProjectModal(false);
      setProjectForm({
        project_name: '',
        department_id: 1,
        officer_id: 'OFF-101',
        project_start_date: new Date().toISOString().split('T')[0],
        project_expected_end_date: '2026-12-31',
        project_budget: 5000000,
        project_status: 'IN_PROGRESS',
        project_description: '',
      });
    }
  };

  const handleCreateOfficerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await projectService.createOfficer({
        officer_id: officerForm.officer_id,
        department_id: Number(officerForm.department_id),
        officer_name: officerForm.officer_name,
        officer_designation: officerForm.officer_designation,
        officer_email: officerForm.officer_email || `officer.${Date.now()}@gov.in`,
        officer_status: true,
      });
      if (res.success) {
        toast.success(`Officer ${officerForm.officer_name} registered successfully!`);
      } else {
        toast.info(`Officer registered locally in state.`);
      }
      setShowOfficerModal(false);
    } catch (err: any) {
      toast.error('Failed to register officer');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-indigo-500" />
            Project Management & Assignments (MOD-03)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create state projects, register department officers, and manage developer assignments.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowOfficerModal(true)}
            variant="outline"
            className="text-xs font-bold px-4 py-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
          >
            <UserPlus className="w-4 h-4 mr-1.5 text-blue-700 dark:text-cyan-400" /> Register Officer
          </Button>
          <Button
            onClick={() => setShowProjectModal(true)}
            className="bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Create Project
          </Button>
        </div>
      </div>


      {/* Search & Overview */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects, department, or officer..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      {loading && (
        <div className="text-center py-12 text-slate-500 text-xs animate-pulse">Loading live project data...</div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((proj, idx) => (
          <motion.div
            key={proj.project_id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
          >
            <Card className="space-y-4 p-5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md dark:hover:border-indigo-500/50 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    PROJ-#{proj.project_id}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">{proj.project_name}</h3>
                </div>
                <StatusBadge status={proj.project_status || 'IN_PROGRESS'} />
              </div>

              {proj.project_description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{proj.project_description}</p>
              )}

              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl space-y-2 text-xs border border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-500" /> Assigned Officer:
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">{proj.officer_name || proj.officer_id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-500" /> Timeline:
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {proj.project_start_date || 'N/A'} to {proj.project_expected_end_date || 'Ongoing'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Allocated Budget:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(proj.project_budget || 0)}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-indigo-500" /> Create New Project
            </h3>
            <form onSubmit={handleCreateProjectSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Project Name</label>
                <input
                  required
                  value={projectForm.project_name}
                  onChange={(e) => setProjectForm({ ...projectForm, project_name: e.target.value })}
                  placeholder="e.g. Smart City Traffic Network"
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Department</label>
                <select
                  value={projectForm.department_id}
                  onChange={(e) => setProjectForm({ ...projectForm, department_id: Number(e.target.value) })}
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {departments.map((d) => (
                    <option key={d.did} value={d.did}>
                      {d.department_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Assigned Officer ID</label>
                <input
                  required
                  value={projectForm.officer_id}
                  onChange={(e) => setProjectForm({ ...projectForm, officer_id: e.target.value })}
                  placeholder="e.g. OFF-101"
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Budget Allocation (INR)</label>
                <input
                  type="number"
                  required
                  value={projectForm.project_budget}
                  onChange={(e) => setProjectForm({ ...projectForm, project_budget: Number(e.target.value) })}
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Project Description</label>
                <textarea
                  value={projectForm.project_description}
                  onChange={(e) => setProjectForm({ ...projectForm, project_description: e.target.value })}
                  placeholder="Scope of work..."
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 bg-indigo-600 text-white font-bold text-xs py-2 rounded-xl">
                  Create Project
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowProjectModal(false)} className="text-xs">
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Officer Modal */}
      {showOfficerModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-cyan-500" /> Register Officer
            </h3>
            <form onSubmit={handleCreateOfficerSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Officer ID</label>
                <input
                  required
                  value={officerForm.officer_id}
                  onChange={(e) => setOfficerForm({ ...officerForm, officer_id: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Officer Name</label>
                <input
                  required
                  value={officerForm.officer_name}
                  onChange={(e) => setOfficerForm({ ...officerForm, officer_name: e.target.value })}
                  placeholder="e.g. Er. Rajesh Kumar"
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Designation</label>
                <input
                  value={officerForm.officer_designation}
                  onChange={(e) => setOfficerForm({ ...officerForm, officer_designation: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 bg-cyan-600 text-white font-bold text-xs py-2 rounded-xl">
                  Register Officer
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowOfficerModal(false)} className="text-xs">
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

