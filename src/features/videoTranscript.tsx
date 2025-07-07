'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { VideoHighlight, TranscriptItem } from '@/types/video';
import { TranscriptList, VideoPlayer, VideoControls } from '@/components';


interface VideoTranscriptProps {
  video?: VideoHighlight;
}


export default function VideoTranscript({ video }: VideoTranscriptProps) {
  /* State 狀態管理 */
  
  // 當前播放時間（秒）
  const [currentTime, setCurrentTime] = useState(0);
  
  // 影片總時長（秒）- 從 HTML5 video 元素獲取
  const [duration, setDuration] = useState(0);
  
  // 影片播放狀態
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 用戶選擇的高亮片段 ID 集合
  const [selectedHighlights, setSelectedHighlights] = useState<Set<string>>(
    new Set()
  );
  
  // 當前活躍的轉錄項目 ID（用於在列表中高亮顯示）
  const [activeTranscriptId, setActiveTranscriptId] = useState<string | null>(
    null
  );

  // video 元素的 ref，用於直接操作 HTML5 video API
  const videoRef = useRef<HTMLVideoElement>(null);

  /* Computed Values 計算值 */
  
  // 轉錄文字陣列，從 video prop 中提取
  const transcript = useMemo(() => (video ? video.transcript : []), [video]);
  
  // 按分段組織的轉錄文字，用於在 UI 中分組顯示
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


  // 初始化高亮片段選擇狀態
  // 當 video 數據載入時，自動選中所有預設的高亮片段
  useEffect(() => {
    if (video && video.transcript) {
      video.transcript.forEach((item) => {
        if (item.isHighlight) {
          setSelectedHighlights((prev) => prev.add(item.id));
        }
      });
    }
  }, [video]);

  /* useEffect 時間管理相關 */
  // 播放時間更新器
  // 當影片播放時，每 100ms 更新一次當前時間
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

  // 播放完成檢測
  // 當播放時間達到影片結尾時，自動停止播放
  useEffect(() => {
    if (video && currentTime >= video.duration) {
      setIsPlaying(false);
    }
  }, [currentTime, video]);

  // 當前播放時間對應的字幕項目
  // 根據 currentTime 找到當前應該顯示的字幕
  // 使用 useMemo 來穩定當前字幕項目，避免不必要的重新渲染
  const currentSubtitle = useMemo(() => {
    return transcript.find(
      (item) => currentTime >= item.startTime && currentTime <= item.endTime
    );
  }, [currentTime, transcript]);

  // 當前字幕項目變化時更新活躍的轉錄項目 ID
  // 用於在轉錄列表中高亮當前播放的字幕項目
  useEffect(() => {
    setActiveTranscriptId(currentSubtitle?.id || null);
  }, [currentSubtitle]);

  /* Functions 播放控制相關 */
  
  /**
   * 切換播放/暫停狀態
   * 調用原生 HTML5 video 的 play() 或 pause() 方法
   */
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  /**
   * 跳轉到指定時間點
   * 同時更新 video 元素的 currentTime 和 React state
   * @param time 目標時間（秒）
   */
  const jumpToTime = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    setCurrentTime(time);
  };

  /**
   * 跳轉到上一個字幕段落
   * 如果當前不在任何段落中，則跳到開頭
   */
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

  /**
   * 跳轉到下一個字幕段落
   * 如果已是最後一段，則停止播放
   */
  const skipForward = () => {
    const nextItem = transcript.find((item) => item.startTime > currentTime);

    if (nextItem) {
      jumpToTime(nextItem.startTime);
    } else {
      setIsPlaying(false);
    }
  };

  /**
   * 切換高亮片段的選擇狀態
   * 用於用戶手動標記/取消標記重點片段
   * @param itemId 轉錄項目的 ID
   */
  const toggleHighlight = (itemId: string) => {
    const newSelected = new Set(selectedHighlights);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedHighlights(newSelected);
  };

  /* HTML5 video 事件處理函數 */
  
  /**
   * 處理影片時間更新事件
   * 同步 video 元素的 currentTime 到 React state
   */
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  /**
   * 處理影片元數據載入完成事件
   * 獲取影片總時長
   */
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  /**
   * 處理影片開始播放事件
   * 更新播放狀態為 true
   */
  const handlePlay = () => {
    setIsPlaying(true);
  };

  /**
   * 處理影片暫停事件
   * 更新播放狀態為 false
   */
  const handlePause = () => {
    setIsPlaying(false);
  };

  /**
   * 處理影片播放結束事件
   * 停止播放並設置時間為影片結尾
   */
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