import { startTransition, useCallback, useEffect, useRef, useState } from 'react';
import {
  discoverByGenre,
  getCredits,
  getDetails,
  getNowPlaying,
  getPopular,
  getSimilar,
  getTopRated,
  getTrailerId,
  getTrending,
  search,
  type MoviePageResult,
  type TMDBCast,
  type TMDBMovieDetails
} from '../services/tmdb';
import { type MovieData } from '../data/movies';

const INITIAL_PAGE_BATCH = 1;
const PAGE_BATCH_SIZE = 1;
const hasPoster = (item: MovieData) => Boolean(item.posterPath);

interface UseTMDBResult {
  data: MovieData[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  isRefreshing: boolean;
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

function matchesGenreLabels(item: MovieData, labels: string[]): boolean {
  const itemGenres = item.genre ?? '';
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
  pages: MoviePageResult[],
  filter?: (item: MovieData) => boolean
): MovieData[] {
  return pages
    .flatMap((page) => page.results)
    .filter((item) => (filter ? filter(item) : true));
}

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Unknown catalog error.';
}

interface PaginatedQueryOptions {
  enabled?: boolean;
  filter?: (item: MovieData) => boolean;
  initialPageBatch?: number;
  initialPageData?: MoviePageResult | null;
  pageBatchSize?: number;
}

function usePaginatedMovieQuery(
  fetchPage: (page: number, signal?: AbortSignal) => Promise<MoviePageResult>,
  options: PaginatedQueryOptions = {}
): UseTMDBResult {
  const {
    enabled = true,
    filter,
    initialPageBatch = INITIAL_PAGE_BATCH,
    initialPageData,
    pageBatchSize = PAGE_BATCH_SIZE
  } = options;
  const [data, setData] = useState<MovieData[]>(() =>
    initialPageData ? toMovieBatch([initialPageData], filter) : []
  );
  const [loading, setLoading] = useState(enabled && !initialPageData);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(() =>
    initialPageData ? initialPageData.page < initialPageData.total_pages : false
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const dataRef = useRef(data);
  const loadedPageRef = useRef(initialPageData?.page ?? 0);
  const totalPagesRef = useRef(initialPageData?.total_pages ?? 1);
  const generationRef = useRef(0);
  const initAbortRef = useRef<AbortController | null>(null);
  const loadMoreAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    if (!initialPageData) {
      return;
    }

    loadedPageRef.current = initialPageData.page;
    totalPagesRef.current = Math.max(initialPageData.total_pages, 1);
    setHasMore(initialPageData.page < initialPageData.total_pages);

    startTransition(() => {
      setData(toMovieBatch([initialPageData], filter));
      setLoading(false);
      setError(null);
    });
  }, [filter, initialPageData]);

