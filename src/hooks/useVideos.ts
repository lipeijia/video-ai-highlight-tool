// src/hooks/use-videos.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '@/lib/mock-api';

export function useVideos() {
  return useQuery({
    queryKey: ['videos'],
    queryFn: mockApi.getVideos
  });
}

export function useVideo(id: string) {
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => mockApi.getVideo(id),
    enabled: !!id
  });
}

export function useUploadVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.uploadVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    }
  });
}
