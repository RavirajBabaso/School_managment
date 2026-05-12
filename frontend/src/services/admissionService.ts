import api from './api';
import type { Announcement, Notification } from '../types/notification.types';
import type { Task, TaskStatus } from '../types/task.types';

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface AdmissionDashboardSummary {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  delayedTasks: number;
  completionRate: number;
}

export interface AdmissionAnalytics {
  campaignPerformance: Array<{ campaign: string; conversions: number; inquiries: number }>;
  campaignProductivity: number;
  completionRate: number;
  delayPercentage: number;
  departmentEfficiency: number;
  inquiryConversionPerformance: number;
  monthlyPerformance: Array<{ completed: number; delayed: number; inquiries: number; month: string }>;
  taskDistribution: {
    completed: number;
    delayed: number;
    inProgress: number;
    pending: number;
    total: number;
  };
}

export interface AdmissionDelayAlert {
  assignedBy: string;
  dueDate: string;
  id: number;
  severity: 'Overdue' | 'Approaching' | 'Escalated';
  status: string;
  title: string;
}

export interface AdmissionReportHistoryItem {
  createdAt: string;
  dateFrom: string;
  dateTo: string;
  id: number;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

export const getAdmissionDashboard = async () => {
  const response = await api.get<ApiResponse<AdmissionDashboardSummary>>('/admission/dashboard');
  return response.data.data;
};

export const getAdmissionTasks = async (status = 'ALL') => {
  const response = await api.get<ApiResponse<Task[]>>('/admission/tasks', { params: { status } });
  return response.data.data;
};

export const updateAdmissionTask = async (
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
  const response = await api.put<ApiResponse<Task>>(`/admission/tasks/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.data;
};

export const getAdmissionNotifications = async () => {
  const response = await api.get<ApiResponse<Notification[]>>('/notifications');
  return response.data.data;
};

export const markAdmissionNotificationRead = async (id: number) => {
  await api.put(`/notifications/${id}/read`);
};

export const markAllAdmissionNotificationsRead = async () => {
  await api.put('/notifications/read-all');
};

export const getAdmissionAnnouncements = async () => {
  const response = await api.get<ApiResponse<Announcement[]>>('/admission/announcements');
  return response.data.data;
};

export const getAdmissionAnalytics = async () => {
  const response = await api.get<ApiResponse<AdmissionAnalytics>>('/admission/analytics');
  return response.data.data;
};

export const getAdmissionDelayAlerts = async () => {
  const response = await api.get<ApiResponse<AdmissionDelayAlert[]>>('/admission/delay-alerts');
  return response.data.data;
};

export const getAdmissionReportHistory = async () => {
  const response = await api.get<ApiResponse<AdmissionReportHistoryItem[]>>('/admission/reports');
  return response.data.data;
};

export const generateAdmissionReport = async (
  type: 'daily' | 'weekly' | 'monthly',
  params: Record<string, string | number>
) => {
  const response = await api.get<ApiResponse<{ excelPath: string; pdfPath: string; reportId: number }>>(
    `/admission/reports/${type}`,
    { params }
  );
  return response.data.data;
};
