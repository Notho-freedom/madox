import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getTrending,
  getPopular,
  getTopRated,
  getNowPlaying,
  search,
  discoverByGenre,
  getDetails,
  getTrailerId,
  getCredits,
  getSimilar,
  genreNames,
  genreColor,
  type TMDBPageResult,
  type TMDBMovie,
  type TMDBMovieDetails,
  type TMDBCast } from
'../services/tmdb';
import { type MovieData } from '../data/movies';

const INITIAL_PAGE_BATCH = 3;
const PAGE_BATCH_SIZE = 2;
const hasPoster = (item: TMDBMovie) => Boolean(item.poster_path);

// Convert TMDB movie to our MovieData format
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
    videoId: '', // Will be fetched on demand
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

interface UseTMDBResult {
  data: MovieData[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  refetch: () => void;
}

export type TMDBCatalogSource =
  | {
      filterLabels?: string[];
      kind: 'trending';
      timeWindow: 'day' | 'week';
      type: 'movie' | 'tv' | 'all';
    }
  | {
      filterLabels?: string[];
      kind: 'popular';
      type: 'movie' | 'tv';
    }
  | {
      filterLabels?: string[];
      kind: 'topRated';
      type: 'movie' | 'tv';
    }
  | {
      filterLabels?: string[];
      kind: 'nowPlaying';
      type: 'movie' | 'tv';
    }
  | {
      filterLabels?: string[];
      kind: 'discover';
      genreId: number;
      sortBy?: 'popularity.desc' | 'vote_average.desc';
      type: 'movie' | 'tv';
      voteCountGte?: number;
    }
  | {
      filterLabels?: string[];
      kind: 'search';
      query: string;
      type: 'movie' | 'tv' | 'multi';
    };

function matchesGenreLabels(item: TMDBMovie, labels: string[]): boolean {
  const itemGenres = genreNames(item.genre_ids || []);
  return labels.some((label) => itemGenres.includes(label));
}

function mergeUniqueMovies(current: MovieData[], incoming: MovieData[]): MovieData[] {
  const merged = new Map<string, MovieData>();

  for (const item of current) {
    merged.set(item.id, item);
  }

  for (const item of incoming) {
    merged.set(item.id, item);
  }

  return Array.from(merged.values());
}

function toMovieBatch(
  pages: TMDBPageResult<TMDBMovie>[],
  filter?: (item: TMDBMovie) => boolean
): MovieData[] {
  return pages
    .flatMap((page) => page.results)
    .filter((item) => (filter ? filter(item) : true))
    .map(tmdbToMovieData);
}

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Unknown TMDB error.';
}

interface PaginatedQueryOptions {
  enabled?: boolean;
  filter?: (item: TMDBMovie) => boolean;
  initialPageBatch?: number;
  pageBatchSize?: number;
}

