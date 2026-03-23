const API_TOKEN =
'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OGM1OWUzOWQxNDNmYjEyYjZjNDAyMjAzOTlhZWFlOCIsIm5iZiI6MTc3NDI4MzMyNS4wMDE5OTk5LCJzdWIiOiI2OWMxNmEzYzNjMWZmYzJjZTMxYjEzYzQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.l1UV8AmsbTthAutPK62-TN5YShxhTi21m8VPacipiIQ';
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMG_BASE = 'https://image.tmdb.org/t/p';

// Image helpers
export function poster(
path: string | null,
size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500')
: string {
  if (!path) return '';
  return `${IMG_BASE}/${size}${path}`;
}

export function backdrop(
path: string | null,
size: 'w780' | 'w1280' | 'original' = 'w1280')
: string {
  if (!path) return '';
  return `${IMG_BASE}/${size}${path}`;
}

// Cache
const cache = new Map<string, {data: any;ts: number;}>();
const TTL = 5 * 60 * 1000;

async function tmdbFetch<T>(
endpoint: string,
params: Record<string, string> = {})
: Promise<T> {
  const qs = new URLSearchParams({ language: 'fr-FR', ...params }).toString();
  const url = `${BASE_URL}${endpoint}?${qs}`;
  const cached = cache.get(url);
  if (cached && Date.now() - cached.ts < TTL) return cached.data as T;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.status_message || `TMDB error ${res.status}`);
  }
  const data = await res.json();
  cache.set(url, { data, ts: Date.now() });
  return data as T;
}

// ─── Types ───────────────────────────────────────────────────
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
  genres: {id: number;name: string;}[];
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

interface PageResult<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// ─── Endpoints ───────────────────────────────────────────────

// Trending
export async function getTrending(
type: 'movie' | 'tv' | 'all' = 'all',
window: 'day' | 'week' = 'week')
: Promise<TMDBMovie[]> {
  const data = await tmdbFetch<PageResult<TMDBMovie>>(
    `/trending/${type}/${window}`
  );
  return data.results;
}

// Popular
export async function getPopular(
type: 'movie' | 'tv' = 'movie',
page: number = 1)
: Promise<TMDBMovie[]> {
  const data = await tmdbFetch<PageResult<TMDBMovie>>(`/${type}/popular`, {
    page: String(page)
  });
  return data.results;
}

// Top Rated
export async function getTopRated(
type: 'movie' | 'tv' = 'movie',
page: number = 1)
: Promise<TMDBMovie[]> {
  const data = await tmdbFetch<PageResult<TMDBMovie>>(`/${type}/top_rated`, {
    page: String(page)
  });
  return data.results;
}

// Now Playing (movies) / On The Air (tv)
export async function getNowPlaying(
type: 'movie' | 'tv' = 'movie')
: Promise<TMDBMovie[]> {
  const endpoint = type === 'movie' ? '/movie/now_playing' : '/tv/on_the_air';
  const data = await tmdbFetch<PageResult<TMDBMovie>>(endpoint);
  return data.results;
}

// Upcoming
export async function getUpcoming(): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<PageResult<TMDBMovie>>('/movie/upcoming');
  return data.results;
}

// Search
export async function search(
query: string,
type: 'movie' | 'tv' | 'multi' = 'multi',
page: number = 1)
: Promise<TMDBMovie[]> {
  const data = await tmdbFetch<PageResult<TMDBMovie>>(`/search/${type}`, {
    query,
    page: String(page)
  });
  return data.results;
}

// Discover by genre
export async function discoverByGenre(
type: 'movie' | 'tv',
genreId: number,
page: number = 1)
: Promise<TMDBMovie[]> {
  const data = await tmdbFetch<PageResult<TMDBMovie>>(`/discover/${type}`, {
    with_genres: String(genreId),
    sort_by: 'popularity.desc',
    page: String(page)
  });
  return data.results;
}

// Details
export async function getDetails(
type: 'movie' | 'tv',
id: number)
: Promise<TMDBMovieDetails> {
  return tmdbFetch<TMDBMovieDetails>(`/${type}/${id}`);
}

// Videos (trailers)
export async function getVideos(
type: 'movie' | 'tv',
id: number)
: Promise<TMDBVideo[]> {
  const data = await tmdbFetch<{results: TMDBVideo[];}>(
    `/${type}/${id}/videos`
  );
  return data.results;
}

// Get YouTube trailer ID
export async function getTrailerId(
type: 'movie' | 'tv',
id: number)
: Promise<string | null> {
  const videos = await getVideos(type, id);
  // Prefer official YouTube trailers
  const trailer =
  videos.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official
  ) ||
  videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
  videos.find((v) => v.site === 'YouTube' && v.type === 'Teaser') ||
  videos.find((v) => v.site === 'YouTube');
  return trailer?.key || null;
}

// Credits (cast)
export async function getCredits(
type: 'movie' | 'tv',
id: number)
: Promise<TMDBCast[]> {
  const data = await tmdbFetch<{cast: TMDBCast[];}>(`/${type}/${id}/credits`);
  return data.cast;
}

// Similar
export async function getSimilar(
type: 'movie' | 'tv',
id: number)
: Promise<TMDBMovie[]> {
  const data = await tmdbFetch<PageResult<TMDBMovie>>(`/${type}/${id}/similar`);
  return data.results;
}

// Genre list
export async function getGenres(
type: 'movie' | 'tv' = 'movie')
: Promise<TMDBGenre[]> {
  const data = await tmdbFetch<{genres: TMDBGenre[];}>(`/genre/${type}/list`);
  return data.genres;
}

// ─── Genre map (static for quick lookup) ─────────────────────
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

export function genreName(id: number): string {
  return GENRE_MAP[id] || 'Unknown';
}

export function genreNames(ids: number[]): string {
  return (
    ids.
    slice(0, 2).
    map((id) => GENRE_MAP[id] || '').
    filter(Boolean).
    join(' / ') || 'Entertainment');

}

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

export function genreColor(genre: string): string {
  return GENRE_COLORS[genre] || '#4b5563';
}