import React, { useEffect, useState } from 'react';
import { projectService } from '../lib/api/project-service';
import { departmentService } from '../lib/api/department-service';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { FolderKanban, Plus, UserPlus, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { toast } from 'sonner';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showOfficerModal, setShowOfficerModal] = useState(false);

  const [projectForm, setProjectForm] = useState({ project_name: '', department_id: 1, officer_id: 201, project_start_date: '2026-08-01', budget_allocated: 50000000 });
  const [officerForm, setOfficerForm] = useState({ officer_name: '', department_id: 1 });

  useEffect(() => {
    projectService.getProjectsList().then((res) => res.data && setProjects(res.data));
    departmentService.getDepartmentsList().then((res) => res.data && setDepartments(res.data));
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await projectService.createProject(projectForm);
    if (res.success) {
      toast.success('Project created and assigned to Officer successfully!');
      setProjects([...projects, { ...projectForm, project_id: Date.now(), officer_name: 'Er. Officer', status: 'ACTIVE' }]);
      setShowProjectModal(false);
    }
  };

  const handleCreateOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await projectService.createOfficer(officerForm);
    if (res.success) {
      toast.success(`Officer ${officerForm.officer_name} registered successfully!`);
      setShowOfficerModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Project Management & Assignments (MOD-03)</h1>
          <p className="text-xs text-slate-400">Create projects, register department officers, and assign developers.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowOfficerModal(true)} variant="secondary">
            <UserPlus className="w-4 h-4 mr-2" /> Register Officer
          </Button>
          <Button onClick={() => setShowProjectModal(true)}>
            <Plus className="w-4 h-4 mr-2" /> Create Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <Card key={proj.project_id} className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-400">PROJ-#{proj.project_id}</span>
                <h3 className="text-lg font-bold text-slate-100">{proj.project_name}</h3>
              </div>
              <StatusBadge status={proj.status || 'ACTIVE'} />
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Officer:</span>
                <span className="font-semibold text-slate-200">{proj.officer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Start Date:</span>
                <span className="font-semibold text-slate-200">{proj.project_start_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Allocated Budget:</span>
                <span className="font-bold text-emerald-400">{formatCurrency(proj.budget_allocated)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Create New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400">Project Name</label>
                <input
                  required
                  value={projectForm.project_name}
                  onChange={(e) => setProjectForm({ ...projectForm, project_name: e.target.value })}
                  placeholder="e.g. Smart City Infrastructure"
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Budget Allocation (INR)</label>
                <input
                  type="number"
                  required
                  value={projectForm.budget_allocated}
                  onChange={(e) => setProjectForm({ ...projectForm, budget_allocated: Number(e.target.value) })}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1">Create Project</Button>
                <Button type="button" variant="outline" onClick={() => setShowProjectModal(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Officer Modal */}
      {showOfficerModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Register Department Officer</h3>
            <form onSubmit={handleCreateOfficer} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400">Officer Name</label>
                <input
                  required
                  value={officerForm.officer_name}
                  onChange={(e) => setOfficerForm({ ...officerForm, officer_name: e.target.value })}
                  placeholder="e.g. Er. Rajesh Kumar"
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1">Register Officer</Button>
                <Button type="button" variant="outline" onClick={() => setShowOfficerModal(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
