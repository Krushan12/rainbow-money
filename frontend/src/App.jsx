import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ClientProvider } from './contexts/ClientContext';
import { Toaster } from './components/ui/toaster';
import PrivateRoute from './components/Auth/PrivateRoute';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './pages/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import ReportDashboard from './pages/ReportDashboard';
import SettingsPage from './pages/SettingsPage';
import ClientsPage from './pages/ClientsPage';

function App() {
  return (
    <AuthProvider>
      <ClientProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected routes */}
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              
              {/* Main dashboard that also handles client-specific dashboard */}
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="clients/:clientId/dashboard" element={<DashboardPage />} />
              
              {/* Clients routes */}
              <Route path="clients" element={<ClientsPage />} />
              
              {/* Main reports that also handles client-specific reports */}
              <Route path="reports" element={<ReportDashboard />} />
              <Route path="clients/:clientId/reports" element={<ReportDashboard />} />
              
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Redirect any unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster />
        </Router>
      </ClientProvider>
    </AuthProvider>
  );
}

export default App;