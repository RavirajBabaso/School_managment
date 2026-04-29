/**
 * ChairmanDashboard.tsx
 * Sidebar: Dashboard, Task Assignment, Task Monitor, Alerts, Approvals,
 * MIS Reports, Announcements, User Mgmt, Performance
 * KPI cards (Total Tasks, Completed, Delayed, Pending Approval) are clickable
 * and open an inline task drawer filtered by that status.
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

/* ═══════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════════════════ */
const C = {
  bgPrimary:       '#FFFFFF',
  bgSecondary:     '#F8F9FC',
  bgInfo:          '#EFF6FF',
  bgPage:          '#F1F4F9',
  textPrimary:     '#1E293B',
  textSecondary:   '#5B6E8C',
  textTertiary:    '#8A99B0',
  borderSecondary: '#DCE2EA',
  borderTertiary:  '#EFF2F6',
  blue:            '#185FA5',
  blueDark:        '#0C447C',
  green:           '#639922',
  greenDeep:       '#27500A',
  amber:           '#BA7517',
  amberDark:       '#633806',
  red:             '#E24B4A',
  redDark:         '#791F1F',
  radMd:           '8px',
  radLg:           '14px',
};

/* ═══════════════════════════════════════════════════════════════════════════
   TASK DATA  (replace with real API data / useQuery in production)
═══════════════════════════════════════════════════════════════════════════ */
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

// Tasks that need chairman approval
const PENDING_APPROVAL_IDS = new Set([3, 8, 11]);

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════════ */
const statusStyle = (s: Task['status']) => {
  if (s === 'Completed')   return { bg: '#EAF3DE', color: C.greenDeep };
  if (s === 'Delayed')     return { bg: '#FCEBEB', color: C.redDark   };
  if (s === 'In Progress') return { bg: '#E6F1FB', color: C.blueDark  };
  return                          { bg: '#FAEEDA', color: C.amberDark };
};

const priorityDotColor = (p: Task['priority']) =>
  p === 'High' ? C.red : p === 'Medium' ? C.amber : C.green;

const priorityTagStyle = (p: Task['priority']) =>
  p === 'High'   ? { bg: '#FCEBEB', color: C.redDark   } :
  p === 'Medium' ? { bg: '#FAEEDA', color: C.amberDark } :
                   { bg: '#EAF3DE', color: C.greenDeep };

const getFilteredTasks = (filter: TaskFilter): Task[] => {
  if (filter === 'all')       return ALL_TASKS;
  if (filter === 'completed') return ALL_TASKS.filter(t => t.status === 'Completed');
  if (filter === 'delayed')   return ALL_TASKS.filter(t => t.status === 'Delayed');
  if (filter === 'pending')   return ALL_TASKS.filter(t => PENDING_APPROVAL_IDS.has(t.id));
  return ALL_TASKS;
};

const FILTER_LABELS: Record<TaskFilter, string> = {
  all:       'All Tasks',
  completed: 'Completed Tasks',
  delayed:   'Delayed Tasks',
  pending:   'Pending Approval Tasks',
};

/* ═══════════════════════════════════════════════════════════════════════════
   MICRO-COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */
function Pill({ variant = 'blue', children, small }: {
  variant?: 'red' | 'amber' | 'blue' | 'green';
  children: React.ReactNode;
  small?: boolean;
}) {
  const map = {
    red:   { background: '#FCEBEB', color: C.redDark   },
    amber: { background: '#FAEEDA', color: C.amberDark },
    blue:  { background: '#E6F1FB', color: C.blueDark  },
    green: { background: '#EAF3DE', color: C.greenDeep },
  };
  return (
    <span style={{ ...map[variant], fontSize: small ? 10 : 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500, whiteSpace: 'nowrap' as const, display: 'inline-block' }}>
      {children}
    </span>
  );
}

function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ border: `0.5px solid ${C.borderTertiary}`, borderRadius: C.radLg, background: C.bgPrimary, overflow: 'hidden', ...style }}>
      {children}
    </div>
  );
}

function PanelHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div style={{ padding: '9px 13px', borderBottom: `0.5px solid ${C.borderTertiary}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: C.textPrimary }}>{title}</span>
      {right}
    </div>
  );
}

function PanelBody({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ padding: '10px 13px', ...style }}>{children}</div>;
}

function Avatar({ initials, bg, color, size = 24 }: { initials: string; bg: string; color: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size < 28 ? 10 : 11, fontWeight: 500, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function AlertIconCircle({ variant }: { variant: 'red' | 'amber' }) {
  const stroke = variant === 'red' ? C.red : C.amber;
  const bg     = variant === 'red' ? '#FCEBEB' : '#FAEEDA';
  return (
    <div style={{ width: 20, height: 20, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
      <svg width="10" height="10" viewBox="0 0 10 10">
        <circle cx="5" cy="5" r="4" fill="none" stroke={stroke} strokeWidth="1.5" />
        <line x1="5" y1="2.5" x2="5" y2="5.5" stroke={stroke} strokeWidth="1.5" />
        <circle cx="5" cy="7" r=".8" fill={stroke} />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TASK TABLE
═══════════════════════════════════════════════════════════════════════════ */
function TaskTable({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <div style={{ fontSize: 12, color: C.textTertiary, padding: '16px 0', textAlign: 'center' }}>No tasks found.</div>;
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `0.5px solid ${C.borderSecondary}` }}>
            {['Task', 'Assigned To', 'Dept', 'Priority', 'Deadline', 'Status'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '4px 8px', color: C.textSecondary, fontWeight: 500 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map((t, i) => {
            const st = statusStyle(t.status);
            const pt = priorityTagStyle(t.priority);
            return (
              <tr key={t.id} style={{ borderBottom: i < tasks.length - 1 ? `0.5px solid ${C.borderTertiary}` : undefined }}>
                <td style={{ padding: '6px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 3, height: 28, borderRadius: 2, background: priorityDotColor(t.priority), flexShrink: 0 }} />
                    <span style={{ fontSize: 12 }}>{t.title}</span>
                  </div>
                </td>
                <td style={{ padding: '6px 8px', color: C.textSecondary, fontSize: 11 }}>{t.assignedTo}</td>
                <td style={{ padding: '6px 8px', color: C.textSecondary, fontSize: 11 }}>{t.department}</td>
                <td style={{ padding: '6px 8px' }}>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, fontWeight: 500, background: pt.bg, color: pt.color }}>{t.priority}</span>
                </td>
                <td style={{ padding: '6px 8px', color: C.textSecondary, fontSize: 11 }}>{t.deadline}</td>
                <td style={{ padding: '6px 8px' }}>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, fontWeight: 500, background: st.bg, color: st.color }}>{t.status}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CLICKABLE KPI CARD
═══════════════════════════════════════════════════════════════════════════ */
function KpiCard({ label, value, sub, color, isActive, onClick }: {
  label: string;
  value: number;
  sub: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      title={`Click to view ${label}`}
      style={{
        background:   isActive ? color + '12' : C.bgSecondary,
        borderRadius: C.radMd,
        padding:      '10px 12px',
        cursor:       'pointer',
        border:       isActive ? `1.5px solid ${color}55` : `0.5px solid transparent`,
        transition:   'all .15s',
        userSelect:   'none' as const,
        boxShadow:    isActive ? `0 0 0 3px ${color}18` : 'none',
      }}
    >
      <div style={{ fontSize: 11, color: C.textSecondary, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 500, color }}>{value}</div>
      <div style={{ fontSize: 10, color: C.textTertiary, marginTop: 2 }}>
        {isActive ? '▲ Click to close' : sub}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TASK DRAWER  (inline panel that appears below KPI cards)
═══════════════════════════════════════════════════════════════════════════ */
function TaskDrawer({ filter, onClose }: { filter: TaskFilter; onClose: () => void }) {
  const tasks = getFilteredTasks(filter);
  const pillVariant: Record<TaskFilter, 'blue' | 'green' | 'red' | 'amber'> = {
    all: 'blue', completed: 'green', delayed: 'red', pending: 'amber',
  };
  return (
    <Panel style={{ marginBottom: 12, animation: 'kpiSlide .2s ease' }}>
      <PanelHeader
        title={FILTER_LABELS[filter]}
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Pill variant={pillVariant[filter]} small>{tasks.length} task{tasks.length !== 1 ? 's' : ''}</Pill>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textTertiary, fontSize: 18, lineHeight: 1, padding: '0 2px' }} aria-label="Close">×</button>
          </div>
        }
      />
      <PanelBody>
        <TaskTable tasks={tasks} />
      </PanelBody>
    </Panel>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CHAIRMAN OVERVIEW  (dashboard home page)
═══════════════════════════════════════════════════════════════════════════ */
const DEPT_HEALTH = [
  { name: 'HR',        pct: 88, color: C.green },
  { name: 'Admin',     pct: 82, color: C.green },
  { name: 'Finance',   pct: 78, color: C.green },
  { name: 'Admission', pct: 62, color: C.amber },
  { name: 'IT',        pct: 57, color: C.amber },
  { name: 'Purchase',  pct: 41, color: C.red   },
  { name: 'Property',  pct: 55, color: C.amber },
];

const DASH_ALERTS = [
  { title: 'Purchase order — 4 days overdue',         sub: 'Purchase Officer · Escalated', variant: 'red'   as const, pill: 'Critical'  },
  { title: 'IT infrastructure — no update 2 days',    sub: 'IT Head · Warning',            variant: 'amber' as const, pill: 'Warning'   },
  { title: 'Admission report — delayed by 1 day',     sub: 'Admission Head · Delay',       variant: 'amber' as const, pill: 'Delay'     },
  { title: 'Property maintenance — escalated to you', sub: 'School Manager → Chairman',    variant: 'red'   as const, pill: 'Escalated' },
];

const AVATAR_POOL = [
  { bg: '#FAEEDA', color: C.amberDark },
  { bg: '#EEEDFE', color: '#3C3489'   },
  { bg: '#E1F5EE', color: '#085041'   },
];

function ChairmanOverviewPage() {
  const [activeFilter, setActiveFilter] = useState<TaskFilter | null>(null);

  const completedCount = ALL_TASKS.filter(t => t.status === 'Completed').length;
  const delayedCount   = ALL_TASKS.filter(t => t.status === 'Delayed').length;

  const kpiCards = [
    { key: 'all'       as TaskFilter, label: 'Total Tasks',     value: ALL_TASKS.length,     sub: 'This month',   color: C.blue    },
    { key: 'completed' as TaskFilter, label: 'Completed',       value: completedCount,        sub: `${Math.round(completedCount/ALL_TASKS.length*100)}% rate`, color: '#3B6D11' },
    { key: 'delayed'   as TaskFilter, label: 'Delayed',         value: delayedCount,          sub: 'Needs action', color: '#A32D2D' },
    { key: 'pending'   as TaskFilter, label: 'Pending Approval',value: PENDING_APPROVAL_IDS.size, sub: 'Awaiting you', color: '#854F0B' },
  ];

  const toggleFilter = (key: TaskFilter) =>
    setActiveFilter(prev => prev === key ? null : key);

  const pendingApprovalTasks = ALL_TASKS.filter(t => PENDING_APPROVAL_IDS.has(t.id));

  return (
    <div>
      {/* ── KPI Cards (clickable) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 12 }}>
        {kpiCards.map(k => (
          <KpiCard
            key={k.key}
            label={k.label}
            value={k.value}
            sub={k.sub}
            color={k.color}
            isActive={activeFilter === k.key}
            onClick={() => toggleFilter(k.key)}
          />
        ))}
      </div>

      {/* ── Task Drawer (opens on KPI click) ── */}
      {activeFilter !== null && (
        <TaskDrawer filter={activeFilter} onClose={() => setActiveFilter(null)} />
      )}

      {/* ── Row 2: Dept Health + Alerts ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Panel>
          <PanelHeader title="Department health" right={
            <button style={{ fontSize: 11, color: C.blue, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' }}>Full report ↗</button>
          } />
          <PanelBody>
            {DEPT_HEALTH.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: i < DEPT_HEALTH.length - 1 ? `0.5px solid ${C.borderTertiary}` : undefined }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: d.color }} />
                <div style={{ fontSize: 12, color: C.textPrimary, width: 80, flexShrink: 0 }}>{d.name}</div>
                <div style={{ flex: 1, height: 5, background: C.bgSecondary, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${d.pct}%`, height: '100%', borderRadius: 3, background: d.color }} />
                </div>
                <div style={{ fontSize: 11, color: C.textSecondary, minWidth: 28, textAlign: 'right' }}>{d.pct}%</div>
              </div>
            ))}
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader title="Active alerts" right={<Pill variant="red" small>5 active</Pill>} />
          <PanelBody>
            {DASH_ALERTS.map((a, i) => (
              <div key={a.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 0', borderBottom: i < DASH_ALERTS.length - 1 ? `0.5px solid ${C.borderTertiary}` : undefined }}>
                <AlertIconCircle variant={a.variant} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: C.textPrimary }}>{a.title}</div>
                  <div style={{ fontSize: 10, color: C.textTertiary, marginTop: 1 }}>{a.sub}</div>
                </div>
                <Pill variant={a.variant} small>{a.pill}</Pill>
              </div>
            ))}
          </PanelBody>
        </Panel>
      </div>

      {/* ── Row 3: Recent Tasks + Pending Approvals ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Panel>
          <PanelHeader title="Recent task assignments" right={
            <button onClick={() => window.location.href = '/chairman/task-assignment'} style={{ fontSize: 11, color: C.blue, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' }}>
              View all ↗
            </button>
          } />
          <PanelBody>
            {ALL_TASKS.slice(0, 4).map((t, i) => {
              const pt = priorityTagStyle(t.priority);
              return (
                <div key={t.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 0', borderBottom: i < 3 ? `0.5px solid ${C.borderTertiary}` : undefined }}>
                  <div style={{ width: 3, height: 36, borderRadius: 2, background: priorityDotColor(t.priority), flexShrink: 0, alignSelf: 'center' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                    <div style={{ fontSize: 10, color: C.textSecondary, marginTop: 2 }}>{t.assignedTo} · Due: {t.deadline}</div>
                  </div>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, fontWeight: 500, background: pt.bg, color: pt.color, whiteSpace: 'nowrap' as const }}>{t.priority}</span>
                </div>
              );
            })}
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader title="Pending approvals" right={
            <button onClick={() => toggleFilter('pending')} style={{ fontSize: 11, color: C.blue, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' }}>
              View all ↗
            </button>
          } />
          <PanelBody>
            {pendingApprovalTasks.map((t, i) => {
              const ac = AVATAR_POOL[i % AVATAR_POOL.length];
              const initials = t.assignedTo.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
              return (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: i < pendingApprovalTasks.length - 1 ? `0.5px solid ${C.borderTertiary}` : undefined }}>
                  <Avatar initials={initials} bg={ac.bg} color={ac.color} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                    <div style={{ fontSize: 10, color: C.textSecondary, marginTop: 1 }}>{t.assignedTo} · Pending approval</div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <button style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, cursor: 'pointer', border: '0.5px solid #97C459', fontWeight: 500, background: '#EAF3DE', color: C.greenDeep, fontFamily: 'inherit' }}>Approve</button>
                    <button style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, cursor: 'pointer', border: '0.5px solid #F09595', fontWeight: 500, background: '#FCEBEB', color: C.redDark, fontFamily: 'inherit' }}>Reject</button>
                  </div>
                </div>
              );
            })}
          </PanelBody>
        </Panel>
      </div>

      <style>{`@keyframes kpiSlide { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PERFORMANCE PAGE
═══════════════════════════════════════════════════════════════════════════ */
const PERF_DATA = [
  { name: 'School Manager', pct: 76 },
  { name: 'Principal',      pct: 84 },
  { name: 'Finance Head',   pct: 78 },
  { name: 'HR Head',        pct: 88 },
  { name: 'Admission Head', pct: 62 },
  { name: 'Admin Head',     pct: 80 },
  { name: 'IT Head',        pct: 57 },
  { name: 'Purchase Head',  pct: 41 },
];

const barColor = (p: number) => p >= 80 ? C.green : p >= 60 ? C.amber : C.red;

function PerformancePage() {
  const top = [...PERF_DATA].sort((a, b) => b.pct - a.pct)[0];
  const avg = Math.round(PERF_DATA.reduce((s, d) => s + d.pct, 0) / PERF_DATA.length);
  const delayRate = Math.round((PERF_DATA.filter(d => d.pct < 60).length / PERF_DATA.length) * 100);
  return (
    <>
      <ChairmanTopbar title="Performance" subtitle="Analytics · Department completion health" />
      <ContentArea>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
          {[
            { label: 'Top performer',  value: top.name,        sub: `${top.pct}% score`,    color: C.green   },
            { label: 'School average', value: `${avg}%`,        sub: 'All departments',      color: C.blue    },
            { label: 'Delay rate',     value: `${delayRate}%`, sub: 'Depts below 60%',      color: C.red     },
          ].map(s => (
            <div key={s.label} style={{ background: C.bgSecondary, borderRadius: C.radMd, padding: '10px 12px' }}>
              <div style={{ fontSize: 11, color: C.textSecondary, marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 500, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: C.textTertiary, marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <Panel>
          <PanelHeader title="Staff performance scores" />
          <PanelBody>
            {PERF_DATA.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: i < PERF_DATA.length - 1 ? `0.5px solid ${C.borderTertiary}` : undefined }}>
                <div style={{ width: 110, fontSize: 12, color: C.textPrimary, flexShrink: 0 }}>{d.name}</div>
                <div style={{ flex: 1, height: 5, background: C.bgSecondary, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${d.pct}%`, height: '100%', borderRadius: 3, background: barColor(d.pct), transition: 'width .4s ease' }} />
                </div>
                <div style={{ fontSize: 11, color: C.textSecondary, minWidth: 32, textAlign: 'right' }}>{d.pct}%</div>
              </div>
            ))}
          </PanelBody>
        </Panel>
      </ContentArea>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   USER MANAGEMENT PAGE
═══════════════════════════════════════════════════════════════════════════ */
const USERS = [
  { role: 'School Manager',   name: 'Ramesh Kulkarni',   init: 'RK', status: 'Active',   bg: '#E6F1FB', color: C.blueDark       },
  { role: 'Principal',        name: 'Dr. Sunita Sharma', init: 'SS', status: 'Active',   bg: '#EAF3DE', color: C.greenDeep      },
  { role: 'Finance Head',     name: 'Priya Joshi',       init: 'PJ', status: 'Active',   bg: '#FAEEDA', color: C.amberDark      },
  { role: 'HR Head',          name: 'Anita Verma',       init: 'AV', status: 'Active',   bg: '#E1F5EE', color: '#085041'        },
  { role: 'Admission Head',   name: 'Suresh Patil',      init: 'SP', status: 'Active',   bg: '#EEEDFE', color: '#3C3489'        },
  { role: 'Admin Head',       name: 'Meena Rawat',       init: 'MR', status: 'Active',   bg: '#F2F4F8', color: C.textSecondary  },
  { role: 'Purchase Head',    name: 'Kiran Shah',        init: 'KS', status: 'Inactive', bg: '#FCEBEB', color: C.redDark        },
  { role: 'IT Head',          name: 'Vivek Nair',        init: 'VN', status: 'Active',   bg: '#E6F1FB', color: C.blueDark       },
  { role: 'Property Manager', name: 'Dilip Bhosale',     init: 'DB', status: 'Active',   bg: '#EAF3DE', color: C.greenDeep      },
];

function UserManagementPage() {
  const [search, setSearch] = useState('');
  const filtered = USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <ChairmanTopbar title="User Management" subtitle="Administration · Manage staff access and operational ownership" />
      <ContentArea>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <input placeholder="Search by name or role…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: 220, fontSize: 12, padding: '6px 8px', borderRadius: 6, border: `0.5px solid ${C.borderSecondary}`, background: C.bgSecondary, fontFamily: 'inherit', color: C.textPrimary, outline: 'none' }} />
          <button style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6, border: `0.5px solid ${C.borderSecondary}`, cursor: 'pointer', background: C.bgInfo, color: C.blue, fontWeight: 500, fontFamily: 'inherit' }}>
            + Add new user ↗
          </button>
        </div>
        <Panel>
          <PanelHeader title="Department heads" right={<Pill variant="blue" small>{USERS.length} total</Pill>} />
          <PanelBody>
            {filtered.map((u, i) => (
              <div key={u.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: i < filtered.length - 1 ? `0.5px solid ${C.borderTertiary}` : undefined }}>
                <Avatar initials={u.init} bg={u.bg} color={u.color} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: C.textPrimary }}>{u.name}</div>
                  <div style={{ fontSize: 10, color: C.textSecondary }}>{u.role}</div>
                </div>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 500, background: u.status === 'Active' ? '#EAF3DE' : '#FCEBEB', color: u.status === 'Active' ? C.greenDeep : C.redDark }}>
                  {u.status}
                </span>
              </div>
            ))}
          </PanelBody>
        </Panel>
      </ContentArea>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SIDEBAR  (Task Assignment, Approvals, MIS Reports removed)
═══════════════════════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  {
    section: 'Master',
    items: [
      { label: 'Dashboard',       path: '',              dot: C.blue,    badge: null, bv: undefined as undefined | 'red' | 'amber' | 'blue' },
    ],
  },
  {
    section: 'Modules',
    items: [
      { label: 'Task assignment', path: 'task-assignment', dot: C.red,     badge: null, bv: undefined as undefined | 'red' | 'amber' | 'blue' },
      { label: 'Task monitor',    path: 'task-monitor',  dot: C.green,   badge: null, bv: undefined as undefined | 'red' | 'amber' | 'blue' },
      { label: 'Alerts',          path: 'alerts',        dot: C.red,     badge: '5',  bv: 'red'   as 'red' },
      { label: 'Approvals',       path: 'approvals',     dot: C.amber,   badge: null, bv: undefined as undefined | 'red' | 'amber' | 'blue' },
      { label: 'MIS report',      path: 'mis-reports',   dot: C.red,     badge: null, bv: undefined as undefined | 'red' | 'amber' | 'blue' },
      { label: 'Announcements',   path: 'announcements', dot: '#D4537E', badge: null, bv: undefined as undefined | 'red' | 'amber' | 'blue' },
    ],
  },
  {
    section: 'Admin',
    items: [
      { label: 'User management', path: 'users',         dot: '#888780', badge: null, bv: undefined as undefined | 'red' | 'amber' | 'blue' },
      { label: 'Performance',     path: 'performance',   dot: '#1D9E75', badge: null, bv: undefined as undefined | 'red' | 'amber' | 'blue' },
    ],
  },
];

function ChairmanSidebar() {
  const { data: dashboard } = useQuery({
    queryKey: ['chairman-dashboard'],
    queryFn: getChairmanDashboard,
    refetchInterval: 30000
  });
  const alertCount = dashboard?.alerts?.length ?? dashboard?.delayedTasks ?? 0;
  const pendingApprovals = dashboard?.pendingApprovals ?? 0;

  return (
    <div style={{ width: 196, flexShrink: 0, borderRight: `0.5px solid ${C.borderTertiary}`, background: C.bgSecondary, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100vh', position: 'sticky', top: 0 }}>
      {/* Logo */}
      <div style={{ padding: '14px 14px 12px', borderBottom: `0.5px solid ${C.borderTertiary}` }}>
        <div style={{ width: 30, height: 30, borderRadius: 7, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L10.5 6H15L11 9.5L12.5 14.5L8 11.5L3.5 14.5L5 9.5L1 6H5.5L8 1Z" fill="#fff" opacity=".9" />
          </svg>
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.textPrimary }}>EduTask Pro</div>
        <div style={{ fontSize: 10, color: C.textTertiary, marginTop: 1 }}>Chairman Control</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '6px 0', overflowY: 'auto' }}>
        {NAV_ITEMS.map(({ section, items }) => (
          <React.Fragment key={section}>
            <div style={{ padding: '8px 12px 3px', fontSize: 10, fontWeight: 500, color: C.textTertiary, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
              {section}
            </div>
            {items.map(({ label, path, dot, badge, bv }) => {
              const liveBadge =
                label === 'Alerts'
                  ? alertCount
                  : label === 'Approvals'
                    ? pendingApprovals
                    : null;
              const badgeValue = liveBadge ?? (badge ? Number(badge) : null);
              const badgeVariant =
                label === 'Approvals'
                  ? 'amber'
                  : bv;

              return (
              <NavLink
                key={label}
                to={path}
                end={path === ''}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
                  fontSize: 12, color: isActive ? C.textPrimary : C.textSecondary,
                  cursor: 'pointer', borderRadius: 6, margin: '1px 6px',
                  transition: 'background 0.15s', textDecoration: 'none',
                  fontWeight: isActive ? 500 : 400,
                  background: isActive ? C.bgPrimary : 'transparent',
                  border: isActive ? `0.5px solid ${C.borderSecondary}` : '0.5px solid transparent',
                })}
                >
                <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: dot }} />
                {label}
                {badgeValue !== null && badgeValue > 0 && badgeVariant && (
                  <span style={{
                    marginLeft: 'auto', fontSize: 10, padding: '1px 6px', borderRadius: 10, fontWeight: 500,
                    background: badgeVariant === 'red' ? '#FCEBEB' : badgeVariant === 'amber' ? '#FAEEDA' : '#E6F1FB',
                    color:      badgeVariant === 'red' ? C.redDark  : badgeVariant === 'amber' ? C.amberDark : C.blueDark,
                  }}>
                    {badgeValue}
                  </span>
                )}
              </NavLink>
              );
            })}
          </React.Fragment>
        ))}
      </nav>

      {/* User footer */}
      <div style={{ padding: '10px 12px', borderTop: `0.5px solid ${C.borderTertiary}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar initials="CH" bg="#E6F1FB" color={C.blueDark} size={28} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.textPrimary }}>Chairman</div>
            <div style={{ fontSize: 10, color: C.textTertiary }}>Master access</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TOPBAR
═══════════════════════════════════════════════════════════════════════════ */
function ChairmanTopbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { logout } = useAuth();
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ padding: '11px 18px', borderBottom: `0.5px solid ${C.borderTertiary}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: C.bgPrimary }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: C.textPrimary }}>{title}</div>
        <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 1 }}>{subtitle ?? `${today} · All departments`}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar initials="CH" bg="#E6F1FB" color={C.blueDark} size={28} />
        <button
          type="button"
          onClick={logout}
          style={{
            fontSize: 11,
            color: C.blueDark,
            border: `1px solid ${C.borderSecondary}`,
            borderRadius: 6,
            background: 'white',
            padding: '6px 12px',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function ContentArea({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px', background: C.bgPrimary }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN SHELL
═══════════════════════════════════════════════════════════════════════════ */
function ChairmanDashboard() {
  useSocket();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bgPage, color: C.textPrimary, fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, sans-serif" }}>
      <ChairmanSidebar />
      <main style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Routes>
          <Route
            index
            element={
              <>
                <ChairmanTopbar title="Chairman master dashboard" />
                <ContentArea><ChairmanOverview /></ContentArea>
              </>
            }
          />
          <Route path="overview" element={<Navigate to=".." replace />} />
          <Route
            path="task-assignment"
            element={
              <>
                <ChairmanTopbar title="Task Assignment" subtitle="Modules - Assign and review department tasks" />
                <ContentArea><TaskAssignment /></ContentArea>
              </>
            }
          />
          <Route
            path="task-monitor"
            element={
              <>
                <ChairmanTopbar title="Task Monitor" subtitle="Modules · Live task tracker — all departments" />
                <ContentArea><TaskMonitoring /></ContentArea>
              </>
            }
          />
          <Route path="task-monitoring" element={<Navigate to="../task-monitor" replace />} />
          <Route
            path="alerts"
            element={
              <>
                <ChairmanTopbar title="Alerts & Escalations" subtitle="Modules · Unresolved alerts requiring action" />
                <ContentArea><AlertsEscalations /></ContentArea>
              </>
            }
          />
          <Route path="alerts-escalations" element={<Navigate to="../alerts" replace />} />
          <Route
            path="approvals"
            element={
              <>
                <ChairmanTopbar title="Approvals" subtitle="Modules - Review requests awaiting chairman action" />
                <ContentArea><ApprovalManagement /></ContentArea>
              </>
            }
          />
          <Route
            path="mis-reports"
            element={
              <>
                <ChairmanTopbar title="MIS Reports" subtitle="Reports - Generate and download institutional reports" />
                <ContentArea><MISReports /></ContentArea>
              </>
            }
          />
          <Route path="reports" element={<Navigate to="../mis-reports" replace />} />
          <Route
            path="announcements"
            element={
              <>
                <ChairmanTopbar title="Announcements" subtitle="Communications · Broadcast messages to staff" />
                <ContentArea><AnnouncementsPage /></ContentArea>
              </>
            }
          />
          <Route
            path="users"
            element={
              <>
                <ChairmanTopbar title="User Management" subtitle="Administration · Manage staff access and operational ownership" />
                <ContentArea><UserManagementPage /></ContentArea>
              </>
            }
          />
          <Route path="user-management" element={<Navigate to="../users" replace />} />
          <Route
            path="performance"
            element={
              <>
                <ChairmanTopbar title="Performance" subtitle="Analytics · Department completion health" />
                <ContentArea><PerformancePage /></ContentArea>
              </>
            }
          />
          <Route path="performance-analytics" element={<Navigate to="../performance" replace />} />
          <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default ChairmanDashboard;
