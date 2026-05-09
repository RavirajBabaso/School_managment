import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

function PropertyNotifications() {

  const notifications = [
    {
      id: 1,
      title:
        'New Task Assigned',

      message:
        'Electrical maintenance task has been assigned for Block A classrooms.',

      type: 'info',

      time: '5 min ago'
    },

    {
      id: 2,
      title:
        'Task Delayed',

      message:
        'Generator servicing task deadline has been exceeded by 2 days.',

      type: 'warning',

      time: '20 min ago'
    },

    {
      id: 3,
      title:
        'Maintenance Completed',

      message:
        'CCTV installation work completed successfully.',

      type: 'success',

      time: '1 hour ago'
    },

    {
      id: 4,
      title:
        'Chairman Announcement',

      message:
        'Infrastructure audit meeting scheduled for Friday.',

      type: 'info',

      time: 'Today'
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#020817] text-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="min-w-0 flex-1">

        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <section className="space-y-6 p-6">

          {/* Header */}
          <div className="overflow-hidden rounded-[32px] border border-slate-800 bg-gradient-to-br from-[#111827] via-[#0F172A] to-[#172554] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">

            <div className="flex items-center justify-between gap-5">

              <div>

                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                  Property & Maintenance
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
                  Notifications
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Monitor task alerts, delayed maintenance updates, infrastructure activities, and system notifications in real time.
                </p>
              </div>

              <div className="hidden rounded-[22px] border border-red-500/20 bg-red-500/10 px-5 py-4 lg:block">

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-300">
                  Unread
                </p>

                <h2 className="mt-2 text-3xl font-bold text-red-400">
                  4
                </h2>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-5">

            {notifications.map(
              (
                notification
              ) => (
                <div
                  key={
                    notification.id
                  }
                  className={`rounded-[28px] border p-6 shadow-sm transition-all duration-200 hover:scale-[1.01] ${
                    notification.type ===
                    'warning'
                      ? 'border-amber-500/20 bg-amber-500/10'
                      : notification.type ===
                        'success'
                      ? 'border-emerald-500/20 bg-emerald-500/10'
                      : 'border-blue-500/20 bg-blue-500/10'
                  }`}
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <h2 className="text-lg font-semibold text-white">
                        {
                          notification.title
                        }
                      </h2>

                      <p className="mt-3 text-sm leading-7 text-slate-200">
                        {
                          notification.message
                        }
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full border border-slate-700 bg-[#0F172A] px-3 py-1 text-xs font-medium text-slate-400">
                      {
                        notification.time
                      }
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">

                    <div className="flex items-center gap-2">

                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          notification.type ===
                          'warning'
                            ? 'bg-amber-400'
                            : notification.type ===
                              'success'
                            ? 'bg-emerald-400'
                            : 'bg-blue-400'
                        }`}
                      />

                      <span className="text-xs font-medium text-slate-400">
                        Property Department
                      </span>
                    </div>

                    <button
                      type="button"
                      className="rounded-[12px] border border-slate-700 bg-[#0F172A] px-4 py-2 text-xs font-semibold text-slate-300 transition-all duration-200 hover:bg-[#172036] hover:text-white"
                    >
                      Mark as Read
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default PropertyNotifications;