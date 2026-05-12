import { useMemo } from 'react';

import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

import Badge from '../../components/common/Badge';

interface NotificationItem {
  id: number;
  text: string;
  type: 'blue' | 'amber' | 'green' | 'red';
  time: string;
  read: boolean;
}

const notifications: NotificationItem[] = [
  {
    id: 1,
    text: 'New staff onboarding documents ready for review.',
    type: 'blue',
    time: '2 hours ago',
    read: false
  },
  {
    id: 2,
    text: 'Office supplies inventory needs attention.',
    type: 'amber',
    time: '4 hours ago',
    read: false
  },
  {
    id: 3,
    text: 'Visitor management system updated successfully.',
    type: 'green',
    time: '6 hours ago',
    read: true
  },
  {
    id: 4,
    text: 'Facility maintenance request submitted.',
    type: 'amber',
    time: 'Yesterday',
    read: true
  },
  {
    id: 5,
    text: 'Staff ID cards ready for distribution.',
    type: 'green',
    time: '2 days ago',
    read: true
  },
  {
    id: 6,
    text: 'Parking allocation deadline approaching.',
    type: 'red',
    time: '3 days ago',
    read: true
  }
];

function AdminNotifications() {

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, []);

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
                  Admin Notifications
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
                  Stay updated with staff onboarding, office supplies, visitor management, and administrative task notifications.
                </p>
              </div>

              <div className="rounded-[22px] border border-blue-500/20 bg-blue-500/10 px-5 py-4">

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Unread
                </p>

                <h2 className="mt-2 text-3xl font-bold text-blue-800">
                  {unreadCount}
                </h2>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="text-lg font-semibold text-slate-950">
                  Recent Notifications
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  {notifications.length} total notifications
                </p>
              </div>

              <button className="rounded-full bg-[#185FA5] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#226fc0]">
                Mark All Read
              </button>
            </div>

            <div className="space-y-3">

              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-[20px] border p-5 transition-all duration-200 hover:bg-[#EEF4FF] ${
                    !notification.read ? 'border-[#185FA5]/30 bg-[#185FA5]/5' : 'border-slate-200'
                  }`}
                >

                  <div className="flex items-start justify-between">

                    <div className="flex items-start gap-4">

                      <div className={`mt-1 h-3 w-3 rounded-full ${
                        notification.type === 'blue' ? 'bg-blue-500' :
                        notification.type === 'amber' ? 'bg-amber-500' :
                        notification.type === 'green' ? 'bg-emerald-500' :
                        'bg-red-500'
                      }`} />

                      <div>

                        <p className={`text-sm ${!notification.read ? 'font-semibold text-slate-950' : 'text-slate-700'}`}>
                          {notification.text}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {notification.time}
                        </p>
                      </div>
                    </div>

                    {!notification.read && (
                      <Badge variant="blue">
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminNotifications;
