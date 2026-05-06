import React from 'react';
import type { Notification, MeetingResponse, MeetingResponseMap } from '../../types/meeting.types';

interface NotificationItemProps {
  notification: Notification;
  responses: MeetingResponseMap;
  onRespond: (id: number, response: MeetingResponse) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, responses, onRespond }) => {
  const getIcon = (type: string, sub?: string) => {
    if (type === 'meeting') {
      if (sub === 'new') return (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-4m0 0l-2 2m2-2l2 2" />
        </svg>
      );
      if (sub === 'reminder') return (
        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      if (sub === 'reschedule') return (
        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
      if (sub === 'cancel') return (
        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8" />
        </svg>
      );
    }
    if (type === 'task') return (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    );
    if (type === 'delay') return (
      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    );
    return null;
  };

  const canRespond = notification.type === 'meeting' && (notification.sub === 'new' || notification.sub === 'reschedule') && !responses[notification.mId || 0];

  return (
    <div className="flex items-start gap-3 py-3 border-b border-[var(--border-color)]">
      {!notification.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
      {notification.read && <div className="w-2 h-2 flex-shrink-0" />}
      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: notification.iconBg }}>
        {getIcon(notification.type, notification.sub)}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-[var(--text-primary)]">{notification.title}</div>
        <div className="text-xs text-[var(--text-secondary)] mt-0.5">{notification.detail}</div>
        {canRespond && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onRespond(notification.mId || 0, 'ACCEPTED')}
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded-md transition-colors"
            >
              Accept
            </button>
            <button
              onClick={() => onRespond(notification.mId || 0, 'DECLINED')}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-md transition-colors"
            >
              Decline
            </button>
            <button
              className="border border-amber-500 text-amber-700 text-xs px-3 py-1 rounded-md hover:bg-amber-50 transition-colors"
            >
              Reschedule
            </button>
          </div>
        )}
        {notification.type === 'delay' && (
          <div className="flex gap-2 mt-2">
            <button className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1 rounded-md transition-colors">
              Follow up
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-md transition-colors">
              Escalate
            </button>
          </div>
        )}
      </div>
      <div className="text-right">
        <div className="text-xs text-[var(--text-secondary)]">{notification.time}</div>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: notification.tagBg, color: notification.tagColor }}>
          {notification.tag}
        </span>
      </div>
    </div>
  );
};

export default NotificationItem;