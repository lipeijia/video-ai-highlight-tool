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
      {
        id: '1',
        startTime: 0,
        endTime: 3,
        text: 'Welcome to our product demonstration.',
        isHighlight: false,
        segment: 'Introduction'
      },
      {
        id: '2',
        startTime: 5,
        endTime: 10,
        text: "Today, we'll be showcasing our latest innovation.",
        isHighlight: true,
        segment: 'Introduction'
      },
      {
        id: '3',
        startTime: 15,
        endTime: 22,
        text: 'Our product has three main features.',
        isHighlight: false,
        segment: 'Key Features'
      },
      {
        id: '4',
        startTime: 20,
        endTime: 23,
        text: "First, it's incredibly easy to use.",
        isHighlight: false,
        segment: 'Key Features'
      },
      {
        id: '5',
        startTime: 25,
        endTime: 28,
        text: "Second, it's highly efficient.",
        isHighlight: false,
        segment: 'Key Features'
      },
      {
        id: '6',
        startTime: 30,
        endTime: 35,
        text: "And third, it's cost-effective.",
        isHighlight: false,
        segment: 'Key Features'
      },
      {
        id: '7',
        startTime: 40,
        endTime: 43,
        text: 'Let me show you how it works.',
        isHighlight: false,
        segment: 'Demonstration'
      },
      {
        id: '8',
        startTime: 45,
        endTime: 48,
        text: 'Simply press this button to start.',
        isHighlight: true,
        segment: 'Demonstration'
      },
      {
        id: '9',
        startTime: 50,
        endTime: 53,
        text: 'The interface is intuitive and user-friendly.',
        isHighlight: true,
        segment: 'Demonstration'
      },
      {
        id: '10',
        startTime: 55,
        endTime: 58,
        text: 'In conclusion, our product is game-changer.',
        isHighlight: false,
        segment: 'Conclusion'
      },
      {
        id: '11',
        startTime: 60,
        endTime: 63,
        text: 'We are excited to bring it to market.',
        isHighlight: true,
        segment: 'Conclusion'
      },
      {
        id: '12',
        startTime: 65,
        endTime: 67,
        text: 'Theank you for your attention.',
        isHighlight: false,
        segment: 'Conclusion'
      }
    ];

    // 創建影片物件
    const newVideo: VideoHighlight = {
      id: videoId,
      title: file.name.replace(/\.[^/.]+$/, ''), // 移除副檔名
      duration: 67, // 總長度 75 秒
      uploadedAt: new Date().toISOString(),
      processingStatus: 'completed',
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
