import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';

import Login from '../pages/auth/Login';

import PropertyDashboard from '../pages/propertyMaintenance/PropertyDashboard';
import PropertyTasks from '../pages/propertyMaintenance/PropertyTasks';
import PropertyNotifications from '../pages/propertyMaintenance/PropertyNotifications';
import PropertyAnnouncements from '../pages/propertyMaintenance/PropertyAnnouncements';

import ProtectedRoute from './ProtectedRoute';

import { ROLES } from '../constants/roles';

import HRDashboard from '../pages/hr/HRDashboard';

function AppRoutes() {

  return (
    <BrowserRouter>

      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

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

export default AppRoutes;