import React, { useEffect, useState } from 'react';
import { workorderService } from '../lib/api/workorder-service';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { WorkOrder } from '../types';
import { FileText, Plus } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { toast } from 'sonner';

export default function WorkOrdersPage() {
  const [orders, setOrders] = useState<WorkOrder[]>([]);

  useEffect(() => {
    workorderService.getWorkOrders().then((res) => res.data && setOrders(res.data));
  }, []);

  const handleNewWorkOrder = async () => {
    const res = await workorderService.createWorkOrder({
      title: 'New Infrastructure Work Request',
      description: 'Request for secondary fiber link and server rack cabling.',
      costEstimate: 1200000,
    });
    if (res.success) {
      toast.success('Work order submitted for department review');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Work Orders & Executions</h1>
          <p className="text-xs text-slate-500">Track department-issued work orders and budgets.</p>
        </div>
        <Button onClick={handleNewWorkOrder}>
          <Plus className="w-4 h-4 mr-2" /> Request Work Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((wo) => (
          <Card key={wo.id} className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">{wo.workOrderNumber}</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{wo.title}</h3>
              </div>
              <StatusBadge status={wo.status} />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{wo.description}</p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Officer:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{wo.assignedOfficer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Cost:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(wo.costEstimate)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
