'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipBack, SkipForward, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VideoHighlight, TranscriptItem } from '@/types/video';

interface VideoTranscriptProps {
  video?: VideoHighlight;
}

// 模擬資料
const mockTranscript: TranscriptItem[] = [
  {
    id: '1',
    startTime: 0,
    endTime: 5,
    text: 'Welcome to our product demonstration. This is an introduction to our latest innovation.',
    isHighlight: false,
    segment: 'Introduction'
  },
  {
    id: '2',
    startTime: 5,
    endTime: 12,
    text: "Today, we'll be showcasing our latest AI-powered tool that revolutionizes video content creation.",
    isHighlight: true,
    segment: 'Introduction'
  },
  {
    id: '3',
    startTime: 15,
    endTime: 22,
    text: 'Our product has three main features that make it stand out in the market.',
    isHighlight: true,
    segment: 'Key Features'
  },
  {
    id: '4',
    startTime: 22,
    endTime: 28,
    text: "First, it's incredibly easy to use with a modern and intuitive interface.",    isHighlight: false,
    segment: 'Key Features'
  },
  {
    id: '5',
    startTime: 28,
    endTime: 35,
    text: "Second, it's highly efficient with AI-powered automation capabilities.",
    isHighlight: true,
    segment: 'Key Features'
  },
  {
    id: '6',
    startTime: 35,
    endTime: 42,
    text: "And third, it's cost-effective with flexible pricing plans for every need.",
    isHighlight: false,
    segment: 'Key Features'
  },
  {
    id: '7',
    startTime: 45,
    endTime: 52,
    text: 'Let me show you how it works in a real-world scenario.',
    isHighlight: true,
    segment: 'Demonstration'
  },
  {
    id: '8',
    startTime: 52,
    endTime: 58,
    text: 'Simply upload your video file and our AI will automatically process it.',
    isHighlight: false,
    segment: 'Demonstration'
  },
  {
    id: '9',
    startTime: 58,
    endTime: 65,
    text: 'The system generates transcripts, identifies key moments, and creates highlights.',
    isHighlight: true,
    segment: 'Demonstration'
  },
  {
    id: '10',
    startTime: 68,
    endTime: 75,
    text: 'Thank you for watching this demonstration. We hope you found it informative.',
    isHighlight: false,
    segment: 'Conclusion'
  }
];

const mockVideo: VideoHighlight = {
  id: 'demo-video',
  title: 'AI Video Tool Demo',
  duration: 75,
  uploadedAt: new Date().toISOString(),
  processingStatus: 'completed',
  transcript: mockTranscript
};

// TODO: 使用實際的 VideoHighlight 類型替換 mockVideo
//TODO: 影片porgress 要顯示highlight片段的時間戳記，點擊後跳轉到該時間點


