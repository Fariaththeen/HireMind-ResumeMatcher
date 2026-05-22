import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resumesApi } from '../services/api';

export function useResumes(skip = 0, limit = 10) {
  return useQuery({
    queryKey: ['resumes', skip, limit],
    queryFn: () => resumesApi.getAll(skip, limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUploadResume() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ file, candidateName }: { file: File; candidateName?: string }) =>
      resumesApi.upload(file, candidateName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => resumesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
}
