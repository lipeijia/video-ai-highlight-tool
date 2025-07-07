'use client';
import { Progress } from '@/components/ui/progress';
import { TranscriptItem } from '@/types/video';
import HighlightMarker from './HighlightMarker';

interface ProgressBarProps {
  /** 當前播放時間 */
  currentTime: number;
  /** 影片總時長 */
  totalDuration: number;
  /** 轉錄文字列表（用於高亮標記） */
  transcript: TranscriptItem[];
  /** 跳轉到指定時間的回調函數 */
  onJumpToTime: (time: number) => void;
}

export default function ProgressBar({
  currentTime,
  totalDuration,
  transcript,
  onJumpToTime
}: ProgressBarProps) {
  return (
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
  );
}
