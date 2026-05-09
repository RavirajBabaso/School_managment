import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import {
  NavLink,
  useLocation
} from 'react-router-dom';

import {
  ROLE_LABELS,
  ROLES
} from '../../constants/roles';

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
  '/task': 'Task Detail',

  /* Property */
  '/property-maintenance':
    'Property Dashboard',

  '/property-maintenance/tasks':
    'Property Tasks',

  '/property-maintenance/notifications':
    'Property Notifications',

  '/property-maintenance/announcements':
    'Property Announcements',

  /* Finance */
  '/finance':
    'Finance Dashboard',

  '/finance/tasks':
    'Finance Tasks',

  '/finance/notifications':
    'Finance Notifications',

  '/finance/announcements':
    'Finance Announcements'
};

function getInitials(name?: string) {
  if (!name) {
    return 'U';
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) =>
        part[0]?.toUpperCase() ?? ''
    )
    .join('');
}

function formatNavbarDate() {
  return new Date().toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'long',
      weekday: 'long',
      year: 'numeric'
    }
  );
}

function Navbar({
  actions,
  rightActions,
  title
}: NavbarProps) {

  const location =
    useLocation();

  const { logout } =
    useAuth();

  const { user } =
    useAppSelector(
      (state) => state.auth
    );

  const { unreadCount } =
    useAppSelector(
      (state) =>
        state.notifications
    );

  const pendingApprovals =
    useAppSelector(
      (state) =>
        state.tasks.tasks.filter(
          (task) =>
            task.status ===
            'PENDING'
        ).length
    );

  const [darkMode, setDarkMode] =
    useState(false);

  const isDirectorRoute =
    location.pathname.startsWith(
      '/director'
    );

  const isChairmanRoute =
    location.pathname.startsWith(
      '/chairman'
    );

  const isPropertyRoute =
    location.pathname.startsWith(
      '/property-maintenance'
    );

  const isFinanceRoute =
    location.pathname.startsWith(
      '/finance'
    );

  useEffect(() => {

    const savedTheme =
      localStorage.getItem(
        'theme'
      );

    const preferDark =
      window.matchMedia?.(
        '(prefers-color-scheme: dark)'
      ).matches;

    setDarkMode(
      savedTheme === 'dark' ||
        (!savedTheme &&
          preferDark)
    );

  }, []);

  useEffect(() => {

    const shouldBeDark =
      isDirectorRoute ||
      isChairmanRoute ||
      isPropertyRoute ||
      isFinanceRoute ||
      darkMode;

    document.documentElement.classList.toggle(
      'dark',
      shouldBeDark
    );

    if (
      !isDirectorRoute &&
      !isChairmanRoute &&
      !isPropertyRoute &&
      !isFinanceRoute
    ) {
      localStorage.setItem(
        'theme',
        darkMode
          ? 'dark'
          : 'light'
      );
    }

  }, [
    darkMode,
    isDirectorRoute,
    isChairmanRoute,
    isPropertyRoute,
    isFinanceRoute
  ]);

  const resolvedTitle =
    title ??
    pageTitles[
      location.pathname
    ] ??
    Object.entries(
      pageTitles
    ).find(([path]) =>
      location.pathname.startsWith(
        path
      )
    )?.[1] ??
    'Dashboard';

  const subtitleParts = [
    formatNavbarDate(),

    user?.departmentName ??
      (user
        ? ROLE_LABELS[
            user.role
          ]
        : 'All Departments')
  ];

  /* Director Tabs */
  const directorTabs =
    useMemo(
      () => [
        {
          label: 'Dashboard',
          to: '/director'
        },
        {
          label:
            'Notifications',
          to: '/director/notifications',
          badge: unreadCount
        },
        {
          label: 'Meetings',
          to: '/director/meetings'
        },
        {
          label:
            'Communication',
          to: '/director/communications'
        },
        {
          label:
            'Send Approval',
          to: '/director/approvals'
        }
      ],
      [unreadCount]
    );

  /* Property Tabs */
  const propertyTabs =
    useMemo(
      () => [
        {
          label: 'Dashboard',
          to: '/property-maintenance'
        },
        {
          label: 'Tasks',
          to: '/property-maintenance/tasks'
        },
        {
          label:
            'Notifications',
          to: '/property-maintenance/notifications',
          badge: unreadCount
        },
        {
          label:
            'Announcements',
          to: '/property-maintenance/announcements'
        }
      ],
      [unreadCount]
    );

  /* Finance Tabs */
  const financeTabs =
    useMemo(
      () => [
        {
          label: 'Dashboard',
          to: '/finance'
        },
        {
          label: 'Tasks',
          to: '/finance/tasks'
        },
        {
          label:
            'Notifications',
          to: '/finance/notifications',
          badge: unreadCount
        },
        {
          label:
            'Announcements',
          to: '/finance/announcements'
        }
      ],
      [unreadCount]
    );

  const showDirectorTabs =
    user?.role ===
      ROLES.DIRECTOR &&
    location.pathname.startsWith(
      '/director'
    );

  const showPropertyTabs =
    location.pathname.startsWith(
      '/property-maintenance'
    );

  const showFinanceTabs =
    location.pathname.startsWith(
      '/finance'
    );

  return (
    <header className="flex flex-col gap-4 border-b border-[var(--border-color)] bg-[var(--card-bg)] px-[22px] py-[18px]">

      {/* Top */}
      <div className="flex flex-wrap items-center justify-between gap-3">

        {/* Left */}
        <div className="min-w-0">

          <h1 className="truncate text-[14px] font-medium text-[var(--text-primary)]">
            {resolvedTitle}
          </h1>

          <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
            {subtitleParts.join(
              ' • '
            )}
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center gap-2">

      {!isDirectorRoute &&
          !isChairmanRoute &&
          !isPropertyRoute &&
          !isFinanceRoute ? (
            <button
              type="button"
              onClick={() =>
                setDarkMode(
                  (prev) =>
                    !prev
                )
              }
              className="rounded-full border border-[var(--border-color)] bg-[var(--surface)] px-3 py-2 text-[11px] font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-tertiary)]"
            >
              {darkMode
                ? 'Light mode'
                : 'Dark mode'}
            </button>
          ) : null}

          {!isDirectorRoute &&
          !isChairmanRoute &&
          !isPropertyRoute &&
          !isFinanceRoute &&
          unreadCount > 0 ? (
            <Badge variant="red">
              {unreadCount} alerts
            </Badge>
          ) : null}

          {!isDirectorRoute &&
          !isChairmanRoute &&
          !isPropertyRoute &&
          !isFinanceRoute &&
          pendingApprovals >
            0 ? (
            <Badge variant="amber">
              {
                pendingApprovals
              }{' '}
              pending approvals
            </Badge>
          ) : null}

          {actions}

          <NotificationBell />

          {/* Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6F1FB] text-[12px] font-semibold text-[#0C447C]">
            {getInitials(
              user?.name
            )}
          </div>

          {rightActions}

          {/* Logout */}
          {(user?.role ===
            ROLES.DIRECTOR ||
            user?.role ===
            ROLES.CHAIRMAN ||
            user?.role ===
            ROLES.PROPERTY ||
            user?.role ===
            ROLES.FINANCE) ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-[#1D9E75] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#178b68]"
            >
              Logout
            </button>
          ) : null}
        </div>
      </div>

      {/* Tabs */}
      {showDirectorTabs ||
      showPropertyTabs ||
      showFinanceTabs ? (
        <nav className="flex flex-wrap gap-2 overflow-x-auto pt-2">

          {(showDirectorTabs
            ? directorTabs
            : showFinanceTabs
            ? financeTabs
            : propertyTabs
          ).map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={
                tab.to ===
                  '/director' ||
                tab.to ===
                  '/property-maintenance' ||
                tab.to ===
                  '/finance'
              }
              className={({
                isActive
              }) =>
                [
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',

                  isActive
                    ? 'bg-[#185FA5] text-white shadow-sm'
                    : 'border border-slate-700 bg-[#0F172A] text-slate-400 hover:bg-[#172036] hover:text-white'
                ].join(' ')
              }
            >
              {tab.label}

              {tab.badge ? (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/10 px-2 text-[10px] font-semibold text-white">
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