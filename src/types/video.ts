export interface TranscriptItem {
  id: string;
  startTime: number; // 開始時間（秒）
  endTime: number; // 結束時間（秒）
  text: string; // 轉錄文字內容
  isHighlight: boolean; // 是否為重點片段
  segment?: string; // 分類（如：Introduction, Key Features, etc.）
}

export interface VideoHighlight {
  id: string;
  title: string;
  duration: number; // 影片總長度（秒）
  uploadedAt: string; // ISO 日期字串
  processingStatus: 'uploading' | 'processing' | 'completed' | 'failed';
  transcript: TranscriptItem[];
}

export interface UploadProgress {
  progress: number; // 進度百分比 (0-100)
  stage:
    | 'uploading'
    | 'processing'
    | 'transcribing'
    | 'analyzing'
    | 'completed';
  message: string; // 當前狀態訊息
}

// 額外的工具型別
export interface HighlightSegment {
  id: string;
  startTime: number;
  endTime: number;
  title: string;
  description?: string;
  transcriptItems: TranscriptItem[];
}

// 用於前端 UI 的輔助型別
export interface VideoPlayerState {
  currentTime: number;
  isPlaying: boolean;
  volume: number;
  playbackRate: number;
}
