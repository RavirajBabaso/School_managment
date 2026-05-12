import { useMemo } from 'react';

import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

import Badge from '../../components/common/Badge';
import StatGrid from '../../components/common/StatGrid';
import TaskTable from '../../components/tables/TaskTable';

function FinanceDashboard() {

  const stats = useMemo(
    () => [
      {
        label: 'Assigned Tasks',
        value: 18,
        color: '#60A5FA',
        sub: 'Updated today'
      },
      {
        label: 'In Progress',
        value: 8,
        color: '#FBBF24',
        sub: 'Active tasks'
      },
      {
        label: 'Completed',
        value: 14,
        color: '#34D399',
        sub: 'Finished tasks'
      },
      {
        label: 'Delayed',
        value: 2,
        color: '#F87171',
        sub: 'Need attention'
      }
    ],
    []
  );

  const tasks = [
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
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#F5F7FB] text-slate-950">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="min-w-0 flex-1">

        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <section className="space-y-6 p-6">

          {/* Hero */}
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <Badge variant="blue">
                  Finance Department
                </Badge>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                  Finance Dashboard
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
                  Monitor financial operations, budget tracking, expense management, audit preparation, and financial reporting updates.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-[22px] border border-blue-500/20 bg-blue-500/10 px-5 py-4">

                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                    Pending
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-blue-800">
                    8
                  </h2>
                </div>

                <div className="rounded-[22px] border border-emerald-500/20 bg-emerald-500/10 px-5 py-4">

                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Completed
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-emerald-800">
                    14
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <StatGrid items={stats} />

          {/* Main Grid */}
          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">

            {/* Tasks */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-5 flex items-center justify-between">

                <div>

                  <h2 className="text-lg font-semibold text-slate-950">
                    Assigned Tasks
                  </h2>

                  <p className="mt-1 text-sm text-slate-600">
                    View and manage ongoing financial activities.
                  </p>
                </div>

                <Badge variant="blue">
                  18 Tasks
                </Badge>
              </div>

              <TaskTable
                tasks={tasks as any}
              />
            </div>

            {/* Right Side */}
            <div className="space-y-6">

              {/* Notifications */}
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <h2 className="text-lg font-semibold text-slate-950">
                    Notifications
                  </h2>

                  <Badge variant="red">
                    2 New
                  </Badge>
                </div>

                <div className="mt-5 space-y-4">

                  {[
                    {
                      text: 'Budget approval pending.',
                      type: 'blue'
                    },
                    {
                      text: 'Monthly report due.',
                      type: 'amber'
                    },
                    {
                      text: 'Audit scheduled next week.',
                      type: 'green'
                    }
                  ].map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={index}
                        className={`rounded-[20px] border p-4 ${
                          item.type ===
                          'amber'
                            ? 'border-amber-500/20 bg-amber-500/10'
                            : item.type ===
                              'green'
                            ? 'border-emerald-500/20 bg-emerald-500/10'
                            : 'border-blue-500/20 bg-blue-500/10'
                        }`}
                      >

                        <p className="text-sm text-slate-950">
                          {
                            item.text
                          }
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Announcements */}
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <h2 className="text-lg font-semibold text-slate-950">
                    Announcements
                  </h2>

                  <span className="text-xs text-slate-500">
                    Latest
                  </span>
                </div>

                <div className="mt-5 space-y-4">

                  {[
                    'Q2 budget allocation approved.',
                    'New expense policy effective Monday.',
                    'Annual audit starting next week.'
                  ].map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={index}
                        className="rounded-[18px] border border-slate-200 bg-[#F8FAFC] p-4 transition-all duration-200 hover:bg-[#EEF4FF]"
                      >

                        <p className="text-sm leading-6 text-slate-700">
                          {item}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default FinanceDashboard;
