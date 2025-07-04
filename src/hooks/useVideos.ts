// src/hooks/useVideos.ts
import { useMutation } from '@tanstack/react-query';
import { mockApi } from '@/lib/mock-api';
import type {  UploadProgress } from '@/types/video';
import { useState } from 'react';

// 上傳影片 Hook
export function useVideoUpload() {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null
  );

  const mutation = useMutation({
    mutationFn: (file: File) => {
      setUploadProgress({
        progress: 0,
        stage: 'uploading',
        message: '準備上傳...'
      });

      return mockApi.uploadVideo(file, setUploadProgress);
    },
    onSuccess: () => {
      // 上傳成功，清除進度
      setTimeout(() => setUploadProgress(null), 2000);
    },
    onError: () => {
      setUploadProgress(null);
    }
  });

  return {
    ...mutation,
    uploadProgress
  };
}

// 獲取轉錄文字 - 單一影片數據
export function useTranscript(videoId: string) {
  return {
    data: mockApi.getSingleVideoData(videoId)?.transcript || null,
    isLoading: false,
    error: null
  };
}

// 獲取重點片段 - 單一影片數據
export function useHighlights(videoId: string) {
  const videoData = mockApi.getSingleVideoData(videoId);
  return {
    data: videoData?.transcript.filter((t) => t.isHighlight) || [],
    isLoading: false,
    error: null
  };
}
