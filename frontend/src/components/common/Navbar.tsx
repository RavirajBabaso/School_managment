import { useMemo } from 'react';
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
import PurchaseNotificationBell from '../purchase/NotificationBell';

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

  '/principal/dashboard':
    'Principal Dashboard',

  '/principal/tasks':
    'Principal Tasks',

  '/principal/notifications':
    'Principal Notifications',

  '/principal/announcements':
    'Principal Announcements',

  '/principal/reports':
    'Academic Reports',

  '/principal/analytics':
    'Academic Analytics',

  '/principal/change-password':
    'Change Password',

  /* HR */
  '/hr/dashboard': 'HR Dashboard',
  '/hr/tasks': 'HR Tasks',
  '/hr/notifications': 'HR Notifications',
  '/hr/announcements': 'HR Announcements',
  '/hr/reports': 'HR Reports',
  '/hr/analytics': 'HR Analytics',
  '/hr/change-password': 'Change Password',

/* Purchase */
   '/purchase/dashboard': 'Purchase Dashboard',
   '/purchase/tasks': 'Purchase Tasks',
   '/purchase/notifications': 'Purchase Notifications',
   '/purchase/announcements': 'Purchase Announcements',
   '/purchase/reports': 'Purchase Reports',
   '/purchase/analytics': 'Purchase Analytics',
   '/purchase/change-password': 'Change Password',

   /* IT */
   '/it/dashboard': 'IT Dashboard',
   '/it/tasks': 'IT Tasks',
   '/it/notifications': 'IT Notifications',
   '/it/announcements': 'IT Announcements',
   '/it/reports': 'IT Reports',
   '/it/analytics': 'IT Analytics',
   '/it/change-password': 'Change Password',

   /* Transport */
   '/transport/dashboard': 'Transport Dashboard',
   '/transport/tasks': 'Transport Tasks',
   '/transport/notifications': 'Transport Notifications',
   '/transport/announcements': 'Transport Announcements',
   '/transport/reports': 'Transport Reports',
   '/transport/analytics': 'Transport Analytics',
   '/transport/change-password': 'Change Password',

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
    'Finance Announcements',

  /* Admin */
  '/admin':
    'Admin Dashboard',

  '/admin/tasks':
    'Admin Tasks',

  '/admin/notifications':
    'Admin Notifications',

  '/admin/staff':
    'Staff Management',

  '/admin/students':
    'Student Records',

  '/admin/attendance':
    'Attendance Monitoring',

  '/admin/leave':
    'Leave Approvals',

  '/admin/departments':
    'Department Management',

  '/admin/circulars':
    'Circulars & Notices',

  '/admin/reports':
    'Reports & Analytics',

  '/admin/documents':
    'Document Management'
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

  const isDirectorRoute =
    location.pathname.startsWith(
      '/director'
    );

  const isChairmanRoute =
    location.pathname.startsWith(
      '/chairman'
    );

  const isPrincipalRoute =
    location.pathname.startsWith(
      '/principal'
    );

  const isPropertyRoute =
    location.pathname.startsWith(
      '/property-maintenance'
    );

  const isFinanceRoute =
    location.pathname.startsWith(
      '/finance'
    );

  const isAdminRoute =
    location.pathname.startsWith(
      '/admin'
    );

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

   // Get module name from current path for more accurate display
   let moduleNameFromPath = '';
   if (location.pathname.startsWith('/chairman')) {
     moduleNameFromPath = 'Chairman';
   } else if (location.pathname.startsWith('/director')) {
     moduleNameFromPath = 'Director';
   } else if (location.pathname.startsWith('/principal')) {
     moduleNameFromPath = 'Principal';
   } else if (location.pathname.startsWith('/property-maintenance')) {
     moduleNameFromPath = 'Property';
   } else if (location.pathname.startsWith('/finance')) {
     moduleNameFromPath = 'Finance';
   } else if (location.pathname.startsWith('/admin')) {
     moduleNameFromPath = 'Admin';
   } else if (location.pathname.startsWith('/hr')) {
     moduleNameFromPath = 'Human Resources';
   } else if (location.pathname.startsWith('/purchase')) {
     moduleNameFromPath = 'Purchase';
   } else if (location.pathname.startsWith('/it')) {
     moduleNameFromPath = 'Information Technology';
   } else if (location.pathname.startsWith('/transport')) {
     moduleNameFromPath = 'Transport';
   } else if (location.pathname.startsWith('/department')) {
     moduleNameFromPath = 'Department';
   } else if (location.pathname.startsWith('/admission')) {
     moduleNameFromPath = 'Admission';
   } else if (location.pathname === '/notifications') {
     moduleNameFromPath = 'Notifications';
   } else if (location.pathname.startsWith('/task')) {
     moduleNameFromPath = 'Task Detail';
   }

   const subtitleParts = [
     formatNavbarDate(),

     user?.departmentName ??
       (moduleNameFromPath ||
        (user
          ? ROLE_LABELS[
              user.role
            ]
          : 'All Departments'))
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

  /* Principal Tabs */
  const principalTabs =
    useMemo(
      () => [
        {
          label: 'Dashboard',
          to: '/principal/dashboard'
        },
        {
          label: 'My Tasks',
          to: '/principal/tasks'
        },
        {
          label: 'Notifications',
          to: '/principal/notifications',
          badge: unreadCount
        },
        {
          label: 'Announcements',
          to: '/principal/announcements'
        },
        {
          label: 'Reports',
          to: '/principal/reports'
        },
        {
          label: 'Analytics',
          to: '/principal/analytics'
        },
        {
          label: 'Change Password',
          to: '/principal/change-password'
        }
      ],
      [unreadCount]
    );

/* Admin Tabs */
  const adminTabs =
    useMemo(
      () => [
        {
          label: 'Dashboard',
          to: '/admin'
        },
        {
          label: 'Staff',
          to: '/admin/staff'
        },
        {
          label: 'Students',
          to: '/admin/students'
        },
        {
          label: 'Tasks',
          to: '/admin/tasks'
        },
        {
          label: 'Attendance',
          to: '/admin/attendance'
        },
        {
          label: 'Leave',
          to: '/admin/leave'
        },
        {
          label: 'Departments',
          to: '/admin/departments'
        },
        {
          label: 'Circulars',
          to: '/admin/circulars'
        },
        {
          label: 'Reports',
          to: '/admin/reports'
        },
        {
          label: 'Documents',
          to: '/admin/documents'
        },
        {
          label:
            'Notifications',
          to: '/admin/notifications',
          badge: unreadCount
        }
      ],
      [unreadCount]
    );

  /* HR Tabs */
  const hrTabs =
    useMemo(
      () => [
        {
          label: 'Dashboard',
          to: '/hr/dashboard'
        },
        {
          label: 'My Tasks',
          to: '/hr/tasks'
        },
        {
          label: 'Notifications',
          to: '/hr/notifications',
          badge: unreadCount
        },
        {
          label: 'Announcements',
          to: '/hr/announcements'
        },
        {
          label: 'Reports',
          to: '/hr/reports'
        },
        {
          label: 'Analytics',
          to: '/hr/analytics'
        },
        {
          label: 'Change Password',
          to: '/hr/change-password'
        }
        ],
        [unreadCount]
      );

  /* Purchase Tabs */
   const purchaseTabs =
     useMemo(
       () => [
         {
           label: 'Dashboard',
           to: '/purchase/dashboard'
         },
         {
           label: 'My Tasks',
           to: '/purchase/tasks'
         },
         {
           label: 'Notifications',
           to: '/purchase/notifications',
           badge: unreadCount
         },
         {
           label: 'Announcements',
           to: '/purchase/announcements'
         },
         {
           label: 'Reports',
           to: '/purchase/reports'
         },
         {
           label: 'Analytics',
           to: '/purchase/analytics'
         },
         {
           label: 'Change Password',
           to: '/purchase/change-password'
         }
],
        [unreadCount]
       );

   /* IT Tabs */
   const itTabs =
     useMemo(
       () => [
         {
           label: 'Dashboard',
           to: '/it/dashboard'
         },
         {
           label: 'My Tasks',
           to: '/it/tasks'
         },
         {
           label: 'Notifications',
           to: '/it/notifications',
           badge: unreadCount
         },
         {
           label: 'Announcements',
           to: '/it/announcements'
         },
         {
           label: 'Reports',
           to: '/it/reports'
         },
         {
           label: 'Analytics',
           to: '/it/analytics'
         },
         {
           label: 'Change Password',
           to: '/it/change-password'
         }
       ],
       [unreadCount]
     );

   /* Transport Tabs */
   const transportTabs =
     useMemo(
       () => [
         {
           label: 'Dashboard',
           to: '/transport/dashboard'
         },
         {
           label: 'My Tasks',
           to: '/transport/tasks'
         },
         {
           label: 'Notifications',
           to: '/transport/notifications',
           badge: unreadCount
         },
         {
           label: 'Announcements',
           to: '/transport/announcements'
         },
         {
           label: 'Reports',
           to: '/transport/reports'
         },
         {
           label: 'Analytics',
           to: '/transport/analytics'
         },
         {
           label: 'Change Password',
           to: '/transport/change-password'
         }
       ],
       [unreadCount]
     );

   const showHRTabs =
    user?.role === ROLES.HR &&
    location.pathname.startsWith(
      '/hr'
    );

  const showPurchaseTabs =
    user?.role === ROLES.PURCHASE &&
    location.pathname.startsWith(
      '/purchase'
    );

  const showDirectorTabs =
    user?.role === ROLES.DIRECTOR &&
    location.pathname.startsWith(
      '/director'
    );

  const showPrincipalTabs =
    user?.role === ROLES.PRINCIPAL &&
    location.pathname.startsWith(
      '/principal'
    );

  const showPropertyTabs =
    user?.role === ROLES.PROPERTY &&
    location.pathname.startsWith(
      '/property-maintenance'
    );

  const showFinanceTabs =
    user?.role === ROLES.FINANCE &&
    location.pathname.startsWith(
      '/finance'
    );

const showAdminTabs =
     user?.role === ROLES.ADMIN &&
     location.pathname.startsWith(
       '/admin'
     );

   const showITTabs =
     user?.role === ROLES.IT &&
     location.pathname.startsWith(
       '/it'
     );

   const showTransportTabs =
     user?.role === ROLES.TRANSPORT &&
     location.pathname.startsWith(
       '/transport'
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
          !isPrincipalRoute &&
          !isPropertyRoute &&
          !isFinanceRoute &&
          !isAdminRoute &&
          unreadCount > 0 ? (
            <Badge variant="red">
              {unreadCount} alerts
            </Badge>
          ) : null}

          {!isDirectorRoute &&
          !isChairmanRoute &&
          !isPrincipalRoute &&
          !isPropertyRoute &&
          !isFinanceRoute &&
          !isAdminRoute &&
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

           {showPurchaseTabs && (
             <PurchaseNotificationBell />
           )}

           {!isDirectorRoute &&
           !isChairmanRoute &&
           !isPrincipalRoute &&
           !isPropertyRoute &&
           !isFinanceRoute &&
           !isAdminRoute &&
           !showPurchaseTabs &&
           unreadCount > 0 ? (
             <NotificationBell />
           ) : null}

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
                ROLES.PRINCIPAL ||
                user?.role ===
                ROLES.PROPERTY ||
                user?.role ===
                ROLES.FINANCE ||
                user?.role ===
                ROLES.ADMIN ||
                user?.role ===
                ROLES.ADMISSION ||
                user?.role ===
                ROLES.HR ||
                user?.role ===
                ROLES.PURCHASE ||
                user?.role ===
                ROLES.IT ||
                user?.role ===
                ROLES.TRANSPORT) ? (
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
        showPrincipalTabs ||
        showPropertyTabs ||
        showFinanceTabs ||
        showAdminTabs ||
        showHRTabs ||
        showPurchaseTabs ||
        showITTabs ||
        showTransportTabs ? (
         <nav className="flex flex-wrap gap-2 overflow-x-auto pt-2">

           {(showDirectorTabs
             ? directorTabs
             : showPrincipalTabs
             ? principalTabs
             : showAdminTabs
             ? adminTabs
             : showFinanceTabs
             ? financeTabs
             : showHRTabs
             ? hrTabs
             : showPurchaseTabs
             ? purchaseTabs
             : showITTabs
             ? itTabs
             : showTransportTabs
             ? transportTabs
             : propertyTabs
           ).map((tab) => (
             <NavLink
               key={tab.to}
               to={tab.to}
               end={
                 tab.to ===
                   '/director' ||
                 tab.to ===
                   '/principal/dashboard' ||
                 tab.to ===
                   '/property-maintenance' ||
                 tab.to ===
                   '/finance' ||
                 tab.to ===
                   '/admin' ||
                 tab.to ===
                   '/hr' ||
                 tab.to ===
                   '/hr/dashboard' ||
                 tab.to ===
                   '/purchase/dashboard' ||
                 tab.to ===
                   '/it/dashboard' ||
                 tab.to ===
                   '/transport/dashboard'
               }
              className={({
                isActive
              }) =>
                [
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',

                  isActive
                    ? 'bg-[#185FA5] text-white shadow-sm'
                    : 'border border-slate-300 bg-[#F8FAFC] text-slate-600 hover:bg-[#EEF4FF] hover:text-slate-950'
                ].join(' ')
              }
            >
              {tab.label}

              {tab.badge ? (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/10 px-2 text-[10px] font-semibold text-slate-950">
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
