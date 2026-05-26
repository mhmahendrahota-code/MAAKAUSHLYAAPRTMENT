import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Public pages
import { Home } from './pages/Public/Home';
import { About } from './pages/Public/About';
import { Contact } from './pages/Public/Contact';
import { Committee } from './pages/Public/Committee';
import { Gallery } from './pages/Public/Gallery';

// Resident pages
import { Dashboard } from './pages/Resident/Dashboard';
import { Notices } from './pages/Resident/Notices';
import { MaintenanceBills } from './pages/Resident/MaintenanceBills';
import { Complaints } from './pages/Resident/Complaints';
import { Downloads } from './pages/Resident/Downloads';

// Admin & Security pages
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { Directory } from './pages/Admin/Directory';
import { VisitorLogs } from './pages/Admin/VisitorLogs';
import { Finance } from './pages/Admin/Finance';

// Root Layout Wrapper
const AppLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      {/* Top sticky Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Flex container for sidebar & nested content portal */}
      <div className="flex-1 flex relative">
        {user && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        
        {/* Dynamic content rendering zone */}
        <main className="flex-1 min-w-0 overflow-y-auto bg-transparent flex flex-col items-center">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Resident Protected Portal Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Resident']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/maintenance-bills" 
              element={
                <ProtectedRoute allowedRoles={['Resident']}>
                  <MaintenanceBills />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/complaints" 
              element={
                <ProtectedRoute allowedRoles={['Resident', 'Admin']}>
                  <Complaints />
                </ProtectedRoute>
              } 
            />

            {/* Shared Board Notices - readable by all authenticated members */}
            <Route 
              path="/notices" 
              element={
                <ProtectedRoute allowedRoles={['Resident', 'Admin', 'Security']}>
                  <Notices />
                </ProtectedRoute>
              } 
            />

            {/* Shared Committee Section - readable by all authenticated members */}
            <Route 
              path="/committee" 
              element={
                <ProtectedRoute allowedRoles={['Resident', 'Admin', 'Security']}>
                  <Committee />
                </ProtectedRoute>
              } 
            />

            {/* Shared Gallery Section - readable by all authenticated members */}
            <Route 
              path="/gallery" 
              element={
                <ProtectedRoute allowedRoles={['Resident', 'Admin', 'Security']}>
                  <Gallery />
                </ProtectedRoute>
              } 
            />

            {/* Shared Downloads Section - readable by all authenticated members */}
            <Route 
              path="/downloads" 
              element={
                <ProtectedRoute allowedRoles={['Resident', 'Admin', 'Security']}>
                  <Downloads />
                </ProtectedRoute>
              } 
            />

            {/* Admin Protected Portal Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/directory" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <Directory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/finance" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <Finance />
                </ProtectedRoute>
              } 
            />

            {/* Security/Gatekeeper Protected Portal Routes (readable by Admin as well) */}
            <Route 
              path="/visitor-logs" 
              element={
                <ProtectedRoute allowedRoles={['Security', 'Admin', 'Resident']}>
                  <VisitorLogs />
                </ProtectedRoute>
              } 
            />

            {/* Redirect anything else back to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
};

export default App;
