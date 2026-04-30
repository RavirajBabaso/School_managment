import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import Modal from '../../components/common/Modal';
import StatGrid from '../../components/common/StatGrid';
import MeetingCard from '../../components/meeting/MeetingCard';
import { getMeetings, scheduleMeeting, respondToMeeting } from '../../services/meetingService';
import type { Meeting, MeetingResponse, MeetingResponseMap } from '../../types/meeting.types';

type TabType = 'ALL' | 'PENDING' | 'CONFIRMED' | 'WEEK';

const MeetingsPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [meetingResponses, setMeetingResponses] = useState<MeetingResponseMap>({});
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    attendees: '',
    agenda: '',
  });
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ['meetings'],
    queryFn: getMeetings,
  });

  const respondMutation = useMutation({
    mutationFn: ({ id, response }: { id: number; response: MeetingResponse }) =>
      respondToMeeting(id, response),
    onSuccess: (_, { id, response }) => {
      setMeetingResponses(prev => ({ ...prev, [id]: response }));
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });

  const scheduleMutation = useMutation({
    mutationFn: scheduleMeeting,
    onSuccess: () => {
      setScheduleSuccess(true);
      setShowScheduleModal(false);
      setScheduleForm({ title: '', date: '', time: '', venue: '', attendees: '', agenda: '' });
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      setTimeout(() => setScheduleSuccess(false), 1500);
    },
  });

  const handleRespond = (id: number, response: MeetingResponse) => {
    respondMutation.mutate({ id, response });
  };

  const handleSchedule = () => {
    scheduleMutation.mutate(scheduleForm);
  };

  const filteredMeetings = meetings.filter(meeting => {
    switch (activeTab) {
      case 'PENDING':
        return (meeting.status === 'PENDING' || meeting.status === 'RESCHEDULED') &&
               !meetingResponses[meeting.id];
      case 'CONFIRMED':
        return meeting.status === 'CONFIRMED' || meetingResponses[meeting.id] === 'ACCEPTED';
      case 'ALL':
      case 'WEEK':
      default:
        return true;
    }
  });

  const stats = [
    { label: 'Total', value: meetings.length, color: '#185FA5' },
    { label: 'Pending', value: meetings.filter(m => m.status === 'PENDING' || m.status === 'RESCHEDULED').length, color: '#BA7517' },
    { label: 'Confirmed', value: meetings.filter(m => m.status === 'CONFIRMED').length, color: '#3B6D11' },
    { label: 'Upcoming', value: meetings.filter(m => new Date(m.date) > new Date()).length, color: '#185FA5' },
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
            {(['ALL', 'PENDING', 'CONFIRMED', 'WEEK'] as TabType[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'ALL' ? 'All Meetings' : tab === 'WEEK' ? 'This Week' : tab}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {activeTab === 'ALL' ? 'All Meetings' : activeTab === 'WEEK' ? 'This Week' : activeTab}
              </h3>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs transition-colors"
              >
                + Schedule
              </button>
            </div>

            <div>
              {filteredMeetings.map(meeting => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  responses={meetingResponses}
                  onRespond={handleRespond}
                />
              ))}
            </div>
          </div>

          {scheduleSuccess && (
            <div className="bg-green-50 border border-green-300 text-green-800 p-3 rounded-md text-sm">
              Meeting scheduled — invites sent
            </div>
          )}
        </div>
      </main>

      <Modal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} title="Schedule Meeting">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={scheduleForm.title}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={scheduleForm.date}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, date: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={scheduleForm.time}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, time: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
            <input
              type="text"
              value={scheduleForm.venue}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, venue: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attendees</label>
            <select
              value={scheduleForm.attendees}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, attendees: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select attendees</option>
              <option value="All Staff">All Staff</option>
              <option value="Department Heads">Department Heads</option>
              <option value="Teaching Staff">Teaching Staff</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agenda</label>
            <textarea
              value={scheduleForm.agenda}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, agenda: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowScheduleModal(false)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSchedule}
              disabled={scheduleMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50"
            >
              {scheduleMutation.isPending ? 'Scheduling...' : 'Schedule Meeting'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MeetingsPage;