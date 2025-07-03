export interface VideoHighlight {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  highlights: Highlight[];
  createdAt: string;
}

export interface Highlight {
  id: string;
  startTime: number;
  endTime: number;
  description: string;
  confidence: number;
}
