import { type MovieData } from '../data/movies';
import {
  clearWatchlistRecords,
  deleteWatchlistRecord,
  getWatchlistRecords,
  putWatchlistRecord,
  type MediaLibraryRecord
} from './localDb';

const WATCHLIST_EVENT = 'madox:watchlist-updated';

export interface WatchlistEntry extends MovieData {
  mediaType: 'movie' | 'tv';
  savedAt: number;
  tmdbId: number;
}

function toLibraryId(tmdbId: number, mediaType: 'movie' | 'tv'): string {
  return `${mediaType}-${tmdbId}`;
}

function emitWatchlistUpdated() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(WATCHLIST_EVENT));
}

function toRecord(movie: MovieData): MediaLibraryRecord {
  const tmdbId = movie.tmdbId ?? Number(movie.id);
  const mediaType = movie.mediaType ?? 'movie';

  return {
    id: toLibraryId(tmdbId, mediaType),
    tmdbId,
    mediaType,
    title: movie.title,
    year: movie.year,
    rating: movie.rating,
    color: movie.color,
    videoId: movie.videoId,
    genre: movie.genre,
    duration: movie.duration,
    description: movie.description,
    posterPath: movie.posterPath ?? null,
    backdropPath: movie.backdropPath ?? null,
    popularity: movie.popularity,
    voteCount: movie.voteCount,
    savedAt: Date.now()
  };
}

function fromRecord(record: MediaLibraryRecord): WatchlistEntry {
  return {
    id: record.id,
    title: record.title,
    year: record.year,
    rating: record.rating,
    color: record.color,
    videoId: record.videoId,
    genre: record.genre,
    duration: record.duration,
    description: record.description,
    posterPath: record.posterPath,
    backdropPath: record.backdropPath,
    tmdbId: record.tmdbId,
    mediaType: record.mediaType,
    popularity: record.popularity,
    voteCount: record.voteCount,
    savedAt: record.savedAt
  };
}

export async function getWatchlist(): Promise<WatchlistEntry[]> {
  const records = await getWatchlistRecords();
  return records.map(fromRecord);
}

export async function addToWatchlist(movie: MovieData): Promise<void> {
  await putWatchlistRecord(toRecord(movie));
  emitWatchlistUpdated();
}

export async function removeFromWatchlist(
  entry: Pick<WatchlistEntry, 'tmdbId' | 'mediaType'>
): Promise<void> {
  await deleteWatchlistRecord(toLibraryId(entry.tmdbId, entry.mediaType));
  emitWatchlistUpdated();
}

export async function clearWatchlist(): Promise<void> {
  await clearWatchlistRecords();
  emitWatchlistUpdated();
}

export function subscribeWatchlist(listener: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  window.addEventListener(WATCHLIST_EVENT, listener);
  return () => {
    window.removeEventListener(WATCHLIST_EVENT, listener);
  };
}
