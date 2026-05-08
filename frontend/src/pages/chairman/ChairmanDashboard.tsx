/**
 * ChairmanDashboard.tsx
 * Modern UI with CSS variables theme matching DirectorDashboard
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import { getChairmanDashboard } from '../../services/dashboardService';
import AlertsEscalations from './AlertsEscalations';
import AnnouncementsPage from './AnnouncementsPage';
import ApprovalManagement from './ApprovalManagement';
import ChairmanOverview from './ChairmanOverview';
import MISReports from './MISReports';
import TaskAssignment from './TaskAssignment';
import TaskMonitoring from './TaskMonitoring';
import UserManagement from './UserManagement';
import PerformanceAnalytics from './PerformanceAnalytics';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

type TaskFilter = 'all' | 'completed' | 'delayed' | 'pending';

interface Task {
  id: number;
  title: string;
  assignedTo: string;
  department: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  status: 'Completed' | 'Delayed' | 'In Progress' | 'Pending';
}

const ALL_TASKS: Task[] = [
  { id: 1,  title: 'Monthly fee collection audit',    assignedTo: 'Finance Head',    department: 'Finance',   priority: 'High',   deadline: 'Apr 20', status: 'Delayed'     },
  { id: 2,  title: 'New student admission drive',     assignedTo: 'Admission Head',  department: 'Admission', priority: 'Medium', deadline: 'Apr 25', status: 'In Progress' },
  { id: 3,  title: 'Staff training schedule Q2',      assignedTo: 'HR Head',         department: 'HR',        priority: 'Low',    deadline: 'Apr 30', status: 'Pending'     },
  { id: 4,  title: 'Network upgrade phase 2',         assignedTo: 'IT Head',         department: 'IT',        priority: 'High',   deadline: 'Apr 22', status: 'In Progress' },
  { id: 5,  title: 'Purchase order — lab equipment',  assignedTo: 'Purchase Head',   department: 'Purchase',  priority: 'High',   deadline: 'Apr 14', status: 'Delayed'     },
  { id: 6,  title: 'Staff attendance report',         assignedTo: 'HR Head',         department: 'HR',        priority: 'Low',    deadline: 'Apr 18', status: 'Completed'   },
  { id: 7,  title: 'Noticeboard update',              assignedTo: 'Admin Head',      department: 'Admin',     priority: 'Low',    deadline: 'Apr 18', status: 'Completed'   },
  { id: 8,  title: 'Canteen vendor renewal',          assignedTo: 'Purchase Head',   department: 'Purchase',  priority: 'Low',    deadline: 'Apr 30', status: 'Pending'     },
  { id: 9,  title: 'Property maintenance check',      assignedTo: 'Property Mgr',    department: 'Property',  priority: 'Medium', deadline: 'Apr 19', status: 'Delayed'     },
  { id: 10, title: 'Fee revision communication',      assignedTo: 'Finance Head',    department: 'Finance',   priority: 'High',   deadline: 'Apr 16', status: 'Completed'   },
  { id: 11, title: 'Annual day event planning',       assignedTo: 'Admin Head',      department: 'Admin',     priority: 'Medium', deadline: 'Apr 28', status: 'Pending'     },
  { id: 12, title: 'IT server backup verification',   assignedTo: 'IT Head',         department: 'IT',        priority: 'High',   deadline: 'Apr 21', status: 'Completed'   },
];

// Tasks that need chairman approval - removed as requested
const PENDING_APPROVAL_IDS = new Set<number>([]);

const FILTER_LABELS: Record<TaskFilter, string> = {
  all:       'All Tasks',
  completed: 'Completed Tasks',
  delayed:   'Delayed Tasks',
  pending:   'Pending Approval Tasks',
};

const DEPT_HEALTH = [
  { name: 'HR',        pct: 88, color: '#16A34A' },
  { name: 'Admin',     pct: 82, color: '#16A34A' },
  { name: 'Finance',   pct: 78, color: '#16A34A' },
  { name: 'Admission', pct: 62, color: '#D97706' },
  { name: 'IT',        pct: 57, color: '#D97706' },
  { name: 'Purchase',  pct: 41, color: '#DC2626' },
  { name: 'Property',  pct: 55, color: '#D97706' },
];

const DASH_ALERTS: Array<{
  title: string;
  sub: string;
  variant: 'red' | 'amber';
  pill: string;
}> = [
  // Removed alerts as requested
];

function TaskTable({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <div className="py-8 text-center text-sm text-[var(--text-secondary)]">No tasks found.</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[var(--border-color)] text-left text-sm">
        <thead className="bg-[var(--surface)] text-[var(--text-secondary)]">
          <tr>
            {['Task', 'Assigned To', 'Dept', 'Priority', 'Deadline', 'Status'].map(h => (
              <th key={h} className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.24em]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)] bg-[var(--card-bg)]">
          {tasks.map((t, i) => {
            const statusStyle = t.status === 'Completed' ? 'bg-[#F0FDF4] text-[#16A34A]' :
                               t.status === 'Delayed' ? 'bg-[#FEF2F2] text-[#DC2626]' :
                               t.status === 'In Progress' ? 'bg-[#EFF6FF] text-[#2563EB]' :
                               'bg-[#FFFBEB] text-[#D97706]';
            const priorityStyle = t.priority === 'High' ? 'bg-[#FEF2F2] text-[#DC2626]' :
                                 t.priority === 'Medium' ? 'bg-[#FFFBEB] text-[#D97706]' :
                                 'bg-[#F0FDF4] text-[#16A34A]';
            const priorityDotColor = t.priority === 'High' ? '#DC2626' : t.priority === 'Medium' ? '#D97706' : '#16A34A';

            return (
              <tr key={t.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: priorityDotColor }}
                    />
                    <span className="text-sm font-medium text-[var(--text-primary)]">{t.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{t.assignedTo}</td>
                <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{t.department}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${priorityStyle}`}>
                    {t.priority}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{t.deadline}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyle}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ChairmanOverviewPage() {
  const [activeFilter, setActiveFilter] = useState<TaskFilter | null>(null);

  const completedCount = ALL_TASKS.filter(t => t.status === 'Completed').length;
  const delayedCount   = ALL_TASKS.filter(t => t.status === 'Delayed').length;

  const kpiCards = [
    { key: 'all'       as TaskFilter, label: 'Total Tasks',     value: ALL_TASKS.length,     sub: 'This month',   color: '#185FA5' },
    { key: 'completed' as TaskFilter, label: 'Completed',       value: completedCount,        sub: `${Math.round(completedCount/ALL_TASKS.length*100)}% rate`, color: '#3B6D11' },
    { key: 'delayed'   as TaskFilter, label: 'Delayed',         value: delayedCount,          sub: 'Needs action', color: '#A32D2D' },
    { key: 'pending'   as TaskFilter, label: 'Pending Approval',value: PENDING_APPROVAL_IDS.size, sub: 'Awaiting you', color: '#854F0B' },
  ];

  const toggleFilter = (key: TaskFilter) =>
    setActiveFilter(prev => prev === key ? null : key);

  const pendingApprovalTasks = ALL_TASKS.filter(t => PENDING_APPROVAL_IDS.has(t.id));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <section className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)]">
              Chairman dashboard
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">
              Executive oversight
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              Comprehensive view of school operations, task management, and institutional performance.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {kpiCards.map((metric) => (
            <div
              key={metric.label}
              onClick={() => toggleFilter(metric.key)}
              className={`cursor-pointer rounded-[22px] border p-4 transition-all hover:shadow-sm ${
                activeFilter === metric.key
                  ? 'border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm'
                  : 'border-[var(--border-color)] bg-[var(--surface)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
                {metric.label}
              </p>
              <p className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">
                {metric.value}
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                {activeFilter === metric.key ? '▲ Click to close' : metric.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Task Drawer */}
      {activeFilter !== null && (
        <section className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
                Task details
              </p>
              <h2 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                {FILTER_LABELS[activeFilter]}
              </h2>
            </div>
            <button
              onClick={() => setActiveFilter(null)}
              className="rounded-full border border-[var(--border-color)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-tertiary)]"
            >
              Close
            </button>
          </div>
          <div className="mt-5">
            <TaskTable tasks={ALL_TASKS.filter(t =>
              activeFilter === 'all' ? true :
              activeFilter === 'completed' ? t.status === 'Completed' :
              activeFilter === 'delayed' ? t.status === 'Delayed' :
              PENDING_APPROVAL_IDS.has(t.id)
            )} />
          </div>
        </section>
      )}

      {/* Department Health and Alerts */}
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
                Department health
              </p>
              <h2 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                Operational summary
              </h2>
            </div>
            <span className="rounded-full bg-[#EDF9F1] px-3 py-1 text-xs font-semibold text-[#1D9E75]">
              {DEPT_HEALTH.length} departments
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {DEPT_HEALTH.map((dept, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{dept.name}</span>
                    <span className="text-sm text-[var(--text-secondary)]">{dept.pct}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-[var(--surface)]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${dept.pct}%`,
                        backgroundColor: dept.color
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
                Active alerts
              </p>
              <h2 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                Recent notifications
              </h2>
            </div>
            <span className="rounded-full bg-[#FEF2F2] px-3 py-1 text-xs font-semibold text-[#DC2626]">
              {DASH_ALERTS.length} active
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {DASH_ALERTS.map((alert, index) => (
              <div key={index} className="flex items-start gap-3 rounded-[18px] border border-[var(--border-color)] bg-[var(--surface)] p-4">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#DC2626]" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-[var(--text-primary)]">
                      {alert.title}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      alert.variant === 'red' ? 'bg-[#FEF2F2] text-[#DC2626]' : 'bg-[#FFFBEB] text-[#D97706]'
                    }`}>
                      {alert.pill}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">
                    {alert.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recent Tasks and Pending Approvals */}
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
                Recent assignments
              </p>
              <h2 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                Task activity
              </h2>
            </div>
            <NavLink
              to="/chairman/task-assignment"
              className="text-sm font-semibold text-[#378ADD] transition hover:text-[#1E4DB7]"
            >
              View all
            </NavLink>
          </div>

          <div className="mt-5 space-y-4">
            {ALL_TASKS.slice(0, 4).map((task, index) => {
              const priorityColor = task.priority === 'High' ? '#DC2626' : task.priority === 'Medium' ? '#D97706' : '#16A34A';
              return (
                <div key={task.id} className="flex items-start gap-3">
                  <div
                    className="mt-1 h-3 w-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: priorityColor }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">
                      {task.title}
                    </p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      {task.assignedTo} • Due: {task.deadline}
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    task.priority === 'High' ? 'bg-[#FEF2F2] text-[#DC2626]' :
                    task.priority === 'Medium' ? 'bg-[#FFFBEB] text-[#D97706]' :
                    'bg-[#F0FDF4] text-[#16A34A]'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
                Pending approvals
              </p>
              <h2 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                Awaiting action
              </h2>
            </div>
            <NavLink
              to="/chairman/approvals"
              className="text-sm font-semibold text-[#378ADD] transition hover:text-[#1E4DB7]"
            >
              Review all
            </NavLink>
          </div>

          <div className="mt-5 space-y-4">
            {pendingApprovalTasks.map((task, index) => (
              <div key={task.id} className="flex items-center gap-3 rounded-[18px] border border-[var(--border-color)] bg-[var(--surface)] p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6F1FB] text-sm font-semibold text-[#0C447C]">
                  {task.assignedTo.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">
                    {task.title}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {task.assignedTo} • Pending approval
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-full bg-[#16A34A] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#15803D] focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:ring-offset-2">
                    Approve
                  </button>
                  <button className="rounded-full border border-[var(--border-color)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)] focus:ring-offset-2">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
function ChairmanDashboard() {
  useSocket();

  return (
    <div className="flex min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)]">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <Navbar />
        <div className="h-full overflow-y-auto p-6">
          <Routes>
            <Route index element={<ChairmanOverviewPage />} />
            <Route path="overview" element={<Navigate to=".." replace />} />
            <Route path="task-assignment" element={<TaskAssignment />} />
            <Route path="task-monitor" element={<TaskMonitoring />} />
            <Route path="task-monitoring" element={<Navigate to="../task-monitor" replace />} />
            <Route path="alerts" element={<AlertsEscalations />} />
            <Route path="alerts-escalations" element={<Navigate to="../alerts" replace />} />
            <Route path="approvals" element={<ApprovalManagement />} />
            <Route path="mis-reports" element={<MISReports />} />
            <Route path="reports" element={<Navigate to="../mis-reports" replace />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="user-management" element={<Navigate to="../users" replace />} />
            <Route path="performance" element={<PerformanceAnalytics />} />
            <Route path="performance-analytics" element={<Navigate to="../performance" replace />} />
            <Route path="*" element={<Navigate to="." replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default ChairmanDashboard;