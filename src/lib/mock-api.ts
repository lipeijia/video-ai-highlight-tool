// src/lib/mock-api.ts
import type {
  VideoHighlight,
  TranscriptItem,
  UploadProgress
} from '@/types/video';

// 簡單的記憶體存儲
let currentVideo: VideoHighlight | null = null;

export const mockApi = {
  // 上傳影片並生成轉錄
  uploadVideo: async (
    file: File,
    onProgress: (progress: UploadProgress) => void
  ): Promise<VideoHighlight> => {
    const videoId = `video_${Date.now()}`;

    // 模擬上傳進度
    const stages = [
      { progress: 20, stage: 'uploading' as const, message: '上傳影片中...' },
      {
        progress: 40,
        stage: 'processing' as const,
        message: 'AI 分析影片內容...'
      },
      {
        progress: 60,
        stage: 'transcribing' as const,
        message: '生成字幕中...'
      },
      { progress: 80, stage: 'analyzing' as const, message: '分析重點片段...' },
      { progress: 100, stage: 'completed' as const, message: '處理完成！' }
    ];

    for (const stage of stages) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onProgress(stage);
    }

    // 生成模擬的轉錄數據
    const transcript: TranscriptItem[] = [
      // Introduction 部分
      {
        id: '1',
        startTime: 0,
        endTime: 5,
        text: 'Welcome to our product demonstration.',
        speaker: 'Presenter',
        confidence: 0.95,
        isHighlight: false,
        segment: 'Introduction'
      },
      {
        id: '2',
        startTime: 5,
        endTime: 10,
        text: "Today, we'll be showcasing our latest innovation.",
        speaker: 'Presenter',
        confidence: 0.92,
        isHighlight: true, // 重點片段
        segment: 'Introduction'
      },

      // Key Features 部分
      {
        id: '3',
        startTime: 15,
        endTime: 20,
        text: 'Our product has three main features.',
        speaker: 'Presenter',
        confidence: 0.88,
        isHighlight: false,
        segment: 'Key Features'
      },
      {
        id: '4',
        startTime: 20,
        endTime: 25,
        text: "First, it's incredibly easy to use.",
        speaker: 'Presenter',
        confidence: 0.9,
        isHighlight: false,
        segment: 'Key Features'
      },
      {
        id: '5',
        startTime: 25,
        endTime: 30,
        text: "Second, it's highly efficient.",
        speaker: 'Presenter',
        confidence: 0.93,
        isHighlight: false,
        segment: 'Key Features'
      },
      {
        id: '6',
        startTime: 30,
        endTime: 35,
        text: "And third, it's cost-effective.",
        speaker: 'Presenter',
        confidence: 0.91,
        isHighlight: false,
        segment: 'Key Features'
      },

      // Demonstration 部分
      {
        id: '7',
        startTime: 40,
        endTime: 45,
        text: 'Let me show you how it works.',
        speaker: 'Presenter',
        confidence: 0.87,
        isHighlight: false,
        segment: 'Demonstration'
      },
      {
        id: '8',
        startTime: 45,
        endTime: 50,
        text: 'Simply press this button to start.',
        speaker: 'Presenter',
        confidence: 0.94,
        isHighlight: true, // 重點片段
        segment: 'Demonstration'
      },
      {
        id: '9',
        startTime: 50,
        endTime: 55,
        text: 'The interface is intuitive and user-friendly.',
        speaker: 'Presenter',
        confidence: 0.89,
        isHighlight: true, // 重點片段
        segment: 'Demonstration'
      },

      // Conclusion 部分
      {
        id: '10',
        startTime: 60,
        endTime: 65,
        text: 'In conclusion, our product is a game-changer.',
        speaker: 'Presenter',
        confidence: 0.96,
        isHighlight: false,
        segment: 'Conclusion'
      },
      {
        id: '11',
        startTime: 65,
        endTime: 70,
        text: "We're excited to bring this to market.",
        speaker: 'Presenter',
        confidence: 0.93,
        isHighlight: true, // 重點片段
        segment: 'Conclusion'
      },
      {
        id: '12',
        startTime: 70,
        endTime: 75,
        text: 'Thank you for your attention.',
        speaker: 'Presenter',
        confidence: 0.97,
        isHighlight: false,
        segment: 'Conclusion'
      }
    ];

    // 創建影片物件
    const newVideo: VideoHighlight = {
      id: videoId,
      title: file.name.replace(/\.[^/.]+$/, ''), // 移除副檔名
      duration: 75, // 總長度 75 秒
      uploadedAt: new Date().toISOString(),
      processingStatus: 'completed',
      thumbnailUrl: '/api/placeholder/320/180',
      transcript: transcript
    };

    // 存儲到記憶體
    currentVideo = newVideo;

    return newVideo;
  },

  // 獲取單一影片數據
  getSingleVideoData: (videoId: string): VideoHighlight | null => {
    return currentVideo?.id === videoId ? currentVideo : null;
  }
};
