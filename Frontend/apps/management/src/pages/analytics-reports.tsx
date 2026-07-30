import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, BarChart3, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

const budgetData = [
  { name: 'Public Works', total: 50, allocated: 34 },
  { name: 'Water Sanitation', total: 35, allocated: 21 },
  { name: 'IT Commission', total: 28, allocated: 19 },
];

const COLORS = ['#06b6d4', '#10b981', '#8b5cf6'];

export default function AnalyticsReportsPage() {
  const downloadReportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('STATE GOVERNMENT MANAGEMENT REPORT', 14, 20);
    doc.setFontSize(12);
    doc.text('Department Budget Utilization & Project Execution Metrics', 14, 30);
    doc.text('Generated on: July 30, 2026', 14, 40);
    doc.text('Public Works Department: ₹34 Cr / ₹50 Cr', 14, 55);
    doc.text('Water Sanitation: ₹21 Cr / ₹35 Cr', 14, 65);
    doc.text('IT Commission: ₹19 Cr / ₹28 Cr', 14, 75);
    doc.save('Executive_State_Report.pdf');
    toast.success('Executive State Report PDF downloaded!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Department Analytics & Reports (MOD-10)</h1>
          <p className="text-xs text-slate-400">Graphical visualization of budget utilization and infrastructure milestones.</p>
        </div>
        <Button onClick={downloadReportPDF}>
          <Download className="w-4 h-4 mr-2" /> Export State Report PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" /> Budget vs Allocation (in ₹ Crores)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Bar dataKey="total" fill="#334155" name="Total Budget" radius={[4, 4, 0, 0]} />
                <Bar dataKey="allocated" fill="#06b6d4" name="Allocated Budget" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" /> Sector Share Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={budgetData} dataKey="allocated" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
