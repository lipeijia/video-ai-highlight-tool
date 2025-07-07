'use client';
import { formatTime } from '@/lib/utils';
import { TranscriptItem } from '@/types/video';

interface HighlightMarkerProps {
  /** 轉錄項目數據 */
  item: TranscriptItem;
  /** 影片總時長 */
  totalDuration: number;
  /** 跳轉到指定時間的回調函數 */
  onJumpToTime: (time: number) => void;
}

export default function HighlightMarker({
  item,
  totalDuration,
  onJumpToTime
}: HighlightMarkerProps) {
  const leftPercent = (item.startTime / totalDuration) * 100;
  const widthPercent = ((item.endTime - item.startTime) / totalDuration) * 100;

  return (
    <div
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
          onJumpToTime(item.startTime);
        }}
      />

      {/* 懸浮提示 */}
      <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 max-w-xs'>
        <div className='font-semibold'>
          {formatTime(item.startTime)} - {formatTime(item.endTime)}
        </div>
        <div className='text-gray-300'>
          {item.text.substring(0, 40)}...
        </div>
      </div>
    </div>
  );
}
