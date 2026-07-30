import React, { useEffect, useState } from 'react';
import { departmentService } from '../lib/api/department-service';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { DepartmentDTO } from '../types';
import { Building2, Plus, Edit, Eye } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { toast } from 'sonner';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newDept, setNewDept] = useState({ department_name: '', code: '', description: '', totalBudget: 100000000 });

  useEffect(() => {
    departmentService.getDepartmentsList().then((res) => res.data && setDepartments(res.data));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await departmentService.createDepartment({ ...newDept, allocatedBudget: 0 });
    if (res.success) {
      toast.success('Department created successfully!');
      setDepartments([...departments, { ...newDept, did: Date.now(), allocatedBudget: 0 }]);
      setShowModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Department Management (MOD-01)</h1>
          <p className="text-xs text-slate-400">Configure state departments, codes, and budget caps.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card key={dept.did} className="flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-cyan-400">{dept.code}</span>
                <StatusBadge status="ACTIVE" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">{dept.department_name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{dept.description}</p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Budget:</span>
                <span className="font-bold text-slate-100">{formatCurrency(dept.totalBudget)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Allocated Budget:</span>
                <span className="font-bold text-emerald-400">{formatCurrency(dept.allocatedBudget)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Add New Department</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400">Department Name</label>
                <input
                  required
                  value={newDept.department_name}
                  onChange={(e) => setNewDept({ ...newDept, department_name: e.target.value })}
                  placeholder="e.g. Highways Authority"
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Department Code</label>
                <input
                  required
                  value={newDept.code}
                  onChange={(e) => setNewDept({ ...newDept, code: e.target.value })}
                  placeholder="e.g. HWAY-04"
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Description</label>
                <textarea
                  required
                  value={newDept.description}
                  onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                  placeholder="Department scope..."
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1">Save Department</Button>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
