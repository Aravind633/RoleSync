import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../config/api';

export const useJobs = () => {
  const queryClient = useQueryClient();

  //  GET: Fetch all open jobs (For Candidates)
  const getAllJobs = useQuery({
    queryKey: ['jobs', 'all'],
    queryFn: async () => {
      const response = await api.get('/jobs');
      return response.data.data.jobs;
    },
  });

  //  GET: Fetch jobs posted by the logged-in recruiter
  const getMyJobs = useQuery({
    queryKey: ['jobs', 'myJobs'],
    queryFn: async () => {
      const response = await api.get('/jobs/my-jobs');
      return response.data.data.jobs;
    },
  });

  //  POST : Create a new job
  const createJob = useMutation({
    mutationFn: async (jobData: any) => {
      const response = await api.post('/jobs', jobData);
      return response.data.data.job;
    },
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['jobs', 'myJobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs', 'all'] });
    },
  });

  return { getAllJobs, getMyJobs, createJob };
};