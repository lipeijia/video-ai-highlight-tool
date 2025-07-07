// src/app/page.tsx
'use client';

import { useState } from 'react';
import { VideoHighlight } from '@/types/video';

import { VideoUpload,VideoTranscript } from '@/features';

export default function HomePage() {
  const [video, setVideo] = useState<VideoHighlight | null>(null);

  
  // 如果沒有影片，顯示上傳區域
  if (!video) {
  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8'>
        {/* 標題區域 */}
        <div className='mb-8 text-center'>
          <h1 className='text-4xl font-bold mb-4 text-primary'>
            Video AI Highlight Tool
          </h1>
          <p className='text-lg text-muted-foreground'>
            上傳影片，AI 自動生成字幕和重點片段
          </p>
        </div>

        {/* 上傳區域 */}
        <div className='mb-8'>
          <VideoUpload onVideoProcessed={setVideo} />
        </div>
      </div>
    </div>
  )
};

// 如果有影片，顯示轉錄內容
return (
    <VideoTranscript video={video}/>
)

}
