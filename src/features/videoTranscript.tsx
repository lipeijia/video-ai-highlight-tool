'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipBack, SkipForward, Clock } from 'lucide-react';
import { VideoHighlight, TranscriptItem } from '@/types/video';
// 使用標準 HTML5 video 元素
import TranscriptList from '@/components/TranscriptList';


interface VideoTranscriptProps {
  video?: VideoHighlight;
}


//TODO: 拆分成多個組件
//1. ✅ TranscriptList：顯示轉錄列表 (已完成)
//2. TranscriptItem：單個轉錄項目
//3. VideoPlayer：顯示視頻播放器和控制
//4. HighlightMarker：顯示高亮片段標記
//5. ProgressBar：顯示進度條和高亮片段



export default function VideoTranscript({ video }: VideoTranscriptProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedHighlights, setSelectedHighlights] = useState<Set<string>>(
    new Set()
  );
  const [activeTranscriptId, setActiveTranscriptId] = useState<string | null>(
    null
  );

  const videoRef = useRef<HTMLVideoElement>(null);

  
  const transcript = useMemo(() => (video ? video.transcript : []), [video]);
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


  // 初始重點
  useEffect(() => {
    if (video && video.transcript) {
      video.transcript.forEach((item) => {
        if (item.isHighlight) {
          setSelectedHighlights((prev) => prev.add(item.id));
        }
      });
    }
  }, [video]);

  /* useEffect */
  // 更新當前播放時間
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 0.1;
          // 修正：到達結尾時直接返回結尾時間，不重置為 0
          if (!video) return newTime;
          return newTime >= video.duration
            ? video.duration
            : newTime;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, video, video?.duration]);

  // 當前播放完成，停止播放
  useEffect(() => {
    if (video && currentTime >= video.duration) {
      setIsPlaying(false);
    }
  }, [currentTime, video]);

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

  /* Functions */
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  // 使用原生 HTML5 video API
  const jumpToTime = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    setCurrentTime(time);
  };

  const skipBack = () => {
    const currentIndex = transcript.findIndex(
      (item) => currentTime >= item.startTime && currentTime <= item.endTime
    );

    if (currentIndex > 0) {
      const newTime = transcript[currentIndex - 1].startTime;
      jumpToTime(newTime);
    } else {
      jumpToTime(0);
    }
  };

  const skipForward = () => {
    const nextItem = transcript.find((item) => item.startTime > currentTime);

    if (nextItem) {
      jumpToTime(nextItem.startTime);
    } else {
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

  // HTML5 video 事件處理函數
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      console.log('Video duration:', videoRef.current.duration);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(duration);
  };

  return (
    <div className='container flex flex-col lg:flex-row gap-6 h-full'>
      {/* 左側：typescripts */}
      <div className='order-2 lg:order-1 lg:w-1/2 h-full flex flex-col'>
        <h3 className='scroll-m-20 text-3xl font-semibold tracking-tight my-4'>
          Transcripts
        </h3>

        <TranscriptList
          groupedTranscript={groupedTranscript}
          selectedHighlights={selectedHighlights}
          activeTranscriptId={activeTranscriptId}
          onToggleHighlight={toggleHighlight}
          onJumpToTime={jumpToTime}
        />
      </div>

      {/* 右側：preview  將這整個區域變成 sticky*/}

      <div className='flex flex-col order-1 lg:order-2 lg:w-1/2 sticky align-start top-4 z-40 lg:static lg:z-auto bg-background/95 backdrop-blur-sm lg:bg-transparent p-4 lg:p-0 rounded-lg lg:rounded-none space-y-4 '>
        {/* 影片播放器 */}
        <h3 className='scroll-m-20 text-3xl font-semibold tracking-tight my-4 lg:block hidden'>
          Preview
        </h3>
        <div
          className='relative aspect-video bg-black overflow-hidden cursor-pointer'
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src="/videos/calude.mp4"
            className='w-full h-full object-cover'
            controls={false}
            playsInline
            preload='metadata'
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            onError={(error) => {
              console.error('Video error:', error);
            }}
          />

          {/* 示例標籤 */}
          <div className='absolute top-2 left-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded text-xs font-medium'>
            示例影片
          </div>

          {/* 暫停時的封面和播放按鈕 */}
          {!isPlaying && (
            <div className='absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm'>
              <div className='bg-white/20 hover:bg-white/30 text-white border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-110 rounded-full p-4'>
                <Play className='w-8 h-8 ml-1' />
              </div>

              <div className='absolute bottom-20 left-4 right-4 text-center'>
                <p className='text-white/80 text-sm'>點擊任意位置開始播放</p>
              </div>
            </div>
          )}

          {/* 播放時的暫停提示 */}
          {isPlaying && (
            <div className='absolute inset-0 bg-transparent hover:bg-black/20 transition-all duration-200 group'>
              <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                <div className='bg-black/60 text-white rounded-full p-3 backdrop-blur-sm'>
                  <Pause className='w-6 h-6' />
                </div>
              </div>
            </div>
          )}

          {/* 字幕疊加 */}
          {isPlaying && currentSubtitle && (
            <div className='absolute bottom-10 left-4 right-4 pointer-events-none'>
              <div className='bg-black/80 text-white px-4 py-2 rounded-md text-center'>
                <p className='text-sm leading-relaxed'>
                  {currentSubtitle.text}
                </p>
              </div>
            </div>
          )}

          {/* 增強的進度條與高亮標記 */}
          <div className='absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50'>
            <div className='relative'>
              {/* 可點擊的進度條 */}
              <div
                className='cursor-pointer'
                onClick={(e) => {
                  e.stopPropagation();

                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const clickPercent = clickX / rect.width;
                  const videoDuration = duration || video?.duration || 0;
                  const newTime = clickPercent * videoDuration;

                  console.log('Progress clicked:', {
                    newTime,
                    duration: videoDuration
                  });
                  jumpToTime(newTime);
                }}
              >
                <Progress
                  value={
                    duration > 0
                      ? (currentTime / duration) * 100
                      : (currentTime / (video?.duration || 1)) * 100
                  }
                  className='w-full h-3 hover:h-4 transition-all [&>div]:bg-white/80 [&]:bg-gray-600/50'
                />
              </div>

              {/* 高亮片段標記 */}
              {video &&
                (duration > 0 ? duration : video.duration) > 0 &&
                transcript
                  .filter((item) => item.isHighlight)
                  .map((item) => {
                    const videoDuration =
                      duration > 0 ? duration : video.duration;
                    const leftPercent = (item.startTime / videoDuration) * 100;
                    const widthPercent =
                      ((item.endTime - item.startTime) / videoDuration) * 100;

                    return (
                      <div
                        key={item.id}
                        className='absolute top-1/2 transform -translate-y-1/2 group'
                        style={{
                          left: `${leftPercent}%`,
                          width: `${widthPercent}%`,
                          height: '12px'
                        }}
                      >
                        <div
                          className='h-full bg-primary rounded cursor-pointer hover:bg-primary/80 transition-colors hover:scale-105 shadow-sm'
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Highlight clicked:', item.startTime);
                            jumpToTime(item.startTime);
                          }}
                        />

                        {/* 懸浮提示 */}
                        <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 max-w-xs'>
                          <div className='font-semibold'>
                            {formatTime(item.startTime)} -{' '}
                            {formatTime(item.endTime)}
                          </div>
                          <div className='text-gray-300'>
                            {item.text.substring(0, 40)}...
                          </div>
                        </div>
                      </div>
                    );
                  })}

              {/* 當前播放位置指示器 */}
              {video && (duration > 0 ? duration : video.duration) > 0 && (
                <div
                  className='absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-primary shadow-lg pointer-events-none transition-all duration-100'
                  style={{
                    left: `${
                      (currentTime /
                        (duration > 0 ? duration : video.duration)) *
                      100
                    }%`,
                    marginLeft: '-8px'
                  }}
                />
              )}
            </div>
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
              {formatTime(currentTime)} /{' '}
              {formatTime(duration > 0 ? duration : video?.duration ?? 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}