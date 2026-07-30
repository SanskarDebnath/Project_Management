import React, { useEffect, useState } from 'react';
import { payrollService } from '../lib/api/payroll-service';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { Payslip } from '../types';
import { Download, DollarSign, FileText } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

export default function PayrollPage() {
  const [slips, setSlips] = useState<Payslip[]>([]);

  useEffect(() => {
    payrollService.getPayslips().then((res) => res.data && setSlips(res.data));
  }, []);

  const downloadPDF = (slip: Payslip) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('STATE PUBLIC WORKS DEPARTMENT', 14, 20);
    doc.setFontSize(12);
    doc.text(`SALARY SLIP - ${slip.month.toUpperCase()} ${slip.year}`, 14, 30);
    doc.text(`Basic Salary: ${formatCurrency(slip.basicSalary)}`, 14, 45);
    doc.text(`Allowances: ${formatCurrency(slip.allowances)}`, 14, 55);
    doc.text(`Deductions: ${formatCurrency(slip.deductions)}`, 14, 65);
    doc.setFontSize(14);
    doc.text(`Net Payable Amount: ${formatCurrency(slip.netSalary)}`, 14, 80);
    doc.save(`Payslip_${slip.month}_${slip.year}.pdf`);
    toast.success('Payslip PDF downloaded successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Payroll & Salary Slips</h1>
        <p className="text-xs text-slate-500">View monthly compensation statements and download PDF slips.</p>
      </div>

      <div className="space-y-4">
        {slips.map((slip) => (
          <Card key={slip.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{slip.month} {slip.year}</h3>
                  <StatusBadge status={slip.status} />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Disbursed on {slip.paymentDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full sm:w-auto justify-between">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Net Salary</p>
                <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{formatCurrency(slip.netSalary)}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => downloadPDF(slip)}>
                <Download className="w-4 h-4 mr-1.5" /> PDF
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
