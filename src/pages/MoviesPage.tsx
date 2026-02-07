import React from 'react';
import { motion } from 'framer-motion';
import { MovieCard } from '../components/MovieCard';
import { Filter, ChevronDown } from 'lucide-react';
const allMovies = [
{
  title: 'Blade Runner 2049',
  year: '2017',
  rating: '8.0',
  color: '#b91c1c'
},
{
  title: 'Oppenheimer',
  year: '2023',
  rating: '8.4',
  color: '#ea580c'
},
{
  title: 'The Batman',
  year: '2022',
  rating: '7.8',
  color: '#b91c1c'
},
{
  title: 'Interstellar',
  year: '2014',
  rating: '8.7',
  color: '#0f766e'
},
{
  title: 'Arrival',
  year: '2016',
  rating: '7.9',
  color: '#1d4ed8'
},
{
  title: 'Ex Machina',
  year: '2014',
  rating: '7.7',
  color: '#be185d'
},
{
  title: 'Dune: Part Two',
  year: '2024',
  rating: '8.9',
  color: '#ea580c'
},
{
  title: 'Civil War',
  year: '2024',
  rating: '7.6',
  color: '#4b5563'
},
{
  title: 'Poor Things',
  year: '2023',
  rating: '8.1',
  color: '#7e22ce'
},
{
  title: 'The Creator',
  year: '2023',
  rating: '6.8',
  color: '#0f766e'
},
{
  title: 'Everything Everywhere',
  year: '2022',
  rating: '7.8',
  color: '#be123c'
},
{
  title: 'Tenet',
  year: '2020',
  rating: '7.3',
  color: '#1e293b'
}];

export function MoviesPage() {
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

      {/* Header */}
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

        {/* Filters */}
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

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {allMovies.map((movie, index) =>
        <div key={index} className="flex justify-center">
            <MovieCard {...movie} delay={index * 0.05} />
          </div>
        )}
      </div>
    </motion.div>);

}