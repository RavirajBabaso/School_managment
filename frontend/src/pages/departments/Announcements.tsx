import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import * as announcementService from '../../services/announcementService';

import { useNotifications } from '../../hooks/useNotifications';

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Just now';
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function Announcements() {
  const {
    notifications,
    markAsRead
  } = useNotifications();

  const announcementsQuery = useQuery({
    queryKey: ['announcements'],
    queryFn:
      announcementService.getAnnouncements
  });

  const announcementNotifications =
    useMemo(
      () =>
        notifications.filter(
          (notification) =>
            notification.type ===
            'ANNOUNCEMENT'
        ),
      [notifications]
    );

  const resolveNotificationId = (
    message: string
  ) => {
    const snippet =
      message.length > 50
        ? `${message.slice(0, 50)}...`
        : message;

    return announcementNotifications.find(
      (notification) =>
        notification.message.includes(
          snippet
        )
    )?.id;
  };

  return (
    <section className="min-h-screen space-y-6 bg-[#F5F7FB] p-6">
      
      {/* Header */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        
        <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
          Department Comms
        </p>

        <h2 className="mt-3 text-2xl font-semibold text-slate-950">
          Announcements
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Review institution-wide broadcasts and department-specific directions from the chairman.
        </p>
      </div>

      {/* List */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        {announcementsQuery.data &&
        announcementsQuery.data.length >
          0 ? (
          <div className="space-y-4">
            {announcementsQuery.data.map(
              (announcement) => {
                const notificationId =
                  resolveNotificationId(
                    announcement.message
                  );

                return (
                  <button
                    className={[
                      'w-full rounded-[22px] border p-5 text-left transition-all duration-200 hover:bg-[#EEF4FF] focus:outline-none active:outline-none',
                      announcement.target ===
                      'ALL'
                        ? 'border-blue-500/20 bg-blue-500/10'
                        : 'border-amber-500/20 bg-amber-500/10'
                    ].join(' ')}
                    key={announcement.id}
                    onClick={() =>
                      notificationId
                        ? void markAsRead(
                            notificationId
                          )
                        : undefined
                    }
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-4">
                      
                      {/* Left */}
                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          Chairman
                        </p>

                        <p className="mt-3 text-sm leading-6 text-slate-700">
                          {
                            announcement.message
                          }
                        </p>
                      </div>

                      {/* Date */}
                      <span className="shrink-0 text-xs text-slate-500">
                        {formatDate(
                          announcement.created_at
                        )}
                      </span>
                    </div>

                    {/* Footer */}
                    <p className="mt-4 text-xs font-medium text-slate-600">
                      {announcement.target ===
                      'ALL'
                        ? 'Sent to all staff'
                        : `Sent to ${
                            announcement
                              .department
                              ?.name ??
                            'your department'
                          }`}

                      {notificationId
                        ? ' • Mark as read'
                        : ''}
                    </p>
                  </button>
                );
              }
            )}
          </div>
        ) : (
          <div className="rounded-[22px] border border-dashed border-slate-300 bg-[#F8FAFC] px-4 py-12 text-center text-sm text-slate-600">
            No announcements are available right now.
          </div>
        )}
      </div>
    </section>
  );
}

export default Announcements;
