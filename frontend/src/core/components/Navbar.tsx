import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../config/api';
import { NotificationBell } from './common/NotificationBell';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 1. Tell the backend to clear the HTTP-only refresh cookie
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Failed to logout on server', error);
    } finally {
      // 2. Clear the Zustand global store and memory token
      logout();
      // 3. Kick the user back to the login page
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Area */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">RoleSync</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Dynamic Dashboard Link */}
                <Link 
                  to={user?.role === 'candidate' ? '/candidate/dashboard' : '/recruiter/dashboard'}
                  className="text-gray-700 hover:text-blue-600 font-medium text-sm mr-2"
                >
                  Dashboard
                </Link>

                <NotificationBell />

                {/* User Role Badge */}
                <span className="text-sm text-gray-600 font-medium px-3 py-1 bg-gray-100 rounded-full ml-2">
                  {user?.role === 'candidate' ? '🎓 Candidate' : '🏢 Recruiter'}
                </span>
                
                <button
                  onClick={handleLogout}
                  className="ml-4 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium text-sm">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};