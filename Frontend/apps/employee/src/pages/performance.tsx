import React, { useEffect, useState } from 'react';
import { payrollService } from '../lib/api/payroll-service';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { PerformanceReview } from '../types';
import { Award, Star, CheckCircle } from 'lucide-react';

export default function PerformancePage() {
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);

  useEffect(() => {
    payrollService.getPerformanceReviews().then((res) => res.data && setReviews(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Performance Metrics & Reviews</h1>
        <p className="text-xs text-slate-500">View quarterly ratings, manager feedback, and achievements.</p>
      </div>

      <div className="space-y-6">
        {reviews.map((rev) => (
          <Card key={rev.id} className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  {rev.reviewPeriod}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">Quarterly Appraisal Review</h3>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <Award className="w-6 h-6 text-amber-500" />
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{rev.score}</span>
                <span className="text-xs text-slate-400 font-semibold">/ 100</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Tasks Completed</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">{rev.completedTasks}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Quality Rating</p>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{rev.qualityRating} / 5.0</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Punctuality</p>
                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{rev.punctualityRating} / 5.0</p>
              </div>
            </div>

            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
              <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200 mb-1">Manager Remarks:</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{rev.managerComments}"</p>
              <p className="text-[11px] text-slate-400 mt-2 text-right">— Reviewed by {rev.reviewedBy}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
