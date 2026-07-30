import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Award, Plus, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function PerformanceManagementPage() {
  const [reviews, setReviews] = useState([
    { id: 'REV-01', employee: 'Sanskar', period: 'Q2 2026', score: 94.5, comments: 'Exceptional architectural delivery.', status: 'PUBLISHED' },
    { id: 'REV-02', employee: 'Ananya Sharma', period: 'Q2 2026', score: 91.0, comments: 'Delivered water telemetry modules.', status: 'PUBLISHED' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Performance Appraisal Management (MOD-07)</h1>
          <p className="text-xs text-slate-400">Score employee deliverables, rate quality metrics, and issue appraisals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((rev) => (
          <Card key={rev.id} className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">{rev.id} • {rev.period}</span>
                <h3 className="text-lg font-bold text-slate-100">{rev.employee}</h3>
              </div>
              <div className="flex items-center gap-1 font-bold text-xl text-emerald-400">
                <Star className="w-5 h-5 fill-emerald-400" /> {rev.score}
              </div>
            </div>
            <p className="text-xs text-slate-400 italic">"{rev.comments}"</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
