import { startTransition, useEffect, useRef, useState } from 'react';
import {
  getHomeBootstrap,
  type HomeBootstrapResponse
} from '../services/tmdb';
import { type HomeGenreId } from '../data/homeGenres';

interface UseHomeBootstrapResult {
  data: HomeBootstrapResponse | null;
  error: string | null;
  loading: boolean;
  refetch: () => void;
}

const EMPTY_BOOTSTRAP: HomeBootstrapResponse = {
  heroCandidates: [],
  primarySection: null
};

export function useHomeBootstrap(genre: HomeGenreId): UseHomeBootstrapResult {
  const [data, setData] = useState<HomeBootstrapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const hasResolvedDataRef = useRef(false);

  useEffect(() => {
    let active = true;
    if (!hasResolvedDataRef.current) {
      setLoading(true);
    }
    setError(null);

    getHomeBootstrap(genre)
      .then((payload) => {
        if (!active) {
          return;
        }

        startTransition(() => {
          setData(payload ?? EMPTY_BOOTSTRAP);
        });
        hasResolvedDataRef.current = true;
      })
      .catch((fetchError) => {
        if (!active) {
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
        }
      });

    return () => {
      active = false;
    };
  }, [genre, nonce]);

  return {
    data,
    error,
    loading,
    refetch: () => {
      setNonce((current) => current + 1);
    }
  };
}
