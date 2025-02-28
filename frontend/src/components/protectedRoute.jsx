import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";  // ✅ Import Auth Context

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userRole } = useAuth();
  const token = localStorage.getItem("token");

  // Redirect if not logged in
  if (!token) return <Navigate to="/login" />;

  // // Redirect if user role is not allowed
  // if (allowedRoles && !allowedRoles.includes(userRole)) {
  //   return <Navigate to="/unauthorized" />;  // ✅ Redirect unauthorized users
  // }

  return children;
};

export default ProtectedRoute;
