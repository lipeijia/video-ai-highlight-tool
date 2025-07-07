'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { VideoHighlight, TranscriptItem } from '@/types/video';
// 使用標準 HTML5 video 元素
import { TranscriptList, VideoPlayer, VideoControls } from '@/components';


interface VideoTranscriptProps {
  video?: VideoHighlight;
}


//TODO: 拆分成多個組件
//1. ✅ TranscriptList：顯示轉錄列表 (已完成)
//2. ✅ TranscriptItem：單個轉錄項目 (已完成)
//3. ✅ VideoPlayer：顯示視頻播放器和控制 (已完成)
//4. ✅ VideoControls：播放控制元件 (已完成)
//5. HighlightMarker：顯示高亮片段標記 (在 VideoPlayer 內部)
//6. ProgressBar：顯示進度條和高亮片段 (在 VideoPlayer 內部)



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
        <VideoPlayer
          ref={videoRef}
          src="/videos/calude.mp4"
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          currentSubtitle={currentSubtitle}
          transcript={transcript}
          videoDuration={video?.duration}
          onTogglePlay={togglePlay}
          onJumpToTime={jumpToTime}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onError={(error) => {
            console.error('Video error:', error);
          }}
        />

        <VideoControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          videoDuration={video?.duration}
          onTogglePlay={togglePlay}
          onSkipBack={skipBack}
          onSkipForward={skipForward}
        />
      </div>
    </div>
  );
}