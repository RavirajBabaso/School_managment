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
                  Announcements
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
                  View department broadcasts, maintenance alerts, infrastructure updates, and institution-wide announcements.
                </p>
              </div>

              <div className="hidden rounded-[22px] border border-blue-500/20 bg-blue-500/10 px-5 py-4 lg:block">

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Total
                </p>

                <h2 className="mt-2 text-3xl font-bold text-blue-800">
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

                      <h2 className="text-xl font-semibold text-slate-950">
                        {
                          announcement.title
                        }
                      </h2>

                      <p className="mt-4 text-sm leading-7 text-slate-800">
                        {
                          announcement.message
                        }
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full border border-slate-300 bg-[#F8FAFC] px-3 py-1 text-xs font-medium text-slate-600">
                      {
                        announcement.date
                      }
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">

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

                      <span className="text-xs font-medium text-slate-600">
                        Property Department
                      </span>
                    </div>

                    <button
                      type="button"
                      className="rounded-[12px] border border-slate-300 bg-[#F8FAFC] px-4 py-2 text-xs font-semibold text-slate-700 transition-all duration-200 hover:bg-[#EEF4FF] hover:text-slate-950"
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
