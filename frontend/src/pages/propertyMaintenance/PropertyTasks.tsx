import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

import Badge from '../../components/common/Badge';

function PropertyTasks() {

  const tasks = [
    {
      id: 1,
      title:
        'Electrical Maintenance',

      assignedTo:
        'Maintenance Team',

      priority: 'HIGH',

      status:
        'IN_PROGRESS',

      startDate:
        '10 May 2026',

      dueDate:
        '15 May 2026'
    },

    {
      id: 2,
      title:
        'Generator Service',

      assignedTo:
        'Service Team',

      priority:
        'MEDIUM',

      status:
        'PENDING',

      startDate:
        '08 May 2026',

      dueDate:
        '18 May 2026'
    },

    {
      id: 3,
      title:
        'CCTV Installation',

      assignedTo:
        'IT Support',

      priority: 'LOW',

      status:
        'COMPLETED',

      startDate:
        '05 May 2026',

      dueDate:
        '09 May 2026'
    },

    {
      id: 4,
      title:
        'Water Pipeline Repair',

      assignedTo:
        'Infrastructure Team',

      priority: 'HIGH',

      status:
        'DELAYED',

      startDate:
        '01 May 2026',

      dueDate:
        '07 May 2026'
    }
  ];

  const getPriorityClass = (
    priority: string
  ) => {

    switch (priority) {

      case 'HIGH':
        return 'border-red-200 bg-red-50 text-red-700';

      case 'MEDIUM':
        return 'border-amber-200 bg-amber-50 text-amber-700';

      default:
        return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    }
  };

  const getStatusVariant = (
    status: string
  ) => {

    switch (status) {

      case 'COMPLETED':
        return 'green';

      case 'IN_PROGRESS':
        return 'amber';

      case 'DELAYED':
        return 'red';

      default:
        return 'blue';
    }
  };

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

          {/* Header */}
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex items-center justify-between gap-5">

              <div>

                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                  Property & Maintenance
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  Assigned Tasks
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
                  Track maintenance requests, infrastructure tasks, delayed repairs, and operational activities.
                </p>
              </div>

              <div className="hidden rounded-[22px] border border-blue-500/20 bg-blue-500/10 px-5 py-4 lg:block">

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Total Tasks
                </p>

                <h2 className="mt-2 text-3xl font-bold text-blue-800">
                  24
                </h2>
              </div>
            </div>
          </div>

          {/* Task Table */}
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="min-w-full border-collapse">

                <thead>

                  <tr className="border-b border-slate-200 bg-[#F8FAFC]">

                    {[
                      'Task',
                      'Assigned To',
                      'Priority',
                      'Status',
                      'Start Date',
                      'Due Date',
                      'Actions'
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>

                  {tasks.map(
                    (task) => (
                      <tr
                        key={task.id}
                        className="border-b border-slate-200 transition-all duration-200 hover:bg-[#EEF4FF]"
                      >

                        {/* Task */}
                        <td className="px-5 py-5">

                          <div>

                            <h3 className="text-sm font-semibold text-slate-950">
                              {task.title}
                            </h3>

                            <p className="mt-1 text-xs text-slate-600">
                              Property Department
                            </p>
                          </div>
                        </td>

                        {/* Assigned */}
                        <td className="px-5 py-5 text-sm text-slate-700">
                          {task.assignedTo}
                        </td>

                        {/* Priority */}
                        <td className="px-5 py-5">

                          <span
                            className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${getPriorityClass(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-5">

                          <Badge
                            variant={
                              getStatusVariant(
                                task.status
                              ) as any
                            }
                          >
                            {task.status.replace(
                              '_',
                              ' '
                            )}
                          </Badge>
                        </td>

                        {/* Start */}
                        <td className="px-5 py-5 text-sm text-slate-700">
                          {task.startDate}
                        </td>

                        {/* Due */}
                        <td className="px-5 py-5 text-sm text-slate-700">
                          {task.dueDate}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-5">

                          <button
                            type="button"
                            className="rounded-[12px] border border-slate-300 bg-[#F8FAFC] px-4 py-2 text-xs font-semibold text-slate-700 transition-all duration-200 hover:bg-[#EEF4FF] hover:text-slate-950"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PropertyTasks;
