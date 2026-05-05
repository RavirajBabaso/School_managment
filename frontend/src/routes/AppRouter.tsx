import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { DEPARTMENT_HEAD_ROLES, ROLES } from '../constants/roles';
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
import ProtectedRoute from './ProtectedRoute';

function NotificationsLayout() {
  useSocket();

  return (
    <div className="flex min-h-screen bg-[#F1F4F9] text-[#1E293B]">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <Navbar title="Notifications" />
        <NotificationsPage />
      </main>
    </div>
  );
}

function ChairmanAliasRedirect() {
  const location = useLocation();
  const chairmanPath = location.pathname.replace(/^\/chairmen\b/, '/chairman');

  return <Navigate to={`${chairmanPath}${location.search}${location.hash}`} replace />;
}

function AppRouter() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/director" element={<DirectorDashboard />} />
          <Route path="/director/meetings" element={<MeetingsPage />} />
          <Route path="/director/notifications" element={<DirectorNotificationsPage />} />
          <Route path="/director/approvals" element={<ApprovalsPage />} />
          <Route path="/director/communications" element={<CommunicationsPage />} />
          <Route path="/director/academic-operations" element={<AcademicOperationsPage />} />
          <Route path="/director/modules" element={<AcademicOperationsPage />} />
          <Route path="/director/academic-modules" element={<AcademicOperationsPage />} />
          <Route path="/director/reports" element={<ReportsPage />} />
          <Route path="/notifications" element={<NotificationsLayout />} />
          <Route path="/task/:id" element={<TaskDetail />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.CHAIRMAN]} />}>
          <Route path="/chairman/*" element={<ChairmanDashboard />} />
          <Route path="/chairmen/*" element={<ChairmanAliasRedirect />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={DEPARTMENT_HEAD_ROLES} />}>
          <Route path="/department/*" element={<DeptDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
