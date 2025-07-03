export interface VideoHighlight {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  highlights: {
    id: string;
    startTime: number;
    endTime: number;
    description: string;
    confidence: number;
  }[];
  createdAt: string;
}

// Mock 數據
const mockVideos: VideoHighlight[] = [
  {
    id: '1',
    title: '足球比賽精彩片段',
    description: '2024年世界盃決賽精彩時刻',
    thumbnail: 'https://via.placeholder.com/300x200',
    duration: 5400, // 90 minutes in seconds
    highlights: [
      {
        id: 'h1',
        startTime: 300,
        endTime: 320,
        description: '精彩進球時刻',
        confidence: 0.95
      },
      {
        id: 'h2',
        startTime: 1200,
        endTime: 1230,
        description: '關鍵防守',
        confidence: 0.88
      }
    ],
    createdAt: '2024-07-04T10:00:00Z'
  },
  {
    id: '2',
    title: '籃球比賽亮點',
    description: 'NBA總決賽第七場',
    thumbnail: 'https://via.placeholder.com/300x200',
    duration: 2880, // 48 minutes
    highlights: [
      {
        id: 'h3',
        startTime: 600,
        endTime: 615,
        description: '三分球絕殺',
        confidence: 0.92
      }
    ],
    createdAt: '2024-07-03T15:30:00Z'
  }
];

// 模擬 API 延遲
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API 函數
export const mockApi = {
  // 獲取所有影片
  getVideos: async (): Promise<VideoHighlight[]> => {
    await delay(800); // 模擬網路延遲
    return mockVideos;
  },

  // 獲取單一影片
  getVideo: async (id: string): Promise<VideoHighlight | null> => {
    await delay(500);
    return mockVideos.find((video) => video.id === id) || null;
  },

  // 上傳影片並分析（模擬）
  uploadVideo: async (file: File): Promise<VideoHighlight> => {
    await delay(3000); // 模擬分析時間

    const newVideo: VideoHighlight = {
      id: Date.now().toString(),
      title: file.name.replace(/\.[^/.]+$/, ''),
      description: '自動生成的影片分析',
      thumbnail: 'https://via.placeholder.com/300x200',
      duration: Math.floor(Math.random() * 3600) + 300, // 5分鐘到1小時
      highlights: [
        {
          id: `h${Date.now()}`,
          startTime: Math.floor(Math.random() * 300),
          endTime: Math.floor(Math.random() * 300) + 15,
          description: '自動檢測到的精彩片段',
          confidence: Math.random() * 0.3 + 0.7 // 0.7-1.0
        }
      ],
      createdAt: new Date().toISOString()
    };

    mockVideos.push(newVideo);
    return newVideo;
  },

  
};
