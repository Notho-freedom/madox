const DEFAULT_API_BASE_URL = 'http://127.0.0.1:47877';
const CLIENT_CACHE_TTL_MS = 30_000;

const responseCache = new Map<string, { expiresAt: number; value: unknown }>();
const inflightRequests = new Map<string, Promise<unknown>>();

function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;
}

function buildUrl(pathname: string, params?: Record<string, string | number | undefined>) {
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

interface ApiFetchOptions {
  body?: unknown;
  cacheTtlMs?: number;
  method?: 'GET' | 'POST';
  signal?: AbortSignal;
  skipCache?: boolean;
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
  const cacheKey = `${method}:${url.toString()}:${body ? JSON.stringify(body) : ''}`;

  if (!skipCache && method === 'GET') {
    const cached = responseCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value as T;
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
        error?.error || error?.message || `API request failed with status ${response.status}.`
      );
    }

    const payload = (await response.json()) as T;

    if (!skipCache && method === 'GET') {
      responseCache.set(cacheKey, {
        expiresAt: Date.now() + cacheTtlMs,
        value: payload
      });
    }

    return payload;
  })().finally(() => {
    inflightRequests.delete(cacheKey);
  });

  inflightRequests.set(cacheKey, request);

  return request;
}
