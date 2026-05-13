import api from './api';
import type { Announcement, Notification } from '../types/notification.types';
import type { Task, TaskStatus } from '../types/task.types';

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PurchaseDashboardSummary {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  delayedTasks: number;
  completionRate: number;
}

export interface PurchaseAnalytics {
  completionRate: number;
  delayPercentage: number;
  procurementEfficiency: number;
  taskDistribution: {
    completed: number;
    delayed: number;
    inProgress: number;
    pending: number;
    total: number;
  };
  vendorPerformance: Array<{
    vendor: string;
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
  priorityDistribution: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface PurchaseDelayAlert {
  assignedBy: string;
  dueDate: string;
  id: number;
  severity: 'Overdue' | 'Approaching' | 'Escalated';
  status: string;
  title: string;
  priority: string;
}

export interface PurchaseReportHistoryItem {
  createdAt: string;
  dateFrom: string;
  dateTo: string;
  id: number;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

export const getPurchaseDashboard = async () => {
  const response = await api.get<ApiResponse<PurchaseDashboardSummary>>('/purchase/dashboard');
  return response.data.data;
};

export const getPurchaseTasks = async (status = 'ALL') => {
  const response = await api.get<ApiResponse<Task[]>>('/purchase/tasks', { params: { status } });
  return response.data.data;
};

export const updatePurchaseTask = async (
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
  const response = await api.put<ApiResponse<Task>>(`/purchase/tasks/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.data;
};

export const getPurchaseNotifications = async () => {
  const response = await api.get<ApiResponse<Notification[]>>('/notifications');
  return response.data.data;
};

export const markPurchaseNotificationRead = async (id: number) => {
  await api.put(`/notifications/${id}/read`);
};

export const markAllPurchaseNotificationsRead = async () => {
  await api.put('/notifications/read-all');
};

export const getPurchaseAnnouncements = async () => {
  const response = await api.get<ApiResponse<Announcement[]>>('/purchase/announcements');
  return response.data.data;
};

export const getPurchaseAnalytics = async () => {
  const response = await api.get<ApiResponse<PurchaseAnalytics>>('/purchase/analytics');
  return response.data.data;
};

export const getPurchaseDelayAlerts = async () => {
  const response = await api.get<ApiResponse<PurchaseDelayAlert[]>>('/purchase/delay-alerts');
  return response.data.data;
};

export const getPurchaseReportHistory = async () => {
  const response = await api.get<ApiResponse<PurchaseReportHistoryItem[]>>('/purchase/reports');
  return response.data.data;
};

export const generatePurchaseReport = async (
  type: 'daily' | 'weekly' | 'monthly',
  params: Record<string, string | number>
) => {
  const response = await api.get<ApiResponse<{ excelPath: string; pdfPath: string; reportId: number }>>(
    `/purchase/reports/${type}`,
    { params }
  );
  return response.data.data;
};
