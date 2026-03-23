import React from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Star } from 'lucide-react';
import { useTrending } from '../hooks/useTMDB';
import { backdrop } from '../services/tmdb';
import { type MovieData } from '../data/movies';
import { HeroSkeleton } from './LoadingSkeleton';
interface HeroSectionProps {
  onMovieClick?: (movie: MovieData) => void;
  onPlay?: (movie: MovieData) => void;
}
export function HeroSection({ onMovieClick, onPlay }: HeroSectionProps) {
  const { data, loading } = useTrending('all', 'day');
  const featured = data[0];
  if (loading || !featured) return <HeroSkeleton />;
  const heroImage = backdrop(featured.backdropPath);
  return (
    <section className="relative w-full min-h-[85vh] flex items-center px-16 py-20 overflow-hidden">
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
            duration: 1,
            ease: 'easeOut'
          }}>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-white/5 border border-white/10 text-xs tracking-[0.2em] uppercase text-cyan-200 backdrop-blur-md clip-facet-btn">
              Trending #1
            </span>
            {featured.mediaType &&
            <span className="px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] tracking-widest uppercase">
                {featured.mediaType === 'tv' ? 'Series' : 'Movie'}
              </span>
            }
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[0.95] tracking-tight font-['Advent_Pro'] line-clamp-3">
            {featured.title}
          </h1>

          <div className="flex items-center gap-6 text-gray-300 mb-8 font-light tracking-wide flex-wrap">
            <span className="text-white font-medium">{featured.year}</span>
            <span className="w-px h-4 bg-white/20" />
            <span>{featured.genre}</span>
            <span className="w-px h-4 bg-white/20" />
            <span className="flex items-center gap-1">
              <Star size={14} fill="currentColor" className="text-yellow-500" />{' '}
              {featured.rating}
            </span>
          </div>

          <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-lg border-l-2 border-cyan-500/30 pl-6 line-clamp-3">
            {featured.description ||
            'Discover the most popular content right now.'}
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
              className="group relative px-8 py-4 bg-white text-black font-bold tracking-widest uppercase flex items-center gap-3 clip-facet-btn overflow-hidden">
              
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 via-white to-cyan-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
              className="group px-8 py-4 bg-white/5 border border-white/20 text-white font-bold tracking-widest uppercase flex items-center gap-3 clip-facet-btn backdrop-blur-sm hover:bg-white/10 transition-colors">
              
              <Plus
                size={20}
                className="group-hover:rotate-90 transition-transform duration-300" />
              
              <span>More Info</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Hero Visual */}
      <motion.div
        className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[65%] h-[85%] z-0"
        initial={{
          opacity: 0,
          scale: 0.9,
          rotate: 2
        }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: 0
        }}
        transition={{
          duration: 1.2,
          delay: 0.2,
          ease: 'easeOut'
        }}>
        
        <div className="relative w-full h-full">
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
              }} />
            
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
              }} />
            
          </div>
          <div className="absolute -top-1 -right-1 w-32 h-32 bg-gradient-to-bl from-cyan-400/30 to-transparent blur-2xl" />
          <div className="absolute -bottom-1 -left-1 w-32 h-32 bg-gradient-to-tr from-orange-400/30 to-transparent blur-2xl" />
        </div>
      </motion.div>
    </section>);

}