import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getTrending,
  getPopular,
  getTopRated,
  getNowPlaying,
  getUpcoming,
  search,
  discoverByGenre,
  getDetails,
  getTrailerId,
  getCredits,
  getSimilar,
  poster,
  backdrop,
  genreNames,
  genreColor,
  type TMDBMovie,
  type TMDBMovieDetails,
  type TMDBCast } from
'../services/tmdb';
import { type MovieData } from '../data/movies';

// Convert TMDB movie to our MovieData format
export function tmdbToMovieData(item: TMDBMovie): MovieData {
  const title = item.title || item.name || '';
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const genre = genreNames(item.genre_ids || []);
  const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');

  return {
    id: String(item.id),
    title,
    year,
    rating: item.vote_average.toFixed(1),
    color: genreColor(genre.split(' / ')[0]),
    videoId: '', // Will be fetched on demand
    genre,
    duration: '',
    description: item.overview,
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path,
    tmdbId: item.id,
    mediaType: mediaType as 'movie' | 'tv',
    popularity: item.popularity,
    voteCount: item.vote_count
  };
}

interface UseTMDBResult {
  data: MovieData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Hook: Trending
export function useTrending(
type: 'movie' | 'tv' | 'all' = 'all',
window: 'day' | 'week' = 'week')
: UseTMDBResult {
  const [data, setData] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetched = useRef(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await getTrending(type, window);
      setData(results.map(tmdbToMovieData));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [type, window]);

  useEffect(() => {
    if (!fetched.current) {
      fetched.current = true;
      fetchData();
    }
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Hook: Popular
export function usePopular(type: 'movie' | 'tv' = 'movie'): UseTMDBResult {
  const [data, setData] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetched = useRef(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await getPopular(type);
      setData(results.map(tmdbToMovieData));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    if (!fetched.current) {
      fetched.current = true;
      fetchData();
    }
  }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}

// Hook: Top Rated
export function useTopRated(type: 'movie' | 'tv' = 'movie'): UseTMDBResult {
  const [data, setData] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetched = useRef(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await getTopRated(type);
      setData(results.map(tmdbToMovieData));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    if (!fetched.current) {
      fetched.current = true;
      fetchData();
    }
  }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}

// Hook: Now Playing
export function useNowPlaying(type: 'movie' | 'tv' = 'movie'): UseTMDBResult {
  const [data, setData] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetched = useRef(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await getNowPlaying(type);
      setData(results.map(tmdbToMovieData));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    if (!fetched.current) {
      fetched.current = true;
      fetchData();
    }
  }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}

// Hook: Search
export function useTMDBSearch(
query: string,
type: 'movie' | 'tv' | 'multi' = 'multi')
: UseTMDBResult {
  const [data, setData] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prevQuery = useRef('');

  const fetchData = useCallback(async () => {
    if (!query) {
      setData([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const results = await search(query, type);
      setData(results.filter((r) => r.poster_path).map(tmdbToMovieData));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query, type]);

  useEffect(() => {
    if (query !== prevQuery.current) {
      prevQuery.current = query;
      fetchData();
    }
  }, [fetchData, query]);

  return { data, loading, error, refetch: fetchData };
}

// Hook: Discover by genre
export function useDiscover(
type: 'movie' | 'tv',
genreId: number)
: UseTMDBResult {
  const [data, setData] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetched = useRef(false);
  const prevGenre = useRef(genreId);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await discoverByGenre(type, genreId);
      setData(results.filter((r) => r.poster_path).map(tmdbToMovieData));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [type, genreId]);

  useEffect(() => {
    if (!fetched.current || prevGenre.current !== genreId) {
      fetched.current = true;
      prevGenre.current = genreId;
      fetchData();
    }
  }, [fetchData, genreId]);

  return { data, loading, error, refetch: fetchData };
}

// Hook: Get trailer videoId for a movie
export function useTrailer(
tmdbId: number | undefined,
mediaType: 'movie' | 'tv' = 'movie')
{
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tmdbId) return;
    setLoading(true);
    getTrailerId(mediaType, tmdbId).
    then(setVideoId).
    catch(() => setVideoId(null)).
    finally(() => setLoading(false));
  }, [tmdbId, mediaType]);

  return { videoId, loading };
}

// Hook: Movie/TV details with cast and similar
export function useDetails(
tmdbId: number | undefined,
mediaType: 'movie' | 'tv' = 'movie')
{
  const [details, setDetails] = useState<TMDBMovieDetails | null>(null);
  const [cast, setCast] = useState<TMDBCast[]>([]);
  const [similar, setSimilar] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tmdbId) return;
    setLoading(true);
    Promise.all([
    getDetails(mediaType, tmdbId),
    getCredits(mediaType, tmdbId),
    getSimilar(mediaType, tmdbId)]
    ).
    then(([d, c, s]) => {
      setDetails(d);
      setCast(c.slice(0, 8));
      setSimilar(
        s.
        filter((r) => r.poster_path).
        slice(0, 8).
        map(tmdbToMovieData)
      );
    }).
    catch(() => undefined).
    finally(() => setLoading(false));
  }, [tmdbId, mediaType]);

  return { details, cast, similar, loading };
}
