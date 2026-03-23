import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MovieCard } from '../components/MovieCard';
import { Bookmark, Trash2, ListX } from 'lucide-react';
import { type MovieData } from '../data/movies';
import { useTopRated } from '../hooks/useTMDB';
import { GridSkeleton } from '../components/LoadingSkeleton';
interface WatchlistPageProps {
  onMovieClick: (movie: MovieData) => void;
}
export function WatchlistPage({ onMovieClick }: WatchlistPageProps) {
  const { data, loading } = useTopRated('movie');
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const watchlist = data.slice(0, 8).filter((item) => !removed.has(item.id));
  const handleRemove = (id: string) => {
    setRemoved((prev) => new Set(prev).add(id));
  };
  const handleClearAll = () => {
    setRemoved(new Set(data.map((d) => d.id)));
  };
  return (
    <motion.div
      className="px-16 py-12 pb-32 pt-8"
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
        {watchlist.length > 0 &&
        <button
          onClick={handleClearAll}
          className="text-sm text-red-400 hover:text-red-300 flex items-center gap-2 uppercase tracking-widest transition-colors">
          
            <Trash2 size={16} /> Clear All
          </button>
        }
      </div>

      {loading ?
      <GridSkeleton count={8} /> :
      watchlist.length === 0 ?
      <div className="flex flex-col items-center justify-center py-32 text-gray-500">
          <ListX size={48} className="mb-4 opacity-20" />
          <p className="text-lg">Your watchlist is empty.</p>
          <p className="text-sm text-gray-600 mt-2">
            Browse content and add items to your watchlist.
          </p>
        </div> :

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {watchlist.map((item, index) =>
        <motion.div
          key={item.id}
          className="relative group"
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: index * 0.05
          }}>
          
              <div className="flex justify-center">
                <MovieCard
              {...item}
              delay={0}
              onClick={() => onMovieClick(item)} />
            
              </div>
              <button
            onClick={() => handleRemove(item.id)}
            className="absolute top-4 right-8 z-20 p-2 bg-black/50 backdrop-blur-md rounded-full text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 border border-red-500/30">
            
                <Trash2 size={16} />
              </button>
            </motion.div>
        )}
        </div>
      }
    </motion.div>);

}