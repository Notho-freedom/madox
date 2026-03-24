import { useCallback, useEffect, useState } from 'react';
import {
  getContinueWatchingHistory,
  getWatchHistory,
  subscribeWatchHistory,
  type WatchHistoryEntry
} from '../services/watchHistory';

interface UseWatchHistoryResult {
  data: WatchHistoryEntry[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useWatchHistory(
  mode: 'all' | 'continue' = 'all'
): UseWatchHistoryResult {
  const [data, setData] = useState<WatchHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextData =
        mode === 'continue' ?
          await getContinueWatchingHistory() :
          await getWatchHistory();
      setData(nextData);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ?
          fetchError.message :
          'Unable to load local history.'
      );
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    return subscribeWatchHistory(() => {
      void fetchHistory();
    });
  }, [fetchHistory]);

  return {
    data,
    loading,
    error,
    refetch: () => {
      void fetchHistory();
    }
  };
}
