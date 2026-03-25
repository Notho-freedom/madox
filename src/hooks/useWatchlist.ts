import { useCallback, useEffect, useState } from 'react';
import {
  getWatchlist,
  subscribeWatchlist,
  type WatchlistEntry
} from '../services/watchlist';

interface UseWatchlistResult {
  data: WatchlistEntry[];
  error: string | null;
  loading: boolean;
  refetch: () => void;
}

export function useWatchlist(): UseWatchlistResult {
  const [data, setData] = useState<WatchlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWatchlist = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setData(await getWatchlist());
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Unable to load your watchlist.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchWatchlist();
  }, [fetchWatchlist]);

  useEffect(() => {
    return subscribeWatchlist(() => {
      void fetchWatchlist();
    });
  }, [fetchWatchlist]);

  return {
    data,
    error,
    loading,
    refetch: () => {
      void fetchWatchlist();
    }
  };
}
