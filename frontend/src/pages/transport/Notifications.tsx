import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as transportService from '../../services/transportService';
import { useTransportNotifications } from '../../hooks/useTransport';

function Notifications() {
  const queryClient = useQueryClient();
  const { data: notifications = [], isLoading } = useTransportNotifications();

  const markReadMutation = useMutation({
    mutationFn: (id: number) => transportService.markTransportNotificationRead(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['transport-notifications'] })
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => transportService.markAllTransportNotificationsRead(),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['transport-notifications'] })
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-6">
      <div className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950">Transport Notifications</h2>
          {unreadCount > 0 ? (
            <button
              className="rounded-[12px] border border-slate-300 bg-[#F8FAFC] px-4 py-2 text-sm font-semibold text-slate-600"
              onClick={() => markAllReadMutation.mutate()}
              type="button"
            >
              Mark all as read
            </button>
          ) : null}
        </div>

        {isLoading ? <p className="mt-4 text-sm text-slate-500">Loading...</p> : null}

        <div className="mt-4 space-y-3">
          {notifications.map((notification) => (
            <div
              className={`rounded-[16px] border border-[#EFF2F6] p-4 ${notification.is_read ? 'bg-white' : 'bg-[#F8FAFC]'}`}
              key={notification.id}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-950">{notification.type.replace('_', ' ')}</p>
                  <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                  <p className="mt-2 text-xs text-slate-500">{new Date(notification.created_at).toLocaleString('en-IN')}</p>
                </div>
                {!notification.is_read ? (
                  <button
                    className="rounded-[8px] border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
                    onClick={() => markReadMutation.mutate(notification.id)}
                    type="button"
                  >
                    Mark read
                  </button>
                ) : null}
              </div>
            </div>
          ))}
          {notifications.length === 0 && !isLoading ? <p className="text-sm text-slate-500">No notifications found.</p> : null}
        </div>
      </div>
    </div>
  );
}

export default Notifications;