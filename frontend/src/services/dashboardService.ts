import { API_ENDPOINTS } from '../constants/apiEndpoints';
import api from './api';
import type { Task } from '../types/task.types';

export interface ChairmanDashboardData {
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  delayedTasks: number;
  pendingApprovals: number;
  departments: { name: string; completionPct: number; healthColor: string }[];
  alerts: {
    id: number;
    title: string;
    subLabel: string;
    severity: 'Critical' | 'Warning' | 'Delay' | 'Escalated';
  }[];
  recentTasks: Task[];
  taskLists?: {
    total: Task[];
    completed: Task[];
    delayed: Task[];
  };
  pendingApprovalsList: {
    id: number;
    title: string;
    submitter: string;
    amount: string;
    department: string;
  }[];
}

interface PerformanceData {
  userId: number;
  name: string;
  role: string;
  totalTasks: number;
  completedTasks: number;
  delayedTasks: number;
  performanceScore: number;
  delayRate: number;
}

interface MonthlyComparisonData {
  departmentId: number;
  name: string;
  monthlyRates: Array<{
    month: string;
    completionRate: number;
    totalTasks: number;
    completedTasks: number;
  }>;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export const getChairmanDashboard = async (): Promise<ChairmanDashboardData> => {
  const response = await api.get<ApiResponse<ChairmanDashboardData>>(API_ENDPOINTS.dashboard.chairman);
  return response.data.data;
};

export const getStaffPerformance = async (): Promise<PerformanceData[]> => {
  const response = await api.get<ApiResponse<PerformanceData[]>>(API_ENDPOINTS.dashboard.performance);
  return response.data.data;
};

export const getMonthlyComparison = async (): Promise<MonthlyComparisonData[]> => {
  const response = await api.get<ApiResponse<MonthlyComparisonData[]>>(API_ENDPOINTS.dashboard.monthlyComparison);
  return response.data.data;
};
