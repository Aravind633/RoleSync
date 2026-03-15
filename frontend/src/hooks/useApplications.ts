import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../core/utils/api'; 

export const useApplications = () => {
  const queryClient = useQueryClient();

  //  Fetch all jobs the candidate has applied to
  const getMyApplications = useQuery({
    queryKey: ['myApplications'],
    queryFn: async () => {
      const { data } = await api.get('/applications/my-applications');
      return data.data.applications;
    },
  });

  const applyForJob = useMutation({
    mutationFn: async (jobId: string) => {
      const { data } = await api.post(`/applications/apply/${jobId}`);
      return data;
    },
    onSuccess: () => {
      // Refresh the applications list instantly after applying
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
    },
  });

  // Fetch all applicants for a specific job
  const getJobApplicants = (jobId: string) => useQuery({
    queryKey: ['jobApplicants', jobId],
    queryFn: async () => {
      const { data } = await api.get(`/applications/job/${jobId}`);
      return data.data.applications;
    },
    enabled: !!jobId,
  });

  //  Change applicant status (shortlisted, rejected)
  const updateStatus = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string, status: string }) => {
      const { data } = await api.patch(`/applications/${applicationId}/status`, { status });
      return data;
    },
    onSuccess: (_, variables) => {
      // Refresh the applicants list to show the new status
      queryClient.invalidateQueries({ queryKey: ['jobApplicants'] });
    },
  });

  return {
    getMyApplications,
    applyForJob,
    getJobApplicants,
    updateStatus,
  };
};