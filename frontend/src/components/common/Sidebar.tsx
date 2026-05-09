import { NavLink, useLocation } from 'react-router-dom';
import { DEPARTMENT_HEAD_ROLES, ROLE_LABELS, ROLES } from '../../constants/roles';
import { useAppSelector } from '../../store/hooks';
import Badge from './Badge';

interface NavItem {
  badge?: { tone: 'amber' | 'red'; value: number };
  color: string;
  group: 'Overview' | 'Meetings' | 'Approvals' | 'Reports' | 'Inbox' | 'Actions';
  label: string;
  to: string;
}

const chairmanItems: NavItem[] = [
  { color: '#185FA5', group: 'Overview', label: 'Dashboard', to: '/chairman' },
  { color: '#2C7BE5', group: 'Actions', label: 'Task Assignment', to: '/chairman/task-assignment' },
  { color: '#10B981', group: 'Actions', label: 'Task Monitor', to: '/chairman/task-monitor' },
  { color: '#D64545', group: 'Approvals', label: 'Alerts', to: '/chairman/alerts' },
  { color: '#D89B17', group: 'Approvals', label: 'Approvals', to: '/chairman/approvals' },
  { color: '#0EA5A4', group: 'Inbox', label: 'Announcements', to: '/chairman/announcements' },
  { color: '#F97316', group: 'Reports', label: 'User Management', to: '/chairman/users' },
  { color: '#2563EB', group: 'Reports', label: 'Performance', to: '/chairman/performance' }
];

const departmentItems: NavItem[] = [
  { color: '#185FA5', group: 'Overview', label: 'Dashboard', to: '/department' },
  { color: '#2C7BE5', group: 'Actions', label: 'My Tasks', to: '/department/my-tasks' },
  { color: '#D64545', group: 'Inbox', label: 'Notifications', to: '/department/notifications' },
  { color: '#0EA5A4', group: 'Inbox', label: 'Announcements', to: '/department/announcements' }
];

const propertyItems: NavItem[] = [
  { color: '#185FA5', group: 'Overview', label: 'Dashboard', to: '/property-maintenance' },
  { color: '#2C7BE5', group: 'Actions', label: 'Tasks', to: '/property-maintenance/tasks' },
  { color: '#D64545', group: 'Inbox', label: 'Notifications', to: '/property-maintenance/notifications' },
  { color: '#0EA5A4', group: 'Inbox', label: 'Announcements', to: '/property-maintenance/announcements' }
];

const financeItems: NavItem[] = [
  { color: '#185FA5', group: 'Overview', label: 'Dashboard', to: '/finance' },
  { color: '#2C7BE5', group: 'Actions', label: 'Tasks', to: '/finance/tasks' },
  { color: '#D64545', group: 'Inbox', label: 'Notifications', to: '/finance/notifications' },
  { color: '#0EA5A4', group: 'Inbox', label: 'Announcements', to: '/finance/announcements' }
];

const directorItems: NavItem[] = [
  { color: '#185FA5', group: 'Overview', label: 'Dashboard', to: '/director' },
  { color: '#2563EB', group: 'Reports', label: 'MIS Reports', to: '/director/reports' },
  { color: '#2C7BE5', group: 'Meetings', label: 'Meetings', to: '/director/meetings' },
  { color: '#D64545', group: 'Approvals', label: 'Approvals', to: '/director/approvals' },
  { color: '#10B981', group: 'Inbox', label: 'Notifications', to: '/director/notifications' },
  { color: '#0EA5A4', group: 'Inbox', label: 'Communications', to: '/director/communications' },
  { color: '#7C3AED', group: 'Actions', label: 'Academic PPT Submission', to: '/director/modules?module=academic-ppt-submission' },
  { color: '#7C3AED', group: 'Actions', label: 'Checking all Academic Registers', to: '/director/modules?module=academic-registers' },
  { color: '#7C3AED', group: 'Actions', label: 'Academic Syllabus Status Reporting', to: '/director/modules?module=syllabus-status' },
  { color: '#7C3AED', group: 'Actions', label: 'Create Yearly Academic Plan', to: '/director/modules?module=yearly-academic-plan' },
  { color: '#7C3AED', group: 'Actions', label: 'Create Academic Time Table', to: '/director/modules?module=academic-time-table' },
  { color: '#7C3AED', group: 'Actions', label: 'Teachers Workload Status', to: '/director/modules?module=teacher-workload' },
  { color: '#7C3AED', group: 'Actions', label: 'Event Calendar', to: '/director/modules?module=event-calendar' },
  { color: '#7C3AED', group: 'Actions', label: 'Admission Status', to: '/director/modules?module=admission-status' }
];

