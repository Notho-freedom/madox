import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { MovieCard } from '../components/MovieCard';
import { Play } from 'lucide-react';
import { series, getYouTubeThumbnail, type MovieData } from '../data/movies';
interface SeriesPageProps {
  onMovieClick: (movie: MovieData) => void;
}
export function SeriesPage({ onMovieClick }: SeriesPageProps) {
  const featured = series[0];
  return (
    <motion.div
      className="px-16 py-12 pb-32 pt-24"
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      exit={{
        opacity: 0,
        y: -20
      }}
      transition={{
        duration: 0.5
      }}>
      
      {/* Featured Series Banner */}
      <div className="relative w-full h-[400px] mb-16 overflow-hidden group">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${getYouTubeThumbnail(featured.videoId, 'maxres')})`,
            clipPath:
            'polygon(0 0, 100% 0, 100% 85%, 95% 100%, 5% 100%, 0 85%)'
          }} />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080f] via-[#08080f]/40 to-transparent" />

        <div className="absolute bottom-0 left-0 p-12 w-full max-w-3xl">
          <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs tracking-[0.2em] uppercase backdrop-blur-md mb-4 inline-block">
            New Season
          </span>
          <h1 className="text-6xl font-bold text-white mb-4 font-['Advent_Pro']">
            {featured.title.toUpperCase()}
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-xl">
            Mark leads a team of office workers whose memories have been
            surgically divided between their work and personal lives.
          </p>
          <button
            onClick={() => onMovieClick(featured)}
            className="flex items-center gap-3 px-8 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-cyan-50 transition-colors"
            style={{
              clipPath:
              'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
            }}>
            
            <Play size={20} fill="currentColor" /> Watch Now
          </button>
        </div>
      </div>

      <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-1 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
          <h2 className="text-4xl font-bold text-white tracking-tight font-['Advent_Pro']">
            Popular Series
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {series.map((s, index) =>
        <div key={s.id} className="flex justify-center">
            <MovieCard
            {...s}
            delay={index * 0.05}
            onClick={() => onMovieClick(s)} />
          
          </div>
        )}
      </div>
    </motion.div>);

}