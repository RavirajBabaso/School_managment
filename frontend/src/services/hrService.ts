import api from './api';
import type { Announcement, Notification } from '../types/notification.types';
import type { Task, TaskStatus } from '../types/task.types';

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface HRDashboardSummary {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  delayedTasks: number;
  completionRate: number;
}

export interface HRAnalytics {
  completionRate: number;
  delayPercentage: number;
  hREfficiency: number;
  taskDistribution: {
    completed: number;
    delayed: number;
    inProgress: number;
    pending: number;
    total: number;
  };
  staffPerformance: Array<{
    staff: string;
    score: number;
    completed: number;
    delayed: number;
    total: number;
  }>;
  monthlyPerformance: Array<{
    month: string;
    completed: number;
    delayed: number;
    total: number;
  }>;
}

export interface HRDelayAlert {
  assignedBy: string;
  dueDate: string;
  id: number;
  severity: 'Overdue' | 'Approaching' | 'Escalated';
  status: string;
  title: string;
}

export interface HRReportHistoryItem {
  createdAt: string;
  dateFrom: string;
  dateTo: string;
  id: number;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

export const getHRDashboard = async () => {
  const response = await api.get<ApiResponse<HRDashboardSummary>>('/hr/dashboard');
  return response.data.data;
};

export const getHRTasks = async (status = 'ALL') => {
  const response = await api.get<ApiResponse<Task[]>>('/hr/tasks', { params: { status } });
  return response.data.data;
};

export const updateHRTask = async (
  id: number,
  payload: {
    attachment?: File;
    comment?: string;
    status: TaskStatus;
  }
) => {
  const formData = new FormData();
  formData.append('status', payload.status);
  if (payload.comment) {
    formData.append('comment', payload.comment);
  }
  if (payload.attachment) {
    formData.append('attachment', payload.attachment);
  }
  const response = await api.put<ApiResponse<Task>>(`/hr/tasks/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.data;
};

export const getHRNotifications = async () => {
  const response = await api.get<ApiResponse<Notification[]>>('/notifications');
  return response.data.data;
};

export const markHRNotificationRead = async (id: number) => {
  await api.put(`/notifications/${id}/read`);
};

export const markAllHRNotificationsRead = async () => {
  await api.put('/notifications/read-all');
};

export const getHRAnnouncements = async () => {
  const response = await api.get<ApiResponse<Announcement[]>>('/hr/announcements');
  return response.data.data;
};

export const getHRAnalytics = async () => {
  const response = await api.get<ApiResponse<HRAnalytics>>('/hr/analytics');
  return response.data.data;
};

export const getHRDelayAlerts = async () => {
  const response = await api.get<ApiResponse<HRDelayAlert[]>>('/hr/delay-alerts');
  return response.data.data;
};

export const getHRReportHistory = async () => {
  const response = await api.get<ApiResponse<HRReportHistoryItem[]>>('/hr/reports');
  return response.data.data;
};

export const generateHRReport = async (
  type: 'daily' | 'weekly' | 'monthly',
  params: Record<string, string | number>
) => {
  const response = await api.get<ApiResponse<{ excelPath: string; pdfPath: string; reportId: number }>>(
    `/hr/reports/${type}`,
    { params }
  );
  return response.data.data;
};