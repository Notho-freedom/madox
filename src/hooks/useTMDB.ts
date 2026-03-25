import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  discoverByGenre,
  getCredits,
  getDetails,
  getNowPlaying,
  getPersonProfile,
  getPopularPeople,
  getPopular,
  getSimilar,
  getTopRated,
  getTrailerId,
  getTrending,
  searchPeople,
  search,
  type MoviePageResult,
  type PersonCardData,
  type PersonPageResult,
  type PersonProfileResponse,
  type TMDBCast,
  type TMDBMovieDetails
} from '../services/tmdb';
import { type MovieData } from '../data/movies';

const INITIAL_PAGE_BATCH = 1;
const PAGE_BATCH_SIZE = 1;
const EMPTY_FILTER_LABELS: string[] = [];
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

interface UsePersonProfileResult {
  data: PersonProfileResponse | null;
  error: string | null;
  loading: boolean;
  refetch: () => void;
}

interface UsePeopleCatalogResult {
  data: PersonCardData[];
  error: string | null;
  hasMore: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  loading: boolean;
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

function mergeUniquePeople(
  current: PersonCardData[],
  incoming: PersonCardData[]
): PersonCardData[] {
  const merged = new Map<string, PersonCardData>();

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

function toPersonBatch(pages: PersonPageResult[]): PersonCardData[] {
  return pages.flatMap((page) => page.results);
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

function usePaginatedPeopleQuery(
  fetchPage: (page: number, signal?: AbortSignal) => Promise<PersonPageResult>,
  options: {
    enabled?: boolean;
    initialPageBatch?: number;
  } = {}
): UsePeopleCatalogResult {
  const { enabled = true, initialPageBatch = INITIAL_PAGE_BATCH } = options;
  const [data, setData] = useState<PersonCardData[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const dataRef = useRef<PersonCardData[]>([]);
  const loadedPageRef = useRef(0);
  const totalPagesRef = useRef(1);
  const generationRef = useRef(0);
  const initAbortRef = useRef<AbortController | null>(null);
  const loadMoreAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

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

    const hasExistingData = dataRef.current.length > 0;
    setError(null);
    setLoading(!hasExistingData);
    setIsRefreshing(hasExistingData);
    setIsLoadingMore(false);

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
      startTransition(() => {
        setData(toPersonBatch([firstPage, ...extraPages]));
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
  }, [enabled, fetchPage, initialPageBatch]);

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
    const nextPage = loadedPageRef.current + 1;

    setIsLoadingMore(true);
    setError(null);

    try {
      const page = await fetchPage(nextPage, controller.signal);

      if (generation !== generationRef.current || controller.signal.aborted) {
        return;
      }

      loadedPageRef.current = nextPage;
      startTransition(() => {
        setData((current) => mergeUniquePeople(current, page.results));
        setHasMore(nextPage < totalPagesRef.current);
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
  }, [enabled, fetchPage, isLoadingMore, isRefreshing, loading]);

  return {
    data,
    error,
    hasMore,
    isLoadingMore,
    isRefreshing,
    loading,
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
  const sourceKind = source.kind;
  const sourceType = 'type' in source ? source.type : undefined;
  const sourceTimeWindow =
    source.kind === 'trending' ? source.timeWindow : undefined;
  const sourceGenreId = source.kind === 'discover' ? source.genreId : undefined;
  const sourceSortBy = source.kind === 'discover' ? source.sortBy : undefined;
  const sourceVoteCountGte =
    source.kind === 'discover' ? source.voteCountGte : undefined;
  const sourceQuery = source.kind === 'search' ? source.query.trim() : '';
  const filterLabelsKey = (source.filterLabels ?? EMPTY_FILTER_LABELS).join('|');
  const activeFilterLabels = useMemo(() => {
    return filterLabelsKey ? filterLabelsKey.split('|') : EMPTY_FILTER_LABELS;
  }, [filterLabelsKey]);

  const fetchPage = useCallback(
    (page: number, signal?: AbortSignal) => {
      switch (sourceKind) {
        case 'trending':
          return getTrending(sourceType as 'movie' | 'tv' | 'all', sourceTimeWindow as 'day' | 'week', page, { signal });
        case 'popular':
          return getPopular(sourceType as 'movie' | 'tv', page, { signal });
        case 'topRated':
          return getTopRated(sourceType as 'movie' | 'tv', page, { signal });
        case 'nowPlaying':
          return getNowPlaying(sourceType as 'movie' | 'tv', page, { signal });
        case 'discover':
          return discoverByGenre(sourceType as 'movie' | 'tv', sourceGenreId as number, {
            page,
            signal,
            sortBy: sourceSortBy,
            voteCountGte: sourceVoteCountGte
          });
        case 'search':
          return search(sourceQuery, sourceType as 'movie' | 'tv' | 'multi', page, {
            signal
          });
      }
    },
    [
      sourceGenreId,
      sourceKind,
      sourceQuery,
      sourceSortBy,
      sourceTimeWindow,
      sourceType,
      sourceVoteCountGte
    ]
  );

  const optionFilter = options.filter;
  const sourceFilter = useMemo(() => {
    if (activeFilterLabels.length === 0) {
      return undefined;
    }

    return (item: MovieData) => matchesGenreLabels(item, activeFilterLabels);
  }, [activeFilterLabels]);

  const combinedFilter = useMemo(() => {
    if (sourceKind === 'discover' || sourceKind === 'search') {
      return (item: MovieData) =>
        hasPoster(item) &&
        (sourceFilter ? sourceFilter(item) : true) &&
        (optionFilter ? optionFilter(item) : true);
    }

    if (sourceFilter && optionFilter) {
      return (item: MovieData) => sourceFilter(item) && optionFilter(item);
    }

    if (sourceFilter) {
      return sourceFilter;
    }

    if (optionFilter) {
      return optionFilter;
    }

    return undefined;
  }, [optionFilter, sourceFilter, sourceKind]);
  const isEnabled =
    (options.enabled ?? true) &&
    (sourceKind !== 'search' || sourceQuery.length > 0);

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

export function useActorsCatalog(query: string): UsePeopleCatalogResult {
  const trimmedQuery = query.trim();
  const fetchPage = useCallback(
    (page: number, signal?: AbortSignal) =>
      trimmedQuery
        ? searchPeople(trimmedQuery, page, { signal })
        : getPopularPeople(page, { signal }),
    [trimmedQuery]
  );

  return usePaginatedPeopleQuery(fetchPage, {
    enabled: true,
    initialPageBatch: trimmedQuery ? 1 : 2
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

export function usePersonProfile(
  personId: number | undefined
): UsePersonProfileResult {
  const [data, setData] = useState<PersonProfileResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(personId));
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!personId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    let active = true;

    setLoading(true);
    setError(null);

    getPersonProfile(personId, {
      signal: controller.signal
    })
      .then((response) => {
        if (!active || controller.signal.aborted) {
          return;
        }

        startTransition(() => {
          setData(response);
        });
      })
      .catch((err: unknown) => {
        if (
          !active ||
          (err instanceof DOMException && err.name === 'AbortError')
        ) {
          return;
        }

        setError(getErrorMessage(err));
      })
      .finally(() => {
        if (active && !controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [personId, refreshKey]);

  return {
    data,
    error,
    loading,
    refetch: () => {
      setRefreshKey((current) => current + 1);
    }
  };
}
