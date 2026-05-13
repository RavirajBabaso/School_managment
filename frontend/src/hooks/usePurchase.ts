import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as purchaseService from '../services/purchaseService';
import type { PurchaseAnalytics, PurchaseDashboardSummary, PurchaseDelayAlert, PurchaseReportHistoryItem } from '../services/purchaseService';
import type { Task, TaskStatus } from '../types/task.types';

export const usePurchaseDashboard = () => {
  return useQuery<PurchaseDashboardSummary>({
    queryKey: ['purchase-dashboard'],
    queryFn: purchaseService.getPurchaseDashboard,
    refetchInterval: 30000
  });
};

export const usePurchaseTasks = (status: string = 'ALL') => {
  return useQuery<any[]>({
    queryKey: ['purchase-tasks', status],
    queryFn: () => purchaseService.getPurchaseTasks(status),
    refetchInterval: 15000
  });
};

export const useUpdatePurchaseTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { attachment?: File; comment?: string; status: TaskStatus } }) =>
      purchaseService.updatePurchaseTask(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['purchase-tasks'] });
      void queryClient.invalidateQueries({ queryKey: ['purchase-dashboard'] });
      void queryClient.invalidateQueries({ queryKey: ['purchase-analytics'] });
      void queryClient.invalidateQueries({ queryKey: ['purchase-delay-alerts'] });
    }
  });
};

export const usePurchaseAnalytics = () => {
  return useQuery<PurchaseAnalytics>({
    queryKey: ['purchase-analytics'],
    queryFn: purchaseService.getPurchaseAnalytics,
    refetchInterval: 60000
  });
};

export const usePurchaseDelayAlerts = () => {
  return useQuery<PurchaseDelayAlert[]>({
    queryKey: ['purchase-delay-alerts'],
    queryFn: purchaseService.getPurchaseDelayAlerts,
    refetchInterval: 45000
  });
};

export const usePurchaseReportHistory = () => {
  return useQuery<PurchaseReportHistoryItem[]>({
    queryKey: ['purchase-report-history'],
    queryFn: purchaseService.getPurchaseReportHistory
  });
};

export const usePurchaseAnnouncements = () => {
  return useQuery<any[]>({
    queryKey: ['purchase-announcements'],
    queryFn: purchaseService.getPurchaseAnnouncements
  });
};
