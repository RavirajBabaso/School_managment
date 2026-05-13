import { useQuery } from '@tanstack/react-query';
import * as itService from '../services/itService';

export const useITDashboard = () =>
  useQuery({
    queryKey: ['it-dashboard'],
    queryFn: itService.getITDashboard,
    refetchInterval: 30000
  });

export const useITTasks = (status = 'ALL') =>
  useQuery({
    queryKey: ['it-tasks', status],
    queryFn: () => itService.getITTasks(status)
  });

export const useITNotifications = () =>
  useQuery({
    queryKey: ['it-notifications'],
    queryFn: itService.getITNotifications
  });

export const useITAnnouncements = () =>
  useQuery({
    queryKey: ['it-announcements'],
    queryFn: itService.getITAnnouncements
  });

export const useITAnalytics = () =>
  useQuery({
    queryKey: ['it-analytics'],
    queryFn: itService.getITAnalytics
  });

export const useITDelayAlerts = () =>
  useQuery({
    queryKey: ['it-delay-alerts'],
    queryFn: itService.getITDelayAlerts
  });

export const useITReports = () =>
  useQuery({
    queryKey: ['it-reports'],
    queryFn: itService.getITReportHistory
  });