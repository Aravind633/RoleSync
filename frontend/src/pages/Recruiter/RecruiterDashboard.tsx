import { useState } from 'react';
import { useJobs } from '../../hooks/useJobs';
import { CreateJobModal } from './CreateJobModal';

export const RecruiterDashboard = () => {
  const { getMyJobs } = useJobs();
  const { data: jobs, isLoading, isError } = getMyJobs;
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading your jobs...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Failed to load jobs.</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">🏢 Recruiter Dashboard</h1>
      
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Post New Job
        </button>
      </div>

      {jobs?.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
          <p className="text-gray-500">Get started by creating your first job listing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.map((job: any) => (
            <div key={job._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{job.title}</h2>
                    <p className="text-sm text-gray-500">{job.companyName}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {job.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600"><span className="font-medium">Location:</span> {job.location}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Experience:</span> {job.experienceLevel}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skills.map((skill: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t pt-4 mt-auto">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800">Edit</button>
                <button className="text-sm font-medium text-red-600 hover:text-red-800">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateJobModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};