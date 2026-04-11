import { useQuery } from '@tanstack/react-query';
import { api } from '../../config/api';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/stats');
      return data.data;
    },
  });

  const usersList = stats?.recentUsers || [];
  const totalUsers = stats?.totalUsers || 0;

  return (
    <div className="bg-surface text-on-surface antialiased font-['Inter']">
      <style>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
      
      {/* SideNavBar Component */}
      <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 bg-zinc-950 z-50 flex-col p-6 space-y-8 shadow-[40px_0_60px_-15px_rgba(0,0,0,0.3)] tracking-tight">
        <div className="flex flex-col space-y-1">
          <h1 className="text-xl font-bold tracking-tighter text-white">RoleSync</h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Admin Terminal</p>
        </div>
        <nav className="flex-grow flex flex-col space-y-2">
          {/* Active: Dashboard */}
          <Link className="flex items-center space-x-3 p-3 text-white font-semibold bg-zinc-800/50 rounded-lg hover:bg-zinc-800/50 transition-all duration-200 scale-[0.98] active:scale-95" to="/admin/dashboard">
            <span className="material-symbols-outlined text-red-600">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <a className="flex items-center space-x-3 p-3 text-zinc-400 font-medium hover:text-zinc-100 hover:bg-zinc-800/50 transition-all duration-200 scale-[0.98] active:scale-95" href="#">
            <span className="material-symbols-outlined">group</span>
            <span>Users</span>
          </a>
          <a className="flex items-center space-x-3 p-3 text-zinc-400 font-medium hover:text-zinc-100 hover:bg-zinc-800/50 transition-all duration-200 scale-[0.98] active:scale-95" href="#">
            <span className="material-symbols-outlined">payments</span>
            <span>Billing</span>
          </a>
          <a className="flex items-center space-x-3 p-3 text-zinc-400 font-medium hover:text-zinc-100 hover:bg-zinc-800/50 transition-all duration-200 scale-[0.98] active:scale-95" href="#">
            <span className="material-symbols-outlined">monitor_heart</span>
            <span>System Health</span>
          </a>
          <a className="flex items-center space-x-3 p-3 text-zinc-400 font-medium hover:text-zinc-100 hover:bg-zinc-800/50 transition-all duration-200 scale-[0.98] active:scale-95" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </a>
        </nav>
        <div className="pt-6 border-t border-zinc-800">
          <button className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors scale-[0.98] active:scale-95 duration-150">
            Generate Report
          </button>
        </div>
      </aside>

      {/* TopAppBar Component */}
      <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] bg-white/80 backdrop-blur-xl z-40 flex justify-between items-center px-4 md:px-12 h-20 md:ml-64 leading-relaxed border-b border-zinc-200/50">
        <div className="flex items-center">
          <h2 className="text-lg font-bold text-black">Platform Overview</h2>
        </div>
        <div className="flex items-center space-x-8">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm hidden sm:block">search</span>
            <input className="bg-surface-container-low border-none rounded-lg sm:pl-10 px-4 py-2 text-sm focus:ring-2 focus:ring-black/5 w-32 sm:w-64 transition-all" placeholder="Search..." type="text"/>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-zinc-500 hover:text-red-600 transition-colors opacity-80 active:opacity-100 flex items-center justify-center">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="text-zinc-500 hover:text-red-600 transition-colors opacity-80 active:opacity-100 flex items-center justify-center">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            <img alt="Administrator avatar" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4qennwMUWSnqpRk7oenfeEWRDBBR7-vTcbK3EzFFa14mtTFPa3PIzX7LAEW-fixXSKl8iRoAWPS6pFAwkRLUiDnXxcNKR9VsDfCTDGRPbY39o25NT5JT-VtkZpbb_QHhPM6ZSNg_bdx20zvUZrCK-QRVPj2kppQ3ndoV9kMUBOBRgmLdPoiglxx9sqitnYmnZowE9VBkCTNN4QsWv8yIzLvw5EbZvissL-6lk3cStAxfrTyzPX4vlv9FcPsbOiCzk3-BBBzSRgi88"/>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="md:ml-64 pt-20 min-h-screen bg-zinc-50 flex-grow w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-12 space-y-12">
          
          {/* Editorial Metrics Overview */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Revenue</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-4xl font-extrabold text-black tracking-tight">$428.5k</h3>
                <span className="text-secondary text-sm font-bold">+12%</span>
              </div>
              <p className="text-xs text-zinc-500">Monthly Recurring Revenue (MRR)</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Growth</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-4xl font-extrabold text-black tracking-tight">{totalUsers}</h3>
                <span className="text-secondary text-sm font-bold">+1.2%</span>
              </div>
              <p className="text-xs text-zinc-500">Total Registered Users</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Engagement</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-4xl font-extrabold text-black tracking-tight">84%</h3>
                <span className="text-zinc-400 text-sm font-bold">Stable</span>
              </div>
              <p className="text-xs text-zinc-500">Retention Rate (30D)</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Performance</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-4xl font-extrabold text-black tracking-tight">214ms</h3>
                <span className="text-secondary text-sm font-bold">-18ms</span>
              </div>
              <p className="text-xs text-zinc-500">Average API Latency</p>
            </div>
          </section>

          {/* User Management Table Section */}
          <section className="space-y-6">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <h4 className="text-2xl font-extrabold text-black tracking-tight">Active Accounts</h4>
                <p className="text-zinc-500 text-sm">Managing {totalUsers} authenticated users across 4 regions.</p>
              </div>
              <div className="flex space-x-4">
                <button className="bg-surface-container-high px-6 py-2 rounded-lg text-sm font-bold text-black hover:bg-zinc-200 transition-all">Filter</button>
                <button className="bg-primary px-6 py-2 rounded-lg text-sm font-bold text-on-primary hover:bg-zinc-800 transition-all">Add User</button>
              </div>
            </div>

            {/* Pure White Card */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200">
                    <th className="px-6 py-4 text-xs font-extrabold text-zinc-400 uppercase tracking-widest">User Profile</th>
                    <th className="px-6 py-4 text-xs font-extrabold text-zinc-400 uppercase tracking-widest">Assigned Role</th>
                    <th className="px-6 py-4 text-xs font-extrabold text-zinc-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-extrabold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {isLoading ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-zinc-500">Loading user data...</td></tr>
                  ) : usersList.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No users found.</td></tr>
                  ) : (
                    usersList.map((user: any) => (
                      <tr key={user._id} className="hover:bg-zinc-50 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-100 flex-shrink-0 flex items-center justify-center text-zinc-500 font-bold uppercase">
                              {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-black">{user?.firstName ? `${user.firstName} ${user.lastName}` : 'No Name'}</p>
                              <p className="text-xs text-zinc-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                            user.role === 'admin' ? 'bg-red-100 text-red-700' : 
                            user.role === 'recruiter' ? 'bg-zinc-100 text-zinc-600' : 'bg-surface-container-high text-zinc-600'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-medium text-zinc-700">Active</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button className="text-zinc-400 hover:text-black transition-colors"><span className="material-symbols-outlined">more_horiz</span></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="px-6 py-4 bg-zinc-50 flex items-center justify-between border-t border-zinc-200">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Showing Top 10 Users</span>
              </div>
            </div>
          </section>

          {/* Bottom Asymmetric Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
            <div className="md:col-span-2 bg-white border border-zinc-200 rounded-xl p-8 space-y-6">
              <h5 className="text-lg font-extrabold text-black tracking-tight">System Health Status</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-4 bg-zinc-50 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-400 uppercase">Compute Clusters</span>
                    <span className="text-xs font-bold text-green-600">Operational</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[98%]"></div>
                  </div>
                </div>
                <div className="p-4 bg-zinc-50 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-400 uppercase">Database I/O</span>
                    <span className="text-xs font-bold text-green-600">Optimal</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[94%]"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-black text-white rounded-xl p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="material-symbols-outlined text-red-600 text-3xl">bolt</span>
                <h5 className="text-xl font-bold leading-tight">Infrastructure Security Audit Required</h5>
                <p className="text-zinc-400 text-sm">Last sweep was 14 days ago. New compliance standards available for deployment.</p>
              </div>
              <button className="mt-6 w-full border border-zinc-700 py-3 rounded-lg text-sm font-bold hover:bg-zinc-900 transition-colors">Start Audit</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};