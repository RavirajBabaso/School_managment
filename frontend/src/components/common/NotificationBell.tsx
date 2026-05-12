import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useNotifications } from '../../hooks/useNotifications';

function formatTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Just now';
  }

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    month: 'short'
  });
}

function NotificationBell() {
  const {
    notifications,
    unreadCount,
    markAllAsRead
  } = useNotifications();

  const [isOpen, setIsOpen] =
    useState(false);

  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const latestNotifications =
    notifications.slice(0, 5);

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      if (
        !containerRef.current?.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    );

    return () =>
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      );
  }, []);

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    await markAllAsRead();
  };

  return (
    <div
      className="relative"
      ref={containerRef}
    >
      {/* Bell */}
      <button
        aria-label="Open notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition-all duration-200 hover:bg-[#EEF4FF] hover:text-slate-950"
        onClick={() =>
          setIsOpen((current) => !current)
        }
        type="button"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M15 17H9M18 17V11C18 7.686 15.314 5 12 5C8.686 5 6 7.686 6 11V17L4 19H20L18 17ZM13.73 21C13.554 21.303 13.301 21.555 12.997 21.73C12.693 21.905 12.348 21.997 12 21.997C11.652 21.997 11.307 21.905 11.003 21.73C10.699 21.555 10.446 21.303 10.27 21"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>

        {/* Count */}
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#185FA5] px-1 text-[10px] font-bold text-white shadow-md">
            {unreadCount > 9
              ? '9+'
              : unreadCount}
          </span>
        ) : null}
      </button>

      {/* Dropdown */}
      {isOpen ? (
        <div className="absolute right-0 top-12 z-30 w-[340px] overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.14)]">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-950">
                Notifications
              </h3>

              <p className="mt-1 text-[11px] text-slate-500">
                Latest 5 updates
              </p>
            </div>

            <button
              className="text-[11px] font-semibold text-[#60A5FA] transition hover:text-[#93C5FD]"
              onClick={() =>
                void handleMarkAllRead()
              }
              type="button"
            >
              Mark all read
            </button>
          </div>

          {/* List */}
          <div className="max-h-[320px] overflow-y-auto p-2">
            {latestNotifications.length >
            0 ? (
              latestNotifications.map(
                (notification) => (
                  <div
                    className="rounded-[18px] border border-transparent p-3 transition hover:border-slate-300 hover:bg-[#EEF4FF]"
                    key={`${notification.type}-${notification.id}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[13px] font-medium leading-5 text-slate-950">
                        {
                          notification.message
                        }
                      </p>

                      {!notification.is_read ? (
                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#185FA5]" />
                      ) : null}
                    </div>

                    <p className="mt-2 text-[11px] text-slate-500">
                      {formatTimestamp(
                        notification.created_at
                      )}
                    </p>
                  </div>
                )
              )
            ) : (
              <div className="px-4 py-10 text-center">
                <p className="text-sm text-slate-600">
                  No notifications yet
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 px-5 py-3">
            <Link
              className="text-xs font-semibold text-[#60A5FA] transition hover:text-[#93C5FD]"
              onClick={() =>
                setIsOpen(false)
              }
              to="/notifications"
            >
              View all notifications
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default NotificationBell;
