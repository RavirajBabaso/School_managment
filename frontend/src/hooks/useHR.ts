import { useQuery } from '@tanstack/react-query';
import * as hrService from '../services/hrService';

export const useHRDashboard = () =>
  useQuery({
    queryKey: ['hr-dashboard'],
    queryFn: hrService.getHRDashboard,
    refetchInterval: 30000
  });

export const useHRTasks = (status = 'ALL') =>
  useQuery({
    queryKey: ['hr-tasks', status],
    queryFn: () => hrService.getHRTasks(status)
  });

export const useHRNotifications = () =>
  useQuery({
    queryKey: ['hr-notifications'],
    queryFn: hrService.getHRNotifications
  });

export const useHRAnnouncements = () =>
  useQuery({
    queryKey: ['hr-announcements'],
    queryFn: hrService.getHRAnnouncements
  });

export const useHRAnalytics = () =>
  useQuery({
    queryKey: ['hr-analytics'],
    queryFn: hrService.getHRAnalytics
  });

export const useHRDelayAlerts = () =>
  useQuery({
    queryKey: ['hr-delay-alerts'],
    queryFn: hrService.getHRDelayAlerts
  });

export const useHRReports = () =>
  useQuery({
    queryKey: ['hr-reports'],
    queryFn: hrService.getHRReportHistory
  });