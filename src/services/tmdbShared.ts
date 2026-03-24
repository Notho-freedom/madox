import { type MovieData } from '../data/movies';

export interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  media_type?: string;
}

export interface TMDBMovieDetails extends TMDBMovie {
  runtime?: number;
  number_of_seasons?: number;
  genres: { id: number; name: string }[];
  tagline?: string;
  status?: string;
  homepage?: string;
  production_companies?: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface TMDBCast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBPageResult<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface MoviePageResult {
  page: number;
  results: MovieData[];
  total_pages: number;
  total_results: number;
}

export interface HomeBootstrapResponse {
  heroCandidates: MovieData[];
  primarySection: {
    id: string;
    page: MoviePageResult;
  } | null;
}

const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics'
};

const GENRE_COLORS: Record<string, string> = {
  Action: '#b91c1c',
  Adventure: '#ea580c',
  Animation: '#7e22ce',
  Comedy: '#f59e0b',
  Crime: '#374151',
  Documentary: '#0f766e',
  Drama: '#1d4ed8',
  Fantasy: '#7e22ce',
  Horror: '#991b1b',
  Mystery: '#4b5563',
  Romance: '#be185d',
  'Sci-Fi': '#0e7490',
  Thriller: '#1e293b',
  War: '#78350f',
  Western: '#92400e',
  'Action & Adventure': '#b91c1c',
  'Sci-Fi & Fantasy': '#0e7490'
};

export function genreName(id: number): string {
  return GENRE_MAP[id] || 'Unknown';
}

export function genreNames(ids: number[]): string {
  return ids
    .map((id) => GENRE_MAP[id] || '')
    .filter(Boolean)
    .join(' / ') || 'Entertainment';
}

export function genreColor(genre: string): string {
  return GENRE_COLORS[genre] || '#4b5563';
}

export function tmdbToMovieData(item: TMDBMovie): MovieData {
  const title = item.title || item.name || '';
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const genre = genreNames(item.genre_ids || []);
  const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');

  return {
    id: String(item.id),
    title,
    year,
    rating: item.vote_average.toFixed(1),
    color: genreColor(genre.split(' / ')[0]),
    videoId: '',
    genre,
    duration: '',
    description: item.overview,
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path,
    tmdbId: item.id,
    mediaType: mediaType as 'movie' | 'tv',
    popularity: item.popularity,
    voteCount: item.vote_count
  };
}

export function mapMoviePage(result: TMDBPageResult<TMDBMovie>): MoviePageResult {
  return {
    page: result.page,
    results: result.results.map(tmdbToMovieData),
    total_pages: result.total_pages,
    total_results: result.total_results
  };
}
