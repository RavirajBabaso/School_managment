import { useMemo } from 'react';

import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

import Badge from '../../components/common/Badge';

interface AnnouncementItem {
  id: number;
  title: string;
  message: string;
  date: string;
  sender: string;
  target: 'ALL' | 'DEPARTMENT';
}

const announcements: AnnouncementItem[] = [
  {
    id: 1,
    title: 'Q2 Budget Allocation Approved',
    message: 'The Q2 budget allocation has been approved by the Chairman. Please review the updated budget sheets and adjust your department spending accordingly. New budget limits are effective from May 1st.',
    date: 'May 5, 2026',
    sender: 'Chairman Office',
    target: 'ALL'
  },
  {
    id: 2,
    title: 'New Expense Policy',
    message: 'A revised expense reimbursement policy will be effective from next Monday. All expense reports must now include digital copies of receipts and pre-approval for amounts above ₹10,000.',
    date: 'May 3, 2026',
    sender: 'Finance Department',
    target: 'DEPARTMENT'
  },
  {
    id: 3,
    title: 'Annual Audit Schedule',
    message: 'The annual financial audit is scheduled for May 15-20. Please ensure all financial records, invoices, and supporting documents are properly organized and accessible for the audit team.',
    date: 'April 28, 2026',
    sender: 'Finance Head',
    target: 'DEPARTMENT'
  },
  {
    id: 4,
    title: 'GST Filing Reminder',
    message: 'Reminder: GST returns for Q1 must be filed by April 30th. Please coordinate with the accounts team to ensure all necessary documentation is submitted on time.',
    date: 'April 25, 2026',
    sender: 'Tax Team',
    target: 'DEPARTMENT'
  },
  {
    id: 5,
    title: 'Financial Software Update',
    message: 'The accounting software will be updated this weekend. Please ensure all pending entries are completed by Friday 6 PM to avoid data migration issues.',
    date: 'April 22, 2026',
    sender: 'IT Department',
    target: 'ALL'
  }
];

function FinanceAnnouncements() {

  const groupedAnnouncements = useMemo(() => {
    const allTarget = announcements.filter(a => a.target === 'ALL');
    const deptTarget = announcements.filter(a => a.target === 'DEPARTMENT');
    return { allTarget, deptTarget };
  }, []);

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
                  Finance Department
                </Badge>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                  Finance Announcements
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
                  Official communications, policy updates, budget notifications, and important financial announcements.
                </p>
              </div>

              <div className="rounded-[22px] border border-emerald-500/20 bg-emerald-500/10 px-5 py-4">

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Total
                </p>

                <h2 className="mt-2 text-3xl font-bold text-emerald-800">
                  {announcements.length}
                </h2>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="text-lg font-semibold text-slate-950">
                  All Announcements
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  School-wide and department-specific updates
                </p>
              </div>
            </div>

            <div className="space-y-4">

              {/* All Staff Announcements */}
              <div>

                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  All Staff
                </h3>

                <div className="space-y-3">

                  {groupedAnnouncements.allTarget.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="rounded-[20px] border border-slate-200 bg-[#F8FAFC] p-5 transition-all duration-200 hover:border-[#185FA5]/30 hover:bg-[#EEF4FF]"
                    >

                      <div className="flex items-start justify-between">

                        <div className="flex-1">

                          <div className="flex items-center gap-3">

                            <h4 className="text-base font-semibold text-slate-950">
                              {announcement.title}
                            </h4>

                            <Badge variant="blue">
                              All Staff
                            </Badge>
                          </div>

                          <p className="mt-3 text-sm leading-relaxed text-slate-700">
                            {announcement.message}
                          </p>

                          <div className="mt-4 flex items-center gap-4">

                            <span className="text-xs text-slate-500">
                              From: {announcement.sender}
                            </span>

                            <span className="text-xs text-slate-500">
                              {announcement.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department Announcements */}
              <div>

                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Finance Department
                </h3>

                <div className="space-y-3">

                  {groupedAnnouncements.deptTarget.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="rounded-[20px] border border-amber-500/20 bg-[#F8FAFC] p-5 transition-all duration-200 hover:border-amber-500/40 hover:bg-[#EEF4FF]"
                    >

                      <div className="flex items-start justify-between">

                        <div className="flex-1">

                          <div className="flex items-center gap-3">

                            <h4 className="text-base font-semibold text-slate-950">
                              {announcement.title}
                            </h4>

                            <Badge variant="amber">
                              Department
                            </Badge>
                          </div>

                          <p className="mt-3 text-sm leading-relaxed text-slate-700">
                            {announcement.message}
                          </p>

                          <div className="mt-4 flex items-center gap-4">

                            <span className="text-xs text-slate-500">
                              From: {announcement.sender}
                            </span>

                            <span className="text-xs text-slate-500">
                              {announcement.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default FinanceAnnouncements;
