import React, { useEffect, useState } from 'react';
import { workorderService } from '../lib/api/workorder-service';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { WorkOrder } from '../types';
import { FileText, Plus, Search, Calendar, UserCheck } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function WorkOrdersPage() {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newWO, setNewWO] = useState({ title: '', description: '', costEstimate: 1500000 });

  useEffect(() => {
    workorderService.getWorkOrders().then((res) => res.data && setOrders(res.data));
  }, []);

  /* Legacy handleNewWorkOrder commented out below for reference:
  const handleNewWorkOrder = async () => { ... }
  */

  const handleCreateWorkOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await workorderService.createWorkOrder(newWO);
    if (res.success) {
      toast.success('Work order submitted for department review!');
      setOrders([
        {
          id: 'wo-' + Date.now(),
          workOrderNumber: 'WO-2026-00' + (orders.length + 1),
          title: newWO.title,
          description: newWO.description,
          assignedOfficer: 'Er. Anita Sharma',
          costEstimate: Number(newWO.costEstimate),
          status: 'PENDING_APPROVAL',
          issuedDate: new Date().toISOString().split('T')[0],
        },
        ...orders,
      ]);
      setShowModal(false);
      setNewWO({ title: '', description: '', costEstimate: 1500000 });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-500" />
            Work Orders & Executions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track department-issued work orders, digital signatures, and budget allocations.
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Request Work Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((wo, idx) => (
          <motion.div
            key={wo.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
          >
            <Card className="space-y-4 p-5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {wo.workOrderNumber}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">{wo.title}</h3>
                </div>
                <StatusBadge status={wo.status} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{wo.description}</p>
              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl space-y-1.5 text-xs border border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Assigned Officer:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">{wo.assignedOfficer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Estimated Budget:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(wo.costEstimate)}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" /> Request Work Order
            </h3>
            <form onSubmit={handleCreateWorkOrder} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Work Title</label>
                <input
                  required
                  value={newWO.title}
                  onChange={(e) => setNewWO({ ...newWO, title: e.target.value })}
                  placeholder="e.g. Infrastructure Fiber Link"
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Estimated Cost (INR)</label>
                <input
                  type="number"
                  required
                  value={newWO.costEstimate}
                  onChange={(e) => setNewWO({ ...newWO, costEstimate: Number(e.target.value) })}
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Description</label>
                <textarea
                  required
                  value={newWO.description}
                  onChange={(e) => setNewWO({ ...newWO, description: e.target.value })}
                  placeholder="Details of the work request..."
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 bg-indigo-600 text-white font-bold text-xs py-2 rounded-xl">
                  Submit Request
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="text-xs">
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

