import React, { useEffect, useState } from 'react';
import { useDepartmentStore } from '../stores/department-store';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { Building2, Plus, Search, DollarSign, Activity, UserPlus } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { motion } from 'framer-motion';

export default function DepartmentsPage() {
  const { departments, loading, fetchDepartments, addDepartment } = useDepartmentStore();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [newDept, setNewDept] = useState({
    did: 101,
    dname: '',
    code: '',
    description: '',
    dbudget: 5000000,
  });

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const filteredDepts = departments.filter(
    (d) =>
      d.department_name.toLowerCase().includes(search.toLowerCase()) ||
      (d.code && d.code.toLowerCase().includes(search.toLowerCase()))
  );

  /* Legacy static handleCreate commented out below for reference:
  const handleCreate = async (e: React.FormEvent) => { ... }
  */

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addDepartment({
      did: newDept.did || Math.floor(Math.random() * 900) + 100,
      dname: newDept.dname,
      dbudget: Number(newDept.dbudget),
      description: newDept.description,
    });
    if (success) {
      setShowModal(false);
      setNewDept({ did: 102, dname: '', code: '', description: '', dbudget: 5000000 });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-cyan-500" />
            Department Management (MOD-01)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure state departments, assigned codes, and budget allocations in real-time.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              window.location.href = '/projects';
            }}
            variant="outline"
            className="text-xs font-bold px-3.5 py-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
          >
            <UserPlus className="w-4 h-4 mr-1.5 text-blue-700 dark:text-cyan-400" /> Register Officer
          </Button>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Department
          </Button>
        </div>
      </div>

      {/* Search & Statistics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search department name or code..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
          />
        </div>
        <div className="p-3 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Active Units</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{departments.length}</p>
          </div>
          <Activity className="w-5 h-5 text-cyan-500" />
        </div>
        <div className="p-3 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Budget</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(departments.reduce((acc, curr) => acc + (curr.totalBudget || curr.department_budget || 0), 0))}
            </p>
          </div>
          <DollarSign className="w-5 h-5 text-emerald-500" />
        </div>
      </div>

      {loading && (
        <div className="text-center py-12 text-slate-500 text-xs animate-pulse">Loading live department data...</div>
      )}

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredDepts.map((dept, idx) => (
          <motion.div
            key={dept.did}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
          >
            <Card className="flex flex-col justify-between space-y-4 p-5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md dark:hover:border-cyan-500/50 transition-all">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                    {dept.code || `DEPT-0${dept.did}`}
                  </span>
                  <StatusBadge status="ACTIVE" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{dept.department_name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{dept.description || 'Enterprise State Department'}</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl space-y-1.5 text-xs border border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Total Budget:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(dept.totalBudget || dept.department_budget || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Allocated Budget:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(dept.allocatedBudget || (dept.department_budget ? dept.department_budget * 0.75 : 0))}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Department Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-500" />
              Add New Department
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Department ID (Numeric)</label>
                <input
                  type="number"
                  required
                  value={newDept.did}
                  onChange={(e) => setNewDept({ ...newDept, did: Number(e.target.value) })}
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Department Name</label>
                <input
                  required
                  value={newDept.dname}
                  onChange={(e) => setNewDept({ ...newDept, dname: e.target.value })}
                  placeholder="e.g. Highways Authority"
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Budget (INR)</label>
                <input
                  type="number"
                  required
                  value={newDept.dbudget}
                  onChange={(e) => setNewDept({ ...newDept, dbudget: Number(e.target.value) })}
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Description</label>
                <textarea
                  required
                  value={newDept.description}
                  onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                  placeholder="Department scope..."
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 bg-cyan-600 text-white font-bold text-xs py-2 rounded-xl">Save Department</Button>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="text-xs">Cancel</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

