import { useState } from 'react';
import { usePurchaseDelayAlerts } from '../../hooks/usePurchase';
import { useNotifications } from '../../hooks/useNotifications';
import type { Notification } from '../../types/notification.types';

function Notifications() {
  const { data: notifications = [], isLoading, markAsRead, markAllAsRead } = useNotifications();
  const { data: alerts = [] } = usePurchaseDelayAlerts();
  const [activeTab, setActiveTab] = useState<'notifications' | 'alerts'>('notifications');

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const typeColors: Record<string, string> = {
    TASK_ASSIGNED: 'bg-blue-100 text-blue-800',
    TASK_UPDATED: 'bg-yellow-100 text-yellow-800',
    TASK_DELAYED: 'bg-red-100 text-red-800',
    TASK_ESCALATED: 'bg-red-200 text-red-900',
    ANNOUNCEMENT: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Inbox</p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-950">Notifications</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Stay updated with task assignments, status changes, and important alerts.
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="rounded-[14px] bg-[#185FA5] px-5 py-3 text-sm font-semibold text-white hover:bg-[#226fc0]"
            >
              Mark All as Read ({unreadCount})
            </button>
          )}
        </div>
      </div>

      <div className="rounded-[26px] border border-[#EFF2F6] bg-white shadow-sm">
        <div className="flex border-b border-[#EFF2F6]">
          <button
            className={`flex-1 px-6 py-4 text-sm font-medium transition ${
              activeTab === 'notifications'
                ? 'border-b-2 border-[#185FA5] text-[#185FA5] bg-[#F8FAFC]'
                : 'text-slate-600 hover:text-slate-950 hover:bg-[#F8FAFC]'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications ({notifications.length})
          </button>
          <button
            className={`flex-1 px-6 py-4 text-sm font-medium transition ${
              activeTab === 'alerts'
                ? 'border-b-2 border-[#E24B4A] text-[#E24B4A] bg-[#F8FAFC]'
                : 'text-slate-600 hover:text-slate-950 hover:bg-[#F8FAFC]'
            }`}
            onClick={() => setActiveTab('alerts')}
          >
            Delay Alerts ({alerts.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'notifications' && (
            <div className="space-y-3">
              {isLoading ? (
                <p className="text-center text-sm text-slate-500">Loading notifications...</p>
              ) : notifications.length === 0 ? (
                <p className="text-center text-sm text-slate-500">No notifications yet.</p>
              ) : (
                notifications.map((notification: Notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-[18px] border p-4 transition ${
                      notification.is_read
                        ? 'border-[#EFF2F6] bg-[#F8FAFC]'
                        : 'border-[#185FA5] bg-[#F0F9FF]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${typeColors[notification.type] || 'bg-gray-100 text-gray-800'}`}>
                            {notification.type.replace('_', ' ')}
                          </span>
                          {!notification.is_read && (
                            <span className="h-2 w-2 rounded-full bg-[#185FA5]"></span>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-slate-700">{notification.message}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(notification.created_at).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="rounded-[12px] border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-[#F8FAFC]"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <p className="text-center text-sm text-slate-500">No delay alerts.</p>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-[18px] border p-4 ${
                      alert.severity === 'Overdue' || alert.severity === 'Escalated'
                        ? 'border-[#E24B4A] bg-[#FEF2F2]'
                        : 'border-[#BA7517] bg-[#FFFBEB]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950">{alert.title}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          Due: {new Date(alert.dueDate).toLocaleDateString('en-IN')} • {alert.assignedBy}
                          {alert.priority && ` • ${alert.priority} Priority`}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        alert.severity === 'Overdue' || alert.severity === 'Escalated'
                          ? 'bg-[#FEF2F2] text-[#E24B4A]'
                          : 'bg-[#FFFBEB] text-[#BA7517]'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
