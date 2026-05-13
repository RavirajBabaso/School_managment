import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useHRAnalytics } from '../../hooks/useHR';

const COLORS = ['#185FA5', '#BA7517', '#639922', '#E24B4A'];

function HRAnalytics() {
  const { data, isLoading } = useHRAnalytics();

  const pieData = useMemo(() => {
    if (!data) return [];
    return [
      { name: 'Pending', value: data.taskDistribution.pending },
      { name: 'In Progress', value: data.taskDistribution.inProgress },
      { name: 'Completed', value: data.taskDistribution.completed },
      { name: 'Delayed', value: data.taskDistribution.delayed }
    ];
  }, [data]);

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <p className="text-sm text-slate-500">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">HR Analytics</p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-950">Performance Metrics</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Monitor task completion, staff performance, and department efficiency.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[18px] border border-[#EFF2F6] bg-[#F8FAFC] p-4 text-center">
              <p className="text-xs text-slate-500">Completion Rate</p>
              <p className="mt-1 text-2xl font-bold text-[#639922]">{data.completionRate}%</p>
            </div>
            <div className="rounded-[18px] border border-[#EFF2F6] bg-[#F8FAFC] p-4 text-center">
              <p className="text-xs text-slate-500">HR Efficiency</p>
              <p className="mt-1 text-2xl font-bold text-[#185FA5]">{data.hREfficiency}%</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Task Distribution</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={100} paddingAngle={5}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Monthly Performance</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={data.monthlyPerformance}>
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Bar dataKey="completed" fill="#639922" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delayed" fill="#E24B4A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Staff Performance</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={data.staffPerformance}>
              <XAxis dataKey="staff" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip />
              <Line dataKey="completed" stroke="#639922" strokeWidth={2} />
              <Line dataKey="total" stroke="#185FA5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

export default HRAnalytics;