import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

function PropertyAnnouncements() {

  const announcements = [
    {
      id: 1,
      title:
        'Infrastructure Inspection',

      message:
        'Campus-wide infrastructure inspection is scheduled for Friday. Ensure all maintenance logs are updated before inspection.',

      type: 'info',

      date: '10 May 2026'
    },
    {
      id: 2,
      title:
        'Generator Maintenance Delay',

      message:
        'The generator servicing task has been delayed due to pending spare parts delivery. Revised completion date will be updated shortly.',

      type: 'warning',

      date: '09 May 2026'
    },
    {
      id: 3,
      title:
        'Budget Approved',

      message:
        'Chairman approved the new maintenance budget for infrastructure upgrades and classroom electrical repairs.',

      type: 'success',

      date: '08 May 2026'
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
                  Announcements
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  View department broadcasts, maintenance alerts, infrastructure updates, and institution-wide announcements.
                </p>
              </div>

              <div className="hidden rounded-[22px] border border-blue-500/20 bg-blue-500/10 px-5 py-4 lg:block">

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
                  Total
                </p>

                <h2 className="mt-2 text-3xl font-bold text-blue-400">
                  3
                </h2>
              </div>
            </div>
          </div>

          {/* Announcement Cards */}
          <div className="space-y-5">

            {announcements.map(
              (
                announcement
              ) => (
                <div
                  key={
                    announcement.id
                  }
                  className={`rounded-[28px] border p-6 shadow-sm transition-all duration-200 hover:scale-[1.01] ${
                    announcement.type ===
                    'warning'
                      ? 'border-amber-500/20 bg-amber-500/10'
                      : announcement.type ===
                        'success'
                      ? 'border-emerald-500/20 bg-emerald-500/10'
                      : 'border-blue-500/20 bg-blue-500/10'
                  }`}
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <h2 className="text-xl font-semibold text-white">
                        {
                          announcement.title
                        }
                      </h2>

                      <p className="mt-4 text-sm leading-7 text-slate-200">
                        {
                          announcement.message
                        }
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full border border-slate-700 bg-[#0F172A] px-3 py-1 text-xs font-medium text-slate-400">
                      {
                        announcement.date
                      }
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">

                    <div className="flex items-center gap-2">

                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          announcement.type ===
                          'warning'
                            ? 'bg-amber-400'
                            : announcement.type ===
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

export default PropertyAnnouncements;