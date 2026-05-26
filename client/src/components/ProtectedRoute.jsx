import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center">
        {/* Loading Spinner */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-brand-500 animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-400 font-medium tracking-wide animate-pulse">
          Verifying Permissions...
        </p>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role unauthorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their default dashboard depending on their role
    if (user.role === 'Admin') return <Navigate to="/admin" replace />;
    if (user.role === 'Security') return <Navigate to="/visitor-logs" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
export default ProtectedRoute;
