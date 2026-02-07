import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MovieCard } from './MovieCard';
import { ChevronRight } from 'lucide-react';
const movies = [
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
} // Pink
];
const series = [
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
} // Green
];
interface SectionProps {
  title: string;
  items: typeof movies;
}
function GridSection({ title, items }: SectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-100px'
  });
  return (
    <div ref={ref} className="mb-16 pl-16">
      {/* Section Header */}
      <motion.div
        className="flex items-center gap-4 mb-8"
        initial={{
          opacity: 0,
          x: -20
        }}
        animate={
        isInView ?
        {
          opacity: 1,
          x: 0
        } :
        {}
        }
        transition={{
          duration: 0.6
        }}>

        <div className="h-8 w-1 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
        <h2 className="text-3xl font-bold text-white tracking-wide">{title}</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4" />
        <button className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors mr-16 uppercase tracking-widest">
          View All <ChevronRight size={16} />
        </button>
      </motion.div>

      {/* Horizontal Scroll Container */}
      <div className="overflow-x-auto pb-12 scrollbar-hide">
        <div className="flex gap-6 pr-16 min-w-max">
          {items.map((movie, index) =>
          <MovieCard key={movie.title} {...movie} delay={index * 0.1} />
          )}
        </div>
      </div>
    </div>);

}
export function MovieGrid() {
  return (
    <div className="relative z-10 pb-20">
      <GridSection title="Trending Now" items={movies} />
      <GridSection title="New Releases" items={[...movies].reverse()} />
      <GridSection title="Top Series" items={series} />
      <GridSection title="Critically Acclaimed" items={[...series].reverse()} />
    </div>);

}