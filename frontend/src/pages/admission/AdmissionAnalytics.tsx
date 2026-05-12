import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useAdmissionAnalytics } from '../../hooks/useAdmission';

function AdmissionAnalytics() {
  const { data, isLoading } = useAdmissionAnalytics();

  if (isLoading || !data) {
    return <div className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 text-sm text-slate-500">Loading analytics...</div>;
  }

  const distribution = [
    { name: 'Pending', value: data.taskDistribution.pending, color: '#185FA5' },
    { name: 'In Progress', value: data.taskDistribution.inProgress, color: '#BA7517' },
    { name: 'Completed', value: data.taskDistribution.completed, color: '#639922' },
    { name: 'Delayed', value: data.taskDistribution.delayed, color: '#E24B4A' }
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
        <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Marketing analytics</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-950">Admission & Campaign Performance</h1>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {[
            ['Completion', `${data.completionRate}%`, '#639922'],
            ['Delay', `${data.delayPercentage}%`, '#E24B4A'],
            ['Inquiry conversion', `${data.inquiryConversionPerformance}%`, '#185FA5'],
            ['Department efficiency', `${data.departmentEfficiency}%`, '#BA7517']
          ].map(([label, value, color]) => (
            <div className="rounded-[20px] border border-[#EFF2F6] bg-[#F8FAFC] p-4" key={label}>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
              <p className="mt-3 text-2xl font-semibold" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Task Distribution</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={distribution} dataKey="value" nameKey="name" outerRadius={92}>
                  {distribution.map((entry) => <Cell fill={entry.color} key={entry.name} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Campaign Performance</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer>
              <BarChart data={data.campaignPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="campaign" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="inquiries" fill="#185FA5" />
                <Bar dataKey="conversions" fill="#639922" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Monthly Admission Performance</h2>
        <div className="mt-5 h-72">
          <ResponsiveContainer>
            <LineChart data={data.monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="inquiries" stroke="#185FA5" strokeWidth={3} />
              <Line dataKey="completed" stroke="#639922" strokeWidth={3} />
              <Line dataKey="delayed" stroke="#E24B4A" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

export default AdmissionAnalytics;
