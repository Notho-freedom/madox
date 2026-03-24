import {
  getTmdbCacheRecord,
  setTmdbCacheRecord
} from './localDb';

const DEFAULT_API_BASE_URL = 'http://127.0.0.1:47877';
const CLIENT_CACHE_TTL_MS = 30_000;

type ApiResponseSource = 'cache' | 'memory' | 'network';

interface MemoryCacheEntry {
  cachedAt: number;
  expiresAt: number;
  value: unknown;
}

export interface ApiCacheSnapshot<T> {
  cachedAt: number;
  data: T;
  expiresAt: number;
  isStale: boolean;
  source: Exclude<ApiResponseSource, 'network'>;
}

const responseCache = new Map<string, MemoryCacheEntry>();
const inflightRequests = new Map<string, Promise<unknown>>();

function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;
}

function buildUrl(
  pathname: string,
  params?: Record<string, string | number | undefined>
) {
  const url = new URL(pathname, getApiBaseUrl());

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === '') {
        continue;
      }

      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

export interface ApiFetchOptions {
  body?: unknown;
  cacheTtlMs?: number;
  method?: 'GET' | 'POST';
  signal?: AbortSignal;
  skipCache?: boolean;
}

export function buildApiCacheKey(
  pathname: string,
  params?: Record<string, string | number | undefined>,
  options: Pick<ApiFetchOptions, 'body' | 'method'> = {}
): string {
  const { body, method = 'GET' } = options;
  const url = buildUrl(pathname, params);
  return `${method}:${url.toString()}:${body ? JSON.stringify(body) : ''}`;
}

function setMemoryCacheEntry<T>(
  cacheKey: string,
  data: T,
  cachedAt: number,
  expiresAt: number
) {
  responseCache.set(cacheKey, {
    cachedAt,
    expiresAt,
    value: data
  });
}

async function writePersistentCache<T>(
  cacheKey: string,
  data: T,
  cachedAt: number,
  expiresAt: number
) {
  await setTmdbCacheRecord({
    key: cacheKey,
    data,
    cachedAt,
    expiresAt
  });
}

export async function readApiCacheSnapshot<T>(
  pathname: string,
  params?: Record<string, string | number | undefined>,
  options: Pick<ApiFetchOptions, 'body' | 'method'> = {}
): Promise<ApiCacheSnapshot<T> | null> {
  const cacheKey = buildApiCacheKey(pathname, params, options);
  const memoryEntry = responseCache.get(cacheKey);

  if (memoryEntry) {
    return {
      cachedAt: memoryEntry.cachedAt,
      data: memoryEntry.value as T,
      expiresAt: memoryEntry.expiresAt,
      isStale: memoryEntry.expiresAt <= Date.now(),
      source: 'memory'
    };
  }

  const persistentEntry = await getTmdbCacheRecord<T>(cacheKey);

  if (!persistentEntry) {
    return null;
  }

  setMemoryCacheEntry(
    cacheKey,
    persistentEntry.data,
    persistentEntry.cachedAt,
    persistentEntry.expiresAt
  );

  return {
    cachedAt: persistentEntry.cachedAt,
    data: persistentEntry.data,
    expiresAt: persistentEntry.expiresAt,
    isStale: persistentEntry.expiresAt <= Date.now(),
    source: 'cache'
  };
}

export async function apiFetch<T>(
  pathname: string,
  params?: Record<string, string | number | undefined>,
  options: ApiFetchOptions = {}
): Promise<T> {
  const {
    body,
    cacheTtlMs = CLIENT_CACHE_TTL_MS,
    method = 'GET',
    signal,
    skipCache = false
  } = options;

  const url = buildUrl(pathname, params);
  const cacheKey = buildApiCacheKey(pathname, params, {
    body,
    method
  });

  if (!skipCache && method === 'GET') {
    const memoryEntry = responseCache.get(cacheKey);

    if (memoryEntry && memoryEntry.expiresAt > Date.now()) {
      return memoryEntry.value as T;
    }

    const persistentEntry = await getTmdbCacheRecord<T>(cacheKey);

    if (persistentEntry && persistentEntry.expiresAt > Date.now()) {
      setMemoryCacheEntry(
        cacheKey,
        persistentEntry.data,
        persistentEntry.cachedAt,
        persistentEntry.expiresAt
      );
      return persistentEntry.data;
    }
  }

  const existingRequest = inflightRequests.get(cacheKey);
  if (existingRequest) {
    return existingRequest as Promise<T>;
  }

  const request = (async () => {
    const response = await fetch(url, {
      method,
      signal,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error?.error ||
          error?.message ||
          `API request failed with status ${response.status}.`
      );
    }

    const payload = (await response.json()) as T;

    if (method === 'GET') {
      const cachedAt = Date.now();
      const expiresAt = cachedAt + cacheTtlMs;

      setMemoryCacheEntry(cacheKey, payload, cachedAt, expiresAt);
      await writePersistentCache(cacheKey, payload, cachedAt, expiresAt);
    }

    return payload;
  })().finally(() => {
    inflightRequests.delete(cacheKey);
  });

  inflightRequests.set(cacheKey, request);

  return request;
}
