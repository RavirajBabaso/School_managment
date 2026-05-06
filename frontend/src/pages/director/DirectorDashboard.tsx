import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import TaskStatusPieChart from '../../components/charts/TaskStatusPieChart';
import TaskTable from '../../components/tables/TaskTable';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import StatGrid from '../../components/common/StatGrid';
import MeetingCard from '../../components/meeting/MeetingCard';
import Badge from '../../components/common/Badge';
import type { Task } from '../../types/task.types';
import type { RootState } from '../../store';
import type { Meeting, MeetingResponse, MeetingResponseMap } from '../../types/meeting.types';
import type { Notification } from '../../types/notification.types';
import api from '../../services/api';
import { getDirectorModules } from '../../services/directorModuleService';
import { getMeetings, respondToMeeting } from '../../services/meetingService';
import { getNotifications } from '../../services/notificationService';

interface DeptDashboardData {
  myTasks: Task[];
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  delayedCount: number;
  recentAnnouncements: {
    id: number;
    title: string;
    sentTo: string;
    date: string;
  }[];
}

interface ChairmanDashboardData {
  departments: { name: string; completionPct: number; healthColor: string }[];
}

function DirectorDashboard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [meetingResponses, setMeetingResponses] = useState<MeetingResponseMap>({});

  const { data: deptData, isLoading: deptLoading } = useQuery({
    queryKey: ['dept-dashboard', user?.department_id],
    queryFn: async () => {
      const response = await api.get(`/dashboard/dept/${user?.department_id}`);
      return response.data.data as DeptDashboardData;
    },
    enabled: !!user?.department_id,
  });

  const { data: chairmanData, isLoading: chairmanLoading } = useQuery({
    queryKey: ['chairman-dashboard-summary'],
    queryFn: async () => {
      const response = await api.get('/dashboard/chairman');
      return response.data.data as ChairmanDashboardData;
    },
  });

  const { data: meetings = [] } = useQuery({
    queryKey: ['meetings'],
    queryFn: getMeetings,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });

  const { data: directorModules } = useQuery({
    queryKey: ['director-modules'],
    queryFn: getDirectorModules,
  });

  const respondMutation = useMutation({
    mutationFn: ({ id, response }: { id: number; response: MeetingResponse }) =>
      respondToMeeting(id, response),
    onSuccess: (_, { id, response }) => {
      setMeetingResponses(prev => ({ ...prev, [id]: response }));
    },
  });

  const taskStats = {
    total: deptData?.myTasks?.length ?? 0,
    pending: deptData?.pendingCount ?? 0,
    inProgress: deptData?.inProgressCount ?? 0,
    completed: deptData?.completedCount ?? 0,
    delayed: deptData?.delayedCount ?? 0,
  };

  const unreadAlerts = notifications.filter((notification) => !notification.is_read).length;
  const meetingCount = meetings.length;
  const approvalSummary = directorModules?.summary;

  const quickMetrics = [
    { label: 'Assigned tasks', value: taskStats.total, tone: 'green' },
    { label: 'Meetings today', value: meetingCount, tone: 'blue' },
    { label: 'Pending approvals', value: approvalSummary?.pending ?? 0, tone: 'amber' },
    { label: 'Unread alerts', value: unreadAlerts, tone: 'red' }
  ];

  const taskStatusData = [
    { name: 'Pending', value: taskStats.pending, color: '#BA7517' },
    { name: 'In Progress', value: taskStats.inProgress, color: '#185FA5' },
    { name: 'Completed', value: taskStats.completed, color: '#3B6D11' },
    { name: 'Delayed', value: taskStats.delayed, color: '#A32D2D' },
  ];

  if (deptLoading || chairmanLoading || !deptData || !chairmanData) {
    return (
      <div className="flex min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)]">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Navbar />
          <div className="p-6">Loading...</div>
        </main>
      </div>
    );
  }

  const notificationCategoryLabel: Record<Notification['type'], string> = {
    TASK_ASSIGNED: 'Task assigned',
    TASK_UPDATED: 'Update',
    TASK_DELAYED: 'Delay alert',
    TASK_ESCALATED: 'Escalation',
    ANNOUNCEMENT: 'Announcement'
  };

  const notificationTone: Record<Notification['type'], 'blue' | 'green' | 'red' | 'amber' | 'gray'> = {
    TASK_ASSIGNED: 'blue',
    TASK_UPDATED: 'green',
    TASK_DELAYED: 'amber',
    TASK_ESCALATED: 'red',
    ANNOUNCEMENT: 'gray'
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)]">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-hidden">
        <Navbar />
        <div className="h-full overflow-y-auto p-6">
          <div className="space-y-6">
            <section className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)]">
                    Executive summary
                  </p>
                  <h1 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">
                    Director dashboard
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
                    A calm, data-rich leadership workspace for approvals, meetings, notifications and school operations.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/director/approvals"
                    className="rounded-full bg-[#1D9E75] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#178b68]"
                  >
                    New approval
                  </Link>
                  <button
                    type="button"
                    className="rounded-full border border-[var(--border-color)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-tertiary)]"
                  >
                    Export report
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {quickMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[22px] border border-[var(--border-color)] bg-[var(--surface)] p-4"
                  >
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
                      {metric.label}
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
              <div className="space-y-6">
                <section className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">Upcoming meetings</p>
                      <h2 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">Today’s agenda</h2>
                    </div>
                    <Link
                      to="/director/meetings"
                      className="text-sm font-semibold text-[#378ADD] transition hover:text-[#1E4DB7]"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="mt-4 space-y-4">
                    {meetings.slice(0, 3).map((meeting) => (
                      <MeetingCard
                        key={meeting.id}
                        meeting={meeting}
                        responses={meetingResponses}
                        onRespond={(id, response) => respondMutation.mutate({ id, response })}
                      />
                    ))}
                  </div>
                </section>

                <section className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">Notifications</p>
                      <h2 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">Recent alerts</h2>
                    </div>
                    <Badge variant="blue">{unreadAlerts} unread</Badge>
                  </div>

                  <div className="mt-5 space-y-4">
                    {notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start gap-3 rounded-[18px] border border-[var(--border-color)] bg-[var(--surface)] p-4"
                      >
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#1D9E75]" />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="truncate text-sm font-semibold text-[var(--text-primary)]">
                              {notificationCategoryLabel[notification.type]}
                            </span>
                            <Badge variant={notificationTone[notification.type]}>
                              {notification.type.replace('_', ' ').toLowerCase()}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="mt-2 text-xs text-[var(--text-secondary)]">
                            {new Date(notification.created_at).toLocaleString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">Approval insights</p>
                      <h2 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">Review requests</h2>
                    </div>
                    <Link
                      to="/director/approvals"
                      className="rounded-full bg-[#1D9E75] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#178b68]"
                    >
                      Review all
                    </Link>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[20px] bg-[var(--surface)] p-4">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">Pending</p>
                      <p className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">{approvalSummary?.pending ?? 0}</p>
                    </div>
                    <div className="rounded-[20px] bg-[var(--surface)] p-4">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">In progress</p>
                      <p className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">{approvalSummary?.inProgress ?? 0}</p>
                    </div>
                    <div className="rounded-[20px] bg-[var(--surface)] p-4">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">Completed</p>
                      <p className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">{approvalSummary?.completed ?? 0}</p>
                    </div>
                    <div className="rounded-[20px] bg-[var(--surface)] p-4">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">Overdue</p>
                      <p className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">{approvalSummary?.overdue ?? 0}</p>
                    </div>
                  </div>
                </section>

                <section className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">School health</p>
                      <h2 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">Operational summary</h2>
                    </div>
                    <span className="rounded-full bg-[#EDF9F1] px-3 py-1 text-xs font-semibold text-[#1D9E75]">
                      {directorModules?.summary.total ?? 0} items
                    </span>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-[20px] border border-[var(--border-color)]">
                    <table className="min-w-full divide-y divide-[var(--border-color)] text-left text-sm">
                      <thead className="bg-[var(--surface)] text-[var(--text-secondary)]">
                        <tr>
                          <th className="px-4 py-3 uppercase tracking-[0.24em]">Department</th>
                          <th className="px-4 py-3 uppercase tracking-[0.24em]">Completion</th>
                          <th className="px-4 py-3 uppercase tracking-[0.24em]">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-color)] bg-[var(--card-bg)]">
                        {chairmanData.departments.map((dept, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm font-medium text-[var(--text-primary)]">{dept.name}</td>
                            <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{dept.completionPct}%</td>
                            <td className="px-4 py-3">
                              <span
                                className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold"
                                style={{
                                  backgroundColor: dept.healthColor + '22',
                                  color: dept.healthColor
                                }}
                              >
                                {dept.completionPct >= 75 ? 'Good' : dept.completionPct >= 50 ? 'Fair' : 'Poor'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DirectorDashboard;
