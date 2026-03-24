import { serve } from '@hono/node-server';
import * as Sentry from '@sentry/node';
import { Client as QStashClient, Receiver } from '@upstash/qstash';
import { Redis } from '@upstash/redis';
import { MeiliSearch } from 'meilisearch';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { homeGenreOptions, getHomeGenreOption, type HomeGenreId } from '../src/data/homeGenres';
import { getHeroSource, getHomeSectionSet } from '../src/data/homeContent';
import { type TMDBCatalogSource } from '../src/hooks/useTMDB';
import {
  mapMoviePage,
  type HomeBootstrapResponse,
  type MoviePageResult,
  type PersonMediaCredit,
  personCreditToMediaData,
  type TMDBCast,
  type TMDBGenre,
  type TMDBMovie,
  type TMDBMovieDetails,
  type TMDBPageResult,
  type TMDBPersonCombinedCredit,
  type TMDBPersonDetails,
  type TMDBPersonExternalIds,
  type TMDBPersonImage,
  type PersonProfileResponse,
  type TMDBVideo
} from '../src/services/tmdbShared';
import { canUseRemoteTasks, serverEnv } from './config';

type MediaType = 'movie' | 'tv';
type CatalogKind =
  | 'discover'
  | 'nowPlaying'
  | 'popular'
  | 'similar'
  | 'topRated'
  | 'trending'
  | 'upcoming';

type WarmJobPayload =
  | { genre: HomeGenreId; kind: 'bootstrap' }
  | {
      kind: 'catalog';
      params: Record<string, string | number>;
    }
  | {
      full?: boolean;
      kind: 'reindex-search';
    };

interface CacheEnvelope<T> {
  cachedAt: number;
  data: T;
  expiresAt: number;
  staleUntil: number;
}

interface SearchDocument {
  backdropPath?: string | null;
  color: string;
  description?: string;
  genre?: string;
  id: string;
  mediaType?: 'movie' | 'tv';
  popularity?: number;
  posterPath?: string | null;
  rating: string;
  searchId: string;
  title: string;
  tmdbId?: number;
  updatedAt?: number;
  voteCount?: number;
  year: string;
}

const DISCOVERY_TTL_MS = 15 * 60 * 1000;
const DETAILS_TTL_MS = 24 * 60 * 60 * 1000;
const SEARCH_TTL_MS = 10 * 60 * 1000;
const STALE_MULTIPLIER = 4;
const SEARCH_INDEX_NAME = `${serverEnv.meiliIndexPrefix}_content`;
const SEARCH_PAGE_SIZE = 20;
const redis =
  serverEnv.redisRestUrl && serverEnv.redisRestToken ?
    new Redis({
      token: serverEnv.redisRestToken,
      url: serverEnv.redisRestUrl
    }) :
    null;
const qstash =
  serverEnv.qstashToken ?
    new QStashClient({
      token: serverEnv.qstashToken
    }) :
    null;
const qstashReceiver =
  serverEnv.qstashCurrentSigningKey || serverEnv.qstashNextSigningKey ?
    new Receiver({
      currentSigningKey: serverEnv.qstashCurrentSigningKey,
      nextSigningKey: serverEnv.qstashNextSigningKey
    }) :
    null;
const meili =
  serverEnv.meiliHost && serverEnv.meiliApiKey ?
    new MeiliSearch({
      apiKey: serverEnv.meiliApiKey,
      host: serverEnv.meiliHost
    }) :
    null;
const memoryCache = new Map<string, CacheEnvelope<unknown>>();
const inflight = new Map<string, Promise<unknown>>();
let schedulesEnsured = false;
let searchIndexEnsured = false;

function initServerTelemetry() {
  if (!serverEnv.sentryDsn || Sentry.isInitialized()) {
    return;
  }

  Sentry.init({
    dsn: serverEnv.sentryDsn,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.2
  });
}

function cacheKey(scope: string, payload: Record<string, string | number | undefined>) {
  const normalized = Object.entries(payload)
    .filter(([, value]) => value !== undefined && value !== '')
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');

  return `madox:${scope}:${normalized}`;
}

