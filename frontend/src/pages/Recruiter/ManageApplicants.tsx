import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApplications } from '../../hooks/useApplications';

export const ManageApplicants = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { getJobApplicants, updateStatus } = useApplications();
  
  const { data: applicants, isLoading, isError } = getJobApplicants(jobId || '');

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    updateStatus.mutate({ applicationId, status: newStatus });
  };

  const columns = [
    { id: 'pending', label: 'Applied' },
    { id: 'reviewed', label: 'Reviewing' },
    { id: 'interviewing', label: 'Interviewing' },
    { id: 'shortlisted', label: 'Offered' },
    { id: 'rejected', label: 'Rejected' },
  ];

  const getApplicantsByStatus = (status: string) => {
    return applicants?.filter((app: any) => app.status === status) || [];
  };

  return (
    <div className="bg-surface text-on-surface antialiased overflow-hidden min-h-screen">
      <style>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      


      <div className="flex h-screen pt-16 md:pt-20">
        
        {/* SideNavBar */}
        <aside className="hidden md:flex fixed left-0 h-full w-64 pt-8 bg-neutral-50 dark:bg-neutral-950 flex-col gap-y-2 px-6 border-r border-neutral-200/50">
          <div className="mb-8 px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center p-1">
                 <span className="material-symbols-outlined text-white text-sm">business</span>
              </div>
              <div>
                <h2 className="font-black text-lg tracking-tighter text-black dark:text-white">Executive Search</h2>
                <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Premium Tier</p>
              </div>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            <Link className="flex items-center gap-3 px-3 py-3 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors rounded-lg font-inter leading-relaxed text-sm" to="/recruiter/dashboard">
              <span className="material-symbols-outlined text-lg">dashboard</span> Command Center
            </Link>
            <a className="flex items-center gap-3 px-3 py-3 text-black dark:text-white font-bold bg-white dark:bg-neutral-800 rounded-lg font-inter leading-relaxed text-sm shadow-sm border border-neutral-200/50" href="#">
              <span className="material-symbols-outlined text-lg">filter_list</span> Pipelines
            </a>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="ml-0 md:ml-64 w-full h-full p-6 md:p-12 overflow-x-auto no-scrollbar">
          
          {/* Header Section */}
          <div className="mb-8 md:mb-12 flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-secondary text-white text-[10px] font-black uppercase tracking-tighter rounded-sm">Hot Role</span>
                <span className="text-neutral-400 text-xs font-medium uppercase tracking-widest">Active Search</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-primary">
                Reviewing Candidates
              </h1>
              <p className="text-neutral-500 mt-2 text-sm max-w-xl leading-relaxed">Managing {applicants?.length || 0} active candidates across global markets.</p>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="flex gap-6 h-[calc(100vh-280px)] min-w-max pb-32">
            
            {isLoading ? (
               <div className="p-10 text-neutral-500">Loading pipeline data...</div>
            ) : isError ? (
               <div className="p-10 text-error">Failed to load applicant pipeline.</div>
            ) : (
              columns.map((col) => {
                const colApplicants = getApplicantsByStatus(col.id);
                // hide rejected conditionally, or keep if u want. let's keep all
                return (
                  <div key={col.id} className="flex-none w-[280px] md:w-[320px] flex flex-col bg-neutral-100 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-6 px-1">
                      <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        {col.label} <span className="bg-white px-2 py-0.5 rounded-full text-[10px] border border-neutral-200">{colApplicants.length}</span>
                      </h3>
                      <span className="material-symbols-outlined text-neutral-400 text-lg cursor-pointer hover:text-black">more_horiz</span>
                    </div>

                    <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar pb-4 h-full">
                      {colApplicants.length === 0 && (
                        <div className="py-6 border-2 border-dashed border-neutral-300 rounded-lg text-center text-xs font-bold text-neutral-400 uppercase tracking-widest">
                          Empty
                        </div>
                      )}
                      
                      {colApplicants.map((app: any) => (
                        <div key={app._id} className="bg-white border border-neutral-200 p-5 rounded-lg cursor-grab hover:border-black transition-colors flex flex-col">
                          <h4 className="font-bold text-sm text-primary mb-1">{app.candidate?.firstName} {app.candidate?.lastName}</h4>
                          <p className="text-xs text-neutral-400 mb-4 truncate">{app.candidate?.email}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 bg-neutral-50 text-[10px] font-bold text-neutral-500 rounded-full">{app.candidate?.experienceYears || 0} Yrs</span>
                            {app.candidate?.skills?.slice(0, 2).map((skill: string, i: number) => (
                              <span key={i} className="px-3 py-1 bg-neutral-50 text-[10px] font-bold text-neutral-500 rounded-full truncate max-w-[80px]">
                                {skill}
                              </span>
                            ))}
                          </div>
                          
                          <div className="mt-auto pt-4 border-t border-neutral-50">
                            <select
                              value={app.status}
                              onChange={(e) => handleStatusChange(app._id, e.target.value)}
                              disabled={updateStatus.isPending}
                              className="w-full bg-surface-container-low border-none text-[10px] font-bold tracking-widest uppercase rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-black cursor-pointer text-on-surface-variant"
                            >
                              <option value="pending">Move to Applied</option>
                              <option value="reviewed">Move to Reviewing</option>
                              <option value="interviewing">Move to Interviewing</option>
                              <option value="shortlisted">Move to Offered</option>
                              <option value="rejected">Move to Rejected</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}

          </div>
        </main>
      </div>

    </div>
  );
};