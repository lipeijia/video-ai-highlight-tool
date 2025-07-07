'use client';
import { useRef, useEffect } from 'react';
import { formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { TranscriptItem } from '@/types/video';

interface TranscriptListProps {
  /** 按分段組織的轉錄文字 */
  groupedTranscript: Record<string, TranscriptItem[]>;
  /** 已選中的高亮片段 ID 集合 */
  selectedHighlights: Set<string>;
  /** 當前活躍的轉錄項目 ID */
  activeTranscriptId: string | null;
  /** 切換高亮片段的回調函數 */
  onToggleHighlight: (itemId: string) => void;
  /** 跳轉到指定時間的回調函數 */
  onJumpToTime: (time: number) => void;
}

export default function TranscriptList({
  groupedTranscript,
  selectedHighlights,
  activeTranscriptId,
  onToggleHighlight,
  onJumpToTime
}: TranscriptListProps) {
  const transcriptRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className='flex-1 overflow-hidden'>
      <div
        ref={transcriptRef}
        className='space-y-6 overflow-y-auto h-full pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent pb-6 lg:pb-0'
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
                  'border hover:border-primary/60 hover:bg-primary/10 ring-2 ring-transparent',
                  'after:absolute after:top-3 after:right-3 after:w-2 after:h-2 after:border after:rounded-full',

                  selectedHighlights.has(item.id) && [
                    'bg-primary/25 border-primary/0 shadow-md',
                    'after:border-primary/70'
                  ],

                  activeTranscriptId === item.id && [
                    'bg-primary/0 border-primary shadow-sm ring-primary/30',
                    'after:animate-pulse after:w-3 after:h-3 after:shadow-md',
                    'after:bg-primary after:shadow-sm after:ring-1 after:ring-primary/30'
                  ],

                  selectedHighlights.has(item.id) &&
                    activeTranscriptId === item.id && [
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
                        activeTranscriptId === item.id &&
                          'text-primary font-semibold'
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
  );
}
