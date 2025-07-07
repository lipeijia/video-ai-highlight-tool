'use client';
import { forwardRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { TranscriptItem } from '@/types/video';
import { Progress } from '@/components/ui/progress';
import HighlightMarker from './HighlightMarker';

interface VideoPlayerProps {
  /** 影片來源路徑 */
  src: string;
  /** 是否正在播放 */
  isPlaying: boolean;
  /** 當前播放時間 */
  currentTime: number;
  /** 影片總時長 */
  duration: number;
  /** 當前字幕項目 */
  currentSubtitle?: TranscriptItem;
  /** 轉錄文字列表（用於高亮標記） */
  transcript: TranscriptItem[];
  /** 影片總時長（來自 video 物件） */
  videoDuration?: number;
  /** 切換播放/暫停 */
  onTogglePlay: () => void;
  /** 跳轉到指定時間 */
  onJumpToTime: (time: number) => void;
  /** 時間更新事件 */
  onTimeUpdate: () => void;
  /** 載入元數據事件 */
  onLoadedMetadata: () => void;
  /** 播放事件 */
  onPlay: () => void;
  /** 暫停事件 */
  onPause: () => void;
  /** 播放結束事件 */
  onEnded: () => void;
  /** 錯誤事件 */
  onError: (error: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({
    src,
    isPlaying,
    currentTime,
    duration,
    currentSubtitle,
    transcript,
    videoDuration,
    onTogglePlay,
    onJumpToTime,
    onTimeUpdate,
    onLoadedMetadata,
    onPlay,
    onPause,
    onEnded,
    onError
  }, ref) => {
    const totalDuration = duration > 0 ? duration : videoDuration || 0;

    return (
      <div
        className='relative aspect-video bg-black overflow-hidden cursor-pointer'
        onClick={onTogglePlay}
      >
        <video
          ref={ref}
          src={src}
          className='w-full h-full object-cover'
          controls={false}
          playsInline
          preload='metadata'
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onPlay={onPlay}
          onPause={onPause}
          onEnded={onEnded}
          onError={onError}
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
                const newTime = clickPercent * totalDuration;

                console.log('Progress clicked:', {
                  newTime,
                  duration: totalDuration
                });
                onJumpToTime(newTime);
              }}
            >
              <Progress
                value={
                  totalDuration > 0
                    ? (currentTime / totalDuration) * 100
                    : 0
                }
                className='w-full h-3 hover:h-4 transition-all [&>div]:bg-white/80 [&]:bg-gray-600/50'
              />
            </div>

            {/* 高亮片段標記 */}
            {totalDuration > 0 &&
              transcript
                .filter((item) => item.isHighlight)
                .map((item) => (
                  <HighlightMarker
                    key={item.id}
                    item={item}
                    totalDuration={totalDuration}
                    onJumpToTime={onJumpToTime}
                  />
                ))}

            {/* 當前播放位置指示器 */}
            {totalDuration > 0 && (
              <div
                className='absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-primary shadow-lg pointer-events-none transition-all duration-100'
                style={{
                  left: `${(currentTime / totalDuration) * 100}%`,
                  marginLeft: '-8px'
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
