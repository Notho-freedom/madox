import { type MovieData } from '../data/movies';
import {
  clearLikeRecords,
  deleteLikeRecord,
  getLikeRecords,
  putLikeRecord,
  type MediaLibraryRecord
} from './localDb';

const LIKES_EVENT = 'madox:likes-updated';

export interface LikedEntry extends MovieData {
  mediaType: 'movie' | 'tv';
  savedAt: number;
  tmdbId: number;
}

function toLibraryId(tmdbId: number, mediaType: 'movie' | 'tv'): string {
  return `${mediaType}-${tmdbId}`;
}

function emitLikesUpdated() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(LIKES_EVENT));
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

function fromRecord(record: MediaLibraryRecord): LikedEntry {
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

export async function getLikes(): Promise<LikedEntry[]> {
  const records = await getLikeRecords();
  return records.map(fromRecord);
}

export async function addLike(movie: MovieData): Promise<void> {
  await putLikeRecord(toRecord(movie));
  emitLikesUpdated();
}

export async function removeLike(
  entry: Pick<LikedEntry, 'tmdbId' | 'mediaType'>
): Promise<void> {
  await deleteLikeRecord(toLibraryId(entry.tmdbId, entry.mediaType));
  emitLikesUpdated();
}

export async function clearLikes(): Promise<void> {
  await clearLikeRecords();
  emitLikesUpdated();
}

export function subscribeLikes(listener: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  window.addEventListener(LIKES_EVENT, listener);
  return () => {
    window.removeEventListener(LIKES_EVENT, listener);
  };
}
