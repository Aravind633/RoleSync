
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../config/api';

export const useJobs = () => {
  const queryClient = useQueryClient();

  // 📥 GET: Fetch all open jobs (For Candidates)
  const getAllJobs = useQuery({
    queryKey: ['jobs', 'all'],
    queryFn: async () => {
      const response = await api.get('/jobs');
      return response.data.data.jobs;
    },
  });

  // 📥 GET: Fetch jobs posted by the logged-in recruiter
  const getMyJobs = useQuery({
    queryKey: ['jobs', 'myJobs'],
    queryFn: async () => {
      const response = await api.get('/jobs/my-jobs');
      return response.data.data.jobs;
    },
  });

  // 📤 POST: Create a single new job
  const createJob = useMutation({
    mutationFn: async (jobData: any) => {
      const response = await api.post('/jobs', jobData);
      return response.data.data.job;
    },
    onSuccess: () => {
      // Automatically refresh the job lists after a successful creation
      queryClient.invalidateQueries({ queryKey: ['jobs', 'myJobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs', 'all'] });
    },
  });

  // 📤 POST: Bulk upload multiple jobs from a JSON file
  const bulkUpload = useMutation({
    mutationFn: async (jobsArray: any[]) => {
      const response = await api.post('/jobs/bulk', jobsArray);
      return response.data;
    },
    onSuccess: () => {
      // Automatically refresh the job lists after a successful bulk upload
      queryClient.invalidateQueries({ queryKey: ['jobs', 'myJobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs', 'all'] });
    },
  });

  return { getAllJobs, getMyJobs, createJob, bulkUpload };
};