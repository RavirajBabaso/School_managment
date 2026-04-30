import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import TaskStatusPieChart from '../../components/charts/TaskStatusPieChart';
import TaskTable from '../../components/tables/TaskTable';
import Badge from '../../components/common/Badge';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import StatGrid from '../../components/common/StatGrid';
import MeetingCard from '../../components/meeting/MeetingCard';
import type { Task } from '../../types/task.types';
import type { RootState } from '../../store';
import type { Meeting, MeetingResponse, MeetingResponseMap } from '../../types/meeting.types';
import api from '../../services/api';
import { getMeetings, respondToMeeting } from '../../services/meetingService';
import { getNotifications } from '../../services/notificationService';

interface DeptDashboardData {
  myTasks: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    delayed: number;
  };
  taskStatusData: { name: string; value: number; color: string }[];
  recentAnnouncements: {
    id: number;
    title: string;
    sentTo: string;
    date: string;
  }[];
  myTasksList: Task[];
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

  const respondMutation = useMutation({
    mutationFn: ({ id, response }: { id: number; response: MeetingResponse }) =>
      respondToMeeting(id, response),
    onSuccess: (_, { id, response }) => {
      setMeetingResponses(prev => ({ ...prev, [id]: response }));
    },
  });

  if (deptLoading || chairmanLoading || !deptData || !chairmanData) {
    return (
      <div className="flex min-h-screen bg-[#F1F4F9] text-[#1E293B]">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Navbar />
          <div className="p-6">Loading...</div>
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
          <div className="mb-4">
            <h1 className="text-2xl font-semibold">Director Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name} - Director</p>
          </div>

          {/* KPI Cards */}
          <StatGrid items={[
            { label: 'My Tasks', value: deptData.myTasks.total, color: '#185FA5' },
            { label: 'Pending', value: deptData.myTasks.pending, color: '#BA7517' },
            { label: 'In Progress', value: deptData.myTasks.inProgress, color: '#BA7517' },
            { label: 'Completed', value: deptData.myTasks.completed, color: '#3B6D11' },
            { label: 'Delayed', value: deptData.myTasks.delayed, color: '#A32D2D' }
          ]} />

          {/* Middle row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Status Pie Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-4">Task Status Distribution</h3>
              <TaskStatusPieChart data={deptData.taskStatusData} />
            </div>

            {/* Today's Meetings */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-4">Today's Meetings</h3>
              <div>
                {meetings.slice(0, 3).map(meeting => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    responses={meetingResponses}
                    onRespond={(id, response) => respondMutation.mutate({ id, response })}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* School-wide Task Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">School-wide Task Summary</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {chairmanData.departments.map((dept, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.completionPct}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: dept.healthColor }}
                        ></div>
                        <span className="text-sm text-gray-500">
                          {dept.completionPct >= 75 ? 'Good' : dept.completionPct >= 50 ? 'Fair' : 'Poor'}
                        </span>
                      </div>
                    </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Task List */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">My Tasks</h3>
            <TaskTable tasks={deptData.myTasksList} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default DirectorDashboard;
