import api from './api';
import type { Notification } from '../types/meeting.types';

export const getDirectorNotifications = async (): Promise<Notification[]> => {
  const res = await api.get('/notifications');
  return res.data.data;
};

export const markAllDirectorRead = async (): Promise<void> => {
  await api.put('/notifications/mark-all-read');
};