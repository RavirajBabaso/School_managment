import api from './api';
import type { Meeting, MeetingResponse } from '../types/meeting.types';

export const getMeetings = async (): Promise<Meeting[]> => {
  const res = await api.get('/meetings');
  return res.data.data;
};

export const scheduleMeeting = async (payload: {
  title: string; date: string; time: string;
  venue: string; attendees: string; agenda: string;
}): Promise<Meeting> => {
  const res = await api.post('/meetings', payload);
  return res.data.data;
};

export const respondToMeeting = async (id: number, response: MeetingResponse): Promise<void> => {
  await api.put(`/meetings/${id}/respond`, { response });
};