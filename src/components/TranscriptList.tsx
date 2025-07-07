'use client';
import { useRef, useEffect } from 'react';
import { TranscriptItem } from '@/types/video';
import TranscriptItemComponent from './TranscriptItem';

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
              <TranscriptItemComponent
                key={item.id}
                item={item}
                isSelected={selectedHighlights.has(item.id)}
                isActive={activeTranscriptId === item.id}
                onToggleHighlight={onToggleHighlight}
                onJumpToTime={onJumpToTime}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
