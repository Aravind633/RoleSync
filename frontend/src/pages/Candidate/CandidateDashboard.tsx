import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useApplications } from '../../hooks/useApplications';

export const CandidateDashboard = () => {
  // Fetch AI recommendations (Served instantly from Redis!)
  const { data: recommendations, isLoading, isError } = useQuery({
    queryKey: ['aiRecommendations'],
    queryFn: async () => {
      const { data } = await api.get('/matches/recommendations');
      return data.data; // This returns the array of Match objects
    },
  });

  // Fetch the candidate's active applications
  const { getMyApplications } = useApplications();
  const { data: myApplications, isLoading: appsLoading } = getMyApplications;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Candidate Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back! Here are your personalized job matches.</p>
        </div>
        <Link 
          to="/candidate/jobs" 
          className="bg-gray-100 text-gray-800 px-6 py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors border border-gray-300"
        >
          Browse All Jobs
        </Link>
      </div>

      {/* AI Recommendations Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span>✨</span> Top AI Recommended Roles
        </h2>

        {isLoading ? (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-200 shadow-sm">
            <span className="text-gray-500 font-medium animate-pulse">Running matching algorithms...</span>
          </div>
        ) : isError ? (
          <div className="text-center py-10 bg-white rounded-xl border border-red-200 shadow-sm">
            <span className="text-red-500 font-medium">Unable to load recommendations at this time.</span>
          </div>
        ) : recommendations?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-lg mb-4">We are currently calculating your perfect matches.</p>
            <p className="text-sm text-gray-400">Make sure your profile skills and experience are fully updated!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations?.map((match: any) => (
              <div key={match._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all relative overflow-hidden flex flex-col h-full">
                
                {/* Match Score Badge */}
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg font-bold text-sm shadow-sm">
                  {match.score}% Match
                </div>

                <div className="mb-4 pr-12">
                  <h3 className="text-xl font-bold text-gray-900 truncate">{match.job?.title}</h3>
                  <p className="text-blue-600 font-medium">{match.job?.companyName}</p>
                </div>
                
                <div className="space-y-2 mb-6 flex-grow text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">📍</span> {match.job?.location || 'Not specified'}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">💼</span> {match.job?.experienceLevel || 'Any'} Experience
                  </p>
                </div>

                <div className="mt-auto border-t pt-4">
                  <Link
                    to="/candidate/jobs" 
                    className="block w-full text-center py-2 px-4 bg-blue-50 text-blue-700 rounded-md font-semibold text-sm hover:bg-blue-100 transition-colors"
                  >
                    View Details & Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Applications Section */}
      <div className="mt-12 border-t border-gray-200 pt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span>📋</span> My Active Applications
        </h2>

        {appsLoading ? (
          <div className="text-gray-500">Loading your applications...</div>
        ) : myApplications?.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-gray-500">
            You haven't applied to any jobs yet. <Link to="/candidate/jobs" className="text-blue-600 hover:underline">Start browsing!</Link>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myApplications?.map((app: any) => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{app.job?.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{app.job?.companyName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          app.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'shortlisted' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};