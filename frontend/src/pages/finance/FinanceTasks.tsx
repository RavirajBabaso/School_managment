import { useMemo, useState } from 'react';

import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

import Badge from '../../components/common/Badge';
import TaskTable from '../../components/tables/TaskTable';

const financeTasks = [
  {
    id: 1,
    title: 'Monthly Budget Review',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    start_date: '2026-05-01',
    due_date: '2026-05-10',
    departmentName: 'Finance',
    assignedToName: 'Finance Team'
  },
  {
    id: 2,
    title: 'Expense Report Analysis',
    priority: 'MEDIUM',
    status: 'PENDING',
    start_date: '2026-05-03',
    due_date: '2026-05-15',
    departmentName: 'Finance',
    assignedToName: 'Accounts Team'
  },
  {
    id: 3,
    title: 'Audit Preparation',
    priority: 'LOW',
    status: 'COMPLETED',
    start_date: '2026-05-01',
    due_date: '2026-05-08',
    departmentName: 'Finance',
    assignedToName: 'Audit Team'
  },
  {
    id: 4,
    title: 'Quarterly Tax Filing',
    priority: 'HIGH',
    status: 'PENDING',
    start_date: '2026-05-05',
    due_date: '2026-05-20',
    departmentName: 'Finance',
    assignedToName: 'Tax Team'
  },
  {
    id: 5,
    title: 'Vendor Payment Processing',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    start_date: '2026-05-02',
    due_date: '2026-05-12',
    departmentName: 'Finance',
    assignedToName: 'Accounts Payable'
  },
  {
    id: 6,
    title: 'Financial Statement Review',
    priority: 'HIGH',
    status: 'DELAYED',
    start_date: '2026-04-28',
    due_date: '2026-05-05',
    departmentName: 'Finance',
    assignedToName: 'Finance Manager'
  }
];

function FinanceTasks() {

  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'>('ALL');

  const filteredTasks = useMemo(() => {
    if (filter === 'ALL') return financeTasks;
    return financeTasks.filter(task => task.status === filter);
  }, [filter]);

  const stats = useMemo(
    () => [
      { label: 'Pending', value: financeTasks.filter(t => t.status === 'PENDING').length, color: '#60A5FA' },
      { label: 'In Progress', value: financeTasks.filter(t => t.status === 'IN_PROGRESS').length, color: '#FBBF24' },
      { label: 'Completed', value: financeTasks.filter(t => t.status === 'COMPLETED').length, color: '#34D399' },
      { label: 'Delayed', value: financeTasks.filter(t => t.status === 'DELAYED').length, color: '#F87171' }
    ],
    []
  );

  return (
    <div className="flex min-h-screen bg-[#020817] text-white">

      <Sidebar />

      <main className="min-w-0 flex-1">

        <Navbar />

        <section className="space-y-6 p-6">

          <div className="overflow-hidden rounded-[32px] border border-slate-800 bg-gradient-to-br from-[#111827] via-[#0F172A] to-[#172554] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <Badge variant="blue">
                  Finance Department
                </Badge>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
                  Finance Tasks
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Manage and track all finance-related tasks, assignments, and deadlines.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-[22px] border border-blue-500/20 bg-blue-500/10 px-5 py-4">

                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
                    Total Tasks
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-blue-400">
                    {financeTasks.length}
                  </h2>
                </div>

                <div className="rounded-[22px] border border-emerald-500/20 bg-emerald-500/10 px-5 py-4">

                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    Completed
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-emerald-400">
                    {stats[2].value}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-800 bg-[#111827] p-6 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="text-lg font-semibold text-white">
                  Task List
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {filteredTasks.length} tasks found
                </p>
              </div>

              <div className="flex gap-2">

                {(['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${
                      filter === status
                        ? 'bg-[#185FA5] text-white'
                        : 'border border-slate-700 bg-[#0F172A] text-slate-400 hover:bg-[#172036] hover:text-white'
                    }`}
                  >
                    {status === 'ALL' ? 'All' : status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <TaskTable tasks={filteredTasks as any} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default FinanceTasks;