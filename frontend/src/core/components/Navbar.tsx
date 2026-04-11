import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../config/api';
import { useState } from 'react';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hide the global top navbar on the admin dashboard because it uses a specific SideNav
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  // Also hiding the Top nav on Auth pages is common to keep them clean,
  // but if we want a unified nav, we can simplify it for unauthorized states.

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Failed to logout on server', error);
    } finally {
      logout();
      navigate('/login');
    }
  };

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'recruiter') return '/recruiter/dashboard';
    return '/candidate/dashboard';
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl flex justify-between items-center px-4 md:px-12 h-20 max-w-[1920px] mx-auto transition-colors border-b border-surface-container-high/30">
      <div className="flex items-center gap-4 md:gap-12">
        <Link to="/" className="text-xl md:text-2xl font-black tracking-tighter text-black">
          ROLE<span className="text-secondary">SYNC</span>
        </Link>
        
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-8">
            <Link 
              className={`font-inter tracking-tight font-medium ${location.pathname.includes('dashboard') ? 'text-black font-bold border-b-2 border-black pb-1' : 'text-neutral-500 hover:text-black transition-colors'}`} 
              to={getDashboardPath()}
            >
              Dashboard
            </Link>
            {user?.role === 'recruiter' && (
              <>
                <Link className={`font-inter tracking-tight font-medium ${location.pathname.includes('pipeline') ? 'text-black font-bold border-b-2 border-black pb-1' : 'text-neutral-500 hover:text-black transition-colors'}`} to="#">Pipelines</Link>
                <Link className="font-inter tracking-tight font-medium text-neutral-500 hover:text-black transition-colors" to="#">Analytics</Link>
              </>
            )}
            {user?.role === 'candidate' && (
              <>
                 <Link className={`font-inter tracking-tight font-medium ${location.pathname.includes('jobs') ? 'text-black font-bold border-b-2 border-black pb-1' : 'text-neutral-500 hover:text-black transition-colors'}`} to="/candidate/jobs">Explore Roles</Link>
                 <Link className="font-inter tracking-tight font-medium text-neutral-500 hover:text-black transition-colors" to="#">Saved</Link>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        {isAuthenticated ? (
          <>
            <div className="flex gap-4 items-center">
              <span className="material-symbols-outlined text-black hover:opacity-80 transition-opacity duration-300 cursor-pointer">notifications</span>
              <span className="material-symbols-outlined text-black hover:opacity-80 transition-opacity duration-300 cursor-pointer">settings</span>
            </div>
            {user?.role === 'recruiter' && (
               <button className="hidden md:block bg-primary text-on-primary px-6 py-2 rounded-lg font-bold text-xs tracking-tight uppercase hover:opacity-90 transition-opacity">
                 Create Role
               </button>
            )}
            {/* Avatar Profile */}
            <div className="group relative">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-neutral-200 overflow-hidden cursor-pointer border-2 border-transparent group-hover:border-black transition-colors">
                 {user?.role === 'recruiter' ? (
                   <img alt="Profile" className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRUPKp75P93LfCW4d1nuZ9TRc6D9mPfHg8EiSvp8A2N992R6STcm5q3Bpwg2gIw8KD3rMXhbHGhUaoYZMBBspkh1sbxprWl22Fyo1jA0F9sRQnSo107P2_U3CnKVBCUUju4CA2fD_sXBPAYH8Z8i9JUfEKMbmwXgFIo_8sc7_8UjaZp6RR9gVncJhVvjWoQwn956nqeRlBxBw5_UmynL2nM434JVs_2SkZinR6Uc6LriGXxWBYjJ1ZZEvmP8yEEG488dVwTIA4OkJH" />
                 ) : (
                    <div className="w-full h-full bg-zinc-800 text-white flex items-center justify-center font-bold text-xs uppercase">
                      {user?.firstName?.[0] || 'U'}
                    </div>
                 )}
              </div>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                 <div className="py-2">
                   <div className="px-4 py-2 border-b border-neutral-100 mb-1">
                     <p className="text-sm font-bold text-black">{user?.firstName || 'User'}</p>
                     <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
                   </div>
                   {/* Mobile exclusive dashboard links in dropdown */}
                   <div className="md:hidden border-b border-neutral-100 pb-1 mb-1">
                     <Link to={getDashboardPath()} className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">Dashboard</Link>
                     {user?.role === 'recruiter' && <Link to="#" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">Pipelines</Link>}
                     {user?.role === 'candidate' && <Link to="/candidate/jobs" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">Explore Roles</Link>}
                   </div>
                   <button 
                     onClick={handleLogout}
                     className="w-full text-left px-4 py-2 text-sm text-red-600 font-bold hover:bg-neutral-50 transition-colors"
                   >
                     Sign Out
                   </button>
                 </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex gap-8 pointer-events-auto items-center">
            {location.pathname !== '/login' && location.pathname !== '/' && (
              <>
                <span className="text-stone-500 font-medium text-sm hidden md:inline-block">Already have an account?</span>
                <Link className="text-black font-bold text-sm underline underline-offset-4 hover:text-secondary transition-colors duration-300" to="/login">Login</Link>
              </>
            )}
            {location.pathname === '/login' && (
              <Link className="text-black font-bold text-sm underline underline-offset-4 hover:text-secondary transition-colors duration-300" to="/register">Create Account</Link>
            )}
            {location.pathname === '/' && (
              <>
                <Link className="text-black font-bold text-sm hover:text-secondary transition-colors duration-300" to="/login">Log In</Link>
                <Link className="bg-black text-white px-6 py-2 rounded-lg font-bold text-sm tracking-tight hover:bg-zinc-800 transition-colors" to="/register">Join RoleSync</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};