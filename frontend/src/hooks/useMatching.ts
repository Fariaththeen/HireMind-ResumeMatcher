import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { matchingApi } from '../services/api';
import type { MatchRequest } from '../types';

export function useCalculateScore() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: MatchRequest) => matchingApi.calculateScore(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matchHistory'] });
    },
  });
}

export function useMatchHistory(skip = 0, limit = 10) {
  return useQuery({
    queryKey: ['matchHistory', skip, limit],
    queryFn: () => matchingApi.getHistory(skip, limit),
    staleTime: 60 * 1000, // 1 minute
  });
}
