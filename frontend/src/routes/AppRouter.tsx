import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation
} from 'react-router-dom';

import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

import {
  DEPARTMENT_HEAD_ROLES,
  ROLES
} from '../constants/roles';

import { useSocket } from '../hooks/useSocket';

import ChangePassword from '../pages/auth/ChangePassword';
import Login from '../pages/auth/Login';

import NotificationsPage from '../pages/NotificationsPage';

import ChairmanDashboard from '../pages/chairman/ChairmanDashboard';
import TaskDetail from '../pages/chairman/TaskDetail';

import DeptDashboard from '../pages/departments/DeptDashboard';

import DirectorDashboard from '../pages/director/DirectorDashboard';
import MeetingsPage from '../pages/director/MeetingsPage';
import DirectorNotificationsPage from '../pages/director/NotificationsPage';
import ApprovalsPage from '../pages/director/ApprovalsPage';
import CommunicationsPage from '../pages/director/CommunicationsPage';
import AcademicOperationsPage from '../pages/director/AcademicOperationsPage';
import ReportsPage from '../pages/director/ReportsPage';

import PropertyDashboard from '../pages/propertyMaintenance/PropertyDashboard';
import PropertyTasks from '../pages/propertyMaintenance/PropertyTasks';
import PropertyNotifications from '../pages/propertyMaintenance/PropertyNotifications';
import PropertyAnnouncements from '../pages/propertyMaintenance/PropertyAnnouncements';
import TransportDashboard from '../pages/transport/TransportDashboard';

import FinanceDashboard from '../pages/finance/FinanceDashboard';
import FinanceTasks from '../pages/finance/FinanceTasks';
import FinanceNotifications from '../pages/finance/FinanceNotifications';
import FinanceAnnouncements from '../pages/finance/FinanceAnnouncements';

import AdminDashboard from '../pages/admin/AdminDashboard';
import AdmissionDashboard from '../pages/admission/AdmissionDashboard';
import AdmissionLogin from '../pages/admission/AdmissionLogin';
import PrincipalDashboard from '../pages/principal/PrincipalDashboard';
import PrincipalLogin from '../pages/principal/PrincipalLogin';
import PurchaseLogin from '../pages/purchase/PurchaseLogin';
import HRDashboard from '../pages/hr/HRDashboard';
import ITDashboard from '../pages/it/ITDashboard';
import PurchaseDashboard from '../pages/purchase/PurchaseDashboard';

import ProtectedRoute from './ProtectedRoute';

function NotificationsLayout() {

  useSocket();

  return (
    <div className="flex min-h-screen bg-[#F5F7FB] text-slate-950">

      <Sidebar />

      <main className="min-w-0 flex-1">

        <Navbar title="Notifications" />

        <NotificationsPage />
      </main>
    </div>
  );
}

function ChairmanAliasRedirect() {

  const location =
    useLocation();

  const chairmanPath =
    location.pathname.replace(
      /^\/chairmen\b/,
      '/chairman'
    );

  return (
    <Navigate
      to={`${chairmanPath}${location.search}${location.hash}`}
      replace
    />
  );
}

function AppRouter() {

  return (
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true
      }}
    >

      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/principal/login"
          element={<PrincipalLogin />}
        />

        <Route
          path="/admission/login"
          element={<AdmissionLogin />}
        />

        <Route
          path="/purchase/login"
          element={<PurchaseLogin />}
        />

        {/* Shared Protected Routes */}
        <Route element={<ProtectedRoute />}>

          {/* Change Password */}
          <Route
            path="/change-password"
            element={<ChangePassword />}
          />

          {/* Director */}
          <Route
            path="/director/*"
            element={<DirectorDashboard />}
          />

          <Route
            path="/director/meetings"
            element={<MeetingsPage />}
          />

          <Route
            path="/director/notifications"
            element={
              <DirectorNotificationsPage />
            }
          />

          <Route
            path="/director/approvals"
            element={<ApprovalsPage />}
          />

          <Route
            path="/director/communications"
            element={<CommunicationsPage />}
          />

          <Route
            path="/director/academic-operations"
            element={<AcademicOperationsPage />}
          />

          <Route
            path="/director/modules"
            element={<AcademicOperationsPage />}
          />

          <Route
            path="/director/academic-modules"
            element={<AcademicOperationsPage />}
          />

          <Route
            path="/director/reports"
            element={<ReportsPage />}
          />

          {/* Notifications */}
          <Route
            path="/notifications"
            element={<NotificationsLayout />}
          />

          {/* Task Details */}
          <Route
            path="/task/:id"
            element={<TaskDetail />}
          />
        </Route>

        {/* Property Module */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.PROPERTY
              ]}
            />
          }
        >

          <Route
            path="/property-maintenance"
            element={<PropertyDashboard />}
          />

          <Route
            path="/property-maintenance/tasks"
            element={<PropertyTasks />}
          />

          <Route
            path="/property-maintenance/notifications"
            element={<PropertyNotifications />}
          />

          <Route
            path="/property-maintenance/announcements"
            element={<PropertyAnnouncements />}
          />
        </Route>

        {/* Finance Module */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.FINANCE
              ]}
            />
          }
        >

          <Route
            path="/finance"
            element={<FinanceDashboard />}
          />

          <Route
            path="/finance/tasks"
            element={<FinanceTasks />}
          />

          <Route
            path="/finance/notifications"
            element={<FinanceNotifications />}
          />

          <Route
            path="/finance/announcements"
            element={<FinanceAnnouncements />}
          />
        </Route>

        {/* Admin Module */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.ADMIN
              ]}
            />
          }
        >

          <Route
            path="/admin/*"
            element={<AdminDashboard />}
          />
        </Route>

        {/* Principal Module */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.PRINCIPAL
              ]}
            />
          }
        >

          <Route
            path="/principal/*"
            element={<PrincipalDashboard />}
          />
        </Route>

        {/* Admission & Marketing Module */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.ADMISSION
              ]}
            />
          }
        >

           <Route
             path="/admission/*"
             element={<AdmissionDashboard />}
           />
          </Route>

        {/* HR Module */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.HR
              ]}
            />
          }
        >

            <Route
              path="/hr/*"
              element={<HRDashboard />}
            />
          </Route>

          {/* Purchase Module */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  ROLES.PURCHASE
                ]}
              />
            }
          >

            <Route
              path="/purchase/*"
              element={<PurchaseDashboard />}
            />
</Route>

        {/* IT Module */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.IT
              ]}
            />
          }
        >
          <Route
            path="/it/*"
            element={<ITDashboard />}
          />
        </Route>

        {/* Transport Module */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.TRANSPORT
              ]}
            />
          }
        >
          <Route
            path="/transport/*"
            element={<TransportDashboard />}
          />
        </Route>

          {/* Chairman */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.CHAIRMAN
              ]}
            />
          }
        >

          <Route
            path="/chairman/*"
            element={<ChairmanDashboard />}
          />

          <Route
            path="/chairmen/*"
            element={
              <ChairmanAliasRedirect />
            }
          />
        </Route>

        {/* Department */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={
                DEPARTMENT_HEAD_ROLES.filter(
                  (role) =>
                    role !== ROLES.PRINCIPAL
                    && role !== ROLES.ADMISSION
                )
              }
            />
          }
        >

          <Route
            path="/department/*"
            element={<DeptDashboard />}
          />
        </Route>

        {/* Default */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
