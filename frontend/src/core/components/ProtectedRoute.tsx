// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuthStore } from '../../store/authStore';

// interface ProtectedRouteProps {
//   allowedRoles?: Array<'candidate' | 'recruiter' | 'admin'>;
// }

// export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
//   const { isAuthenticated, user } = useAuthStore();

//   // 1. Not logged in? Kick them to the login page.
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   // 2. Logged in, but wrong role? Kick them to an unauthorized page (or home).
//   if (allowedRoles && user && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // 3. Render the child routes.
//   return <Outlet />;
// };

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  allowedRoles?: Array<'candidate' | 'recruiter' | 'admin'>;
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return null;

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};