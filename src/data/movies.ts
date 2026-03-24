export interface MovieData {
  id: string;
  title: string;
  year: string;
  rating: string;
  color: string;
  videoId: string;
  genre?: string;
  duration?: string;
  description?: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  tmdbId?: number;
  mediaType?: 'movie' | 'tv';
  popularity?: number;
  progressPercent?: number;
  resumeTime?: number;
  updatedAt?: number;
  voteCount?: number;
  views?: string;
  channelTitle?: string;
}

export function getYouTubeThumbnail(
videoId: string,
quality: 'default' | 'mq' | 'hq' | 'sd' | 'maxres' = 'hq')
: string {
  if (!videoId) return '';
  const qualityMap = {
    default: 'default',
    mq: 'mqdefault',
    hq: 'hqdefault',
    sd: 'sddefault',
    maxres: 'maxresdefault'
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}