export default function VideoTranscript({ video }: VideoTranscriptProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedHighlights, setSelectedHighlights] = useState<Set<string>>(
    new Set()
  );
  const [activeTranscriptId, setActiveTranscriptId] = useState<string | null>(
    null
  );

  const transcriptRef = useRef<HTMLDivElement>(null);

  const currentVideo = video || mockVideo;
  const transcript = currentVideo.transcript;
  // 按分段組織轉錄文字
  const groupedTranscript = useMemo(() => {
    return transcript.reduce((acc, item) => {
      const segment = item.segment || 'Other';
      if (!acc[segment]) {
        acc[segment] = [];
      }
      acc[segment].push(item);
      return acc;
    }, {} as Record<string, TranscriptItem[]>);
  }, [transcript]);

  /* useEffect */
  // 更新當前播放時間
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 0.1;
          // 修正：到達結尾時直接返回結尾時間，不重置為 0
          return newTime >= currentVideo.duration
            ? currentVideo.duration
            : newTime;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentVideo.duration]);

  // 當前播放完成，停止播放
  useEffect(() => {
    if (currentTime >= currentVideo.duration) {
      setIsPlaying(false);
    }
  }, [currentTime, currentVideo.duration]);

  // 直接根據時間找當前項目
  // 使用 useMemo 來穩定當前字幕項目
  const currentSubtitle = useMemo(() => {
    return transcript.find(
      (item) => currentTime >= item.startTime && currentTime <= item.endTime
    );
  }, [currentTime, transcript]);

  // 修改 useEffect 使用 useMemo 的結果
  useEffect(() => {
    setActiveTranscriptId(currentSubtitle?.id || null);
  }, [currentSubtitle]);

  // 自動滾動到當前項目
  useEffect(() => {
    if (activeTranscriptId && transcriptRef.current) {
      const activeElement = transcriptRef.current.querySelector(
        `[data-transcript-id="${activeTranscriptId}"]`
      );
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [activeTranscriptId]);

  /* Functions */
  // 播放控制函數
  const togglePlay = () => {
    if (currentTime >= currentVideo.duration) {
      // 播放完畢，重新開始
      setCurrentTime(0);
      setIsPlaying(true);
    } else if (isPlaying) {
      // 正在播放，暫停
      setIsPlaying(false);
    } else {
      // 暫停中，繼續播放
      setIsPlaying(true);
    }
  };

  // 跳轉到指定時間
  const jumpToTime = (time: number) => {
    setCurrentTime(time);
    // 如果跳轉到結尾，不自動播放
    if (time >= currentVideo.duration) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const skipBack = () => {
    const currentIndex = transcript.findIndex(
      (item) => currentTime >= item.startTime && currentTime <= item.endTime
    );

    if (currentIndex > 0) {
      setCurrentTime(transcript[currentIndex - 1].startTime);
    } else {
      setCurrentTime(0);
    }
  };

  const skipForward = () => {
    const nextItem = transcript.find((item) => item.startTime > currentTime);

    if (nextItem) {
      setCurrentTime(nextItem.startTime);
    } else {
      setCurrentTime(currentVideo.duration);
      setIsPlaying(false);
    }
  };

  // 選擇/取消選擇重點片段
  const toggleHighlight = (itemId: string) => {
    const newSelected = new Set(selectedHighlights);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedHighlights(newSelected);
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 h-full'>
      {/* 左側：轉錄文字編輯區 */}
      <div className='h-full flex flex-col'>
        <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight my-4'>
          轉錄文字編輯
        </h3>

        <div className='flex-1 overflow-hidden'>
          <div
            ref={transcriptRef}
            className='space-y-6 overflow-y-auto h-full pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent'
          >
            {Object.entries(groupedTranscript).map(([segment, items]) => (
              <div key={segment} className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
                    {segment}
                  </h3>
                </div>

                {items.map((item) => (
                  <div
                    key={item.id}
                    data-transcript-id={item.id}
                    className={cn(
                      'group relative p-4 rounded-lg transition-all duration-50 cursor-pointer',
                      // 基礎樣式
                      'border hover:border-primary/60 hover:bg-primary/10 ring-2 ring-transparent',
                      'after:absolute after:top-3 after:right-3 after:w-2 after:h-2 after:border after:rounded-full',

                      // 已選擇項目
                      selectedHighlights.has(item.id) && [
                        'bg-primary/25 border-primary/0 shadow-md',
                        'after:border-primary/70'
                      ],

                      // 當前播放項目
                      activeTranscriptId === item.id && [
                        'bg-primary/0 border-primary shadow-sm ring-primary/30',
                        'after:animate-pulse after:w-3 after:h-3 after:shadow-md',
                        'after:bg-primary after:shadow-sm after:ring-1 after:ring-primary/30'
                      ],

                      // 同時被選擇且正在播放
                      selectedHighlights.has(item.id) &&
                        activeTranscriptId === item.id && [
                          'bg-primary/25 border-primary shadow-lg ring-primary/30'
                        ]
                    )}
                    onClick={() => toggleHighlight(item.id)}
                  >
                    <div className='flex items-start justify-between gap-3'>
                      <div className='flex gap-2 items-center'>
                        <span
                          className={cn(
                            'font-mono bg-secondary px-2 py-1 rounded text-xs text-muted-foreground',
                            'hover:text-primary',
                            // 如果是當前播放時間，可以加強顯示
                            activeTranscriptId === item.id &&
                              'text-primary font-semibold'
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            jumpToTime(item.startTime);
                          }}
                        >
                          {formatTime(item.startTime)}
                        </span>
                        <p
                          className={cn(
                            'text-sm leading-relaxed text-foreground',
                            activeTranscriptId === item.id &&
                              'text-black font-semibold'
                          )}
                        >
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右側：預覽區 */}
      <div className='h-full flex flex-col'>
        <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight my-4'>
          重點片段
        </h3>
        <div className='flex-1 flex flex-col gap-4'>
          {/* 影片播放器 */}
          <div className='relative aspect-video bg-black rounded-lg overflow-hidden'>
            <div
              className='w-full h-full bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center'
              style={{
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className='absolute inset-0 bg-black/40' />

              {/* 字幕疊加 - 使用更穩定的邏輯 */}
              <div className='absolute bottom-4 left-4 right-4'>
                {currentSubtitle && (
                  <div
                    key={currentSubtitle.id}
                    className='bg-black/80 text-white px-4 py-2 rounded-md text-center transition-all duration-200 ease-in-out animate-in fade-in-0'
                  >
                    <p className='text-sm leading-relaxed'>
                      {currentSubtitle.text}
                    </p>
                  </div>
                )}
              </div>

              {/* 播放按鈕疊加 */}
              <Button
                variant='secondary'
                size='lg'
                onClick={togglePlay}
                className='relative z-10 bg-black/50 hover:bg-black/70 text-white border-white/20'
              >
                {isPlaying ? (
                  <Pause className='w-6 h-6' />
                ) : (
                  <Play className='w-6 h-6' />
                )}
              </Button>
            </div>

            {/* 進度條 */}
            <div className='absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50'>
              <Progress
                value={(currentTime / currentVideo.duration) * 100}
                className='w-full h-2'
              />
            </div>
          </div>

          {/* 播放控制 */}
          <div className='flex items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg'>
            <div className='flex items-center gap-2'>
              <Button variant='outline' size='sm' onClick={skipBack}>
                <SkipBack className='w-4 h-4' />
              </Button>
              <Button variant='outline' size='sm' onClick={togglePlay}>
                {isPlaying ? (
                  <Pause className='w-4 h-4' />
                ) : (
                  <Play className='w-4 h-4' />
                )}
              </Button>
              <Button variant='outline' size='sm' onClick={skipForward}>
                <SkipForward className='w-4 h-4' />
              </Button>
            </div>

            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Clock className='w-4 h-4' />
              <span className='font-mono'>
                {formatTime(currentTime)} / {formatTime(currentVideo.duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}