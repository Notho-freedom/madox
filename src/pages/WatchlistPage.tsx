import React from 'react';
import { motion } from 'framer-motion';
import { MovieCard } from '../components/MovieCard';
import { Bookmark, Trash2 } from 'lucide-react';
const watchlist = [
{
  title: 'Interstellar',
  year: '2014',
  rating: '8.7',
  color: '#0f766e'
},
{
  title: 'Dark',
  year: '2017',
  rating: '8.8',
  color: '#ca8a04'
},
{
  title: 'Arrival',
  year: '2016',
  rating: '7.9',
  color: '#1d4ed8'
},
{
  title: 'Blade Runner 2049',
  year: '2017',
  rating: '8.0',
  color: '#b91c1c'
}];

export function WatchlistPage() {
  return (
    <motion.div
      className="px-16 py-12 pb-32"
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
            4 items
          </span>
        </div>

        <button className="text-sm text-red-400 hover:text-red-300 flex items-center gap-2 uppercase tracking-widest transition-colors">
          <Trash2 size={16} /> Clear All
        </button>
      </div>

      {watchlist.length > 0 ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {watchlist.map((item, index) =>
        <div key={index} className="relative group">
              <div className="flex justify-center">
                <MovieCard {...item} delay={index * 0.05} />
              </div>
              <button className="absolute top-4 right-8 z-20 p-2 bg-black/50 backdrop-blur-md rounded-full text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 border border-red-500/30">
                <Trash2 size={16} />
              </button>
            </div>
        )}
        </div> :

      <div className="flex flex-col items-center justify-center py-32 text-gray-500">
          <Bookmark size={64} className="mb-6 opacity-20" />
          <p className="text-xl font-light">Your watchlist is empty.</p>
          <button className="mt-6 px-6 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors uppercase tracking-widest text-sm">
            Browse Movies
          </button>
        </div>
      }
    </motion.div>);

}