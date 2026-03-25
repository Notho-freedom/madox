import { useCallback, useEffect, useState } from 'react';
import { getLikes, subscribeLikes, type LikedEntry } from '../services/likes';

interface UseLikesResult {
  data: LikedEntry[];
  error: string | null;
  loading: boolean;
  refetch: () => void;
}

export function useLikes(): UseLikesResult {
  const [data, setData] = useState<LikedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLikes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setData(await getLikes());
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Unable to load your likes.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLikes();
  }, [fetchLikes]);

  useEffect(() => {
    return subscribeLikes(() => {
      void fetchLikes();
    });
  }, [fetchLikes]);

  return {
    data,
    error,
    loading,
    refetch: () => {
      void fetchLikes();
    }
  };
}
