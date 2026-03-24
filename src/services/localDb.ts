const DB_NAME = 'madox-local-store';
const DB_VERSION = 1;
const TMDB_CACHE_STORE = 'tmdb-cache';
const WATCH_HISTORY_STORE = 'watch-history';

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
