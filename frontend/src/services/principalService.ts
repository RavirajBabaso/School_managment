import api from './api';
import type { Announcement, Notification } from '../types/notification.types';
import type { Task, TaskStatus } from '../types/task.types';

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PrincipalDashboardSummary {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  delayedTasks: number;
  completionRate: number;
}

export interface PrincipalAnalytics {
  academicEfficiency: number;
  completionRate: number;
  delayPercentage: number;
  facultyPerformance: Array<{
    completed: number;
    delayed: number;
    faculty: string;
    score: number;
    total: number;
  }>;
  monthlyPerformance: Array<{
    completed: number;
    delayed: number;
    month: string;
    total: number;
  }>;
  taskDistribution: {
    completed: number;
    delayed: number;
    inProgress: number;
    pending: number;
    total: number;
  };
}

export interface PrincipalDelayAlert {
  assignedBy: string;
  dueDate: string;
  id: number;
  severity: 'Overdue' | 'Approaching' | 'Escalated';
  status: string;
  title: string;
}

export interface PrincipalReportHistoryItem {
  createdAt: string;
  dateFrom: string;
  dateTo: string;
  id: number;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

export const getPrincipalDashboard = async () => {
  const response = await api.get<ApiResponse<PrincipalDashboardSummary>>('/principal/dashboard');
  return response.data.data;
};

export const getPrincipalTasks = async (status = 'ALL') => {
  const response = await api.get<ApiResponse<Task[]>>('/principal/tasks', { params: { status } });
  return response.data.data;
};

export const getPrincipalTask = async (id: number) => {
  const response = await api.get<ApiResponse<Task>>(`/principal/tasks/${id}`);
  return response.data.data;
};

export const updatePrincipalTask = async (
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

  const response = await api.put<ApiResponse<Task>>(`/principal/tasks/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.data;
};

export const getPrincipalNotifications = async () => {
  const response = await api.get<ApiResponse<Notification[]>>('/notifications');
  return response.data.data;
};

export const markPrincipalNotificationRead = async (id: number) => {
  await api.put(`/notifications/${id}/read`);
};

export const markAllPrincipalNotificationsRead = async () => {
  await api.put('/notifications/read-all');
};

export const getPrincipalAnnouncements = async () => {
  const response = await api.get<ApiResponse<Announcement[]>>('/principal/announcements');
  return response.data.data;
};

export const getPrincipalAnalytics = async () => {
  const response = await api.get<ApiResponse<PrincipalAnalytics>>('/principal/analytics');
  return response.data.data;
};

export const getPrincipalDelayAlerts = async () => {
  const response = await api.get<ApiResponse<PrincipalDelayAlert[]>>('/principal/delay-alerts');
  return response.data.data;
};

export const getPrincipalReportHistory = async () => {
  const response = await api.get<ApiResponse<PrincipalReportHistoryItem[]>>('/principal/reports');
  return response.data.data;
};

export const generatePrincipalReport = async (
  type: 'daily' | 'weekly' | 'monthly',
  params: Record<string, string | number>
) => {
  const response = await api.get<ApiResponse<{ excelPath: string; pdfPath: string; reportId: number }>>(
    `/principal/reports/${type}`,
    { params }
  );
  return response.data.data;
};
