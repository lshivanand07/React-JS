import ErrorHandling from '../components/ErrorHandle/Error';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoutes = ({ allowedRoles }: ProtectedRouteProps) => {
  const userToken = JSON.parse(localStorage.getItem('userToken') || '{}');

  if (!userToken?.token) {
    console.log('not allowed');
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userToken?.role)) {
    return ErrorHandling({
      message: 'Access Denied, You do not have permission to access this page.',
    });
  }

  return <Outlet />;
};

export default ProtectedRoutes;
