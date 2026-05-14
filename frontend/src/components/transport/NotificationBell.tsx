import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Notification } from '../../types/notification.types';
import { useState } from 'react';
import * as transportService from '../../services/transportService';

function TransportNotificationBell({ notifications, unreadCount }: { notifications: Notification[]; unreadCount: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const markReadMutation = useMutation({
    mutationFn: (id: number) => transportService.markTransportNotificationRead(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['transport-notifications'] })
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => transportService.markAllTransportNotificationsRead(),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['transport-notifications'] })
  });

  return (
    <div className="relative">
      <button
        className="relative rounded-[12px] border border-slate-300 bg-[#F8FAFC] p-3 text-slate-600 hover:bg-[#EEF4FF]"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="text-lg">🔔</span>
        {unreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E24B4A] text-xs font-semibold text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 mt-2 w-80 rounded-[16px] border border-[#EFF2F6] bg-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-950">Notifications</h3>
            <button
              className="text-xs font-semibold text-[#185FA5]"
              onClick={() => markAllReadMutation.mutate()}
              type="button"
            >
              Mark all read
            </button>
          </div>
          <div className="mt-3 max-h-60 overflow-y-auto">
            {notifications.slice(0, 5).map((n) => (
              <div className="rounded-[8px] border border-[#EFF2F6] bg-[#F8FAFC] p-2 mb-2" key={n.id}>
                <p className="text-sm text-slate-950">{n.message}</p>
                <p className="mt-1 text-xs text-slate-500">{new Date(n.created_at).toLocaleTimeString()}</p>
              </div>
            ))}
            {notifications.length === 0 ? <p className="text-sm text-slate-500">No notifications</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default TransportNotificationBell;