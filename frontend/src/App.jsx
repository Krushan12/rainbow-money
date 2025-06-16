import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ClientProvider } from './contexts/ClientContext';
import { PortfolioProvider } from './contexts/PortfolioContext';
import { Toaster } from './components/ui/toaster';
import PrivateRoute from './components/Auth/PrivateRoute';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './pages/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import ReportDashboard from './pages/ReportDashboard';
import SettingsPage from './pages/SettingsPage';
import ClientsPage from './pages/ClientsPage';
import ClientDashboard from './pages/ClientDashboard';
import ClientReportDashboard from './pages/ClientReportDashboard';

function App() {
  return (
    <>
      <AuthProvider>
        <ClientProvider>
          <PortfolioProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/auth/*" element={<AuthPage />} />
                
                {/* Protected routes */}
                <Route 
                  path="/" 
                  element={
                    <PrivateRoute>
                      <DashboardLayout />
                    </PrivateRoute>
                  }
                >                  <Route index element={<DashboardPage />} />
                  <Route path="reports" element={<ReportDashboard />} />
                  <Route path="reports/:clientId" element={<ReportDashboard />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="clients" element={<ClientsPage />} />
                  <Route path="clients/:clientId/dashboard" element={<ClientDashboard />} />
                  <Route path="clients/:clientId/report" element={<ReportDashboard />} />
                </Route>

                {/* Redirect any unknown routes to auth */}
                <Route path="*" element={<Navigate to="/auth" replace />} />
              </Routes>
            </Router>
          </PortfolioProvider>
        </ClientProvider>
      </AuthProvider>
      <Toaster />
    </>
  );
}

export default App;