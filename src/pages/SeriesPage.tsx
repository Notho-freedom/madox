import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { MovieCard } from '../components/MovieCard';
import { Play } from 'lucide-react';
const seriesList = [
{
  title: 'Severance',
  year: '2022',
  rating: '8.7',
  color: '#0e7490'
},
{
  title: 'Dark',
  year: '2017',
  rating: '8.8',
  color: '#ca8a04'
},
{
  title: 'Westworld',
  year: '2016',
  rating: '8.5',
  color: '#7e22ce'
},
{
  title: 'Altered Carbon',
  year: '2018',
  rating: '7.9',
  color: '#be123c'
},
{
  title: 'Black Mirror',
  year: '2011',
  rating: '8.7',
  color: '#1e293b'
},
{
  title: 'The Expanse',
  year: '2015',
  rating: '8.5',
  color: '#15803d'
},
{
  title: 'Silo',
  year: '2023',
  rating: '8.1',
  color: '#4b5563'
},
{
  title: 'Foundation',
  year: '2021',
  rating: '7.6',
  color: '#1d4ed8'
},
{
  title: 'Andor',
  year: '2022',
  rating: '8.4',
  color: '#ea580c'
},
{
  title: 'Stranger Things',
  year: '2016',
  rating: '8.7',
  color: '#b91c1c'
},
{
  title: 'The Mandalorian',
  year: '2019',
  rating: '8.7',
  color: '#0f766e'
},
{
  title: 'Arcane',
  year: '2021',
  rating: '9.0',
  color: '#7e22ce'
}];

export function SeriesPage() {
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

      {/* Featured Series Banner */}
      <div className="relative w-full h-[400px] mb-16 overflow-hidden group">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
            'url(https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop)',
            clipPath:
            'polygon(0 0, 100% 0, 100% 85%, 95% 100%, 5% 100%, 0 85%)'
          }} />

        <div className="absolute inset-0 bg-gradient-to-t from-[#08080f] via-[#08080f]/40 to-transparent" />

        <div className="absolute bottom-0 left-0 p-12 w-full max-w-3xl">
          <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs tracking-[0.2em] uppercase backdrop-blur-md mb-4 inline-block">
            New Season
          </span>
          <h1 className="text-6xl font-bold text-white mb-4 font-['Advent_Pro']">
            SEVERANCE
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-xl">
            Mark leads a team of office workers whose memories have been
            surgically divided between their work and personal lives.
          </p>
          <button
            className="flex items-center gap-3 px-8 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-cyan-50 transition-colors"
            style={{
              clipPath:
              'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
            }}>

            <Play size={20} fill="currentColor" /> Watch Season 2
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-1 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
          <h2 className="text-4xl font-bold text-white tracking-tight font-['Advent_Pro']">
            Popular Series
          </h2>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {seriesList.map((series, index) =>
        <div key={index} className="flex justify-center">
            <MovieCard {...series} delay={index * 0.05} />
          </div>
        )}
      </div>
    </motion.div>);

}