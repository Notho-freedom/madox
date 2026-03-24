export const serverEnv = {
  apiHost: process.env.API_HOST?.trim() || '127.0.0.1',
  apiPort: Number(process.env.API_PORT || '47877'),
  apiPublicBaseUrl:
    process.env.API_PUBLIC_BASE_URL?.trim() ||
    process.env.VITE_API_BASE_URL?.trim() ||
    '',
  meiliApiKey: process.env.MEILISEARCH_API_KEY?.trim() || '',
  meiliHost: process.env.MEILISEARCH_HOST?.trim() || '',
  meiliIndexPrefix: process.env.MEILI_INDEX_PREFIX?.trim() || 'madox',
  qstashCurrentSigningKey:
    process.env.QSTASH_CURRENT_SIGNING_KEY?.trim() || '',
  qstashNextSigningKey:
    process.env.QSTASH_NEXT_SIGNING_KEY?.trim() || '',
  qstashToken: process.env.QSTASH_TOKEN?.trim() || '',
  redisRestToken: process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || '',
  redisRestUrl: process.env.UPSTASH_REDIS_REST_URL?.trim() || '',
  sentryDsn:
    process.env.SENTRY_DSN?.trim() ||
    process.env.VITE_SENTRY_DSN?.trim() ||
    '',
  tmdbApiBaseUrl:
    process.env.TMDB_API_BASE_URL?.trim() ||
    process.env.VITE_TMDB_API_BASE_URL?.trim() ||
    'https://api.themoviedb.org/3',
  tmdbApiToken:
    process.env.TMDB_API_TOKEN?.trim() ||
    process.env.VITE_TMDB_API_TOKEN?.trim() ||
    '',
  tmdbImageBaseUrl:
    process.env.VITE_TMDB_IMAGE_BASE_URL?.trim() ||
    'https://image.tmdb.org/t/p',
  tmdbLanguage:
    process.env.TMDB_LANGUAGE?.trim() ||
    process.env.VITE_TMDB_LANGUAGE?.trim() ||
    'fr-FR'
};

export function getLocalApiBaseUrl(): string {
  return `http://${serverEnv.apiHost}:${serverEnv.apiPort}`;
}

export function canUseRemoteTasks(): boolean {
  const baseUrl = serverEnv.apiPublicBaseUrl;

  if (!baseUrl) {
    return false;
  }

  try {
    const parsed = new URL(baseUrl);
    const hostname = parsed.hostname.toLowerCase();

    return !['127.0.0.1', 'localhost', '0.0.0.0'].includes(hostname);
  } catch {
    return false;
  }
}
