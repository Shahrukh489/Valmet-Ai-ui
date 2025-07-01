import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, roles, loading, error } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // You can use a spinner or custom loading component here
  }

  if (error) {
    return <div>Error: {error}</div>; // Handle errors gracefully
  }

  if (!user) {
    // Not logged in: redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are fetched, check if user has any of the allowed roles
  const hasRequiredRole = roles.some(role => allowedRoles.includes(role));

  if (allowedRoles.length > 0 && !hasRequiredRole) {
    // Logged in but lacks appropriate role
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized: render child components
  return children;
};

export default ProtectedRoute;
