import { useState } from 'react';
import { useITReports } from '../../hooks/useIT';

function ITReports() {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { data: reports = [], isLoading } = useITReports();

  const generateReport = async () => {
    const params: Record<string, string | number> = {};
    if (reportType === 'daily') params.date = new Date().toISOString().split('T')[0];
    else if (reportType === 'weekly') params.week = new Date().toISOString();
    else {
      params.year = new Date().getFullYear();
      params.month = new Date().getMonth() + 1;
    }
    window.open(`/api/it/reports/${reportType}?${new URLSearchParams(params as Record<string, string>).toString()}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Generate Report</h2>
        <div className="mt-4 flex items-center gap-4">
          <select
            className="rounded-[12px] border border-slate-300 bg-[#F8FAFC] px-4 py-2 text-sm"
            value={reportType}
            onChange={(e) => setReportType(e.target.value as 'daily' | 'weekly' | 'monthly')}
          >
            <option value="daily">Daily Report</option>
            <option value="weekly">Weekly Report</option>
            <option value="monthly">Monthly Report</option>
          </select>
          <button
            className="rounded-[12px] bg-[#185FA5] px-5 py-2 text-sm font-semibold text-white"
            onClick={generateReport}
            type="button"
          >
            Generate {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
          </button>
        </div>
      </section>

      <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Report History</h2>
        {isLoading ? <p className="mt-4 text-sm text-slate-500">Loading...</p> : null}
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-[#EFF2F6] text-left text-sm">
            <thead className="bg-[#F8FAFC] text-slate-500">
              <tr>
                {['ID', 'Type', 'Date From', 'Date To', 'Created At', 'Actions'].map((heading) => (
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em]" key={heading}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFF2F6]">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-4 py-3 text-slate-600">{report.id}</td>
                  <td className="px-4 py-3 text-slate-600">{report.type}</td>
                  <td className="px-4 py-3 text-slate-600">{report.dateFrom}</td>
                  <td className="px-4 py-3 text-slate-600">{report.dateTo}</td>
                  <td className="px-4 py-3 text-slate-600">{new Date(report.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <button className="rounded-[8px] border border-slate-300 bg-[#F8FAFC] px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-[#EEF4FF]">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && !isLoading ? (
                <tr>
                  <td className="px-4 py-8 text-center text-slate-500" colSpan={6}>No reports found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default ITReports;