import type {
  Task,
  TaskCadence,
  TaskPriority,
  TaskStatus
} from '../../types/task.types';

import Badge from '../common/Badge';

interface TaskTableProps {
  emptyMessage?: string;
  onRowClick?: (task: Task) => void;
  tasks?: Task[];
}

const priorityStripe: Record<
  TaskPriority,
  string
> = {
  HIGH: 'before:bg-[#EF4444]',
  MEDIUM: 'before:bg-[#F59E0B]',
  LOW: 'before:bg-[#22C55E]'
};

const statusVariant: Record<
  TaskStatus,
  'blue' | 'amber' | 'green' | 'red' | 'gray'
> = {
  PENDING: 'blue',
  IN_PROGRESS: 'amber',
  COMPLETED: 'green',
  DELAYED: 'red',
  ESCALATED: 'gray'
};

const formatLabel = (value?: string) =>
  (value ?? 'UNKNOWN')
    .toLowerCase()
    .split('_')
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1)
    )
    .join(' ');

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const getCadence = (
  task: Task
): TaskCadence => {
  const start = new Date(task.start_date);

  const due = new Date(task.due_date);

  const diffDays = Math.max(
    1,
    Math.ceil(
      (due.getTime() - start.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  if (diffDays <= 1) {
    return 'DAILY';
  }

  if (diffDays <= 7) {
    return 'WEEKLY';
  }

  return 'MONTHLY';
};

function TaskTable({
  emptyMessage = 'No tasks available right now.',
  onRowClick,
  tasks
}: TaskTableProps) {
  const safeTasks = Array.isArray(tasks)
    ? tasks
    : [];

  if (safeTasks.length === 0) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-[24px] border border-slate-800 bg-[#111827] p-8 text-center">
        <div>
          <p className="text-base font-semibold text-white">
            No tasks found
          </p>

          <p className="mt-2 text-sm text-slate-400">
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-800 bg-[#111827]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          
          {/* Header */}
          <thead className="bg-[#0F172A]">
            <tr>
              {[
                'Task Title',
                'Assigned To',
                'Priority',
                'Type',
                'Start Date',
                'Deadline',
                'Status'
              ].map((heading) => (
                <th
                  className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400"
                  key={heading}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-800">
            {safeTasks.map((task) => (
              <tr
                className={[
                  'transition hover:bg-[#172036]',
                  onRowClick
                    ? 'cursor-pointer'
                    : ''
                ].join(' ')}
                key={task.id}
                onClick={() =>
                  onRowClick?.(task)
                }
              >
                {/* Title */}
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {task.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {task.department?.name ??
                        task.departmentName ??
                        'General'}
                    </p>
                  </div>
                </td>

                {/* Assigned */}
                <td className="px-5 py-4 text-sm text-slate-300">
                  {task.assignedTo?.name ??
                    task.assignedToName ??
                    'Unassigned'}
                </td>

                {/* Priority */}
                <td className="px-5 py-4">
                  <div
                    className={[
                      'relative inline-flex min-w-[92px] items-center rounded-[12px] bg-[#0F172A] px-3 py-2 pl-4 text-xs font-semibold text-slate-300 before:absolute before:bottom-1.5 before:left-1.5 before:top-1.5 before:w-[3px] before:rounded-full',
                      priorityStripe[
                        task.priority
                      ] ??
                        'before:bg-slate-500'
                    ].join(' ')}
                  >
                    {formatLabel(task.priority)}
                  </div>
                </td>

                {/* Type */}
                <td className="px-5 py-4 text-sm text-slate-300">
                  {formatLabel(
                    getCadence(task)
                  )}
                </td>

                {/* Start */}
                <td className="px-5 py-4 text-sm text-slate-300">
                  {formatDate(task.start_date)}
                </td>

                {/* Due */}
                <td className="px-5 py-4 text-sm text-slate-300">
                  {formatDate(task.due_date)}
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <Badge
                    variant={
                      statusVariant[
                        task.status
                      ] ?? 'gray'
                    }
                  >
                    {formatLabel(task.status)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskTable;