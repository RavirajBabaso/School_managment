import { useMemo, useState } from 'react';

import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

import Badge from '../../components/common/Badge';
import TaskTable from '../../components/tables/TaskTable';

const adminTasks = [
  {
    id: 1,
    title: 'Staff Onboarding Documentation',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    start_date: '2026-05-01',
    due_date: '2026-05-10',
    departmentName: 'Admin Office',
    assignedToName: 'Admin Team'
  },
  {
    id: 2,
    title: 'Office Supplies Inventory',
    priority: 'MEDIUM',
    status: 'PENDING',
    start_date: '2026-05-03',
    due_date: '2026-05-15',
    departmentName: 'Admin Office',
    assignedToName: 'Admin Staff'
  },
  {
    id: 3,
    title: 'Visitor Management System Update',
    priority: 'LOW',
    status: 'COMPLETED',
    start_date: '2026-05-01',
    due_date: '2026-05-08',
    departmentName: 'Admin Office',
    assignedToName: 'Reception Team'
  },
  {
    id: 4,
    title: 'Facility Maintenance Request',
    priority: 'HIGH',
    status: 'PENDING',
    start_date: '2026-05-05',
    due_date: '2026-05-12',
    departmentName: 'Admin Office',
    assignedToName: 'Facilities Team'
  },
  {
    id: 5,
    title: 'Staff ID Card Distribution',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    start_date: '2026-05-02',
    due_date: '2026-05-09',
    departmentName: 'Admin Office',
    assignedToName: 'HR Coordination'
  },
  {
    id: 6,
    title: 'Parking Allocation Update',
    priority: 'LOW',
    status: 'DELAYED',
    start_date: '2026-04-28',
    due_date: '2026-05-05',
    departmentName: 'Admin Office',
    assignedToName: 'Security Team'
  }
];

function AdminTasks() {

  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'>('ALL');

  const filteredTasks = useMemo(() => {
    if (filter === 'ALL') return adminTasks;
    return adminTasks.filter(task => task.status === filter);
  }, [filter]);

  const stats = useMemo(
    () => [
      { label: 'Pending', value: adminTasks.filter(t => t.status === 'PENDING').length, color: '#60A5FA' },
      { label: 'In Progress', value: adminTasks.filter(t => t.status === 'IN_PROGRESS').length, color: '#FBBF24' },
      { label: 'Completed', value: adminTasks.filter(t => t.status === 'COMPLETED').length, color: '#34D399' },
      { label: 'Delayed', value: adminTasks.filter(t => t.status === 'DELAYED').length, color: '#F87171' }
    ],
    []
  );

  return (
    <div className="flex min-h-screen bg-[#F5F7FB] text-slate-950">

      <Sidebar />

      <main className="min-w-0 flex-1">

        <Navbar />

        <section className="space-y-6 p-6">

          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <Badge variant="blue">
                  Admin Office Department
                </Badge>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                  Admin Tasks
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
                  Manage and track all administrative tasks, assignments, and deadlines.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-[22px] border border-blue-500/20 bg-blue-500/10 px-5 py-4">

                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                    Total Tasks
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-blue-800">
                    {adminTasks.length}
                  </h2>
                </div>

                <div className="rounded-[22px] border border-emerald-500/20 bg-emerald-500/10 px-5 py-4">

                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Completed
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-emerald-800">
                    {stats[2].value}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="text-lg font-semibold text-slate-950">
                  Task List
                </h2>

                <p className="mt-1 text-sm text-slate-600">
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
                        : 'border border-slate-300 bg-[#F8FAFC] text-slate-600 hover:bg-[#EEF4FF] hover:text-slate-950'
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

export default AdminTasks;
