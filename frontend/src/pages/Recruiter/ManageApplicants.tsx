import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApplications } from '../../hooks/useApplications';

export const ManageApplicants = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { getJobApplicants, updateStatus } = useApplications();
  
  // Fetch applicants for this specific job
  const { data: applicants, isLoading, isError } = getJobApplicants(jobId || '');

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    updateStatus.mutate({ applicationId, status: newStatus });
  };

  if (isLoading) return <div className="text-center py-10">Loading applicants...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Error loading applicants.</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Applicant Tracking</h1>
        <Link to="/recruiter/dashboard" className="text-blue-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>

      {applicants?.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center text-gray-500">
          No candidates have applied to this job yet.
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience & Skills</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applicants?.map((app: any) => (
                <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{app.candidate.firstName} {app.candidate.lastName}</div>
                    <div className="text-sm text-gray-500">{app.candidate.email}</div>
                    <div className="text-sm text-gray-500">📍 {app.candidate.location || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{app.candidate.experienceYears || 0} Years Exp.</div>
                    <div className="text-sm text-gray-500 flex gap-1 flex-wrap mt-1">
                      {app.candidate.skills?.slice(0, 3).map((s: string) => (
                        <span key={s} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">{s}</span>
                      ))}
                    </div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      disabled={updateStatus.isPending}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};