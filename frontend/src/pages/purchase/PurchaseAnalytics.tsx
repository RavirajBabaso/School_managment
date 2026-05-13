import { usePurchaseAnalytics } from '../../hooks/usePurchase';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

const COLORS = ['#185FA5', '#BA7517', '#639922', '#E24B4A'];

function PurchaseAnalytics() {
  const { data, isLoading } = usePurchaseAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">No analytics data available.</p>
        </div>
      </div>
    );
  }

  const statusData = [
    { name: 'Pending', value: data.taskDistribution.pending, color: '#185FA5' },
    { name: 'In Progress', value: data.taskDistribution.inProgress, color: '#BA7517' },
    { name: 'Completed', value: data.taskDistribution.completed, color: '#639922' },
    { name: 'Delayed', value: data.taskDistribution.delayed, color: '#E24B4A' }
  ];

  const priorityData = [
    { name: 'High', value: data.priorityDistribution.high, color: '#E24B4A' },
    { name: 'Medium', value: data.priorityDistribution.medium, color: '#BA7517' },
    { name: 'Low', value: data.priorityDistribution.low, color: '#639922' }
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Procurement Insights</p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-950">Procurement Analytics</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Detailed analytics on procurement performance, vendor coordination, and purchase operations.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[22px] border border-[#EFF2F6] bg-white p-5 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Completion Rate</p>
          <p className="mt-2 text-3xl font-semibold text-[#639922]">{data.completionRate}%</p>
          <p className="mt-1 text-xs text-slate-600">Tasks completed successfully</p>
        </div>
        <div className="rounded-[22px] border border-[#EFF2F6] bg-white p-5 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Delay Percentage</p>
          <p className="mt-2 text-3xl font-semibold text-[#E24B4A]">{data.delayPercentage}%</p>
          <p className="mt-1 text-xs text-slate-600">Tasks experiencing delays</p>
        </div>
        <div className="rounded-[22px] border border-[#EFF2F6] bg-white p-5 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Procurement Efficiency</p>
          <p className="mt-2 text-3xl font-semibold text-[#185FA5]">{data.procurementEfficiency}</p>
          <p className="mt-1 text-xs text-slate-600">Overall efficiency score</p>
        </div>
        <div className="rounded-[22px] border border-[#EFF2F6] bg-white p-5 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Total Tasks</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{data.taskDistribution.total}</p>
          <p className="mt-1 text-xs text-slate-600">Procurement tasks assigned</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Task Status Distribution</h2>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Priority Distribution</h2>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Monthly Performance Trend</h2>
        <p className="mt-1 text-sm text-slate-600">Procurement task completion vs delays over the last 6 months</p>
        <div className="mt-6 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EFF2F6" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip
                contentStyle={{
                  borderRadius: '16px',
                  border: '1px solid #EFF2F6',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="#639922" strokeWidth={3} name="Completed" dot={{ fill: '#639922', r: 4 }} />
              <Line type="monotone" dataKey="delayed" stroke="#E24B4A" strokeWidth={3} name="Delayed" dot={{ fill: '#E24B4A', r: 4 }} />
              <Line type="monotone" dataKey="total" stroke="#185FA5" strokeWidth={3} name="Total" dot={{ fill: '#185FA5', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Vendor Performance</h2>
        <p className="mt-1 text-sm text-slate-600">Efficiency scores based on task completion and delays</p>
        <div className="mt-6 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.vendorPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#EFF2F6" />
              <XAxis type="number" stroke="#64748B" fontSize={12} />
              <YAxis dataKey="vendor" type="category" stroke="#64748B" fontSize={12} width={120} />
              <Tooltip
                contentStyle={{
                  borderRadius: '16px',
                  border: '1px solid #EFF2F6',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="completed" fill="#639922" name="Completed" />
              <Bar dataKey="delayed" fill="#E24B4A" name="Delayed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

export default PurchaseAnalytics;
