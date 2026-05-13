import { useITAnalytics } from '../../hooks/useIT';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

function ITAnalytics() {
  const { data: analytics, isLoading } = useITAnalytics();

  if (isLoading || !analytics) {
    return <div className="p-6">Loading analytics...</div>;
  }

  const pieData = [
    { name: 'Pending', value: analytics.taskDistribution.pending, color: '#185FA5' },
    { name: 'In Progress', value: analytics.taskDistribution.inProgress, color: '#BA7517' },
    { name: 'Completed', value: analytics.taskDistribution.completed, color: '#639922' },
    { name: 'Delayed', value: analytics.taskDistribution.delayed, color: '#E24B4A' }
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Task Distribution</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.monthlyPerformance}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#639922" name="Completed" />
              <Bar dataKey="delayed" fill="#E24B4A" name="Delayed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Performance Trend</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.monthlyPerformance}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#639922" name="Completed" />
              <Line type="monotone" dataKey="total" stroke="#185FA5" name="Total" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

export default ITAnalytics;