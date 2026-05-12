import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../components/common/Button';
import { usePrincipalReports } from '../../hooks/usePrincipal';
import * as principalService from '../../services/principalService';

function AcademicReports() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = usePrincipalReports();
  const now = new Date();

  const generate = useMutation({
    mutationFn: (type: 'daily' | 'weekly' | 'monthly') => {
      if (type === 'daily') {
        return principalService.generatePrincipalReport('daily', { date: now.toISOString() });
      }
      if (type === 'weekly') {
        return principalService.generatePrincipalReport('weekly', { week: now.toISOString() });
      }
      return principalService.generatePrincipalReport('monthly', {
        month: now.getMonth() + 1,
        year: now.getFullYear()
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['principal-reports'] })
  });

  return (
    <div className="space-y-6">
      <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
        <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Reports & MIS</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-950">Academic Reports</h1>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button loading={generate.isPending} onClick={() => generate.mutate('daily')}>Daily Report</Button>
          <Button loading={generate.isPending} onClick={() => generate.mutate('weekly')} variant="ghost">Weekly Report</Button>
          <Button loading={generate.isPending} onClick={() => generate.mutate('monthly')} variant="ghost">Monthly MIS</Button>
        </div>
      </section>

      <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Report History</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full divide-y divide-[#EFF2F6] text-left text-sm">
            <thead className="bg-[#F8FAFC] text-slate-500">
              <tr>{['Type', 'Generated', 'Period', 'Downloads'].map((heading) => <th className="px-4 py-3 text-[11px] uppercase tracking-[0.2em]" key={heading}>{heading}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-[#EFF2F6]">
              {isLoading ? <tr><td className="px-4 py-6 text-slate-500" colSpan={4}>Loading reports...</td></tr> : null}
              {data.map((report) => (
                <tr key={report.id}>
                  <td className="px-4 py-4 font-semibold text-slate-950">{report.type}</td>
                  <td className="px-4 py-4 text-slate-600">{new Date(report.createdAt).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-4 text-slate-600">{new Date(report.dateFrom).toLocaleDateString('en-IN')} - {new Date(report.dateTo).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">PDF</Button>
                      <Button size="sm" variant="ghost">Excel</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AcademicReports;
