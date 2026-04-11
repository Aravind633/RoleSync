import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../config/api';
import { useAuthStore } from '../../store/authStore';
import { Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      const { user } = response.data.data;
      const { accessToken } = response.data;
      setAuth(user, accessToken);

      if (user.role === 'candidate') {
        navigate('/candidate/dashboard');
      } else if (user.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen">
      <main className="min-h-screen flex flex-col md:flex-row">
        {/* Left Side: Editorial & Geometric Representation */}
        <section className="hidden md:flex md:w-1/2 bg-surface-container-low relative overflow-hidden items-center justify-center p-16">
          <div className="absolute inset-0 opacity-10">
            <svg fill="none" height="100%" viewBox="0 0 800 800" width="100%" xmlns="http://www.w3.org/2000/svg">
              <line stroke="black" strokeWidth="0.5" x1="100" x2="700" y1="700" y2="100"></line>
              <line stroke="black" strokeWidth="0.5" x1="200" x2="750" y1="700" y2="150"></line>
              <line stroke="black" strokeWidth="0.5" x1="300" x2="800" y1="700" y2="200"></line>
              <circle cx="400" cy="400" r="300" stroke="black" strokeWidth="0.5"></circle>
              <rect height="500" stroke="black" strokeWidth="0.5" width="500" x="150" y="150"></rect>
            </svg>
          </div>
          <div className="relative z-10 max-w-lg">
            <div className="mb-8 md:mb-12">
              <span className="text-2xl md:text-3xl font-black tracking-tighter text-primary">RoleSync</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary leading-[1.1] mb-8">
              The Curated Path to Professional <span className="text-secondary italic">Excellence.</span>
            </h1>
            <p className="text-lg text-on-surface-variant font-medium leading-relaxed">
              RoleSync bridges the gap between ambition and placement through a lens of editorial precision and high-standard recruitment.
            </p>
            <div className="mt-24 flex items-center gap-4">
              <div className="h-[1px] w-12 bg-primary"></div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">The Editorial Standard</span>
            </div>
          </div>
          {/* Abstract Visual Component */}
          <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-gradient-to-tr from-surface-container-highest to-surface-bright rounded-full blur-3xl opacity-50"></div>
        </section>

        {/* Right Side: Login Form */}
        <section className="flex-1 flex items-center justify-center bg-surface-container-lowest p-6 sm:p-12 md:p-16 lg:p-24 relative z-10 w-full">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="md:hidden mb-8 mt-4">
              <span className="text-2xl font-black tracking-tighter text-primary">RoleSync</span>
            </div>
            <header className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-2">Welcome Back</h2>
              <p className="text-on-surface-variant font-medium">Access your curated career dashboard.</p>
            </header>
            
            {error && (
              <div className="bg-error-container text-on-error-container p-4 rounded-lg text-sm text-center font-bold border border-error-container/50 mb-6">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant" htmlFor="email">Email Address</label>
                <input 
                  className="w-full px-4 py-4 bg-surface-container-low border border-outline-variant/20 rounded-lg text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-300" 
                  id="email" 
                  name="email"
                  placeholder="name@company.com" 
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant" htmlFor="password">Password</label>
                  <a className="text-xs font-bold text-secondary uppercase tracking-widest hover:underline underline-offset-4" href="#">Forgot Password</a>
                </div>
                <div className="relative">
                  <input 
                    className="w-full px-4 py-4 bg-surface-container-low border border-outline-variant/20 rounded-lg text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-300 pr-12" 
                    id="password" 
                    name="password"
                    placeholder="••••••••" 
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="pt-4">
                <button 
                  className="w-full bg-primary text-on-primary py-5 px-6 rounded-lg font-bold text-sm uppercase tracking-[0.15em] hover:opacity-90 active:scale-[0.98] transition-all duration-300 disabled:opacity-50" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </div>
            </form>
            <div className="mt-12 text-center">
              <p className="text-sm text-on-surface-variant font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary font-bold hover:underline underline-offset-4">Sign up</Link>
              </p>
            </div>
            <footer className="mt-24 pt-8 border-t border-surface-container-highest/30">
              <div className="flex flex-col gap-4">
                <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-outline">
                  <a className="hover:text-primary transition-colors" href="#">Privacy</a>
                  <a className="hover:text-primary transition-colors" href="#">Terms</a>
                  <a className="hover:text-primary transition-colors" href="#">Contact</a>
                </div>
                <p className="text-[10px] text-outline leading-loose">
                  © {new Date().getFullYear()} RoleSync. The Editorial Standard in Career Placement. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </section>
      </main>
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary z-50"></div>
    </div>
  );
};