import React from 'react';
import { motion } from 'framer-motion';
import { MovieCard } from '../components/MovieCard';
import { Filter, ChevronDown } from 'lucide-react';
import { movies, type MovieData } from '../data/movies';
interface MoviesPageProps {
  onMovieClick: (movie: MovieData) => void;
}
export function MoviesPage({ onMovieClick }: MoviesPageProps) {
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
      
      <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="h-8 w-1 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            <h1 className="text-5xl font-bold text-white tracking-tight font-['Advent_Pro']">
              Movies
            </h1>
          </div>
          <p className="text-gray-400 ml-5 tracking-wide">
            Explore the complete collection of cinematic masterpieces.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm uppercase tracking-widest text-gray-300"
            style={{
              clipPath:
              'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
            }}>
            
            <Filter size={16} /> Filter
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm uppercase tracking-widest text-gray-300"
            style={{
              clipPath:
              'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
            }}>
            
            Sort By: Popular <ChevronDown size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {movies.map((movie, index) =>
        <div key={movie.id} className="flex justify-center">
            <MovieCard
            {...movie}
            delay={index * 0.05}
            onClick={() => onMovieClick(movie)} />
          
          </div>
        )}
      </div>
    </motion.div>);

}