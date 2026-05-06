import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import TaskTable from '../../components/tables/TaskTable';
import * as reportService from '../../services/reportService';
import * as taskService from '../../services/taskService';
import { setTasks } from '../../store/taskSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { TaskStatus } from '../../types/task.types';

const filterTabs: Array<{ label: string; value: TaskStatus | 'ALL' }> = [
  { label: 'All Tasks', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Delayed', value: 'DELAYED' }
];

const statCards: Array<{ color: string; key: TaskStatus; label: string }> = [
  { color: 'bg-[#EAF3FC] text-[#185FA5]', key: 'PENDING', label: 'Pending' },
  { color: 'bg-[#FFF7E1] text-[#A86A00]', key: 'IN_PROGRESS', label: 'In Progress' },
  { color: 'bg-[#EDF9F1] text-[#2E7D4F]', key: 'COMPLETED', label: 'Completed' },
  { color: 'bg-[#FFF1F1] text-[#C13F3A]', key: 'DELAYED', label: 'Delayed' }
];

function TaskMonitoring() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks);

  const [activeFilter, setActiveFilter] = useState<TaskStatus | 'ALL'>('ALL');

  const tableRef = useRef<HTMLDivElement | null>(null);

  const taskQuery = useQuery({
    queryKey: ['tasks', 'monitoring'],
    queryFn: () => taskService.getAllTasks()
  });

  useEffect(() => {
    if (taskQuery.data) {
      dispatch(setTasks(taskQuery.data));
    }
  }, [dispatch, taskQuery.data]);

  // 🔢 Count calculation
  const counts = useMemo(
    () =>
      statCards.reduce<Record<TaskStatus, number>>(
        (acc, card) => {
          acc[card.key] = tasks.filter((task) => task.status === card.key).length;
          return acc;
        },
        {
          PENDING: 0,
          IN_PROGRESS: 0,
          COMPLETED: 0,
          DELAYED: 0,
          ESCALATED: 0
        }
      ),
    [tasks]
  );

  // 🔍 Filtering
  const filteredTasks =
    activeFilter === 'ALL'
      ? tasks
      : tasks.filter((task) => task.status === activeFilter);

  const handleExportPdf = async () => {
    const blob = await reportService.exportDailyReportPdf();
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => window.URL.revokeObjectURL(url), 60000);
  };

  return (
    <section className="space-y-5 p-5 bg-[var(--bg-secondary)] min-h-screen text-[var(--text-primary)]">

      {/* ================= KPI CARDS ================= */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <article
            key={card.key}
            onClick={() => {
              setActiveFilter(card.key);
              tableRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`cursor-pointer rounded-[14px] border p-4 transition
              ${
                activeFilter === card.key
                  ? 'border-[#185FA5] bg-[#EFF6FF]'
                  : 'border-[#EFF2F6] bg-white hover:bg-[#F8FAFC]'
              }
            `}
          >
            <span
              className={[
                'inline-flex rounded-full px-2 py-1 text-[11px] font-semibold',
                card.color
              ].join(' ')}
            >
              {card.label}
            </span>

            <p className="mt-3 text-2xl font-semibold text-[#1E293B]">
              {counts[card.key]}
            </p>

            <p className="mt-1 text-xs text-[#8A99B0]">
              Click to view {card.label.toLowerCase()} tasks
            </p>
          </article>
        ))}
      </div>

      {/* ================= HEADER ================= */}
      <div className="rounded-[14px] border border-[#EFF2F6] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#185FA5]">
              Monitor Module
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[#1E293B]">
              Task monitoring view
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-wrap gap-2">
              {filterTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => {
                    setActiveFilter(tab.value);
                    tableRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={[
                    'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                    activeFilter === tab.value
                      ? 'bg-[#185FA5] text-white'
                      : 'bg-[#F3F6FA] text-[#5B6E8C] hover:bg-[#E7EDF4]'
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <Button onClick={handleExportPdf}>Export PDF</Button>
          </div>
        </div>
      </div>

      {/* ================= TASK TABLE ================= */}
      <div
        ref={tableRef}
        className="rounded-[14px] border border-[#EFF2F6] bg-white p-5"
      >
        <TaskTable
          emptyMessage="Once tasks are assigned, the monitoring grid will populate here."
          onRowClick={(task) => navigate(`/task/${task.id}`)}
          tasks={filteredTasks}
        />
      </div>
    </section>
  );
}

export default TaskMonitoring;