function usePaginatedMovieQuery(
  fetchPage: (page: number) => Promise<TMDBPageResult<TMDBMovie>>,
  options: PaginatedQueryOptions = {}
): UseTMDBResult {
  const {
    enabled = true,
    filter,
    initialPageBatch = INITIAL_PAGE_BATCH,
    pageBatchSize = PAGE_BATCH_SIZE
  } = options;
  const [data, setData] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadedPageRef = useRef(0);
  const totalPagesRef = useRef(1);
  const generationRef = useRef(0);

  const initialize = useCallback(async () => {
    generationRef.current += 1;
    const generation = generationRef.current;
    loadedPageRef.current = 0;
    totalPagesRef.current = 1;

    if (!enabled) {
      setData([]);
      setLoading(false);
      setError(null);
      setHasMore(false);
      setIsLoadingMore(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasMore(false);
    setIsLoadingMore(false);

    try {
      const firstPage = await fetchPage(1);

      if (generation !== generationRef.current) {
        return;
      }

      totalPagesRef.current = Math.max(firstPage.total_pages, 1);
      const finalInitialPage = Math.min(initialPageBatch, totalPagesRef.current);
      const extraPages =
        finalInitialPage > 1 ?
          await Promise.all(
            Array.from(
              { length: finalInitialPage - 1 },
              (_unused, index) => fetchPage(index + 2)
            )
          ) :
          [];

      if (generation !== generationRef.current) {
        return;
      }

      loadedPageRef.current = finalInitialPage;
      setData(toMovieBatch([firstPage, ...extraPages], filter));
      setHasMore(finalInitialPage < totalPagesRef.current);
    } catch (err: unknown) {
      if (generation !== generationRef.current) {
        return;
      }

      setError(getErrorMessage(err));
      setData([]);
      setHasMore(false);
    } finally {
      if (generation === generationRef.current) {
        setLoading(false);
      }
    }
  }, [enabled, fetchPage, filter, initialPageBatch]);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  const loadMore = useCallback(async () => {
    if (
      !enabled ||
      loading ||
      isLoadingMore ||
      loadedPageRef.current >= totalPagesRef.current
    ) {
      return;
    }

    const generation = generationRef.current;
    const startPage = loadedPageRef.current + 1;
    const endPage = Math.min(
      loadedPageRef.current + pageBatchSize,
      totalPagesRef.current
    );
    setIsLoadingMore(true);
    setError(null);

    try {
      const nextPages = await Promise.all(
        Array.from(
          { length: endPage - startPage + 1 },
          (_unused, index) => fetchPage(startPage + index)
        )
      );

      if (generation !== generationRef.current) {
        return;
      }

      loadedPageRef.current = endPage;
      setData((current) =>
        mergeUniqueMovies(current, toMovieBatch(nextPages, filter))
      );
      setHasMore(endPage < totalPagesRef.current);
    } catch (err: unknown) {
      if (generation !== generationRef.current) {
        return;
      }

      setError(getErrorMessage(err));
    } finally {
      if (generation === generationRef.current) {
        setIsLoadingMore(false);
      }
    }
  }, [enabled, fetchPage, filter, isLoadingMore, loading, pageBatchSize]);

  return {
    data,
    loading,
    error,
    hasMore,
    isLoadingMore,
    loadMore,
    refetch: () => {
      void initialize();
    }
  };
}

export function useTMDBCatalog(source: TMDBCatalogSource): UseTMDBResult {
  const fetchPage = useCallback(
    (page: number) => {
      switch (source.kind) {
        case 'trending':
          return getTrending(source.type, source.timeWindow, page);
        case 'popular':
          return getPopular(source.type, page);
        case 'topRated':
          return getTopRated(source.type, page);
        case 'nowPlaying':
          return getNowPlaying(source.type, page);
        case 'discover':
          return discoverByGenre(source.type, source.genreId, {
            page,
            sortBy: source.sortBy,
            voteCountGte: source.voteCountGte
          });
        case 'search':
          return search(source.query.trim(), source.type, page);
      }
    },
    [source]
  );

  const activeFilterLabels = source.filterLabels ?? [];
  const sourceFilter =
    activeFilterLabels.length > 0 ?
      (item: TMDBMovie) => matchesGenreLabels(item, activeFilterLabels) :
      undefined;

  return usePaginatedMovieQuery(fetchPage, {
    enabled: source.kind !== 'search' || source.query.trim().length > 0,
    filter:
      source.kind === 'discover' || source.kind === 'search' ?
        (item) => hasPoster(item) && (sourceFilter ? sourceFilter(item) : true) :
      sourceFilter ?
        sourceFilter :
        undefined
  });
}

// Hook: Trending
export function useTrending(
type: 'movie' | 'tv' | 'all' = 'all',
window: 'day' | 'week' = 'week')
: UseTMDBResult {
  const fetchPage = useCallback(
    (page: number) => getTrending(type, window, page),
    [type, window]
  );

  return usePaginatedMovieQuery(fetchPage);
}

// Hook: Popular
export function usePopular(type: 'movie' | 'tv' = 'movie'): UseTMDBResult {
  const fetchPage = useCallback((page: number) => getPopular(type, page), [type]);

  return usePaginatedMovieQuery(fetchPage);
}

// Hook: Top Rated
export function useTopRated(type: 'movie' | 'tv' = 'movie'): UseTMDBResult {
  const fetchPage = useCallback((page: number) => getTopRated(type, page), [type]);

  return usePaginatedMovieQuery(fetchPage);
}

// Hook: Now Playing
export function useNowPlaying(type: 'movie' | 'tv' = 'movie'): UseTMDBResult {
  const fetchPage = useCallback((page: number) => getNowPlaying(type, page), [type]);

  return usePaginatedMovieQuery(fetchPage);
}

// Hook: Search
export function useTMDBSearch(
query: string,
type: 'movie' | 'tv' | 'multi' = 'multi')
: UseTMDBResult {
  const trimmedQuery = query.trim();
  const fetchPage = useCallback(
    (page: number) => search(trimmedQuery, type, page),
    [trimmedQuery, type]
  );

  return usePaginatedMovieQuery(fetchPage, {
    enabled: trimmedQuery.length > 0,
    filter: hasPoster
  });
}

// Hook: Discover by genre
export function useDiscover(
type: 'movie' | 'tv',
genreId: number)
: UseTMDBResult {
  const fetchPage = useCallback(
    (page: number) => discoverByGenre(type, genreId, { page }),
    [genreId, type]
  );

  return usePaginatedMovieQuery(fetchPage, {
    filter: hasPoster
  });
}

// Hook: Get trailer videoId for a movie
export function useTrailer(
tmdbId: number | undefined,
mediaType: 'movie' | 'tv' = 'movie')
{
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tmdbId) return;
    setLoading(true);
    getTrailerId(mediaType, tmdbId).
    then(setVideoId).
    catch(() => setVideoId(null)).
    finally(() => setLoading(false));
  }, [tmdbId, mediaType]);

  return { videoId, loading };
}

// Hook: Movie/TV details with cast and similar
export function useDetails(
tmdbId: number | undefined,
mediaType: 'movie' | 'tv' = 'movie')
{
  const [details, setDetails] = useState<TMDBMovieDetails | null>(null);
  const [cast, setCast] = useState<TMDBCast[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const similarQuery = usePaginatedMovieQuery(
    useCallback(
      (page: number) =>
        tmdbId ? getSimilar(mediaType, tmdbId, page) : Promise.reject(new Error('Missing TMDB id.')),
      [mediaType, tmdbId]
    ),
    {
      enabled: Boolean(tmdbId),
      filter: hasPoster
    }
  );

  useEffect(() => {
    if (!tmdbId) {
      setDetails(null);
      setCast([]);
      setLoadingDetails(false);
      return;
    }

    let active = true;
    setLoadingDetails(true);
    Promise.all([getDetails(mediaType, tmdbId), getCredits(mediaType, tmdbId)])
      .then(([d, c]) => {
        if (!active) {
          return;
        }

        setDetails(d);
        setCast(c);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setDetails(null);
        setCast([]);
      })
      .finally(() => {
        if (active) {
          setLoadingDetails(false);
        }
      });

    return () => {
      active = false;
    };
  }, [tmdbId, mediaType]);

  return {
    details,
    cast,
    similar: similarQuery.data,
    loading: loadingDetails || similarQuery.loading,
    hasMoreSimilar: similarQuery.hasMore,
    isLoadingMoreSimilar: similarQuery.isLoadingMore,
    loadMoreSimilar: similarQuery.loadMore
  };
}
