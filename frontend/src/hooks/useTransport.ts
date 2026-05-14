import { useQuery } from '@tanstack/react-query';
import * as transportService from '../services/transportService';

export const useTransportDashboard = () =>
  useQuery({
    queryKey: ['transport-dashboard'],
    queryFn: transportService.getTransportDashboard,
    refetchInterval: 30000
  });

export const useTransportTasks = (status = 'ALL') =>
  useQuery({
    queryKey: ['transport-tasks', status],
    queryFn: () => transportService.getTransportTasks(status)
  });

export const useTransportNotifications = () =>
  useQuery({
    queryKey: ['transport-notifications'],
    queryFn: transportService.getTransportNotifications
  });

export const useTransportAnnouncements = () =>
  useQuery({
    queryKey: ['transport-announcements'],
    queryFn: transportService.getTransportAnnouncements
  });

export const useTransportAnalytics = () =>
  useQuery({
    queryKey: ['transport-analytics'],
    queryFn: transportService.getTransportAnalytics
  });

export const useTransportDelayAlerts = () =>
  useQuery({
    queryKey: ['transport-delay-alerts'],
    queryFn: transportService.getTransportDelayAlerts
  });

export const useTransportReports = () =>
  useQuery({
    queryKey: ['transport-reports'],
    queryFn: transportService.getTransportReportHistory
  });