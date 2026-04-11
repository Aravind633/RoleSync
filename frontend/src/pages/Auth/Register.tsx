import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../config/api';
import { useAuthStore } from '../../store/authStore';
import { Eye, EyeOff } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'candidate' as 'candidate' | 'recruiter',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleToggle = (role: 'candidate' | 'recruiter') => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      const { user } = response.data.data;
      const { accessToken } = response.data;
      setAuth(user, accessToken);

      if (user.role === 'candidate') {
        navigate('/candidate/dashboard');
      } else if (user.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface overflow-hidden min-h-screen">
      <style>{`
        .ghost-border {
            border: 1px solid rgba(207, 196, 197, 0.2);
        }
        .ghost-border:focus-within {
            border-color: #000000;
        }
      `}</style>
      

      
      <main className="min-h-screen flex flex-col md:flex-row">
        {/* Left Side: Editorial Content */}
        <section className="relative hidden md:flex md:w-1/2 lg:w-3/5 h-screen overflow-hidden bg-primary items-center justify-center p-16">
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover opacity-50 grayscale" 
              alt="Modern minimalist architectural interior with clean lines, soft natural lighting, and a high-end editorial aesthetic in grayscale" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDl9DRighMqP4t0XJGLdrky3efR_cvZkNdVlw2QaR2o-c0bBxoQSmqKpyH_F4YN6GuoAuLVwmMzIvEjB7heESGeHEgcXN-6aOt_nQooSVGzZ9_bgJ7X6B1qQ_dTC6H4Inb18ntQGfFFkAXmlJPvfIiE__cKNe4PN3_niogRrJHjXPCRNnBAfuBHsaqakjdveFvXNgUsB8oGI-NI9Ivy0H6ucEYl9gwr9jWlzeUgADvRqs71aDq1bx1N9PTD_v9067DjcHahat7oH3TX"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          </div>
          <div className="relative z-10 w-full max-w-2xl">
            <h1 className="text-white text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              The Curated Path <br/>to Excellence.
            </h1>
            <p className="text-stone-400 text-lg lg:text-xl font-light leading-relaxed max-w-md">
              Join the elite circle of professionals and recruiters redefining the modern career landscape through precision matching.
            </p>
            <div className="mt-16 grid grid-cols-2 gap-12">
              <div>
                <div className="text-white text-4xl font-bold tracking-tight mb-1">8M+</div>
                <div className="text-stone-500 text-xs uppercase tracking-widest font-bold">Matches Made</div>
              </div>
              <div>
                <div className="text-white text-4xl font-bold tracking-tight mb-1">94%</div>
                <div className="text-stone-500 text-xs uppercase tracking-widest font-bold">Retention Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Registration Form */}
        <section className="w-full md:w-1/2 lg:w-2/5 min-h-screen bg-surface-container-lowest flex items-center justify-center px-6 md:px-12 lg:px-24 py-12 md:py-20 overflow-y-auto z-10">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="md:hidden mb-8">
              <span className="text-2xl font-black tracking-tighter text-primary">RoleSync</span>
            </div>
            <div className="mb-8 md:mb-12">
              <h2 className="text-3xl font-black tracking-tighter text-black mb-2">Create Account</h2>
              <p className="text-on-surface-variant font-medium">Define your future with RoleSync Editorial.</p>
            </div>
            
            {/* Segmented Control (Candidate vs Recruiter) */}
            <div className="bg-surface-container p-1 rounded-lg flex mb-10">
              <button 
                type="button"
                onClick={() => handleRoleToggle('candidate')}
                className={`flex-1 py-3 text-sm rounded-lg transition-all ${formData.role === 'candidate' ? 'font-bold bg-surface-container-lowest text-black shadow-sm' : 'font-medium text-on-surface-variant hover:text-black'}`}
              >
                Candidate
              </button>
              <button 
                type="button"
                onClick={() => handleRoleToggle('recruiter')}
                className={`flex-1 py-3 text-sm transition-all rounded-lg ${formData.role === 'recruiter' ? 'font-bold bg-surface-container-lowest text-black shadow-sm' : 'font-medium text-on-surface-variant hover:text-black'}`}
              >
                Recruiter
              </button>
            </div>

            {error && (
              <div className="bg-error-container text-on-error-container p-4 rounded-lg text-sm text-center font-bold border border-error-container/50 mb-6">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">First Name</label>
                  <div className="ghost-border bg-surface-container-low px-4 py-4 rounded-lg flex items-center gap-3">
                    <input 
                      name="firstName"
                      className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder:text-stone-400 text-sm font-medium p-0" 
                      placeholder="First" 
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                {/* Last Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">Last Name</label>
                  <div className="ghost-border bg-surface-container-low px-4 py-4 rounded-lg flex items-center gap-3">
                    <input 
                      name="lastName"
                      className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder:text-stone-400 text-sm font-medium p-0" 
                      placeholder="Last" 
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">Work Email</label>
                <div className="ghost-border bg-surface-container-low px-4 py-4 rounded-lg flex items-center gap-3">
                  <span className="material-symbols-outlined text-stone-400 text-sm">mail</span>
                  <input 
                    name="email"
                    className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder:text-stone-400 text-sm font-medium p-0" 
                    placeholder="name@company.com" 
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">Password</label>
                <div className="ghost-border bg-surface-container-low px-4 py-4 rounded-lg flex items-center gap-3 relative">
                  <span className="material-symbols-outlined text-stone-400 text-sm">lock</span>
                  <input 
                    name="password"
                    className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-stone-400 text-sm font-medium p-0" 
                    placeholder="Min. 8 characters" 
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-stone-400 hover:text-black transition-colors flex items-center justify-center p-1 absolute right-3"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-5 rounded-lg font-bold tracking-widest text-xs uppercase hover:bg-stone-800 transition-all duration-300 mt-4 active:scale-[0.98] disabled:opacity-50" 
              >
                {loading ? 'PROCESSING...' : 'CREATE ACCOUNT'}
              </button>
            </form>

          </div>
        </section>
      </main>

      {/* Global Footer Minimalist */}
      <footer className="fixed bottom-0 right-0 w-full md:w-1/2 lg:w-2/5 p-8 bg-transparent pointer-events-none z-0">
        <div className="flex justify-center gap-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest pointer-events-auto">
          <a className="hover:text-black transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-black transition-colors" href="#">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};