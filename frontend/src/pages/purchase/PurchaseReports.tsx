import { useState } from 'react';
import { usePurchaseReportHistory } from '../../hooks/usePurchase';
import { generatePurchaseReport } from '../../services/purchaseService';
import toast from 'react-hot-toast';

function PurchaseReports() {
  const { data: reportHistory = [], isLoading } = usePurchaseReportHistory();
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [week, setWeek] = useState('2024-W01');
  const [month, setMonth] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const params: Record<string, string | number> = {};
      if (reportType === 'daily') {
        params.date = date;
      } else if (reportType === 'weekly') {
        params.week = week;
      } else {
        params.year = month.year;
        params.month = month.month;
      }

      const result = await generatePurchaseReport(reportType, params);
      toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated successfully!`);

      // Open or download files
      if (result.excelPath) {
        window.open(result.excelPath, '_blank');
      }
      if (result.pdfPath) {
        window.open(result.pdfPath, '_blank');
      }
    } catch (error) {
      toast.error('Failed to generate report');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Reports & MIS</p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-950">Purchase Reports</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Generate daily, weekly, and monthly procurement reports. Download in PDF or Excel format.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-950">Generate New Report</h2>
          <p className="mt-1 text-sm text-slate-600">Select report type and date range to generate</p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">Report Type</label>
              <div className="mt-2 flex gap-3">
                {(['daily', 'weekly', 'monthly'] as const).map((type) => (
                  <button
                    key={type}
                    className={`rounded-[14px] px-5 py-2.5 text-sm font-medium transition ${
                      reportType === type
                        ? 'bg-[#185FA5] text-white'
                        : 'border border-slate-300 bg-[#F8FAFC] text-slate-600 hover:bg-[#EEF4FF]'
                    }`}
                    onClick={() => setReportType(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {reportType === 'daily' && (
              <div>
                <label className="block text-sm font-medium text-slate-700">Select Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-2 h-12 w-full rounded-[16px] border border-slate-300 bg-[#F8FAFC] px-4 text-sm focus:border-[#185FA5] focus:bg-white"
                />
              </div>
            )}

            {reportType === 'weekly' && (
              <div>
                <label className="block text-sm font-medium text-slate-700">Select Week</label>
                <input
                  type="week"
                  value={week}
                  onChange={(e) => setWeek(e.target.value)}
                  className="mt-2 h-12 w-full rounded-[16px] border border-slate-300 bg-[#F8FAFC] px-4 text-sm focus:border-[#185FA5] focus:bg-white"
                />
              </div>
            )}

            {reportType === 'monthly' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Year</label>
                  <input
                    type="number"
                    value={month.year}
                    onChange={(e) => setMonth({ ...month, year: Number(e.target.value) })}
                    min="2000"
                    max="2100"
                    className="mt-2 h-12 w-full rounded-[16px] border border-slate-300 bg-[#F8FAFC] px-4 text-sm focus:border-[#185FA5] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Month</label>
                  <select
                    value={month.month}
                    onChange={(e) => setMonth({ ...month, month: Number(e.target.value) })}
                    className="mt-2 h-12 w-full rounded-[16px] border border-slate-300 bg-[#F8FAFC] px-4 text-sm focus:border-[#185FA5] focus:bg-white"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('en', { month: 'long' })}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              onClick={handleGenerateReport}
              disabled={generating}
              className="flex h-12 items-center justify-center rounded-[16px] bg-[#185FA5] px-6 text-sm font-semibold text-white transition hover:bg-[#226fc0] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {generating ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                'Generate Report'
              )}
            </button>
          </div>
        </section>

        <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Report History</h2>
          <p className="mt-1 text-sm text-slate-600">Previously generated reports</p>

          <div className="mt-6 space-y-3">
            {isLoading ? (
              <p className="text-sm text-slate-500">Loading history...</p>
            ) : reportHistory.length === 0 ? (
              <p className="text-sm text-slate-500">No reports generated yet.</p>
            ) : (
              reportHistory.map((report) => (
                <div
                  key={report.id}
                  className="rounded-[16px] border border-[#EFF2F6] bg-[#F8FAFC] p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-950">{report.type} Report</p>
                      <p className="mt-1 text-xs text-slate-600">
                        {new Date(report.createdAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-[12px] border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-[#F8FAFC]">
                        View
                      </button>
                      <button className="rounded-[12px] bg-[#185FA5] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#226fc0]">
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default PurchaseReports;
