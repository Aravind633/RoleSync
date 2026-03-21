import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from "../../utils/api";
import { useApplications } from '../../hooks/useApplications';

export const JobSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  
  // To prevent searching on every single keystroke, we only trigger search on button click
  const [activeSearch, setActiveSearch] = useState({ q: '', location: '' });

  const { applyForJob, getMyApplications } = useApplications();
  const appliedJobs = getMyApplications?.data || [];
  const appliedJobIds = appliedJobs.map((app: any) => app.job?._id);

  // Fetch jobs using your new advanced aggregation endpoint
  const { data: searchResults, isLoading, isError } = useQuery({
    queryKey: ['searchJobs', activeSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeSearch.q) params.append('q', activeSearch.q);
      if (activeSearch.location) params.append('location', activeSearch.location);
      
      const { data } = await api.get(`/jobs/search?${params.toString()}`);
      return data.data.jobs;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch({ q: searchQuery, location: locationQuery });
  };

  const handleApply = (jobId: string) => {
    applyForJob?.mutate(jobId);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Find Your Perfect Role
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Search open positions and apply with a single click.
        </p>
      </div>

      {/* Advanced Search Bar */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-10">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="sr-only">Job Title or Keyword</label>
            <input
              type="text"
              placeholder="Job title, company, or keywords..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="sr-only">Location</label>
            <input
              type="text"
              placeholder="City, state, or 'Remote'"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 border"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results Section */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Searching jobs...</div>
      ) : isError ? (
        <div className="text-center py-12 text-red-500">Failed to load jobs. Please try again.</div>
      ) : searchResults?.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults?.map((job: any) => {
            const hasApplied = appliedJobIds.includes(job._id);
            const isApplying = applyForJob?.isPending && applyForJob.variables === job._id;

            return (
              <div key={job._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 truncate">{job.title}</h2>
                  <p className="text-blue-600 font-medium">{job.companyName}</p>
                </div>
                
                <div className="space-y-2 mb-6 flex-grow text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">📍</span> {job.location || 'Not specified'}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">💼</span> {job.experienceLevel || 'Any'} Experience
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skills?.slice(0, 4).map((skill: string, idx: number) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                  {job.skills?.length > 4 && (
                    <span className="bg-gray-50 text-gray-500 px-2 py-1 rounded text-xs font-medium">
                      +{job.skills.length - 4} more
                    </span>
                  )}
                </div>

                <div className="mt-auto border-t pt-4">
                  <button
                    onClick={() => handleSearch} 
                    onMouseUp={() => handleApply(job._id)} 
                    disabled={hasApplied || isApplying}
                    className={`w-full py-2 px-4 rounded-md font-semibold text-sm transition-colors ${
                      hasApplied 
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : isApplying
                        ? 'bg-gray-300 text-gray-700 cursor-wait'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                    }`}
                  >
                    {hasApplied ? '✓ Applied' : isApplying ? 'Applying...' : 'Apply Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};