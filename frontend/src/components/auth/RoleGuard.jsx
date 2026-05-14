import React from 'react';
import { useAuth } from './AuthContext';

const RoleGuard = ({ children, allowedRoles, fallback = null }) => {
  const { user } = useAuth();

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return fallback;
  }

  return <>{children}</>;
};

export default RoleGuard;