  const initialize = useCallback(async () => {
    generationRef.current += 1;
    const generation = generationRef.current;

    initAbortRef.current?.abort();
    const controller = new AbortController();
    initAbortRef.current = controller;

    if (!enabled) {
      controller.abort();
      loadedPageRef.current = 0;
      totalPagesRef.current = 1;
      setData([]);
      setLoading(false);
      setError(null);
      setHasMore(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
      return;
    }

    setError(null);
    setIsLoadingMore(false);

    const hasExistingData = dataRef.current.length > 0;
    setLoading(!hasExistingData);
    setIsRefreshing(hasExistingData);

    try {
      const firstPage = await fetchPage(1, controller.signal);

      if (generation !== generationRef.current || controller.signal.aborted) {
        return;
      }

      totalPagesRef.current = Math.max(firstPage.total_pages, 1);
      const finalInitialPage = Math.min(initialPageBatch, totalPagesRef.current);
      const extraPages =
        finalInitialPage > 1
          ? await Promise.all(
              Array.from({ length: finalInitialPage - 1 }, (_unused, index) =>
                fetchPage(index + 2, controller.signal)
              )
            )
          : [];

      if (generation !== generationRef.current || controller.signal.aborted) {
        return;
      }

      loadedPageRef.current = finalInitialPage;
      const nextData = toMovieBatch([firstPage, ...extraPages], filter);

      startTransition(() => {
        setData(nextData);
        setHasMore(finalInitialPage < totalPagesRef.current);
      });
    } catch (err: unknown) {
      if (
        generation !== generationRef.current ||
        (err instanceof DOMException && err.name === 'AbortError')
      ) {
        return;
      }

      setError(getErrorMessage(err));
      if (!hasExistingData) {
        setData([]);
        setHasMore(false);
      }
    } finally {
      if (generation === generationRef.current && !controller.signal.aborted) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [enabled, fetchPage, filter, initialPageBatch]);

  useEffect(() => {
    void initialize();

    return () => {
      generationRef.current += 1;
      initAbortRef.current?.abort();
      loadMoreAbortRef.current?.abort();
    };
  }, [initialize]);

  const loadMore = useCallback(async () => {
    if (
      !enabled ||
      loading ||
      isRefreshing ||
      isLoadingMore ||
      loadedPageRef.current >= totalPagesRef.current
    ) {
      return;
    }

    const generation = generationRef.current;
    loadMoreAbortRef.current?.abort();
    const controller = new AbortController();
    loadMoreAbortRef.current = controller;
    const startPage = loadedPageRef.current + 1;
    const endPage = Math.min(
      loadedPageRef.current + pageBatchSize,
      totalPagesRef.current
    );

    setIsLoadingMore(true);
    setError(null);

    try {
      const nextPages = await Promise.all(
        Array.from({ length: endPage - startPage + 1 }, (_unused, index) =>
          fetchPage(startPage + index, controller.signal)
        )
      );

      if (generation !== generationRef.current || controller.signal.aborted) {
        return;
      }

      loadedPageRef.current = endPage;
      startTransition(() => {
        setData((current) =>
          mergeUniqueMovies(current, toMovieBatch(nextPages, filter))
        );
        setHasMore(endPage < totalPagesRef.current);
      });
    } catch (err: unknown) {
      if (
        generation !== generationRef.current ||
        (err instanceof DOMException && err.name === 'AbortError')
      ) {
        return;
      }

      setError(getErrorMessage(err));
    } finally {
      if (generation === generationRef.current && !controller.signal.aborted) {
        setIsLoadingMore(false);
      }
    }
  }, [
    enabled,
    fetchPage,
    filter,
    isLoadingMore,
    isRefreshing,
    loading,
    pageBatchSize
  ]);

  return {
    data,
    loading,
    error,
    hasMore,
    isRefreshing,
    isLoadingMore,
    loadMore,
    refetch: () => {
      void initialize();
    }
  };
}

export function useTMDBCatalog(
  source: TMDBCatalogSource,
  options: PaginatedQueryOptions = {}
): UseTMDBResult {
  const fetchPage = useCallback(
    (page: number, signal?: AbortSignal) => {
      switch (source.kind) {
        case 'trending':
          return getTrending(source.type, source.timeWindow, page, { signal });
        case 'popular':
          return getPopular(source.type, page, { signal });
        case 'topRated':
          return getTopRated(source.type, page, { signal });
        case 'nowPlaying':
          return getNowPlaying(source.type, page, { signal });
        case 'discover':
          return discoverByGenre(source.type, source.genreId, {
            page,
            signal,
            sortBy: source.sortBy,
            voteCountGte: source.voteCountGte
          });
        case 'search':
          return search(source.query.trim(), source.type, page, { signal });
      }
    },
    [source]
  );

  const activeFilterLabels = source.filterLabels ?? [];
  const optionFilter = options.filter;
  const sourceFilter =
    activeFilterLabels.length > 0
      ? (item: MovieData) => matchesGenreLabels(item, activeFilterLabels)
      : undefined;
  const combinedFilter =
    source.kind === 'discover' || source.kind === 'search'
      ? (item: MovieData) =>
          hasPoster(item) &&
          (sourceFilter ? sourceFilter(item) : true) &&
          (optionFilter ? optionFilter(item) : true)
      : sourceFilter && optionFilter
      ? (item: MovieData) => sourceFilter(item) && optionFilter(item)
      : sourceFilter
      ? sourceFilter
      : optionFilter
      ? optionFilter
      : undefined;
  const isEnabled =
    (options.enabled ?? true) &&
    (source.kind !== 'search' || source.query.trim().length > 0);

  return usePaginatedMovieQuery(fetchPage, {
    ...options,
    enabled: isEnabled,
    filter: combinedFilter
  });
}

export function useTrending(
  type: 'movie' | 'tv' | 'all' = 'all',
  window: 'day' | 'week' = 'week'
): UseTMDBResult {
  const fetchPage = useCallback(
    (page: number, signal?: AbortSignal) =>
      getTrending(type, window, page, { signal }),
    [type, window]
  );

  return usePaginatedMovieQuery(fetchPage);
}

export function usePopular(type: 'movie' | 'tv' = 'movie'): UseTMDBResult {
  const fetchPage = useCallback(
    (page: number, signal?: AbortSignal) => getPopular(type, page, { signal }),
    [type]
  );

  return usePaginatedMovieQuery(fetchPage);
}

export function useTopRated(type: 'movie' | 'tv' = 'movie'): UseTMDBResult {
  const fetchPage = useCallback(
    (page: number, signal?: AbortSignal) => getTopRated(type, page, { signal }),
    [type]
  );

  return usePaginatedMovieQuery(fetchPage);
}

export function useNowPlaying(type: 'movie' | 'tv' = 'movie'): UseTMDBResult {
  const fetchPage = useCallback(
    (page: number, signal?: AbortSignal) =>
      getNowPlaying(type, page, { signal }),
    [type]
  );

  return usePaginatedMovieQuery(fetchPage);
}

export function useTMDBSearch(
  query: string,
  type: 'movie' | 'tv' | 'multi' = 'multi'
): UseTMDBResult {
  const trimmedQuery = query.trim();
  const fetchPage = useCallback(
    (page: number, signal?: AbortSignal) =>
      search(trimmedQuery, type, page, { signal }),
    [trimmedQuery, type]
  );

  return usePaginatedMovieQuery(fetchPage, {
    enabled: trimmedQuery.length > 0,
    filter: hasPoster
  });
}

export function useDiscover(type: 'movie' | 'tv', genreId: number): UseTMDBResult {
  const fetchPage = useCallback(
    (page: number, signal?: AbortSignal) =>
      discoverByGenre(type, genreId, {
        page,
        signal
      }),
    [genreId, type]
  );

  return usePaginatedMovieQuery(fetchPage, {
    filter: hasPoster
  });
}

export function useTrailer(
  tmdbId: number | undefined,
  mediaType: 'movie' | 'tv' = 'movie'
) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tmdbId) return;
    setLoading(true);
    getTrailerId(mediaType, tmdbId)
      .then(setVideoId)
      .catch(() => setVideoId(null))
      .finally(() => setLoading(false));
  }, [tmdbId, mediaType]);

  return { videoId, loading };
}

export function useDetails(
  tmdbId: number | undefined,
  mediaType: 'movie' | 'tv' = 'movie'
) {
  const [details, setDetails] = useState<TMDBMovieDetails | null>(null);
  const [cast, setCast] = useState<TMDBCast[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const similarQuery = usePaginatedMovieQuery(
    useCallback(
      (page: number, signal?: AbortSignal) =>
        tmdbId
          ? getSimilar(mediaType, tmdbId, page, { signal })
          : Promise.reject(new Error('Missing TMDB id.')),
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
      .then(([nextDetails, nextCast]) => {
        if (!active) {
          return;
        }

        startTransition(() => {
          setDetails(nextDetails);
          setCast(nextCast);
        });
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
