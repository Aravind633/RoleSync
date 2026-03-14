import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../config/api';

export const useProfile = () => {
  const queryClient = useQueryClient();

  //  GET: Fetch the logged-in user's profile
  const getProfile = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: async () => {
      const response = await api.get('/profiles/me');
      return response.data.data.profile;
    },
    retry: 0, 
  });

  //  PATCH: Update profile and upload resume
  const updateProfile = useMutation({

    mutationFn: async (formData: FormData) => {
      const response = await api.patch('/profiles/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data.profile;
    },
    onSuccess: () => {
     
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });

  return { getProfile, updateProfile };
};