import React from 'react';
import { motion } from 'framer-motion';
import { MovieCard } from '../components/MovieCard';
import { Filter, ChevronDown } from 'lucide-react';
const allMovies = [
{
  title: 'Blade Runner 2049',
  year: '2017',
  rating: '8.0',
  color: '#b91c1c',
  image:
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2576&auto=format&fit=crop'
},
{
  title: 'Oppenheimer',
  year: '2023',
  rating: '8.4',
  color: '#ea580c',
  image:
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop'
},
{
  title: 'The Batman',
  year: '2022',
  rating: '7.8',
  color: '#b91c1c',
  image:
  'https://images.unsplash.com/photo-1509347528160-9a9e33742cd4?q=80&w=800&auto=format&fit=crop'
},
{
  title: 'Interstellar',
  year: '2014',
  rating: '8.7',
  color: '#0f766e',
  image:
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop'
},
{
  title: 'Arrival',
  year: '2016',
  rating: '7.9',
  color: '#1d4ed8',
  image:
  'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop'
},
{
  title: 'Ex Machina',
  year: '2014',
  rating: '7.7',
  color: '#be185d',
  image:
  'https://images.unsplash.com/photo-1506318137071-a8bcbf6755dd?q=80&w=800&auto=format&fit=crop'
},
{
  title: 'Dune: Part Two',
  year: '2024',
  rating: '8.9',
  color: '#ea580c',
  image:
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2576&auto=format&fit=crop'
},
{
  title: 'Civil War',
  year: '2024',
  rating: '7.6',
  color: '#4b5563',
  image:
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop'
},
{
  title: 'Poor Things',
  year: '2023',
  rating: '8.1',
  color: '#7e22ce',
  image:
  'https://images.unsplash.com/photo-1509347528160-9a9e33742cd4?q=80&w=800&auto=format&fit=crop'
},
{
  title: 'The Creator',
  year: '2023',
  rating: '6.8',
  color: '#0f766e',
  image:
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop'
},
{
  title: 'Everything Everywhere',
  year: '2022',
  rating: '7.8',
  color: '#be123c',
  image:
  'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop'
},
{
  title: 'Tenet',
  year: '2020',
  rating: '7.3',
  color: '#1e293b',
  image:
  'https://images.unsplash.com/photo-1506318137071-a8bcbf6755dd?q=80&w=800&auto=format&fit=crop'
}];

interface MoviesPageProps {
  onMovieClick: (movie: any) => void;
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
        {allMovies.map((movie, index) =>
        <div key={index} className="flex justify-center">
            <MovieCard
            {...movie}
            delay={index * 0.05}
            onClick={() => onMovieClick(movie)} />
          
          </div>
        )}
      </div>
    </motion.div>);

}