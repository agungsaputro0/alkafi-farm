import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoadingSpinner from '../atoms/LoadingSpinner';

type AdminRouteProps = {
  children: ReactNode;
};

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { userName, loading, userRole } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!userName) {
    return <Navigate to="/Login" replace />;
  }

  if (userRole === 2 && window.location.pathname !== "/Portal") {
    return <Navigate to="/Portal" replace />;
  }


  return <>{children}</>;
};

export default AdminRoute;
