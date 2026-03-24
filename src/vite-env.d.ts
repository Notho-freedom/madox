/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_TMDB_API_TOKEN?: string;
  readonly VITE_TMDB_API_BASE_URL?: string;
  readonly VITE_TMDB_IMAGE_BASE_URL?: string;
  readonly VITE_TMDB_LANGUAGE?: string;
  readonly VITE_TMDB_CACHE_TTL_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
