import api from './api';
import type { Announcement, Notification } from '../types/notification.types';
import type { Task, TaskStatus } from '../types/task.types';

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface TransportDashboardSummary {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  delayedTasks: number;
  completionRate: number;
}

export interface TransportAnalytics {
  completionRate: number;
  delayPercentage: number;
  routeEfficiency: number;
  taskDistribution: {
    completed: number;
    delayed: number;
    inProgress: number;
    pending: number;
    total: number;
  };
  vehicleCoordination: {
    vehiclesManaged: number;
    routesOptimized: number;
    maintenanceTracking: number;
  };
  monthlyPerformance: Array<{
    month: string;
    completed: number;
    delayed: number;
    total: number;
  }>;
}

export interface TransportDelayAlert {
  assignedBy: string;
  dueDate: string;
  id: number;
  severity: 'Overdue' | 'Approaching' | 'Escalated';
  status: string;
  title: string;
}

export interface TransportReportHistoryItem {
  createdAt: string;
  dateFrom: string;
  dateTo: string;
  id: number;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

export const getTransportDashboard = async () => {
  console.log('Fetching transport dashboard...');
  const response = await api.get<ApiResponse<TransportDashboardSummary>>('/transport/dashboard');
  console.log('Transport dashboard fetched:', response.data.data);
  return response.data.data;
};

export const getTransportTasks = async (status = 'ALL') => {
  console.log(`Fetching transport tasks with status: ${status}`);
  const response = await api.get<ApiResponse<Task[]>>('/transport/tasks', { params: { status } });
  console.log('Transport tasks fetched:', response.data.data);
  return response.data.data;
};

export const updateTransportTask = async (
  id: number,
  payload: {
    attachment?: File;
    comment?: string;
    status: TaskStatus;
  }
) => {
  console.log(`Updating transport task ${id} with payload:`, payload);
  const formData = new FormData();
  formData.append('status', payload.status);
  if (payload.comment) {
    formData.append('comment', payload.comment);
  }
  if (payload.attachment) {
    formData.append('attachment', payload.attachment);
  }
  const response = await api.put<ApiResponse<Task>>(`/transport/tasks/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  console.log('Transport task updated:', response.data.data);
  return response.data.data;
};

export const getTransportNotifications = async () => {
  console.log('Fetching transport notifications...');
  const response = await api.get<ApiResponse<Notification[]>>('/notifications');
  console.log('Transport notifications fetched:', response.data.data);
  return response.data.data;
};

export const markTransportNotificationRead = async (id: number) => {
  console.log(`Marking transport notification ${id} as read...`);
  await api.put(`/notifications/${id}/read`);
  console.log(`Transport notification ${id} marked as read`);
};

export const markAllTransportNotificationsRead = async () => {
  console.log('Marking all transport notifications as read...');
  await api.put('/notifications/read-all');
  console.log('All transport notifications marked as read');
};

export const getTransportAnnouncements = async () => {
  console.log('Fetching transport announcements...');
  const response = await api.get<ApiResponse<Announcement[]>>('/transport/announcements');
  console.log('Transport announcements fetched:', response.data.data);
  return response.data.data;
};

export const getTransportAnalytics = async () => {
  console.log('Fetching transport analytics...');
  const response = await api.get<ApiResponse<TransportAnalytics>>('/transport/analytics');
  console.log('Transport analytics fetched:', response.data.data);
  return response.data.data;
};

export const getTransportDelayAlerts = async () => {
  console.log('Fetching transport delay alerts...');
  const response = await api.get<ApiResponse<TransportDelayAlert[]>>('/transport/delay-alerts');
  console.log('Transport delay alerts fetched:', response.data.data);
  return response.data.data;
};

export const getTransportReportHistory = async () => {
  console.log('Fetching transport report history...');
  const response = await api.get<ApiResponse<TransportReportHistoryItem[]>>('/transport/reports');
  console.log('Transport report history fetched:', response.data.data);
  return response.data.data;
};

export const generateTransportReport = async (
  type: 'daily' | 'weekly' | 'monthly',
  params: Record<string, string | number>
) => {
  console.log(`Generating transport report of type: ${type} with params:`, params);
  const response = await api.get<ApiResponse<{ excelPath: string; pdfPath: string; reportId: number }>>(
    `/transport/reports/${type}`,
    { params }
  );
  console.log('Transport report generated:', response.data.data);
  return response.data.data;
};