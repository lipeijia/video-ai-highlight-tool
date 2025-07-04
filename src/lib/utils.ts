import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import type { TranscriptItem } from '@/types/video';

// 格式化檔案大小
// 例如：1024 -> "1 KB", 1048576 -> "1 MB
export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};


// 格式化時間為 MM:SS 格式
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

// 根據分類分組轉錄項目
export function groupTranscriptByCategory(transcript: TranscriptItem[]) {
  return transcript.reduce((groups, item) => {
    const category = item.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, TranscriptItem[]>);
}

// 獲取重點片段
export function getHighlights(transcript: TranscriptItem[]): TranscriptItem[] {
  return transcript.filter((item) => item.isHighlight);
}

// 計算總字數
export function getTotalWordCount(transcript: TranscriptItem[]): number {
  return transcript.reduce((total, item) => {
    return total + item.text.split(' ').length;
  }, 0);
}
