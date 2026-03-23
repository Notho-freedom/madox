import React from 'react';
import { motion } from 'framer-motion';
import { Play, Plus } from 'lucide-react';
import { movies, getYouTubeThumbnail, type MovieData } from '../data/movies';
const featured = movies.find((m) => m.id === 'dune-part-two')!;
interface HeroSectionProps {
  onMovieClick?: (movie: MovieData) => void;
  onPlay?: (movie: MovieData) => void;
}
export function HeroSection({ onMovieClick, onPlay }: HeroSectionProps) {
  const heroThumbnail = getYouTubeThumbnail(featured.videoId, 'maxres');
  return (
    <section className="relative w-full min-h-[85vh] flex items-center px-16 py-20 overflow-hidden">
      {/* Content Container */}
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
              Featured Premiere
            </span>
            <div className="flex gap-1">
              <span className="w-1 h-1 bg-white/50 rounded-full" />
              <span className="w-1 h-1 bg-white/30 rounded-full" />
              <span className="w-1 h-1 bg-white/10 rounded-full" />
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold text-white mb-6 leading-[0.9] tracking-tight font-['Advent_Pro']">
            DUNE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 via-orange-100 to-white opacity-90">
              PART TWO
            </span>
          </h1>

          <div className="flex items-center gap-6 text-gray-300 mb-8 font-light tracking-wide">
            <span className="text-white font-medium">{featured.year}</span>
            <span className="w-px h-4 bg-white/20" />
            <span>{featured.genre} / Adventure</span>
            <span className="w-px h-4 bg-white/20" />
            <span className="flex items-center gap-1">
              <span className="text-yellow-500">★</span> {featured.rating}
            </span>
            <span className="w-px h-4 bg-white/20" />
            <span>{featured.duration}</span>
          </div>

          <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-lg border-l-2 border-orange-500/30 pl-6">
            {featured.description}
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
              
              <div className="absolute inset-0 bg-gradient-to-r from-orange-200 via-white to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

      {/* Hero Visual - Crystal Frame with YouTube Thumbnail */}
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
                backgroundImage: `url(${heroThumbnail})`,
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

          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
            style={{
              filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.5))'
            }}>
            
            <path
              d="M 20% 0 L 0 15 L 0 70 L 10% 100"
              fill="none"
              stroke="url(#border-gradient)"
              strokeWidth="1" />
            
            <path
              d="M 90% 0 L 100% 30 L 100% 85 L 80% 100"
              fill="none"
              stroke="url(#border-gradient)"
              strokeWidth="1" />
            
            <defs>
              <linearGradient
                id="border-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%">
                
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </motion.div>
    </section>);

}