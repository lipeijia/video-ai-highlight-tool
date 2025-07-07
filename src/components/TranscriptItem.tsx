'use client';
import { formatTime, cn } from '@/lib/utils';
import { TranscriptItem as TranscriptItemType } from '@/types/video';

interface TranscriptItemProps {
  /** 轉錄項目數據 */
  item: TranscriptItemType;
  /** 是否為選中的高亮片段 */
  isSelected: boolean;
  /** 是否為當前活躍的轉錄項目 */
  isActive: boolean;
  /** 切換高亮片段的回調函數 */
  onToggleHighlight: (itemId: string) => void;
  /** 跳轉到指定時間的回調函數 */
  onJumpToTime: (time: number) => void;
}

export default function TranscriptItem({
  item,
  isSelected,
  isActive,
  onToggleHighlight,
  onJumpToTime
}: TranscriptItemProps) {
  return (
    <div
      data-transcript-id={item.id}
      className={cn(
        'group relative p-4 rounded-lg transition-all duration-50 cursor-pointer',
        'border hover:border-primary/60 hover:bg-primary/10 ring-2 ring-transparent',
        'after:absolute after:top-3 after:right-3 after:w-2 after:h-2 after:border after:rounded-full',

        isSelected && [
          'bg-primary/25 border-primary/0 shadow-md',
          'after:border-primary/70'
        ],

        isActive && [
          'bg-primary/0 border-primary shadow-sm ring-primary/30',
          'after:animate-pulse after:w-3 after:h-3 after:shadow-md',
          'after:bg-primary after:shadow-sm after:ring-1 after:ring-primary/30'
        ],

        isSelected && isActive && [
          'bg-primary/25 border-primary shadow-lg ring-primary/30'
        ]
      )}
      onClick={() => onToggleHighlight(item.id)}
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='flex gap-2 items-center'>
          <span
            className={cn(
              'font-mono bg-secondary px-2 py-1 rounded text-xs text-muted-foreground',
              'hover:text-primary',
              isActive && 'text-primary font-semibold'
            )}
            onClick={(e) => {
              e.stopPropagation();
              onJumpToTime(item.startTime);
            }}
          >
            {formatTime(item.startTime)}
          </span>
          <p
            className={cn(
              'text-sm leading-relaxed text-foreground',
              isActive && 'text-black font-semibold'
            )}
          >
            {item.text}
          </p>
        </div>
      </div>
    </div>
  );
}
