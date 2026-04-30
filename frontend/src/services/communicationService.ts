import api from './api';
import type { Communication } from '../types/meeting.types';

export const getCommunications = async (): Promise<Communication[]> => {
  const res = await api.get('/communications');
  return res.data.data;
};