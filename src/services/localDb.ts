const DB_NAME = 'madox-local-store';
const DB_VERSION = 2;
const TMDB_CACHE_STORE = 'tmdb-cache';
const WATCH_HISTORY_STORE = 'watch-history';
const WATCHLIST_STORE = 'watchlist';
const LIKES_STORE = 'likes';
const SETTINGS_STORE = 'settings';

export interface TmdbCacheRecord<T = unknown> {
  key: string;
  data: T;
  cachedAt: number;
  expiresAt: number;
}

export interface WatchHistoryRecord {
  id: string;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  year: string;
  rating: string;
  color: string;
  videoId: string;
  genre?: string;
  duration?: string;
  description?: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  popularity?: number;
  voteCount?: number;
  progressPercent: number;
  currentTime: number;
  durationSeconds: number;
  updatedAt: number;
}

export interface MediaLibraryRecord {
  id: string;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  year: string;
  rating: string;
  color: string;
  videoId: string;
  genre?: string;
  duration?: string;
  description?: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  popularity?: number;
  voteCount?: number;
  savedAt: number;
}

export interface SettingsRecord<T = unknown> {
  key: string;
  updatedAt: number;
  value: T;
}

let dbPromise: Promise<IDBDatabase | null> | null = null;

function hasIndexedDbSupport(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}

function wrapRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function openDatabase(): Promise<IDBDatabase | null> {
  if (!hasIndexedDbSupport()) {
    return Promise.resolve(null);
  }

  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(TMDB_CACHE_STORE)) {
        db.createObjectStore(TMDB_CACHE_STORE, {
          keyPath: 'key'
        });
      }

      if (!db.objectStoreNames.contains(WATCH_HISTORY_STORE)) {
        const store = db.createObjectStore(WATCH_HISTORY_STORE, {
          keyPath: 'id'
        });
        store.createIndex('updatedAt', 'updatedAt');
      }

      if (!db.objectStoreNames.contains(WATCHLIST_STORE)) {
        const store = db.createObjectStore(WATCHLIST_STORE, {
          keyPath: 'id'
        });
        store.createIndex('savedAt', 'savedAt');
      }

      if (!db.objectStoreNames.contains(LIKES_STORE)) {
        const store = db.createObjectStore(LIKES_STORE, {
          keyPath: 'id'
        });
        store.createIndex('savedAt', 'savedAt');
      }

      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, {
          keyPath: 'key'
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  }).catch(() => null);

  return dbPromise;
}

async function withStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => Promise<T>
): Promise<T | null> {
  const db = await openDatabase();

  if (!db) {
    return null;
  }

  const transaction = db.transaction(storeName, mode);
  const store = transaction.objectStore(storeName);
  const completion = new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });

  try {
    const result = await operation(store);
    await completion;
    return result;
  } catch (error) {
    transaction.abort();
    throw error;
  }
}

export async function getTmdbCacheRecord<T = unknown>(
  key: string
): Promise<TmdbCacheRecord<T> | null> {
  return withStore(TMDB_CACHE_STORE, 'readonly', async (store) => {
    const record = await wrapRequest(store.get(key));
    return (record as TmdbCacheRecord<T> | undefined) ?? null;
  });
}

export async function setTmdbCacheRecord<T>(
  record: TmdbCacheRecord<T>
): Promise<void> {
  await withStore(TMDB_CACHE_STORE, 'readwrite', async (store) => {
    await wrapRequest(store.put(record));
  });
}

export async function getWatchHistoryRecords(): Promise<WatchHistoryRecord[]> {
  const result = await withStore(WATCH_HISTORY_STORE, 'readonly', async (store) => {
    const records = await wrapRequest(store.getAll());
    return (records as WatchHistoryRecord[]) ?? [];
  });

  return (result ?? []).sort((left, right) => right.updatedAt - left.updatedAt);
}

export async function putWatchHistoryRecord(
  record: WatchHistoryRecord
): Promise<void> {
  await withStore(WATCH_HISTORY_STORE, 'readwrite', async (store) => {
    await wrapRequest(store.put(record));
  });
}

export async function deleteWatchHistoryRecord(id: string): Promise<void> {
  await withStore(WATCH_HISTORY_STORE, 'readwrite', async (store) => {
    await wrapRequest(store.delete(id));
  });
}

async function getMediaLibraryRecords(
  storeName: typeof WATCHLIST_STORE | typeof LIKES_STORE
): Promise<MediaLibraryRecord[]> {
  const result = await withStore(storeName, 'readonly', async (store) => {
    const records = await wrapRequest(store.getAll());
    return (records as MediaLibraryRecord[]) ?? [];
  });

  return (result ?? []).sort((left, right) => right.savedAt - left.savedAt);
}

async function putMediaLibraryRecord(
  storeName: typeof WATCHLIST_STORE | typeof LIKES_STORE,
  record: MediaLibraryRecord
): Promise<void> {
  await withStore(storeName, 'readwrite', async (store) => {
    await wrapRequest(store.put(record));
  });
}

async function deleteMediaLibraryRecord(
  storeName: typeof WATCHLIST_STORE | typeof LIKES_STORE,
  id: string
): Promise<void> {
  await withStore(storeName, 'readwrite', async (store) => {
    await wrapRequest(store.delete(id));
  });
}

async function clearMediaLibraryRecords(
  storeName: typeof WATCHLIST_STORE | typeof LIKES_STORE
): Promise<void> {
  await withStore(storeName, 'readwrite', async (store) => {
    await wrapRequest(store.clear());
  });
}

export async function getWatchlistRecords(): Promise<MediaLibraryRecord[]> {
  return getMediaLibraryRecords(WATCHLIST_STORE);
}

export async function putWatchlistRecord(record: MediaLibraryRecord): Promise<void> {
  await putMediaLibraryRecord(WATCHLIST_STORE, record);
}

export async function deleteWatchlistRecord(id: string): Promise<void> {
  await deleteMediaLibraryRecord(WATCHLIST_STORE, id);
}

export async function clearWatchlistRecords(): Promise<void> {
  await clearMediaLibraryRecords(WATCHLIST_STORE);
}

export async function getLikeRecords(): Promise<MediaLibraryRecord[]> {
  return getMediaLibraryRecords(LIKES_STORE);
}

export async function putLikeRecord(record: MediaLibraryRecord): Promise<void> {
  await putMediaLibraryRecord(LIKES_STORE, record);
}

export async function deleteLikeRecord(id: string): Promise<void> {
  await deleteMediaLibraryRecord(LIKES_STORE, id);
}

export async function clearLikeRecords(): Promise<void> {
  await clearMediaLibraryRecords(LIKES_STORE);
}

export async function getSettingsRecord<T = unknown>(
  key: string
): Promise<SettingsRecord<T> | null> {
  return withStore(SETTINGS_STORE, 'readonly', async (store) => {
    const record = await wrapRequest(store.get(key));
    return (record as SettingsRecord<T> | undefined) ?? null;
  });
}

export async function putSettingsRecord<T>(
  record: SettingsRecord<T>
): Promise<void> {
  await withStore(SETTINGS_STORE, 'readwrite', async (store) => {
    await wrapRequest(store.put(record));
  });
}
