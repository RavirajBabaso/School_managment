import { useQuery } from '@tanstack/react-query';
import * as admissionService from '../services/admissionService';

export const useAdmissionDashboard = () =>
  useQuery({
    queryKey: ['admission-dashboard'],
    queryFn: admissionService.getAdmissionDashboard,
    refetchInterval: 30000
  });

export const useAdmissionTasks = (status = 'ALL') =>
  useQuery({
    queryKey: ['admission-tasks', status],
    queryFn: () => admissionService.getAdmissionTasks(status)
  });

export const useAdmissionNotifications = () =>
  useQuery({
    queryKey: ['admission-notifications'],
    queryFn: admissionService.getAdmissionNotifications
  });

export const useAdmissionAnnouncements = () =>
  useQuery({
    queryKey: ['admission-announcements'],
    queryFn: admissionService.getAdmissionAnnouncements
  });

export const useAdmissionAnalytics = () =>
  useQuery({
    queryKey: ['admission-analytics'],
    queryFn: admissionService.getAdmissionAnalytics
  });

export const useAdmissionDelayAlerts = () =>
  useQuery({
    queryKey: ['admission-delay-alerts'],
    queryFn: admissionService.getAdmissionDelayAlerts
  });

export const useAdmissionReports = () =>
  useQuery({
    queryKey: ['admission-reports'],
    queryFn: admissionService.getAdmissionReportHistory
  });
