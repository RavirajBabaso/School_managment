import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { addNotification } from '../store/notificationSlice';
import { upsertTask } from '../store/taskSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { Announcement, Notification } from '../types/notification.types';
import type { Task } from '../types/task.types';

interface SocketTaskPayload {
  task?: Task;
}

const resolveTaskPayload = (payload: SocketTaskPayload | Task) => {
  if ('id' in payload) {
    return payload;
  }

  return payload.task;
};

const normalizeAnnouncementNotification = (
  announcement: Announcement,
  userId: number | undefined
): Notification => ({
  id: announcement.id,
  user_id: userId ?? 0,
  type: 'ANNOUNCEMENT',
  message: announcement.message,
  task_id: null,
  is_read: false,
  created_at: announcement.created_at
});

export const useSocket = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    const socketBaseUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api').replace(
      /\/api\/?$/,
      ''
    );
    const socket = io(socketBaseUrl, {
      auth: { token },
      transports: ['websocket']
    });

socket.on('notification:new', (notification: Notification) => {
      dispatch(addNotification(notification));
      void queryClient.invalidateQueries({ queryKey: ['chairman-dashboard'] });
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success(notification.message);
    });

    socket.on('task:assigned', (payload: SocketTaskPayload | Task) => {
      const task = resolveTaskPayload(payload);
      if (task) {
        dispatch(upsertTask(task));
        void queryClient.invalidateQueries({ queryKey: ['purchase-tasks'] });
        void queryClient.invalidateQueries({ queryKey: ['purchase-dashboard'] });
      }
    });

socket.on('task:updated', (payload: SocketTaskPayload | Task) => {
      const task = resolveTaskPayload(payload);
      if (task) {
        dispatch(upsertTask(task));
        void queryClient.invalidateQueries({ queryKey: ['chairman-dashboard'] });
        void queryClient.invalidateQueries({ queryKey: ['principal-dashboard'] });
        void queryClient.invalidateQueries({ queryKey: ['principal-tasks'] });
        void queryClient.invalidateQueries({ queryKey: ['principal-analytics'] });
        void queryClient.invalidateQueries({ queryKey: ['principal-delay-alerts'] });
        void queryClient.invalidateQueries({ queryKey: ['admission-dashboard'] });
        void queryClient.invalidateQueries({ queryKey: ['admission-tasks'] });
        void queryClient.invalidateQueries({ queryKey: ['admission-analytics'] });
        void queryClient.invalidateQueries({ queryKey: ['hr-dashboard'] });
        void queryClient.invalidateQueries({ queryKey: ['hr-tasks'] });
        void queryClient.invalidateQueries({ queryKey: ['hr-analytics'] });
        void queryClient.invalidateQueries({ queryKey: ['hr-delay-alerts'] });
        void queryClient.invalidateQueries({ queryKey: ['purchase-dashboard'] });
        void queryClient.invalidateQueries({ queryKey: ['purchase-tasks'] });
        void queryClient.invalidateQueries({ queryKey: ['purchase-analytics'] });
        void queryClient.invalidateQueries({ queryKey: ['purchase-delay-alerts'] });
        void queryClient.invalidateQueries({ queryKey: ['tasks'] });
        void queryClient.invalidateQueries({ queryKey: ['task', task.id] });
        void queryClient.invalidateQueries({ queryKey: ['staffPerformance'] });
        void queryClient.invalidateQueries({ queryKey: ['monthlyComparison'] });
      }
    });

    socket.on('approval:new', () => {
      void queryClient.invalidateQueries({ queryKey: ['approvals'] });
      void queryClient.invalidateQueries({ queryKey: ['chairman-dashboard'] });
    });

    socket.on('approval:updated', () => {
      void queryClient.invalidateQueries({ queryKey: ['approvals'] });
      void queryClient.invalidateQueries({ queryKey: ['chairman-dashboard'] });
    });

socket.on('announcement:new', (announcement: Announcement) => {
      dispatch(addNotification(normalizeAnnouncementNotification(announcement, user?.id)));
      void queryClient.invalidateQueries({ queryKey: ['announcements'] });
      void queryClient.invalidateQueries({ queryKey: ['principal-announcements'] });
      void queryClient.invalidateQueries({ queryKey: ['admission-announcements'] });
      void queryClient.invalidateQueries({ queryKey: ['chairman-dashboard'] });
      void queryClient.invalidateQueries({ queryKey: ['purchase-announcements'] });
    });

    socket.on('task:delayed', (payload: SocketTaskPayload | Task) => {
      const task = resolveTaskPayload(payload);
      if (task) {
        dispatch(upsertTask(task));
        void queryClient.invalidateQueries({ queryKey: ['hr-delay-alerts'] });
        void queryClient.invalidateQueries({ queryKey: ['hr-dashboard'] });
        void queryClient.invalidateQueries({ queryKey: ['purchase-delay-alerts'] });
        void queryClient.invalidateQueries({ queryKey: ['purchase-dashboard'] });
      }
    });

    socket.on('escalation:new', (payload: SocketTaskPayload | Task) => {
      const task = resolveTaskPayload(payload);
      if (task) {
        dispatch(upsertTask(task));
        void queryClient.invalidateQueries({ queryKey: ['hr-delay-alerts'] });
        void queryClient.invalidateQueries({ queryKey: ['hr-dashboard'] });
        void queryClient.invalidateQueries({ queryKey: ['purchase-delay-alerts'] });
        void queryClient.invalidateQueries({ queryKey: ['purchase-dashboard'] });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch, queryClient, token, user?.id]);
};
