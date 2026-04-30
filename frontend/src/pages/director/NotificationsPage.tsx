import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import StatGrid from '../../components/common/StatGrid';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import NotificationItem from '../../components/notification/NotificationItem';
import { getDirectorNotifications, markAllDirectorRead } from '../../services/directorNotificationService';
import { respondToMeeting } from '../../services/meetingService';
import type { Notification, MeetingResponse, MeetingResponseMap, NotifPreference } from '../../types/meeting.types';

type TabType = 'all' | 'meeting' | 'task' | 'delay' | 'unread' | 'settings';

const NotificationsPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [localNotifs, setLocalNotifs] = useState<Notification[]>([]);
  const [meetingResponses, setMeetingResponses] = useState<MeetingResponseMap>({});
  const [preferences, setPreferences] = useState<NotifPreference[]>([
    { key: 'meeting_new', label: 'New meeting invitations', enabled: true },
    { key: 'meeting_reminder', label: 'Meeting reminders', enabled: true },
    { key: 'meeting_reschedule', label: 'Meeting rescheduling', enabled: true },
    { key: 'meeting_cancel', label: 'Meeting cancellations', enabled: true },
    { key: 'task_assign', label: 'Task assignments', enabled: true },
    { key: 'task_update', label: 'Task updates', enabled: true },
    { key: 'delay_warning', label: 'Delay warnings', enabled: true },
    { key: 'delay_escalation', label: 'Delay escalations', enabled: true },
    { key: 'email_digest', label: 'Daily email digest', enabled: false },
    { key: 'push_mobile', label: 'Mobile push notifications', enabled: true },
  ]);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getDirectorNotifications,
  });

  useEffect(() => {
    setLocalNotifs(notifications);
  }, [notifications]);

  const markAllMutation = useMutation({
    mutationFn: markAllDirectorRead,
    onSuccess: () => {
      setLocalNotifs(prev => prev.map(n => ({ ...n, read: true })));
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const respondMutation = useMutation({
    mutationFn: ({ id, response }: { id: number; response: MeetingResponse }) =>
      respondToMeeting(id, response),
    onSuccess: (_, { id, response }) => {
      setMeetingResponses(prev => ({ ...prev, [id]: response }));
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });

  const handleRespond = (id: number, response: MeetingResponse) => {
    respondMutation.mutate({ id, response });
  };

  const handleMarkAllRead = () => {
    markAllMutation.mutate();
  };

  const handlePreferenceChange = (key: string, enabled: boolean) => {
    setPreferences(prev => prev.map(p => p.key === key ? { ...p, enabled } : p));
  };

  const filteredNotifications = localNotifs.filter(notification => {
    if (activeTab === 'unread') return !notification.read;
    if (activeTab === 'all') return true;
    return notification.type === activeTab;
  });

  const stats = [
    { label: 'Total', value: localNotifs.length, color: '#7C3AED' },
    { label: 'Unread', value: localNotifs.filter(n => !n.read).length, color: '#DC2626' },
    { label: 'Need Response', value: localNotifs.filter(n => n.type === 'meeting' && !meetingResponses[n.mId || 0]).length, color: '#F59E0B' },
    { label: 'Cancelled', value: localNotifs.filter(n => n.sub === 'cancel').length, color: '#6B7280' },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#F1F4F9] text-[#1E293B]">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Navbar />
          <div className="p-6 space-y-6">
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F1F4F9] text-[#1E293B]">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <Navbar />
        <div className="p-6 space-y-6">
          <StatGrid items={stats} />

          <div className="flex border-b border-gray-200 mb-4">
            {(['all', 'meeting', 'task', 'delay', 'unread'] as TabType[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 ml-auto"
            >
              Mark All Read
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'settings'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Settings
            </button>
          </div>

          {activeTab === 'settings' ? (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Meeting Notifications</h4>
                  <div className="space-y-2">
                    {preferences.filter(p => p.key.startsWith('meeting_')).map(pref => (
                      <div key={pref.key} className="flex items-center justify-between">
                        <span className="text-sm flex-1">{pref.label}</span>
                        <ToggleSwitch
                          enabled={pref.enabled}
                          onChange={(enabled) => handlePreferenceChange(pref.key, enabled)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Task Notifications</h4>
                  <div className="space-y-2">
                    {preferences.filter(p => p.key.startsWith('task_')).map(pref => (
                      <div key={pref.key} className="flex items-center justify-between">
                        <span className="text-sm flex-1">{pref.label}</span>
                        <ToggleSwitch
                          enabled={pref.enabled}
                          onChange={(enabled) => handlePreferenceChange(pref.key, enabled)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Delivery</h4>
                  <div className="space-y-2">
                    {preferences.filter(p => !p.key.startsWith('meeting_') && !p.key.startsWith('task_')).map(pref => (
                      <div key={pref.key} className="flex items-center justify-between">
                        <span className="text-sm flex-1">{pref.label}</span>
                        <ToggleSwitch
                          enabled={pref.enabled}
                          onChange={(enabled) => handlePreferenceChange(pref.key, enabled)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                  Save Preferences
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-4">
                {activeTab === 'all' ? 'All Notifications' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h3>

              <div>
                {filteredNotifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    responses={meetingResponses}
                    onRespond={handleRespond}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;