function matchesGenreLabels(movie: SearchDocument, labels: string[]) {
  const genres = movie.genre ?? '';
  return labels.some((label) => genres.includes(label));
}

async function getCacheEnvelope<T>(key: string): Promise<CacheEnvelope<T> | null> {
  const memoryEntry = memoryCache.get(key);
  if (memoryEntry) {
    return memoryEntry as CacheEnvelope<T>;
  }

  if (!redis) {
    return null;
  }

  try {
    const raw = await redis.get<string>(key);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as CacheEnvelope<T>;
    memoryCache.set(key, parsed as CacheEnvelope<unknown>);
    return parsed;
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
}

async function setCacheEnvelope<T>(key: string, envelope: CacheEnvelope<T>) {
  memoryCache.set(key, envelope as CacheEnvelope<unknown>);

  if (!redis) {
    return;
  }

  try {
    const ttlSeconds = Math.max(
      1,
      Math.ceil((envelope.staleUntil - Date.now()) / 1000)
    );
    await redis.set(key, JSON.stringify(envelope), {
      ex: ttlSeconds
    });
  } catch (error) {
    Sentry.captureException(error);
  }
}

async function queueWarmJob(body: WarmJobPayload, deduplicationId: string) {
  if (!qstash || !canUseRemoteTasks()) {
    return false;
  }

  try {
    await qstash.publishJSON({
      body,
      deduplicationId,
      headers: {
        'Content-Type': 'application/json'
      },
      retries: 3,
      url: `${serverEnv.apiPublicBaseUrl}/api/internal/${body.kind === 'reindex-search' ? 'reindex-search' : 'warm-cache'}`
    });
    return true;
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
}

async function ensureSearchIndex() {
  if (!meili || searchIndexEnsured) {
    return;
  }

  searchIndexEnsured = true;

  try {
    await meili.createIndex(SEARCH_INDEX_NAME, {
      primaryKey: 'searchId'
    }).catch(() => undefined);

    const index = meili.index<SearchDocument>(SEARCH_INDEX_NAME);
    await Promise.all([
      index.updateSearchableAttributes(['title', 'genre', 'description', 'year']),
      index.updateFilterableAttributes(['mediaType', 'genre', 'year']),
      index.updateSortableAttributes(['popularity', 'voteCount', 'year'])
    ]);
  } catch (error) {
    Sentry.captureException(error);
  }
}

async function indexMoviesForSearch(items: SearchDocument[]) {
  if (!meili || items.length === 0) {
    return;
  }

  await ensureSearchIndex();

  try {
    const index = meili.index<SearchDocument>(SEARCH_INDEX_NAME);
    await index.addDocuments(items);
  } catch (error) {
    Sentry.captureException(error);
  }
}

function toSearchDocuments(items: SearchDocument[]): SearchDocument[] {
  return items.map((item) => ({
    ...item,
    searchId: `${item.mediaType ?? 'movie'}-${item.tmdbId ?? item.id}`
  }));
}

async function searchInMeili(
  query: string,
  type: 'movie' | 'tv' | 'multi',
  page: number
): Promise<MoviePageResult | null> {
  if (!meili || query.trim().length === 0) {
    return null;
  }

  await ensureSearchIndex();

  try {
    const index = meili.index<SearchDocument>(SEARCH_INDEX_NAME);
    const response = await index.search(query, {
      filter: type === 'multi' ? undefined : `mediaType = "${type}"`,
      limit: SEARCH_PAGE_SIZE,
      offset: (page - 1) * SEARCH_PAGE_SIZE
    });
    const hits = (response.hits ?? []).map((item) => {
      const nextItem = { ...item };
      delete nextItem.searchId;
      return nextItem;
    });
    const totalHits = response.estimatedTotalHits ?? hits.length;

    return {
      page,
      results: hits,
      total_pages: Math.max(1, Math.ceil(totalHits / SEARCH_PAGE_SIZE)),
      total_results: totalHits
    };
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
}

async function verifyInternalRequest(
  signature: string | undefined,
  rawBody: string,
  url: string
) {
  if (!signature) {
    return process.env.NODE_ENV !== 'production';
  }

  if (!qstashReceiver) {
    return false;
  }

  try {
    return qstashReceiver.verify({
      body: rawBody,
      signature,
      url
    });
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
}

async function tmdbFetchJson<T>(
  endpoint: string,
  params: Record<string, string | number | undefined> = {}
): Promise<T> {
  if (!serverEnv.tmdbApiToken) {
    throw new Error('Missing TMDB_API_TOKEN for backend requests.');
  }

  const normalizedBaseUrl = serverEnv.tmdbApiBaseUrl.endsWith('/')
    ? serverEnv.tmdbApiBaseUrl
    : `${serverEnv.tmdbApiBaseUrl}/`;
  const normalizedEndpoint = endpoint.replace(/^\/+/, '');
  const url = new URL(normalizedEndpoint, normalizedBaseUrl);
  url.searchParams.set('language', serverEnv.tmdbLanguage);

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') {
      continue;
    }

    url.searchParams.set(key, String(value));
  }

  return Sentry.startSpan(
    {
      name: 'tmdb_fetch',
      op: 'http.client',
      attributes: {
        endpoint
      }
    },
    async () => {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${serverEnv.tmdbApiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error?.status_message || `TMDB error ${response.status}`
        );
      }

      return response.json() as Promise<T>;
    }
  );
}

async function readThroughCache<T>(
  key: string,
  ttlMs: number,
  loader: () => Promise<T>,
  warmPayload?: WarmJobPayload
): Promise<T> {
  const now = Date.now();
  const cached = await getCacheEnvelope<T>(key);

  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  if (cached && cached.staleUntil > now) {
    const queueId = `${key}:warm`;
    const queued = warmPayload ? await queueWarmJob(warmPayload, queueId) : false;

    if (!queued) {
      void refreshCacheInBackground(key, ttlMs, loader);
    }

    return cached.data;
  }

  const currentRequest = inflight.get(key);
  if (currentRequest) {
    return currentRequest as Promise<T>;
  }

  const request = refreshCacheInBackground(key, ttlMs, loader).finally(() => {
    inflight.delete(key);
  });
  inflight.set(key, request);
  return request;
}

async function refreshCacheInBackground<T>(
  key: string,
  ttlMs: number,
  loader: () => Promise<T>
): Promise<T> {
  const data = await loader();
  const cachedAt = Date.now();
  await setCacheEnvelope(key, {
    cachedAt,
    data,
    expiresAt: cachedAt + ttlMs,
    staleUntil: cachedAt + ttlMs * STALE_MULTIPLIER
  });
  return data;
}

async function getTrendingCatalog(
  type: 'movie' | 'tv' | 'all',
  timeWindow: 'day' | 'week',
  page: number
) {
  const key = cacheKey('catalog', {
    kind: 'trending',
    page,
    timeWindow,
    type
  });

  return readThroughCache(
    key,
    DISCOVERY_TTL_MS,
    async () => {
      const result = await tmdbFetchJson<TMDBPageResult<TMDBMovie>>(
        `/trending/${type}/${timeWindow}`,
        { page }
      );
      return mapMoviePage(result);
    },
    {
      kind: 'catalog',
      params: {
        kind: 'trending',
        page,
        timeWindow,
        type
      }
    }
  );
}

async function getPopularCatalog(type: MediaType, page: number) {
  const key = cacheKey('catalog', { kind: 'popular', page, type });

  return readThroughCache(
    key,
    DISCOVERY_TTL_MS,
    async () => {
      const result = await tmdbFetchJson<TMDBPageResult<TMDBMovie>>(
        `/${type}/popular`,
        { page }
      );
      return mapMoviePage(result);
    },
    {
      kind: 'catalog',
      params: {
        kind: 'popular',
        page,
        type
      }
    }
  );
}

async function getTopRatedCatalog(type: MediaType, page: number) {
  const key = cacheKey('catalog', { kind: 'topRated', page, type });

  return readThroughCache(
    key,
    DISCOVERY_TTL_MS,
    async () => {
      const result = await tmdbFetchJson<TMDBPageResult<TMDBMovie>>(
        `/${type}/top_rated`,
        { page }
      );
      return mapMoviePage(result);
    },
    {
      kind: 'catalog',
      params: {
        kind: 'topRated',
        page,
        type
      }
    }
  );
}

async function getNowPlayingCatalog(type: MediaType, page: number) {
  const key = cacheKey('catalog', { kind: 'nowPlaying', page, type });
  const endpoint = type === 'movie' ? '/movie/now_playing' : '/tv/on_the_air';

  return readThroughCache(
    key,
    DISCOVERY_TTL_MS,
    async () => {
      const result = await tmdbFetchJson<TMDBPageResult<TMDBMovie>>(endpoint, {
        page
      });
      return mapMoviePage(result);
    },
    {
      kind: 'catalog',
      params: {
        kind: 'nowPlaying',
        page,
        type
      }
    }
  );
}

async function getUpcomingCatalog(page: number) {
  const key = cacheKey('catalog', { kind: 'upcoming', page, type: 'movie' });

  return readThroughCache(
    key,
    DISCOVERY_TTL_MS,
    async () => {
      const result = await tmdbFetchJson<TMDBPageResult<TMDBMovie>>(
        '/movie/upcoming',
        { page }
      );
      return mapMoviePage(result);
    },
    {
      kind: 'catalog',
      params: {
        kind: 'upcoming',
        page,
        type: 'movie'
      }
    }
  );
}

async function getDiscoverCatalog(
  type: MediaType,
  genreId: number,
  page: number,
  sortBy: string,
  voteCountGte?: number
) {
  const key = cacheKey('catalog', {
    genreId,
    kind: 'discover',
    page,
    sortBy,
    type,
    voteCountGte
  });

  return readThroughCache(
    key,
    DISCOVERY_TTL_MS,
    async () => {
      const result = await tmdbFetchJson<TMDBPageResult<TMDBMovie>>(
        `/discover/${type}`,
        {
          page,
          sort_by: sortBy,
          with_genres: genreId,
          ...(voteCountGte ? { 'vote_count.gte': voteCountGte } : {})
        }
      );
      return mapMoviePage(result);
    },
    {
      kind: 'catalog',
      params: {
        genreId,
        kind: 'discover',
        page,
        sortBy,
        type,
        voteCountGte
      }
    }
  );
}

async function getSimilarCatalog(type: MediaType, id: number, page: number) {
  const key = cacheKey('catalog', {
    id,
    kind: 'similar',
    mediaType: type,
    page
  });

  return readThroughCache(
    key,
    DETAILS_TTL_MS,
    async () => {
      const result = await tmdbFetchJson<TMDBPageResult<TMDBMovie>>(
        `/${type}/${id}/similar`,
        { page }
      );
      return mapMoviePage(result);
    }
  );
}

async function getDetailsPayload(type: MediaType, id: number) {
  const key = cacheKey('details', { id, type });
  return readThroughCache(
    key,
    DETAILS_TTL_MS,
    () => tmdbFetchJson<TMDBMovieDetails>(`/${type}/${id}`)
  );
}

async function getCreditsPayload(type: MediaType, id: number) {
  const key = cacheKey('credits', { id, type });
  return readThroughCache(
    key,
    DETAILS_TTL_MS,
    async () => {
      const result = await tmdbFetchJson<{ cast: TMDBCast[] }>(`/${type}/${id}/credits`);
      return result.cast;
    }
  );
}

async function getVideosPayload(type: MediaType, id: number) {
  const key = cacheKey('videos', { id, type });
  return readThroughCache(
    key,
    DETAILS_TTL_MS,
    async () => {
      const result = await tmdbFetchJson<{ results: TMDBVideo[] }>(`/${type}/${id}/videos`);
      return result.results;
    }
  );
}

async function getGenresPayload(type: MediaType) {
  const key = cacheKey('genres', { type });
  return readThroughCache(
    key,
    DETAILS_TTL_MS,
    async () => {
      const result = await tmdbFetchJson<{ genres: TMDBGenre[] }>(`/genre/${type}/list`);
      return result.genres;
    }
  );
}

function comparePersonCredits(
  left: PersonMediaCredit,
  right: PersonMediaCredit
) {
  return (
    right.popularity - left.popularity ||
    right.voteCount - left.voteCount ||
    parseFloat(right.rating) - parseFloat(left.rating) ||
    Number(right.year || 0) - Number(left.year || 0)
  );
}

function normalizePersonFilmography(
  credits: TMDBPersonCombinedCredit[]
): PersonMediaCredit[] {
  const deduped = new Map<string, PersonMediaCredit>();

  for (const credit of credits) {
    if (credit.media_type !== 'movie' && credit.media_type !== 'tv') {
      continue;
    }

    const normalized = personCreditToMediaData(credit);
    const key = `${normalized.mediaType}:${normalized.tmdbId}`;
    const current = deduped.get(key);

    if (!current || comparePersonCredits(normalized, current) < 0) {
      deduped.set(key, normalized);
    }
  }

  return Array.from(deduped.values()).sort(comparePersonCredits);
}

async function getPersonProfilePayload(id: number): Promise<PersonProfileResponse> {
  const key = cacheKey('person-profile', { id });

  return readThroughCache(key, DETAILS_TTL_MS, async () => {
    const [detailsResult, imagesResult, creditsResult, externalIdsResult] =
      await Promise.allSettled([
        tmdbFetchJson<TMDBPersonDetails>(`/person/${id}`),
        tmdbFetchJson<{ profiles: TMDBPersonImage[] }>(`/person/${id}/images`),
        tmdbFetchJson<{ cast: TMDBPersonCombinedCredit[] }>(
          `/person/${id}/combined_credits`
        ),
        tmdbFetchJson<TMDBPersonExternalIds>(`/person/${id}/external_ids`)
      ]);

    if (detailsResult.status !== 'fulfilled') {
      throw detailsResult.reason;
    }

    if (creditsResult.status !== 'fulfilled') {
      throw creditsResult.reason;
    }

    const person = detailsResult.value;
    const filmography = normalizePersonFilmography(creditsResult.value.cast);
    const images =
      imagesResult.status === 'fulfilled' ? imagesResult.value.profiles : [];
    const externalIds =
      externalIdsResult.status === 'fulfilled' ? externalIdsResult.value : null;

    return {
      externalIds,
      filmography,
      images,
      knownFor: filmography.slice(0, 6),
      person,
      stats: {
        actingCredits: filmography.length,
        movies: filmography.filter((item) => item.mediaType === 'movie').length,
        series: filmography.filter((item) => item.mediaType === 'tv').length
      }
    };
  });
}

async function searchTmdbCatalog(
  query: string,
  type: 'movie' | 'tv' | 'multi',
  page: number
) {
  const key = cacheKey('search', { page, query, type });

  return readThroughCache(
    key,
    SEARCH_TTL_MS,
    async () => {
      const meiliResult = await searchInMeili(query, type, page);
      if (meiliResult && meiliResult.results.length > 0) {
        return meiliResult;
      }

      const result = await tmdbFetchJson<TMDBPageResult<TMDBMovie>>(
        `/search/${type}`,
        {
          page,
          query
        }
      );
      const mapped = mapMoviePage(result);
      void indexMoviesForSearch(
        toSearchDocuments(
          mapped.results.map((item) => ({
            ...item,
            searchId: `${item.mediaType ?? 'movie'}-${item.tmdbId ?? item.id}`
          }))
        )
      );
      return mapped;
    }
  );
}

async function fetchCatalogFromSource(source: TMDBCatalogSource, page: number) {
  switch (source.kind) {
    case 'trending': {
      const result = await getTrendingCatalog(source.type, source.timeWindow, page);
      return source.filterLabels?.length ?
        {
          ...result,
          results: result.results.filter((item) =>
            matchesGenreLabels(item, source.filterLabels)
          )
        } :
        result;
    }
    case 'popular':
      return getPopularCatalog(source.type, page);
    case 'topRated':
      return getTopRatedCatalog(source.type, page);
    case 'nowPlaying':
      return getNowPlayingCatalog(source.type, page);
    case 'discover':
      return getDiscoverCatalog(
        source.type,
        source.genreId,
        page,
        source.sortBy || 'popularity.desc',
        source.voteCountGte
      );
    case 'search':
      return searchTmdbCatalog(source.query, source.type, page);
    default:
      throw new Error(`Unsupported source kind "${String(source.kind)}".`);
  }
}

function mergeUniqueResults(pages: MoviePageResult[]) {
  const merged = new Map<string, SearchDocument>();

  for (const page of pages) {
    for (const movie of page.results) {
      merged.set(movie.id, {
        ...movie,
        searchId: `${movie.mediaType ?? 'movie'}-${movie.tmdbId ?? movie.id}`
      });
    }
  }

  return Array.from(merged.values()).map((movie) => {
    const nextMovie = { ...movie };
    delete nextMovie.searchId;
    return nextMovie;
  });
}

async function getHomeBootstrap(genre: HomeGenreId): Promise<HomeBootstrapResponse> {
  const cacheId = cacheKey('home-bootstrap', { genre });
  const genreOption = getHomeGenreOption(genre);
  const heroSource = getHeroSource(genreOption);
  const sectionSet = getHomeSectionSet(genreOption);

  return readThroughCache(
    cacheId,
    DISCOVERY_TTL_MS,
    async () => {
      const [heroPage, primarySectionPage] = await Promise.all([
        fetchCatalogFromSource(heroSource, 1),
        fetchCatalogFromSource(sectionSet.trending.source, 1)
      ]);

      let heroCandidates = heroPage.results;

      if (genreOption.id !== 'all' && heroCandidates.length < 4) {
        const fallback = await getTrendingCatalog('all', 'day', 1);
        heroCandidates = mergeUniqueResults([heroPage, fallback]).slice(0, 6);
      }

      return {
        heroCandidates,
        primarySection: {
          id: sectionSet.trending.id,
          page: primarySectionPage
        }
      };
    },
    {
      genre,
      kind: 'bootstrap'
    }
  );
}

async function warmHotSearchIndex(full = false) {
  const hotSources = [
    { kind: 'trending', timeWindow: 'week', type: 'all' as const },
    { kind: 'popular', type: 'movie' as const },
    { kind: 'popular', type: 'tv' as const },
    { kind: 'topRated', type: 'movie' as const }
  ];

  const documents = new Map<string, SearchDocument>();

  for (const genre of full ? homeGenreOptions.map((item) => item.id) : ['all' as HomeGenreId]) {
    const option = getHomeGenreOption(genre);
    const sectionSet = getHomeSectionSet(option);
    const genreSources = full ? [getHeroSource(option), sectionSet.trending.source] : [];

    for (const source of [...hotSources, ...genreSources]) {
      const page = await fetchCatalogFromSource(source, 1);
      for (const movie of page.results) {
        const searchId = `${movie.mediaType ?? 'movie'}-${movie.tmdbId ?? movie.id}`;
        documents.set(searchId, {
          ...movie,
          searchId
        });
      }
    }
  }

  await indexMoviesForSearch(Array.from(documents.values()));
}

async function ensureSchedules() {
  if (schedulesEnsured || !qstash || !canUseRemoteTasks()) {
    return;
  }

  schedulesEnsured = true;

  try {
    const schedules = await qstash.schedules.list();
    const existing = new Set(
      schedules.map((schedule) => `${schedule.destination}:${schedule.cron}`)
    );
    const scheduleSpecs = [
      {
        body: { genre: 'all', kind: 'bootstrap' },
        cron: '*/15 * * * *',
        destination: `${serverEnv.apiPublicBaseUrl}/api/internal/warm-cache`
      },
      {
        body: { full: false, kind: 'reindex-search' },
        cron: '0 * * * *',
        destination: `${serverEnv.apiPublicBaseUrl}/api/internal/reindex-search`
      },
      {
        body: { full: true, kind: 'reindex-search' },
        cron: '0 2 * * *',
        destination: `${serverEnv.apiPublicBaseUrl}/api/internal/reindex-search`
      }
    ];

    for (const spec of scheduleSpecs) {
      const key = `${spec.destination}:${spec.cron}`;
      if (existing.has(key)) {
        continue;
      }

      await qstash.schedules.create({
        body: JSON.stringify(spec.body),
        cron: spec.cron,
        destination: spec.destination,
        headers: {
          'Content-Type': 'application/json'
        },
        retries: 3
      });
    }
  } catch (error) {
    Sentry.captureException(error);
  }
}

function jsonError(error: unknown) {
  return {
    error: error instanceof Error ? error.message : 'Unknown API error.'
  };
}

export function createApiApp() {
  initServerTelemetry();
  void ensureSchedules();
  void ensureSearchIndex();

  const app = new Hono();

  app.use(
    '*',
    cors({
      origin: '*'
    })
  );

  app.get('/health', (c) => {
    return c.json({
      meili: Boolean(meili),
      qstash: Boolean(qstash),
      redis: Boolean(redis),
      status: 'ok'
    });
  });

  app.get('/api/home/bootstrap', async (c) => {
    try {
      const genre = (c.req.query('genre') || 'all') as HomeGenreId;
      const payload = await getHomeBootstrap(genre);
      return c.json(payload);
    } catch (error) {
      Sentry.captureException(error);
      return c.json(jsonError(error), 500);
    }
  });

  app.get('/api/catalog', async (c) => {
    try {
      const kind = (c.req.query('kind') || 'trending') as CatalogKind;
      const page = Number(c.req.query('page') || '1');

      if (kind === 'similar') {
        const mediaType = (c.req.query('mediaType') || 'movie') as MediaType;
        const id = Number(c.req.query('id'));
        return c.json(await getSimilarCatalog(mediaType, id, page));
      }

      if (kind === 'upcoming') {
        return c.json(await getUpcomingCatalog(page));
      }

      if (kind === 'discover') {
        const type = (c.req.query('type') || 'movie') as MediaType;
        const genreId = Number(c.req.query('genreId'));
        const sortBy = c.req.query('sortBy') || 'popularity.desc';
        const voteCountGte = Number(c.req.query('voteCountGte') || '0') || undefined;
        return c.json(
          await getDiscoverCatalog(type, genreId, page, sortBy, voteCountGte)
        );
      }

      if (kind === 'popular') {
        const type = (c.req.query('type') || 'movie') as MediaType;
        return c.json(await getPopularCatalog(type, page));
      }

      if (kind === 'topRated') {
        const type = (c.req.query('type') || 'movie') as MediaType;
        return c.json(await getTopRatedCatalog(type, page));
      }

      if (kind === 'nowPlaying') {
        const type = (c.req.query('type') || 'movie') as MediaType;
        return c.json(await getNowPlayingCatalog(type, page));
      }

      const type = (c.req.query('type') || 'all') as 'movie' | 'tv' | 'all';
      const timeWindow = (c.req.query('timeWindow') || 'week') as 'day' | 'week';
      return c.json(await getTrendingCatalog(type, timeWindow, page));
    } catch (error) {
      Sentry.captureException(error);
      return c.json(jsonError(error), 500);
    }
  });

  app.get('/api/search', async (c) => {
    try {
      const q = c.req.query('q') || '';
      const type = (c.req.query('type') || 'multi') as 'movie' | 'tv' | 'multi';
      const page = Number(c.req.query('page') || '1');
      return c.json(await searchTmdbCatalog(q, type, page));
    } catch (error) {
      Sentry.captureException(error);
      return c.json(jsonError(error), 500);
    }
  });

  app.get('/api/details/:mediaType/:id', async (c) => {
    try {
      const mediaType = c.req.param('mediaType') as MediaType;
      const id = Number(c.req.param('id'));
      return c.json(await getDetailsPayload(mediaType, id));
    } catch (error) {
      Sentry.captureException(error);
      return c.json(jsonError(error), 500);
    }
  });

  app.get('/api/details/:mediaType/:id/credits', async (c) => {
    try {
      const mediaType = c.req.param('mediaType') as MediaType;
      const id = Number(c.req.param('id'));
      return c.json(await getCreditsPayload(mediaType, id));
    } catch (error) {
      Sentry.captureException(error);
      return c.json(jsonError(error), 500);
    }
  });

  app.get('/api/details/:mediaType/:id/videos', async (c) => {
    try {
      const mediaType = c.req.param('mediaType') as MediaType;
      const id = Number(c.req.param('id'));
      return c.json(await getVideosPayload(mediaType, id));
    } catch (error) {
      Sentry.captureException(error);
      return c.json(jsonError(error), 500);
    }
  });

  app.get('/api/person/:id/profile', async (c) => {
    try {
      const id = Number(c.req.param('id'));
      return c.json(await getPersonProfilePayload(id));
    } catch (error) {
      Sentry.captureException(error);
      return c.json(jsonError(error), 500);
    }
  });

  app.get('/api/genres', async (c) => {
    try {
      const type = (c.req.query('type') || 'movie') as MediaType;
      return c.json(await getGenresPayload(type));
    } catch (error) {
      Sentry.captureException(error);
      return c.json(jsonError(error), 500);
    }
  });

  app.post('/api/internal/warm-cache', async (c) => {
    const rawBody = await c.req.text();
    const isVerified = await verifyInternalRequest(
      c.req.header('upstash-signature'),
      rawBody,
      c.req.url
    );

    if (!isVerified) {
      return c.json({ error: 'Unauthorized internal request.' }, 401);
    }

    try {
      const body = JSON.parse(rawBody) as WarmJobPayload;

      if (body.kind === 'bootstrap') {
        await getHomeBootstrap(body.genre);
      } else if (body.kind === 'catalog') {
        const page = Number(body.params.page || '1');
        const kind = String(body.params.kind) as CatalogKind;

        if (kind === 'trending') {
          await getTrendingCatalog(
            String(body.params.type || 'all') as 'movie' | 'tv' | 'all',
            String(body.params.timeWindow || 'week') as 'day' | 'week',
            page
          );
        } else if (kind === 'popular') {
          await getPopularCatalog(String(body.params.type || 'movie') as MediaType, page);
        } else if (kind === 'topRated') {
          await getTopRatedCatalog(String(body.params.type || 'movie') as MediaType, page);
        } else if (kind === 'nowPlaying') {
          await getNowPlayingCatalog(String(body.params.type || 'movie') as MediaType, page);
        } else if (kind === 'discover') {
          await getDiscoverCatalog(
            String(body.params.type || 'movie') as MediaType,
            Number(body.params.genreId),
            page,
            String(body.params.sortBy || 'popularity.desc'),
            body.params.voteCountGte ? Number(body.params.voteCountGte) : undefined
          );
        } else if (kind === 'upcoming') {
          await getUpcomingCatalog(page);
        }
      }

      return c.json({ ok: true });
    } catch (error) {
      Sentry.captureException(error);
      return c.json(jsonError(error), 500);
    }
  });

  app.post('/api/internal/reindex-search', async (c) => {
    const rawBody = await c.req.text();
    const isVerified = await verifyInternalRequest(
      c.req.header('upstash-signature'),
      rawBody,
      c.req.url
    );

    if (!isVerified) {
      return c.json({ error: 'Unauthorized internal request.' }, 401);
    }

    try {
      const body = JSON.parse(rawBody || '{}') as WarmJobPayload;
      await warmHotSearchIndex(Boolean(body.full));
      return c.json({ ok: true });
    } catch (error) {
      Sentry.captureException(error);
      return c.json(jsonError(error), 500);
    }
  });

  return app;
}

let apiServerInstance: ReturnType<typeof serve> | null = null;

export function startApiServer() {
  if (apiServerInstance) {
    return apiServerInstance;
  }

  const app = createApiApp();
  apiServerInstance = serve({
    fetch: app.fetch,
    hostname: serverEnv.apiHost,
    port: serverEnv.apiPort
  });

  return apiServerInstance;
}

export async function stopApiServer() {
  if (!apiServerInstance) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    apiServerInstance?.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
  apiServerInstance = null;
}
