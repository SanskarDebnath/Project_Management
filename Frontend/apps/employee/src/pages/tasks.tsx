import React, { useEffect, useState } from 'react';
import { taskService } from '../lib/api/task-service';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { TaskItem } from '../types';
import { CheckSquare, Plus, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    taskService.getTasks().then((res) => res.data && setTasks(res.data));
  }, []);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    const res = await taskService.updateTaskStatus(taskId, newStatus);
    if (res.success) {
      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus as any } : t)));
      toast.success(`Task status updated to ${newStatus}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Assigned Tasks</h1>
          <p className="text-xs text-slate-500">Track and log project milestones.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Card key={task.id} className="flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">{task.id}</span>
                <StatusBadge status={task.status} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{task.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{task.description}</p>
              <div className="text-[11px] text-slate-400">
                <p>Project: <span className="font-semibold text-slate-700 dark:text-slate-300">{task.projectName}</span></p>
                <p>Est. Hours: {task.estimatedHours} hrs | Logged: {task.loggedHours} hrs</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-4">
              <span className="text-xs text-slate-400">Due: {task.dueDate}</span>
              <div className="flex gap-1.5">
                {task.status !== 'COMPLETED' && (
                  <Button size="sm" variant="success" onClick={() => handleStatusChange(task.id, 'COMPLETED')}>
                    Complete
                  </Button>
                )}
                {task.status === 'TODO' && (
                  <Button size="sm" variant="primary" onClick={() => handleStatusChange(task.id, 'IN_PROGRESS')}>
                    Start
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
