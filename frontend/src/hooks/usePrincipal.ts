import { useQuery } from '@tanstack/react-query';
import * as principalService from '../services/principalService';

export const usePrincipalDashboard = () =>
  useQuery({
    queryKey: ['principal-dashboard'],
    queryFn: principalService.getPrincipalDashboard,
    refetchInterval: 30000
  });

export const usePrincipalTasks = (status = 'ALL') =>
  useQuery({
    queryKey: ['principal-tasks', status],
    queryFn: () => principalService.getPrincipalTasks(status)
  });

export const usePrincipalNotifications = () =>
  useQuery({
    queryKey: ['principal-notifications'],
    queryFn: principalService.getPrincipalNotifications
  });

export const usePrincipalAnnouncements = () =>
  useQuery({
    queryKey: ['principal-announcements'],
    queryFn: principalService.getPrincipalAnnouncements
  });

export const usePrincipalAnalytics = () =>
  useQuery({
    queryKey: ['principal-analytics'],
    queryFn: principalService.getPrincipalAnalytics
  });

export const usePrincipalDelayAlerts = () =>
  useQuery({
    queryKey: ['principal-delay-alerts'],
    queryFn: principalService.getPrincipalDelayAlerts
  });

export const usePrincipalReports = () =>
  useQuery({
    queryKey: ['principal-reports'],
    queryFn: principalService.getPrincipalReportHistory
  });
