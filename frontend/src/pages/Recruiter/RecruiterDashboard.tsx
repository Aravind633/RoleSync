import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../config/api'; 
import { useJobs } from '../../hooks/useJobs';
import { CreateJobModal } from './CreateJobModal';
import { BulkUploadModal } from './BulkUploadModal';
import { Link } from 'react-router-dom';

export const RecruiterDashboard = () => {
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const { getMyJobs } = useJobs() || {};
  const jobs = getMyJobs?.data || [];
  const isJobsLoading = getMyJobs?.isLoading || false;
  const isJobsError = getMyJobs?.isError || false;

  const { data: applications, isLoading: isAppsLoading } = useQuery({
    queryKey: ['recruiterApplications'],
    queryFn: async () => {
      const { data } = await api.get('/applications/recruiter');
      return data.data; 
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.patch(`/applications/${id}/status`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiterApplications'] });
    },
  });

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: applicationId, status: newStatus });
  };

  const interviewingCount = applications?.filter((a: any) => a.status === 'reviewed' || a.status === 'interviewing').length || 0;
  const offeredCount = applications?.filter((a: any) => a.status === 'shortlisted' || a.status === 'offered').length || 0;

  return (
    <div className="bg-surface-container-low text-on-surface min-h-screen flex flex-col">
      <style>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
      


      {/* Main Content Canvas */}
      <main className="flex-grow pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-12 max-w-[1920px] mx-auto w-full overflow-x-hidden">
        
        {/* Editorial Header */}
        <header className="mb-16">
          <p className="text-secondary font-bold tracking-widest uppercase text-xs mb-4">Command Center</p>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-black leading-none mb-4">Recruitment Command</h1>
          <div className="h-1 w-24 bg-black"></div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="bg-surface-container-lowest p-8 border border-outline-variant/20 rounded-lg group hover:border-black transition-colors duration-500">
            <span className="text-sm font-medium text-on-surface-variant tracking-tight block mb-2">Total Applicants</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tighter">{applications?.length || 0}</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-8 border border-outline-variant/20 rounded-lg group hover:border-black transition-colors duration-500">
            <span className="text-sm font-medium text-on-surface-variant tracking-tight block mb-2">Active Postings</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tighter">{jobs?.length || 0}</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-8 border border-outline-variant/20 rounded-lg group hover:border-black transition-colors duration-500">
            <span className="text-sm font-medium text-on-surface-variant tracking-tight block mb-2">Interviewing</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tighter">{interviewingCount}</span>
              <span className="text-neutral-400 text-xs font-medium">In Progress</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-8 border border-outline-variant/20 rounded-lg group hover:border-black transition-colors duration-500">
            <span className="text-sm font-medium text-on-surface-variant tracking-tight block mb-2">Offers Pending</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tighter">{offeredCount}</span>
              <span className="text-secondary text-xs font-bold">Priority</span>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-black tracking-tight">Active Job Postings</h2>
          <div className="flex gap-4">
            <button onClick={() => setIsBulkModalOpen(true)} className="bg-surface-container px-6 py-2 rounded-lg font-bold text-sm text-black hover:bg-surface-variant transition-colors border border-outline-variant/50">
              Bulk Upload
            </button>
            <button onClick={() => setIsModalOpen(true)} className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
              Create New Role
            </button>
          </div>
        </div>

        {/* Minimalist Data Table */}
        <div className="bg-surface-container-lowest rounded-lg overflow-x-auto border border-outline-variant/20 -mx-4 md:mx-0">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-high/30">
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Role</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Department</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Location</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {isJobsLoading ? (
                 <tr><td colSpan={4} className="px-8 py-10 text-center text-sm font-medium text-on-surface-variant">Loading roles...</td></tr>
              ) : isJobsError ? (
                 <tr><td colSpan={4} className="px-8 py-10 text-center text-sm font-medium text-error">Failed to load active roles.</td></tr>
              ) : jobs.length === 0 ? (
                 <tr><td colSpan={4} className="px-8 py-10 text-center text-sm font-medium text-on-surface-variant">No active roles found. Create your first role.</td></tr>
              ) : (
                jobs.map((job: any) => (
                  <tr key={job._id} className="group hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-8 py-6">
                      <Link to={`/recruiter/jobs/${job._id}/applicants`} className="block font-bold text-black group-hover:text-secondary transition-colors cursor-pointer">
                        {job?.title || 'Untitled Role'}
                      </Link>
                      <span className="text-xs text-neutral-400">Company: {job?.companyName || 'Not specified'}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter bg-surface-container-high text-on-surface-variant">
                        {job?.skills?.[0] || 'General'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-bold">{job?.location || 'Unspecified'}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {job?.status === 'open' ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-tighter rounded-full border border-green-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-tighter rounded-full border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span> Draft/Closed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 md:py-20 px-6 md:px-12 mt-auto bg-neutral-50 dark:bg-neutral-950 flex flex-col md:flex-row justify-between items-start md:items-center border-t border-neutral-200/20 dark:border-neutral-800/20">
        <div className="mb-8 md:mb-0">
          <span className="text-lg font-black text-black dark:text-white">RoleSync</span>
          <p className="font-inter text-sm tracking-wide leading-relaxed text-neutral-500 dark:text-neutral-400 mt-2">© {new Date().getFullYear()} RoleSync Authority. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap gap-8">
          <a className="font-inter text-sm tracking-wide leading-relaxed text-neutral-500 dark:text-neutral-400 hover:text-red-700 dark:hover:text-red-500 transition-colors duration-300" href="#">Privacy Policy</a>
          <a className="font-inter text-sm tracking-wide leading-relaxed text-neutral-500 dark:text-neutral-400 hover:text-red-700 dark:hover:text-red-500 transition-colors duration-300" href="#">Terms of Service</a>
        </div>
      </footer>

      <CreateJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <BulkUploadModal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} />
    </div>
  );
};