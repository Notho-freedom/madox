import { startTransition, useEffect, useRef, useState } from 'react';
import {
  getCachedHomeBootstrap,
  getHomeBootstrap,
  type HomeBootstrapResponse
} from '../services/tmdb';
import { type HomeGenreId } from '../data/homeGenres';

type HomeBootstrapSource = 'cache' | 'network';

interface UseHomeBootstrapResult {
  data: HomeBootstrapResponse | null;
  error: string | null;
  isRefreshing: boolean;
  lastUpdated: number | null;
  loading: boolean;
  refetch: () => void;
  source: HomeBootstrapSource | null;
}

const EMPTY_BOOTSTRAP: HomeBootstrapResponse = {
  heroCandidates: [],
  primarySection: null
};

export function useHomeBootstrap(genre: HomeGenreId): UseHomeBootstrapResult {
  const [data, setData] = useState<HomeBootstrapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [nonce, setNonce] = useState(0);
  const [source, setSource] = useState<HomeBootstrapSource | null>(null);
  const hasResolvedDataRef = useRef(false);

  useEffect(() => {
    let active = true;
    const abortController = new AbortController();

    const hydrate = async () => {
      setError(null);

      const cachedSnapshot = await getCachedHomeBootstrap(genre);

      if (active && cachedSnapshot) {
        startTransition(() => {
          setData(cachedSnapshot.data ?? EMPTY_BOOTSTRAP);
        });
        setLastUpdated(cachedSnapshot.cachedAt);
        setSource('cache');
        setLoading(false);
        setIsRefreshing(true);
        hasResolvedDataRef.current = true;
      } else if (active && !hasResolvedDataRef.current) {
        setLoading(true);
      }

      const payload = await getHomeBootstrap(genre, {
        signal: abortController.signal,
        skipCache: true
      });

      if (!active) {
        return;
      }

      startTransition(() => {
        setData(payload ?? EMPTY_BOOTSTRAP);
      });
      setLastUpdated(Date.now());
      setSource('network');
      hasResolvedDataRef.current = true;
    };

    hydrate()
      .catch((fetchError) => {
        if (!active) {
          return;
        }

        if (
          fetchError instanceof DOMException &&
          fetchError.name === 'AbortError'
        ) {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Unable to load home bootstrap.'
        );
      })
      .finally(() => {
        if (active) {
          setLoading(false);
          setIsRefreshing(false);
        }
      });

    return () => {
      active = false;
      abortController.abort();
    };
  }, [genre, nonce]);

  return {
    data,
    error,
    isRefreshing,
    lastUpdated,
    loading,
    refetch: () => {
      setNonce((current) => current + 1);
    },
    source
  };
}
