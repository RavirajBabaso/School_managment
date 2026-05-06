import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ROLE_LABELS, ROLES } from '../../constants/roles';
import { useAppSelector } from '../../store/hooks';
import { useAuth } from '../../hooks/useAuth';
import Badge from './Badge';
import NotificationBell from './NotificationBell';

interface NavbarProps {
  actions?: ReactNode;
  rightActions?: ReactNode;
  title?: string;
}

const pageTitles: Record<string, string> = {
  '/chairman': 'Dashboard',
  '/chairman/alerts': 'Alerts',
  '/chairman/announcements': 'Announcements',
  '/chairman/approvals': 'Approvals',
  '/chairman/performance': 'Performance',
  '/chairman/reports': 'MIS Reports',
  '/chairman/task-assignment': 'Task Assignment',
  '/chairman/task-monitor': 'Task Monitor',
  '/chairman/users': 'User Management',
  '/department': 'Dashboard',
  '/department/announcements': 'Announcements',
  '/department/my-tasks': 'My Tasks',
  '/department/notifications': 'Notifications',
  '/director': 'Dashboard',
  '/notifications': 'Notifications',
  '/task': 'Task Detail'
};

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

function formatNavbarDate() {
  return new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    weekday: 'long',
    year: 'numeric'
  });
}

function Navbar({ actions, rightActions, title }: NavbarProps) {
  const location = useLocation();
  const { logout } = useAuth();
  const { user } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.notifications);
  const pendingApprovals = useAppSelector(
    (state) => state.tasks.tasks.filter((task) => task.status === 'PENDING').length
  );
  const [darkMode, setDarkMode] = useState(false);

  const isDirectorRoute = location.pathname.startsWith('/director');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const preferDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    setDarkMode(savedTheme === 'dark' || (!savedTheme && preferDark));
  }, []);

  useEffect(() => {
    // Force dark mode for director routes, otherwise use user preference
    const shouldBeDark = isDirectorRoute || darkMode;
    document.documentElement.classList.toggle('dark', shouldBeDark);
    if (!isDirectorRoute) {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }
  }, [darkMode, isDirectorRoute]);
  const resolvedTitle =
    title ??
    pageTitles[location.pathname] ??
    Object.entries(pageTitles).find(([path]) => location.pathname.startsWith(path))?.[1] ??
    'Dashboard';
  const subtitleParts = [
    formatNavbarDate(),
    user?.departmentName ?? (user ? ROLE_LABELS[user.role] : 'All Departments')
  ];

  const directorTabs = useMemo(
    () => [
      { label: 'Dashboard', to: '/director' },
      { label: 'Notifications', to: '/director/notifications', badge: unreadCount },
      { label: 'Meetings', to: '/director/meetings' },
      { label: 'Communication', to: '/director/communications' },
      { label: 'Send Approval', to: '/director/approvals' }
    ],
    [unreadCount]
  );

  const showDirectorTabs = user?.role === ROLES.DIRECTOR && location.pathname.startsWith('/director');

  return (
    <header className="flex flex-col gap-4 border-b border-[var(--border-color)] bg-[var(--card-bg)] px-[22px] py-[18px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-[14px] font-medium text-[var(--text-primary)]">{resolvedTitle}</h1>
          <p className="mt-1 text-[11px] text-[var(--text-secondary)]">{subtitleParts.join(' • ')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isDirectorRoute && (
            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              className="rounded-full border border-[var(--border-color)] bg-[var(--surface)] px-3 py-2 text-[11px] font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-tertiary)]"
            >
              {darkMode ? 'Light mode' : 'Dark mode'}
            </button>
          )}
          {!isDirectorRoute && unreadCount > 0 && (
            <Badge variant="red">{unreadCount} alerts</Badge>
          )}
          {!isDirectorRoute && pendingApprovals > 0 && (
            <Badge variant="amber">{pendingApprovals} pending approvals</Badge>
          )}
          {actions}
          <NotificationBell />
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6F1FB] text-[12px] font-semibold text-[#0C447C]">
            {getInitials(user?.name)}
          </div>
          {rightActions}
          {user?.role === ROLES.DIRECTOR ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-[#1D9E75] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#178b68] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
            >
              Logout
            </button>
          ) : null}
        </div>
      </div>

      {showDirectorTabs ? (
        <nav className="flex flex-wrap gap-2 overflow-x-auto pt-2">
          {directorTabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/director'}
              className={({ isActive }) =>
                [
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] transition',
                  isActive
                    ? 'bg-white text-[var(--text-primary)] font-medium shadow-sm border border-[var(--border-color)]'
                    : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-white'
                ].join(' ')
              }
            >
              {tab.label}
              {tab.badge ? (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#F8FAFC] px-2 text-[10px] font-semibold text-[#1D4ED8]">
                  {tab.badge}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

export default Navbar;
