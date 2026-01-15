import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';

import Home from './pages/Home';
import Listings from './pages/Listings';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PropertyApprovals from './pages/admin/PropertyApprovals';

import LandlordDashboard from './pages/landlord/LandlordDashboard';
import MyProperties from './pages/landlord/MyProperties';
import AddProperty from './pages/landlord/AddProperty';
import PropertyDetails from './pages/landlord/PropertyDetails';
import AssignTenant from './pages/landlord/AssignTenant';
import VerificationPage from './pages/landlord/VerificationPage';
import TenantDashboard from './pages/tenant/TenantDashboard';
import MaintenanceRequestForm from './pages/tenant/MaintenanceRequestForm';
import PublicLayout from './components/PublicLayout';
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes with Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/properties" element={<PropertyApprovals />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['landlord']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/landlord" element={<LandlordDashboard />} />
              <Route path="/landlord/verify" element={<VerificationPage />} />
              <Route path="/landlord/properties" element={<MyProperties />} />
              <Route path="/landlord/properties/add" element={<AddProperty />} />
              <Route path="/landlord/properties/:id" element={<PropertyDetails />} />
              <Route path="/landlord/properties/:id/assign/:unitId" element={<AssignTenant />} />
            </Route>
          </Route>

          {/* Tenant Routes */}
          <Route element={<ProtectedRoute allowedRoles={['tenant']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/tenant" element={<TenantDashboard />} />
              <Route path="/tenant/maintenance/new" element={<MaintenanceRequestForm />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
