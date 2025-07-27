import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userRole, checkTokenValidity, isLoading } = useAuth();

  // ✅ Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
        <div className="rounded-full h-16 w-16 border-b-4 animate-spin border-interactive-primary-light dark:border-interactive-primary-dark bg-white/60"></div>
      </div>
    );
  }

  // ✅ Check token validity before rendering
  if (!checkTokenValidity()) {
    return <Navigate to="/login" replace />;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
