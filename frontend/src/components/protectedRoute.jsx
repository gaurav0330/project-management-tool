import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userRole, checkTokenValidity } = useAuth();

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
