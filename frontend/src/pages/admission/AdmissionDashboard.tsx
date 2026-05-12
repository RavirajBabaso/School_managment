import { useMemo, useState } from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import AdmissionTaskTable from '../../components/admission/AdmissionTaskTable';
import TaskDetailModal from '../../components/admission/TaskDetailModal';
import { useSocket } from '../../hooks/useSocket';
import { useAdmissionDashboard, useAdmissionDelayAlerts, useAdmissionTasks } from '../../hooks/useAdmission';
import type { Task, TaskStatus } from '../../types/task.types';
import AdmissionAnalytics from './AdmissionAnalytics';
import AdmissionReports from './AdmissionReports';
import Announcements from './Announcements';
import ChangePassword from './ChangePassword';
import Notifications from './Notifications';

const statusFilters: Array<{ label: string; value: TaskStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Delayed', value: 'DELAYED' }
];

const statusColor: Record<string, string> = {
  PENDING: '#185FA5',
  IN_PROGRESS: '#BA7517',
  COMPLETED: '#639922',
  DELAYED: '#E24B4A'
};

function AdmissionTasks() {
  const [filter, setFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { data = [], isLoading } = useAdmissionTasks(filter);

  return (
    <>
      <section className="space-y-6">
        <div className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Assigned task monitoring</p>
              <h1 className="mt-3 text-2xl font-semibold text-slate-950">Admission & Marketing Tasks</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Track inquiry follow-ups, campaign tasks, admission activities, attachments, and task history.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((item) => (
                <button
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    filter === item.value
                      ? 'bg-[#185FA5] text-white'
                      : 'border border-slate-300 bg-[#F8FAFC] text-slate-600 hover:bg-[#EEF4FF]'
                  }`}
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
          {isLoading ? <p className="mb-4 text-sm text-slate-500">Loading tasks...</p> : null}
          <AdmissionTaskTable onView={setSelectedTask} tasks={data} />
        </div>
      </section>

      <TaskDetailModal isOpen={Boolean(selectedTask)} onClose={() => setSelectedTask(null)} task={selectedTask} />
    </>
  );
}

function DelayAlerts() {
  const { data = [] } = useAdmissionDelayAlerts();

  return (
    <div className="space-y-3">
      {data.map((alert) => (
        <div className="rounded-[18px] border border-[#EFF2F6] bg-[#F8FAFC] p-4" key={alert.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-950">{alert.title}</p>
              <p className="mt-1 text-sm text-slate-600">
                Due {new Date(alert.dueDate).toLocaleDateString('en-IN')} - {alert.assignedBy}
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
              alert.severity === 'Overdue' || alert.severity === 'Escalated'
                ? 'bg-[#FEF2F2] text-[#E24B4A]'
                : 'bg-[#FFFBEB] text-[#BA7517]'
            }`}>
              {alert.severity}
            </span>
          </div>
        </div>
      ))}
      {data.length === 0 ? <p className="text-sm text-slate-500">No delay alerts right now.</p> : null}
    </div>
  );
}

function AdmissionOverview() {
  const { data, isLoading } = useAdmissionDashboard();
  const summary = data ?? {
    completedTasks: 0,
    completionRate: 0,
    delayedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    totalTasks: 0
  };

  const kpis = useMemo(
    () => [
      { key: 'total', label: 'Total Tasks', value: summary.totalTasks, percent: '100%', color: '#185FA5' },
      { key: 'pending', label: 'Pending Tasks', value: summary.pendingTasks, percent: `${summary.totalTasks ? Math.round((summary.pendingTasks / summary.totalTasks) * 100) : 0}%`, color: '#185FA5' },
      { key: 'progress', label: 'In Progress', value: summary.inProgressTasks, percent: `${summary.totalTasks ? Math.round((summary.inProgressTasks / summary.totalTasks) * 100) : 0}%`, color: '#BA7517' },
      { key: 'completed', label: 'Completed', value: summary.completedTasks, percent: `${summary.completionRate}%`, color: '#639922' },
      { key: 'delayed', label: 'Delayed', value: summary.delayedTasks, percent: `${summary.totalTasks ? Math.round((summary.delayedTasks / summary.totalTasks) * 100) : 0}%`, color: '#E24B4A' }
    ],
    [summary]
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Admission & Marketing Module</p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-950">Admission Control Panel</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Manage admission follow-ups, marketing campaigns, inquiry activity, task progress, announcements, and real-time department performance.
            </p>
          </div>
          <NavLink className="rounded-[14px] bg-[#185FA5] px-5 py-3 text-sm font-semibold text-white" to="/admission/tasks">
            Review Tasks
          </NavLink>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {kpis.map((item) => (
            <div className="rounded-[22px] border border-[#EFF2F6] bg-[#F8FAFC] p-4" key={item.key}>
              <div className="flex items-center justify-between">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-semibold" style={{ color: item.color }}>{item.percent}</span>
              </div>
              <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-950">{isLoading ? '--' : item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-950">Admission Task Progress</h2>
            <span className="text-sm font-semibold text-[#639922]">{summary.completionRate}% complete</span>
          </div>
          <div className="mt-5 space-y-4">
            {[
              ['PENDING', summary.pendingTasks],
              ['IN_PROGRESS', summary.inProgressTasks],
              ['COMPLETED', summary.completedTasks],
              ['DELAYED', summary.delayedTasks]
            ].map(([label, count]) => {
              const width = summary.totalTasks ? (Number(count) / summary.totalTasks) * 100 : 0;
              return (
                <div key={label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{String(label).replace('_', ' ')}</span>
                    <span className="text-slate-500">{count}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[#EFF2F6]">
                    <div className="h-full rounded-full" style={{ width: `${width}%`, backgroundColor: statusColor[String(label)] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Task Delay Alerts</h2>
          <div className="mt-5">
            <DelayAlerts />
          </div>
        </section>
      </div>
    </div>
  );
}

function AdmissionDashboard() {
  useSocket();

  return (
    <div className="flex min-h-screen bg-[#F1F4F9] text-slate-950">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <Navbar />
        <div className="h-full overflow-y-auto p-6">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdmissionOverview />} />
            <Route path="tasks" element={<AdmissionTasks />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="reports" element={<AdmissionReports />} />
            <Route path="analytics" element={<AdmissionAnalytics />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default AdmissionDashboard;
