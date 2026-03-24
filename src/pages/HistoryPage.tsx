import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock3, Play, RotateCcw } from 'lucide-react';
import { type MovieData } from '../data/movies';
import { useWatchHistory } from '../hooks/useWatchHistory';
import { poster } from '../services/tmdb';
import { type WatchHistoryEntry } from '../services/watchHistory';

interface HistoryPageProps {
  onBack: () => void;
  onMovieClick: (movie: MovieData) => void;
  onResume: (movie: WatchHistoryEntry) => void;
}

function formatLastWatched(updatedAt: number): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short'
  }).format(updatedAt);
}

export function HistoryPage({
  onBack,
  onMovieClick,
  onResume
}: HistoryPageProps) {
  const { data, loading, error, refetch } = useWatchHistory('all');

  return (
    <motion.div
      className="px-16 py-12 pb-28 pt-10"
      initial={{
        opacity: 0,
        y: 18
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      exit={{
        opacity: 0,
        y: -18
      }}
      transition={{
        duration: 0.35
      }}>
      <button
        type="button"
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-gray-400 transition-colors hover:text-white">
        <ArrowLeft size={18} />
        Back to Home
      </button>

      <div className="mb-10 flex items-end justify-between border-b border-white/10 pb-6">
        <div>
          <div className="mb-3 flex items-center gap-4">
            <div className="h-8 w-1 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            <h1 className="font-['Advent_Pro'] text-5xl font-bold tracking-tight text-white">
              Watch History
            </h1>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-400">
              {data.length} entries
            </span>
          </div>
          <p className="ml-5 tracking-wide text-gray-400">
            Resume your latest sessions or revisit anything you already opened.
          </p>
        </div>
      </div>

      {loading &&
        <div className="py-20 text-center text-gray-500">
          Loading local history...
        </div>
      }

      {!loading && error &&
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-8 text-center">
          <p className="text-red-300">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10">
            Retry
          </button>
        </div>
      }

      {!loading && !error && data.length === 0 &&
        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-8 py-16 text-center">
          <Clock3 size={40} className="mx-auto mb-4 text-cyan-300/70" />
          <h2 className="mb-2 text-2xl font-semibold text-white">
            No watch history yet
          </h2>
          <p className="text-gray-400">
            Start a trailer and your playback history will appear here.
          </p>
        </div>
      }

      {!loading && !error &&
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {data.map((entry, index) =>
            <motion.article
              key={entry.id}
              className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] shadow-[0_24px_50px_rgba(5,10,20,0.18)]"
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: index * 0.04
              }}>
              <div className="grid min-h-[220px] grid-cols-[220px_minmax(0,1fr)]">
                <button
                  type="button"
                  onClick={() => onMovieClick(entry)}
                  className="relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage:
                        entry.backdropPath ?
                          `url(https://image.tmdb.org/t/p/w780${entry.backdropPath})` :
                          `url(${poster(entry.posterPath ?? null, 'w500')})`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
                    {Math.round(entry.progressPercent)}% watched
                  </div>
                </button>

                <div className="flex flex-col justify-between p-6">
                  <div>
                    <div className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-gray-500">
                      <span>{entry.year}</span>
                      <span className="h-1 w-1 rounded-full bg-gray-600" />
                      <span>{entry.genre || 'Entertainment'}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onMovieClick(entry)}
                      className="mb-3 text-left text-2xl font-bold leading-tight text-white transition-colors hover:text-cyan-200">
                      {entry.title}
                    </button>

                    <p className="line-clamp-3 text-sm leading-6 text-gray-400">
                      {entry.description || 'Resume this session or open details.'}
                    </p>
                  </div>

                  <div>
                    <div className="mb-5">
                      <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-gray-500">
                        <span>Progress</span>
                        <span>Last opened {formatLastWatched(entry.updatedAt)}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.55)]"
                          style={{
                            width: `${entry.progressPercent}%`
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => onResume(entry)}
                        className="flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2.5 text-sm uppercase tracking-[0.2em] text-cyan-200 transition-colors hover:bg-cyan-400/20">
                        <Play size={16} />
                        Resume
                      </button>
                      <button
                        type="button"
                        onClick={() => onMovieClick(entry)}
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10">
                        <RotateCcw size={16} />
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          )}
        </div>
      }
    </motion.div>
  );
}
