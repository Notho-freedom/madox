import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Clock3, Play } from 'lucide-react';
import { FacetPanel, FacetSectionHeader, facetClipPaths } from './design';
import { useWatchHistory } from '../hooks/useWatchHistory';
import { poster } from '../services/tmdb';
import { type WatchHistoryEntry } from '../services/watchHistory';
import { HorizontalCarousel } from './HorizontalCarousel';
import { ContinueWatchingSkeleton } from './LoadingSkeleton';

interface ContinueWatchingProps {
  onResumeMovie?: (movie: WatchHistoryEntry) => void;
  onViewAll?: () => void;
}

export function ContinueWatching({
  onResumeMovie,
  onViewAll
}: ContinueWatchingProps) {
  const { data, loading } = useWatchHistory('continue');

  return (
    <div className="mb-12 w-full px-16">
      <FacetSectionHeader
        action={
          data.length > 0 ?
            <button
              type="button"
              onClick={onViewAll}
              className="group mr-2 flex items-center gap-1 text-sm uppercase tracking-widest text-cyan-400 transition-colors hover:text-cyan-300">
              View All
              <ChevronRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button> :
            undefined
        }
        className="mb-6"
        title="Continue Watching"
        titleClassName="text-2xl tracking-wide"
      />

      {loading &&
        <ContinueWatchingSkeleton />
      }

      {!loading && data.length === 0 &&
        <FacetPanel chrome="subtle" contentClassName="px-8 py-10">
          <div className="flex items-center gap-4 text-gray-400">
            <Clock3 size={22} className="text-cyan-300/70" />
            <div>
              <h3 className="text-lg font-semibold text-white">
                No active sessions yet
              </h3>
              <p className="text-sm">
                Start a trailer and it will appear here for quick resume.
              </p>
            </div>
          </div>
        </FacetPanel>
      }

      {!loading && data.length > 0 &&
        <HorizontalCarousel
          className="pb-6"
          contentClassName="flex min-w-max gap-5 pr-8"
        >
          {data.map((item, index) =>
            <motion.button
              key={item.id}
              type="button"
              onClick={() => onResumeMovie?.(item)}
              className="group relative w-[300px] overflow-hidden text-left"
              initial={{
                opacity: 0,
                y: 18
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: index * 0.06
              }}
              whileHover={{
                y: -4
              }}>
              <div
                className="relative aspect-video overflow-hidden bg-[#12121a]"
                style={{
                  clipPath: facetClipPaths.continueTile
                }}>
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-95"
                  style={{
                    backgroundImage:
                      item.backdropPath ?
                        `url(https://image.tmdb.org/t/p/w780${item.backdropPath})` :
                        `url(${poster(item.posterPath ?? null, 'w342')})`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                    <Play size={18} fill="white" className="ml-0.5 text-white" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-cyan-300">
                    <span>{item.genre || 'Entertainment'}</span>
                    <span>{Math.round(item.progressPercent ?? 0)}%</span>
                  </div>
                  <h3 className="mb-2 truncate text-base font-bold text-white">
                    {item.title}
                  </h3>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                      style={{
                        width: `${item.progressPercent ?? 0}%`
                      }}
                    />
                  </div>
                </div>
              </div>

              <div
                className="absolute inset-[-1px] z-[-1] bg-gradient-to-br from-white/6 via-transparent to-white/6 opacity-30 transition-opacity duration-300 group-hover:opacity-55"
                style={{
                  clipPath: facetClipPaths.continueTile
                }}
              />
            </motion.button>
          )}
        </HorizontalCarousel>
      }
    </div>
  );
}
