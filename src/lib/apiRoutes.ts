export const API_ROUTES = {
  VIDEOS: {
    LIST: '/videos',
    DETAIL: (id: string) => `/videos/${id}`,
    UPLOAD: '/videos/upload',
    DELETE: (id: string) => `/videos/${id}`,
    TRANSCRIPT: (id: string) => `/videos/${id}/transcript`,
    HIGHLIGHTS: (id: string) => `/videos/${id}/highlights`
  }
} as const;
