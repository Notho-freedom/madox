import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Star, Sparkles } from 'lucide-react';
import { type MovieData } from '../data/movies';
import {
  defaultHomeGenreId,
  getHomeGenreOption,
  type HomeGenreId
} from '../data/homeGenres';
import { getHeroSource } from '../data/homeContent';
import { useTMDBCatalog } from '../hooks/useTMDB';
import { backdrop } from '../services/tmdb';
import { HeroSkeleton } from './LoadingSkeleton';

interface HeroSectionProps {
  activeGenre?: HomeGenreId;
  onMovieClick?: (movie: MovieData) => void;
  onPlay?: (movie: MovieData) => void;
}

function getDaySeed(): number {
  return Math.floor(Date.now() / 86400000);
}

function getGenreHash(input: string): number {
  return Array.from(input).reduce((total, character) => {
    return total + character.charCodeAt(0);
  }, 0);
}

export function HeroSection({
  activeGenre = defaultHomeGenreId,
  onMovieClick,
  onPlay
}: HeroSectionProps) {
  const activeGenreOption = getHomeGenreOption(activeGenre);
  const primarySource = useTMDBCatalog(getHeroSource(activeGenreOption));
  const fallbackSource = useTMDBCatalog({
    kind: 'trending',
    timeWindow: 'day',
    type: 'all'
  });
  const [selectedFeaturedId, setSelectedFeaturedId] = useState<string | null>(null);

  const candidates = useMemo(() => {
    const primaryCandidates = primarySource.data;

    if (activeGenreOption.id === 'all' || primaryCandidates.length >= 4) {
      return primaryCandidates;
    }

    const merged = new Map<string, MovieData>();
    for (const item of primaryCandidates) {
      merged.set(item.id, item);
    }
    for (const item of fallbackSource.data) {
      if (!merged.has(item.id)) {
        merged.set(item.id, item);
      }
    }
    return Array.from(merged.values());
  }, [activeGenreOption.id, fallbackSource.data, primarySource.data]);

  useEffect(() => {
    if (candidates.length === 0) {
      setSelectedFeaturedId(null);
      return;
    }

    const initialIndex =
      (getDaySeed() + getGenreHash(activeGenreOption.id)) %
      Math.min(candidates.length, 6);

    setSelectedFeaturedId(candidates[initialIndex]?.id ?? candidates[0].id);
  }, [activeGenreOption.id, candidates]);

  const featured =
    candidates.find((item) => item.id === selectedFeaturedId) ?? candidates[0];

  const secondaryPicks = useMemo(() => {
    if (!featured) {
      return [];
    }

    return candidates.filter((item) => item.id !== featured.id).slice(0, 3);
  }, [candidates, featured]);

  if ((primarySource.loading && fallbackSource.loading) || !featured) {
    return <HeroSkeleton />;
  }

  const heroImage = backdrop(featured.backdropPath);
  const heroLabel =
    activeGenreOption.id === 'all' ? 'Trending Spotlight' : `${activeGenreOption.label} Spotlight`;

  return (
    <section className="relative flex min-h-[88vh] w-full items-center overflow-hidden px-16 py-20">
      <div className="relative z-10 max-w-2xl">
        <motion.div
          initial={{
            opacity: 0,
            x: -50
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          transition={{
            duration: 0.9,
            ease: 'easeOut'
          }}>
          <div className="mb-4 flex items-center gap-4">
            <span className="clip-facet-btn border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200 backdrop-blur-md">
              {heroLabel}
            </span>
            {featured.mediaType &&
              <span className="border border-cyan-500/30 bg-cyan-500/20 px-2 py-0.5 text-[10px] uppercase tracking-widest text-cyan-300">
                {featured.mediaType === 'tv' ? 'Series' : 'Movie'}
              </span>
            }
          </div>

          <h1 className="mb-6 line-clamp-3 font-['Advent_Pro'] text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-7xl">
            {featured.title}
          </h1>

          <div className="mb-8 flex flex-wrap items-center gap-6 font-light tracking-wide text-gray-300">
            <span className="font-medium text-white">{featured.year}</span>
            <span className="h-4 w-px bg-white/20" />
            <span>{featured.genre}</span>
            <span className="h-4 w-px bg-white/20" />
            <span className="flex items-center gap-1">
              <Star size={14} fill="currentColor" className="text-yellow-500" />
              {featured.rating}
            </span>
          </div>

          <p className="mb-10 max-w-lg border-l-2 border-cyan-500/30 pl-6 text-lg leading-relaxed text-gray-400 line-clamp-3">
            {featured.description || 'Discover the most exciting content available right now.'}
          </p>

          <div className="flex gap-6">
            <motion.button
              whileHover={{
                scale: 1.05
              }}
              whileTap={{
                scale: 0.95
              }}
              onClick={() => onPlay?.(featured)}
              className="group clip-facet-btn relative flex items-center gap-3 overflow-hidden bg-white px-8 py-4 font-bold uppercase tracking-widest text-black">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 via-white to-cyan-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <Play size={20} fill="currentColor" className="relative z-10" />
              <span className="relative z-10">Watch Now</span>
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05
              }}
              whileTap={{
                scale: 0.95
              }}
              onClick={() => onMovieClick?.(featured)}
              className="group clip-facet-btn flex items-center gap-3 border border-white/20 bg-white/5 px-8 py-4 font-bold uppercase tracking-widest text-white backdrop-blur-sm transition-colors hover:bg-white/10">
              <Plus
                size={20}
                className="transition-transform duration-300 group-hover:rotate-90"
              />
              <span>More Info</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute right-[-5%] top-1/2 z-0 h-[85%] w-[65%] -translate-y-1/2"
        initial={{
          opacity: 0,
          scale: 0.92,
          rotate: 2
        }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: 0
        }}
        transition={{
          duration: 1.15,
          delay: 0.2,
          ease: 'easeOut'
        }}>
        <div className="relative h-full w-full">
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              clipPath:
                'polygon(20% 0%, 90% 0%, 100% 30%, 100% 85%, 80% 100%, 10% 100%, 0% 70%, 0% 15%)'
            }}>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${heroImage})`,
                filter: 'brightness(0.7) contrast(1.1) saturate(1.1)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-black/80" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
                repeatDelay: 5
              }}
            />
          </div>
          <div className="absolute -right-1 -top-1 h-32 w-32 bg-gradient-to-bl from-cyan-400/30 to-transparent blur-2xl" />
          <div className="absolute -bottom-1 -left-1 h-32 w-32 bg-gradient-to-tr from-orange-400/30 to-transparent blur-2xl" />
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-y-0 right-10 z-20 hidden items-center xl:flex">
        <div className="pointer-events-auto w-[300px] rounded-[26px] border border-white/10 bg-[#090910]/62 p-4 shadow-[0_24px_60px_rgba(5,10,18,0.28)] backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-cyan-200/80">
            <Sparkles size={14} />
            Quick Picks
          </div>

          <div className="space-y-3">
            {secondaryPicks.map((item) =>
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedFeaturedId(item.id)}
                className="group relative grid w-full grid-cols-[84px_minmax(0,1fr)] gap-3 overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.03] p-3 text-left transition-colors hover:bg-white/[0.06]">
                <div
                  className="h-20 overflow-hidden rounded-[16px] bg-cover bg-center"
                  style={{
                    backgroundImage:
                      item.backdropPath ?
                        `url(https://image.tmdb.org/t/p/w500${item.backdropPath})` :
                        'none'
                  }}
                />
                <div className="min-w-0">
                  <div className="mb-1 line-clamp-2 text-sm font-semibold text-white transition-colors group-hover:text-cyan-200">
                    {item.title}
                  </div>
                  <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-gray-500">
                    {item.genre || 'Entertainment'}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Star size={12} fill="currentColor" className="text-yellow-500" />
                    <span>{item.rating}</span>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
