import React from 'react';
import { motion } from 'framer-motion';
import { MovieCard } from '../components/MovieCard';
import { Bookmark, Trash2 } from 'lucide-react';
import { movies, series, type MovieData } from '../data/movies';
const watchlist = [movies[3], series[1], movies[4], movies[0]];
interface WatchlistPageProps {
  onMovieClick: (movie: MovieData) => void;
}
export function WatchlistPage({ onMovieClick }: WatchlistPageProps) {
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
      
      <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-full">
            <Bookmark size={24} className="text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-white font-['Advent_Pro']">
            My Watchlist
          </h1>
          <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-400 border border-white/10">
            {watchlist.length} items
          </span>
        </div>

        <button className="text-sm text-red-400 hover:text-red-300 flex items-center gap-2 uppercase tracking-widest transition-colors">
          <Trash2 size={16} /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {watchlist.map((item, index) =>
        <div key={item.id} className="relative group">
            <div className="flex justify-center">
              <MovieCard
              {...item}
              delay={index * 0.05}
              onClick={() => onMovieClick(item)} />
            
            </div>
            <button className="absolute top-4 right-8 z-20 p-2 bg-black/50 backdrop-blur-md rounded-full text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 border border-red-500/30">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </motion.div>);

}