const groups = ['Overview', 'Meetings', 'Approvals', 'Reports', 'Inbox', 'Actions'] as const;

function getInitials(name?: string) {
  if (!name) {
    return 'U';
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function Sidebar() {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.notifications);
  const pendingApprovals = useAppSelector(
    (state) => state.tasks.tasks.filter((task) => task.status === 'PENDING').length
  );
  const isDepartmentHead = user ? DEPARTMENT_HEAD_ROLES.includes(user.role) : false;

  let items = chairmanItems;

  if (user?.role === ROLES.DIRECTOR) {
    items = directorItems;
  } else if (user?.role === ROLES.PROPERTY) {
    items = propertyItems;
  } else if (user?.role === ROLES.FINANCE) {
    items = financeItems;
  } else if (isDepartmentHead) {
    items = departmentItems;
  }

  const decoratedItems = items.map((item) => {
    if (item.label === 'Alerts') {
      return { ...item, badge: { tone: 'red' as const, value: unreadCount } };
    }

    if (item.label === 'Approvals') {
      return { ...item, badge: { tone: 'amber' as const, value: pendingApprovals } };
    }

    return item;
  });

  const isActiveLink = (item: NavItem) => {
    const [path, query] = item.to.split('?');
    if (location.pathname !== path) {
      return false;
    }
    if (!query) {
      return true;
    }
    return location.search === `?${query}`;
  };

  return (
    <aside className="flex h-screen w-[240px] shrink-0 flex-col border-r border-[var(--border-color)] bg-[var(--panel-bg)] text-[var(--text-primary)]">
      <div className="border-b border-[var(--border-color)] px-5 py-5">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-[0.28em] text-[var(--text-secondary)]">School Director</span>
          <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">Executive Dashboard</h2>
          <p className="text-[11px] text-[var(--text-secondary)]">Strong oversight for school operations and approvals.</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-5 py-5">
        {groups.map((group) => {
          const groupItems = decoratedItems.filter((item) => item.group === group);

          if (groupItems.length === 0) {
            return null;
          }

          return (
            <div className="mb-6 last:mb-0" key={group}>
              <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-secondary)]">
                {group}
              </p>
              <div className="mt-3 space-y-2">
                {groupItems.map((item) => (
                  <NavLink
                    className={() =>
                      [
                        'flex min-h-[38px] items-center justify-between rounded-[16px] border px-3 py-2 transition-all duration-150',
                        isActiveLink(item)
                          ? 'border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm font-semibold text-[var(--text-primary)]'
                          : 'border-transparent text-[var(--text-secondary)] hover:border-[var(--border-color)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]'
                      ].join(' ')
                    }
                    end={item.to === '/chairman' || item.to === '/department' || item.to === '/director'}
                    key={item.to}
                    to={item.to}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className="h-[7px] w-[7px] rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="truncate text-[12px]">{item.label}</span>
                    </span>
                    {item.badge && item.badge.value > 0 ? (
                      <Badge variant={item.badge.tone}>{item.badge.value}</Badge>
                    ) : null}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-[var(--border-color)] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface)] text-[11px] font-semibold text-[var(--text-primary)]">
            {getInitials(user?.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-medium text-[var(--text-primary)]">{user?.name ?? 'User'}</p>
            <p className="truncate text-[11px] text-[var(--text-secondary)]">Master access</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
