'use client';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Clock } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface VideoControlsProps {
  /** 是否正在播放 */
  isPlaying: boolean;
  /** 當前播放時間 */
  currentTime: number;
  /** 影片總時長 */
  duration: number;
  /** 影片總時長（來自 video 物件） */
  videoDuration?: number;
  /** 切換播放/暫停 */
  onTogglePlay: () => void;
  /** 跳到上一段 */
  onSkipBack: () => void;
  /** 跳到下一段 */
  onSkipForward: () => void;
}

export default function VideoControls({
  isPlaying,
  currentTime,
  duration,
  videoDuration,
  onTogglePlay,
  onSkipBack,
  onSkipForward
}: VideoControlsProps) {
  const totalDuration = duration > 0 ? duration : videoDuration ?? 0;

  return (
    <div className='flex items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg'>
      <div className='flex items-center gap-2'>
        <Button variant='outline' size='sm' onClick={onSkipBack}>
          <SkipBack className='w-4 h-4' />
        </Button>
        <Button variant='outline' size='sm' onClick={onTogglePlay}>
          {isPlaying ? (
            <Pause className='w-4 h-4' />
          ) : (
            <Play className='w-4 h-4' />
          )}
        </Button>
        <Button variant='outline' size='sm' onClick={onSkipForward}>
          <SkipForward className='w-4 h-4' />
        </Button>
      </div>

      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <Clock className='w-4 h-4' />
        <span className='font-mono'>
          {formatTime(currentTime)} / {formatTime(totalDuration)}
        </span>
      </div>
    </div>
  );
}
