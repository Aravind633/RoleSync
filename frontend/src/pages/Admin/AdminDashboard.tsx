import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';

export const AdminDashboard = () => {
  const { data: analytics, isLoading, isError } = useQuery({
    queryKey: ['systemAnalytics'],
    queryFn: async () => {
      const { data } = await api.get('/admin/analytics');
      return data.data;
    },
  });

  if (isLoading) return <div className="p-10 text-center text-gray-500">Loading platform analytics...</div>;
  if (isError) return <div className="p-10 text-center text-red-500">Failed to load analytics.</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="text-gray-500">System overview and conversion metrics</p>
      </div>

      {/* Top Level Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Jobs</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{analytics?.overview.totalJobs}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Applications</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{analytics?.overview.totalApplications}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Avg Apps / Job</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{analytics?.overview.avgApplicationsPerJob}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Skills Chart (Visualized with simple progress bars) */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Top 5 In-Demand Skills</h2>
          <div className="space-y-4">
            {analytics?.topSkills.map((skill: any, index: number) => {
              // Calculate percentage relative to the top skill for the bar width
              const maxDemand = analytics.topSkills[0].demandCount;
              const widthPct = Math.round((skill.demandCount / maxDemand) * 100);
              
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>{skill._id}</span>
                    <span>{skill.demandCount} jobs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${widthPct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Application Funnel */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Application Status Funnel</h2>
          <div className="grid grid-cols-2 gap-4">
            {analytics?.applications.map((stat: any) => (
              <div key={stat._id} className="p-4 bg-gray-50 rounded-md border border-gray-100 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">{stat.count}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">{stat._id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};