import { useQuery } from '@tanstack/react-query';
import { getStaffPerformance, getMonthlyComparison } from '../../services/dashboardService';
import PerformanceChart from '../../components/charts/PerformanceChart';

interface PerformanceData {
  userId: number;
  name: string;
  role: string;
  totalTasks: number;
  completedTasks: number;
  delayedTasks: number;
  performanceScore: number;
  delayRate: number;
}

interface MonthlyData {
  month: string;
  completionRate: number;
}

function PerformanceAnalytics() {
  const { data: performanceData, isLoading: performanceLoading } = useQuery({
    queryKey: ['staffPerformance'],
    queryFn: getStaffPerformance
  });

  const { data: monthlyData, isLoading: monthlyLoading } = useQuery({
    queryKey: ['monthlyComparison'],
    queryFn: getMonthlyComparison
  });

  if (performanceLoading || monthlyLoading) {
    return <div className="p-6">Loading...</div>;
  }

  // Calculate KPIs
  const totalUsers = performanceData?.length || 0;
  const totalTasks = performanceData?.reduce((sum, user) => sum + user.totalTasks, 0) || 0;
  const totalCompleted = performanceData?.reduce((sum, user) => sum + user.completedTasks, 0) || 0;
  const totalDelayed = performanceData?.reduce((sum, user) => sum + user.delayedTasks, 0) || 0;

  const schoolAvg = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
  const delayRate = totalTasks > 0 ? Math.round((totalDelayed / totalTasks) * 100) : 0;

  const topPerformer = performanceData?.reduce((top, user) =>
    user.performanceScore > top.performanceScore ? user : top
  );

  // Prepare chart data - aggregate all departments for 6-month view
  const chartData: MonthlyData[] = [];
  if (monthlyData && monthlyData.length > 0) {
    // Get unique months
    const months = new Set<string>();
    monthlyData.forEach(dept => {
      dept.monthlyRates.forEach(rate => months.add(rate.month));
    });

    Array.from(months).sort().forEach(month => {
      const monthRates = monthlyData.flatMap(dept =>
        dept.monthlyRates.filter(rate => rate.month === month)
      );
      const totalTasks = monthRates.reduce((sum, rate) => sum + rate.totalTasks, 0);
      const totalCompleted = monthRates.reduce((sum, rate) => sum + rate.completedTasks, 0);
      const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

      chartData.push({
        month,
        completionRate
      });
    });
  }

  return (
  <div className="space-y-6">
    {/* KPI Cards */}
    <section className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)]">
            Performance analytics
          </p>

          <h1 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">
            Staff Performance
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
            Monitor staff productivity, completion rates and overall operational performance.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {/* Top Performer */}
        <div className="rounded-[22px] border border-[var(--border-color)] bg-[var(--surface)] p-5 transition-all hover:shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6F1FB] text-lg font-bold text-[#0C447C]">
              👤
            </div>

            <div>
              <p className="text-sm text-[var(--text-secondary)]">
                Top performer
              </p>

              <h2 className="mt-1 text-lg font-semibold text-[var(--text-primary)]">
                {topPerformer?.name || 'N/A'}
              </h2>
            </div>
          </div>
        </div>

        {/* School Avg */}
        <div className="rounded-[22px] border border-[var(--border-color)] bg-[var(--surface)] p-5 transition-all hover:shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDF9F1] text-lg font-bold text-[#16A34A]">
              📊
            </div>

            <div>
              <p className="text-sm text-[var(--text-secondary)]">
                School average
              </p>

              <h2 className="mt-1 text-lg font-semibold text-[var(--text-primary)]">
                {schoolAvg}%
              </h2>
            </div>
          </div>
        </div>

        {/* Delay Rate */}
        <div className="rounded-[22px] border border-[var(--border-color)] bg-[var(--surface)] p-5 transition-all hover:shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEF2F2] text-lg font-bold text-[#DC2626]">
              ⚠️
            </div>

            <div>
              <p className="text-sm text-[var(--text-secondary)]">
                Delay rate
              </p>

              <h2 className="mt-1 text-lg font-semibold text-[var(--text-primary)]">
                {delayRate}%
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Chart */}
    <section className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
            Monthly comparison
          </p>

          <h2 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
            6-Month Completion Trend
          </h2>
        </div>
      </div>

      <div className="mt-6">
        <PerformanceChart data={chartData} />
      </div>
    </section>

    {/* Staff Table */}
    <section className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
            Staff overview
          </p>

          <h2 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
            Staff Performance Table
          </h2>
        </div>

        <span className="rounded-full bg-[#EDF9F1] px-3 py-1 text-xs font-semibold text-[#1D9E75]">
          {totalUsers} staff
        </span>
      </div>

      <div className="mt-6 overflow-x-auto rounded-[22px] border border-[var(--border-color)]">
        <table className="min-w-full divide-y divide-[var(--border-color)]">
          <thead className="bg-[var(--surface)]">
            <tr>
              {[
                'Name',
                'Role',
                'Total Tasks',
                'Completed',
                'Delayed',
                'Performance',
                'Delay Rate'
              ].map((head) => (
                <th
                  key={head}
                  className="px-4 py-4 text-left text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--text-secondary)]"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border-color)] bg-[var(--card-bg)]">
            {performanceData?.map((user: PerformanceData) => (
              <tr
                key={user.userId}
                className="transition hover:bg-[var(--bg-tertiary)]"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6F1FB] text-sm font-semibold text-[#0C447C]">
                      {user.name
                        .split(' ')
                        .map((w) => w[0])
                        .join('')
                        .slice(0, 2)}
                    </div>

                    <span className="font-medium text-[var(--text-primary)]">
                      {user.name}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-4 text-sm text-[var(--text-secondary)]">
                  {user.role}
                </td>

                <td className="px-4 py-4 text-sm text-[var(--text-primary)]">
                  {user.totalTasks}
                </td>

                <td className="px-4 py-4 text-sm text-[#16A34A]">
                  {user.completedTasks}
                </td>

                <td className="px-4 py-4 text-sm text-[#DC2626]">
                  {user.delayedTasks}
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-24 rounded-full bg-[var(--surface)]">
                      <div
                        className="h-2 rounded-full bg-[#378ADD]"
                        style={{
                          width: `${user.performanceScore}%`
                        }}
                      />
                    </div>

                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {user.performanceScore}%
                    </span>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      user.delayRate <= 10
                        ? 'bg-[#EDF9F1] text-[#16A34A]'
                        : user.delayRate <= 30
                        ? 'bg-[#FFF7ED] text-[#EA580C]'
                        : 'bg-[#FEF2F2] text-[#DC2626]'
                    }`}
                  >
                    {user.delayRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  </div>
);
};

export default PerformanceAnalytics;