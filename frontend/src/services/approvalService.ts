import api from './api';
import type { Approval, ApprovalType } from '../types/meeting.types';

export const getApprovals = async (): Promise<Approval[]> => {
  const res = await api.get('/approvals');
  return res.data.data;
};

export const createApproval = async (payload: {
  type: ApprovalType; priority: string;
  title: string; justification: string;
  amount: string; requiredBy: string;
}): Promise<Approval> => {
  const res = await api.post('/approvals', payload);
  return res.data.data;
};

export const getAllApprovals = async (
  status?: 'PENDING' | 'APPROVED' | 'REJECTED',
  type?: ApprovalType
): Promise<Approval[]> => {
  const params: Record<string, string> = {};

  if (status) params.status = status;
  if (type) params.type = type;

  const res = await api.get('/approvals', { params });
  return res.data.data;
};

export const approveApproval = async (id: number | string): Promise<Approval> => {
  const res = await api.put(`/approvals/${id}`, { status: 'APPROVED' });
  return res.data.data;
};

export const rejectApproval = async (id: number | string): Promise<Approval> => {
  const res = await api.put(`/approvals/${id}`, { status: 'REJECTED' });
  return res.data.data;
};