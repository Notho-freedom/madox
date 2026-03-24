import { type MovieData } from '../data/movies';
import {
  deleteWatchHistoryRecord,
  getWatchHistoryRecords,
  putWatchHistoryRecord,
  type WatchHistoryRecord
} from './localDb';

const WATCH_HISTORY_EVENT = 'madox:watch-history-updated';
const CONTINUE_WATCHING_MIN = 5;
const CONTINUE_WATCHING_MAX = 95;

export interface WatchHistoryEntry extends MovieData {
  currentTime: number;
  durationSeconds: number;
  progressPercent: number;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  updatedAt: number;
}

function clampProgress(progressPercent: number): number {
  return Math.max(0, Math.min(100, progressPercent));
}

function toHistoryId(tmdbId: number, mediaType: 'movie' | 'tv'): string {
  return `${mediaType}-${tmdbId}`;
}

function emitWatchHistoryUpdated() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(WATCH_HISTORY_EVENT));
}

function fromRecord(record: WatchHistoryRecord): WatchHistoryEntry {
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
    currentTime: record.currentTime,
    durationSeconds: record.durationSeconds,
    progressPercent: record.progressPercent,
    updatedAt: record.updatedAt,
    resumeTime: record.currentTime
  };
}

export async function getWatchHistory(): Promise<WatchHistoryEntry[]> {
  const records = await getWatchHistoryRecords();
  return records.map(fromRecord);
}

export async function getContinueWatchingHistory(): Promise<WatchHistoryEntry[]> {
  const history = await getWatchHistory();
  return history.filter(
    (entry) =>
      entry.progressPercent > CONTINUE_WATCHING_MIN &&
      entry.progressPercent < CONTINUE_WATCHING_MAX
  );
}

export async function saveWatchHistoryEntry(
  entry: WatchHistoryEntry
): Promise<void> {
  const normalizedProgress = clampProgress(entry.progressPercent);
  const record: WatchHistoryRecord = {
    id: toHistoryId(entry.tmdbId, entry.mediaType),
    tmdbId: entry.tmdbId,
    mediaType: entry.mediaType,
    title: entry.title,
    year: entry.year,
    rating: entry.rating,
    color: entry.color,
    videoId: entry.videoId,
    genre: entry.genre,
    duration: entry.duration,
    description: entry.description,
    posterPath: entry.posterPath ?? null,
    backdropPath: entry.backdropPath ?? null,
    popularity: entry.popularity,
    voteCount: entry.voteCount,
    currentTime: entry.currentTime,
    durationSeconds: entry.durationSeconds,
    progressPercent: normalizedProgress,
    updatedAt: entry.updatedAt
  };

  await putWatchHistoryRecord(record);
  emitWatchHistoryUpdated();
}

export async function removeWatchHistoryEntry(
  entry: Pick<WatchHistoryEntry, 'tmdbId' | 'mediaType'>
): Promise<void> {
  await deleteWatchHistoryRecord(toHistoryId(entry.tmdbId, entry.mediaType));
  emitWatchHistoryUpdated();
}

export function subscribeWatchHistory(listener: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  window.addEventListener(WATCH_HISTORY_EVENT, listener);

  return () => {
    window.removeEventListener(WATCH_HISTORY_EVENT, listener);
  };
}
