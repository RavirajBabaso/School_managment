import api from './api';
import type { Announcement, Notification } from '../types/notification.types';
import type { Task, TaskStatus } from '../types/task.types';

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ITDashboardSummary {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  delayedTasks: number;
  completionRate: number;
}

export interface ITAnalytics {
  completionRate: number;
  delayPercentage: number;
  erpEfficiency: number;
  taskDistribution: {
    completed: number;
    delayed: number;
    inProgress: number;
    pending: number;
    total: number;
  };
  infrastructureManagement: {
    systemsMaintained: number;
    issuesResolved: number;
    uptimePercentage: number;
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

export interface ITDelayAlert {
  assignedBy: string;
  dueDate: string;
  id: number;
  severity: 'Overdue' | 'Approaching' | 'Escalated';
  status: string;
  title: string;
}

export interface ITReportHistoryItem {
  createdAt: string;
  dateFrom: string;
  dateTo: string;
  id: number;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

export const getITDashboard = async () => {
  const response = await api.get<ApiResponse<ITDashboardSummary>>('/it/dashboard');
  return response.data.data;
};

export const getITTasks = async (status = 'ALL') => {
  const response = await api.get<ApiResponse<Task[]>>('/it/tasks', { params: { status } });
  return response.data.data;
};

export const updateITTask = async (
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
  const response = await api.put<ApiResponse<Task>>(`/it/tasks/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.data;
};

export const getITNotifications = async () => {
  const response = await api.get<ApiResponse<Notification[]>>('/notifications');
  return response.data.data;
};

export const markITNotificationRead = async (id: number) => {
  await api.put(`/notifications/${id}/read`);
};

export const markAllITNotificationsRead = async () => {
  await api.put('/notifications/read-all');
};

export const getITAnnouncements = async () => {
  const response = await api.get<ApiResponse<Announcement[]>>('/it/announcements');
  return response.data.data;
};

export const getITAnalytics = async () => {
  const response = await api.get<ApiResponse<ITAnalytics>>('/it/analytics');
  return response.data.data;
};

export const getITDelayAlerts = async () => {
  const response = await api.get<ApiResponse<ITDelayAlert[]>>('/it/delay-alerts');
  return response.data.data;
};

export const getITReportHistory = async () => {
  const response = await api.get<ApiResponse<ITReportHistoryItem[]>>('/it/reports');
  return response.data.data;
};

export const generateITReport = async (
  type: 'daily' | 'weekly' | 'monthly',
  params: Record<string, string | number>
) => {
  const response = await api.get<ApiResponse<{ excelPath: string; pdfPath: string; reportId: number }>>(
    `/it/reports/${type}`,
    { params }
  );
  return response.data.data;
};