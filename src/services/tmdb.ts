import {
  apiFetch,
  readApiCacheSnapshot,
  type ApiCacheSnapshot,
  type ApiFetchOptions
} from './api';
import {
  type HomeBootstrapResponse,
  type MoviePageResult,
  type TMDBCast,
  type TMDBGenre,
  type TMDBMovieDetails,
  type TMDBVideo,
  genreColor,
  genreName,
  genreNames
} from './tmdbShared';

const IMG_BASE =
  import.meta.env.VITE_TMDB_IMAGE_BASE_URL?.trim() ||
  'https://image.tmdb.org/t/p';

type ApiRequestOptions = Pick<
  ApiFetchOptions,
  'cacheTtlMs' | 'signal' | 'skipCache'
>;

export { genreColor, genreName, genreNames };
export type {
  ApiCacheSnapshot,
  HomeBootstrapResponse,
  MoviePageResult,
  TMDBCast,
  TMDBGenre,
  TMDBMovieDetails,
  TMDBVideo
};

export function poster(
  path: string | null,
  size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'
): string {
  if (!path) return '';
  return `${IMG_BASE}/${size}${path}`;
}

export function backdrop(
  path: string | null,
  size: 'w780' | 'w1280' | 'original' = 'w1280'
): string {
  if (!path) return '';
  return `${IMG_BASE}/${size}${path}`;
}

export async function getHomeBootstrap(
  genre: string,
  options: ApiRequestOptions = {}
): Promise<HomeBootstrapResponse> {
  return apiFetch<HomeBootstrapResponse>(
    '/api/home/bootstrap',
    { genre },
    {
      cacheTtlMs: 10_000,
      ...options
    }
  );
}

export async function getCachedHomeBootstrap(
  genre: string
): Promise<ApiCacheSnapshot<HomeBootstrapResponse> | null> {
  return readApiCacheSnapshot<HomeBootstrapResponse>('/api/home/bootstrap', {
    genre
  });
}

export async function getTrending(
  type: 'movie' | 'tv' | 'all' = 'all',
  window: 'day' | 'week' = 'week',
  page = 1,
  options: ApiRequestOptions = {}
): Promise<MoviePageResult> {
  return apiFetch<MoviePageResult>(
    '/api/catalog',
    {
      kind: 'trending',
      page,
      timeWindow: window,
      type
    },
    options
  );
}

export async function getPopular(
  type: 'movie' | 'tv' = 'movie',
  page = 1,
  options: ApiRequestOptions = {}
): Promise<MoviePageResult> {
  return apiFetch<MoviePageResult>(
    '/api/catalog',
    {
      kind: 'popular',
      page,
      type
    },
    options
  );
}

export async function getTopRated(
  type: 'movie' | 'tv' = 'movie',
  page = 1,
  options: ApiRequestOptions = {}
): Promise<MoviePageResult> {
  return apiFetch<MoviePageResult>(
    '/api/catalog',
    {
      kind: 'topRated',
      page,
      type
    },
    options
  );
}

export async function getNowPlaying(
  type: 'movie' | 'tv' = 'movie',
  page = 1,
  options: ApiRequestOptions = {}
): Promise<MoviePageResult> {
  return apiFetch<MoviePageResult>(
    '/api/catalog',
    {
      kind: 'nowPlaying',
      page,
      type
    },
    options
  );
}

export async function getUpcoming(
  page = 1,
  options: ApiRequestOptions = {}
): Promise<MoviePageResult> {
  return apiFetch<MoviePageResult>(
    '/api/catalog',
    {
      kind: 'upcoming',
      page,
      type: 'movie'
    },
    options
  );
}

export async function search(
  query: string,
  type: 'movie' | 'tv' | 'multi' = 'multi',
  page = 1,
  options: ApiRequestOptions = {}
): Promise<MoviePageResult> {
  return apiFetch<MoviePageResult>(
    '/api/search',
    {
      page,
      q: query,
      type
    },
    {
      cacheTtlMs: 10_000,
      ...options
    }
  );
}

export async function discoverByGenre(
  type: 'movie' | 'tv',
  genreId: number,
  options: {
    cacheTtlMs?: number;
    page?: number;
    signal?: AbortSignal;
    skipCache?: boolean;
    sortBy?: 'popularity.desc' | 'vote_average.desc';
    voteCountGte?: number;
  } = {}
): Promise<MoviePageResult> {
  const {
    cacheTtlMs,
    page = 1,
    signal,
    skipCache,
    sortBy = 'popularity.desc',
    voteCountGte
  } = options;

  return apiFetch<MoviePageResult>(
    '/api/catalog',
    {
      genreId,
      kind: 'discover',
      page,
      sortBy,
      type,
      voteCountGte
    },
    {
      cacheTtlMs,
      signal,
      skipCache
    }
  );
}

export async function getDetails(
  type: 'movie' | 'tv',
  id: number,
  options: ApiRequestOptions = {}
): Promise<TMDBMovieDetails> {
  return apiFetch<TMDBMovieDetails>(`/api/details/${type}/${id}`, undefined, options);
}

export async function getVideos(
  type: 'movie' | 'tv',
  id: number,
  options: ApiRequestOptions = {}
): Promise<TMDBVideo[]> {
  return apiFetch<TMDBVideo[]>(`/api/details/${type}/${id}/videos`, undefined, options);
}

export async function getTrailerId(
  type: 'movie' | 'tv',
  id: number,
  options: ApiRequestOptions = {}
): Promise<string | null> {
  const videos = await getVideos(type, id, options);
  const trailer =
    videos.find(
      (video) =>
        video.site === 'YouTube' &&
        video.type === 'Trailer' &&
        video.official
    ) ||
    videos.find(
      (video) => video.site === 'YouTube' && video.type === 'Trailer'
    ) ||
    videos.find((video) => video.site === 'YouTube' && video.type === 'Teaser') ||
    videos.find((video) => video.site === 'YouTube');

  return trailer?.key || null;
}

export async function getCredits(
  type: 'movie' | 'tv',
  id: number,
  options: ApiRequestOptions = {}
): Promise<TMDBCast[]> {
  return apiFetch<TMDBCast[]>(`/api/details/${type}/${id}/credits`, undefined, options);
}

export async function getSimilar(
  type: 'movie' | 'tv',
  id: number,
  page = 1,
  options: ApiRequestOptions = {}
): Promise<MoviePageResult> {
  return apiFetch<MoviePageResult>(
    '/api/catalog',
    {
      id,
      kind: 'similar',
      mediaType: type,
      page
    },
    options
  );
}

export async function getGenres(
  type: 'movie' | 'tv' = 'movie',
  options: ApiRequestOptions = {}
): Promise<TMDBGenre[]> {
  return apiFetch<TMDBGenre[]>(
    '/api/genres',
    { type },
    {
      cacheTtlMs: 60_000,
      ...options
    }
  );
}
