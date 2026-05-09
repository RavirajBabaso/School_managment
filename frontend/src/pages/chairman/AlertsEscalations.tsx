import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import * as taskService from '../../services/taskService';
import type { Task } from '../../types/task.types';

function isCritical(task: Task) {
  return task.status === 'ESCALATED' || task.priority === 'HIGH';
}

function formatPath(task: Task) {
  return `Sub-head -> School Manager -> Chairman${task.department?.name ? ` | ${task.department.name}` : ''}`;
}

function AlertsEscalations() {
  const queryClient = useQueryClient();
  const alertsQuery = useQuery({
    queryKey: ['tasks', 'alerts-feed'],
    queryFn: () => taskService.getAllTasks({ status: 'DELAYED,ESCALATED' }),
    refetchInterval: 15000,
    refetchOnWindowFocus: true
  });

  const resolveMutation = useMutation({
    mutationFn: (taskId: number) => taskService.updateTask(taskId, { status: 'IN_PROGRESS' }),
    onSuccess: async () => {
      toast.success('Alert resolved and task moved to in progress.');
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
      await queryClient.invalidateQueries({ queryKey: ['chairman-dashboard'] });
    }
  });

  const alerts = alertsQuery.data ?? [];
  const metrics = useMemo(
    () => ({
      critical: alerts.filter((task) => task.status === 'ESCALATED').length,
      warnings: alerts.filter((task) => task.status === 'DELAYED').length,
      escalatedToYou: alerts.filter((task) => task.status === 'ESCALATED').length
    }),
    [alerts]
  );

  return (
  <section className="space-y-6">
    {/* Top KPI Cards */}
    <div className="grid gap-4 md:grid-cols-3">
      <article className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
              Critical
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-[var(--text-primary)]">
              {metrics.critical}
            </h2>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Escalated tasks needing attention
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FEF2F2]">
            <span className="h-3 w-3 rounded-full bg-[#DC2626]" />
          </div>
        </div>
      </article>

      <article className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
              Warnings
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-[var(--text-primary)]">
              {metrics.warnings}
            </h2>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Delayed tasks that may escalate
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFFBEB]">
            <span className="h-0 w-0 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent border-b-[#D97706]" />
          </div>
        </div>
      </article>

      <article className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
              Escalated To You
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-[var(--text-primary)]">
              {metrics.escalatedToYou}
            </h2>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Workflow items routed to your desk
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EFF6FF]">
            <span className="text-lg font-bold text-[#2563EB]">!</span>
          </div>
        </div>
      </article>
    </div>

    {/* Alerts Feed */}
    <article className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[var(--border-color)] pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)]">
            Alerts module
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
            Alert & escalation feed
          </h2>

          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Monitor delayed and escalated tasks in real-time.
          </p>
        </div>

        <Badge variant={alertsQuery.isFetching ? 'blue' : 'gray'}>
          {alertsQuery.isFetching
            ? 'Refreshing...'
            : `${alerts.length} Live Alerts`}
        </Badge>
      </div>

      {/* Feed */}
      <div className="mt-6 space-y-4">
        {alertsQuery.isLoading ? (
          <div className="rounded-[20px] border border-dashed border-[var(--border-color)] bg-[var(--surface)] px-4 py-12 text-center text-sm text-[var(--text-secondary)]">
            Loading live alerts...
          </div>
        ) : alertsQuery.isError ? (
          <div className="rounded-[20px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-8 text-center text-sm font-medium text-[#DC2626]">
            Unable to load live alerts right now.
          </div>
        ) : alerts.length > 0 ? (
          alerts.map((task) => {
            const critical = isCritical(task);

            return (
              <div
                key={task.id}
                className="group flex flex-col gap-5 rounded-[22px] border border-[var(--border-color)] bg-[var(--surface)] p-5 transition-all hover:shadow-sm lg:flex-row lg:items-center lg:justify-between"
              >
                {/* Left */}
                <div className="flex min-w-0 items-start gap-4">
                  <div className="mt-1 flex-shrink-0">
                    {critical ? (
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FEF2F2]">
                        <span className="h-3 w-3 rounded-full bg-[#DC2626]" />
                      </div>
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFFBEB]">
                        <span className="h-0 w-0 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent border-b-[#D97706]" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-[var(--text-primary)]">
                      {task.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                      {formatPath(task)}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-4">
                  <Badge variant={critical ? 'red' : 'amber'}>
                    {critical ? 'Critical' : 'Warning'}
                  </Badge>

                  <Button
                    loading={resolveMutation.isPending}
                    onClick={() => void resolveMutation.mutateAsync(task.id)}
                  >
                    Resolve
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-[20px] border border-dashed border-[var(--border-color)] bg-[var(--surface)] px-4 py-12 text-center text-sm text-[var(--text-secondary)]">
            No delayed or escalated tasks are active right now.
          </div>
        )}
      </div>
    </article>
  </section>
);
}

export default AlertsEscalations;
