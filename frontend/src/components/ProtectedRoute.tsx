import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../services/auth.service';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  let location = useLocation();

  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
