import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MovieCard } from './MovieCard';
import { ChevronRight } from 'lucide-react';
const movies = [
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
}];

const series = [
{
  title: 'Severance',
  year: '2022',
  rating: '8.7',
  color: '#0e7490',
  image:
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop'
},
{
  title: 'Dark',
  year: '2017',
  rating: '8.8',
  color: '#ca8a04',
  image:
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop'
},
{
  title: 'Westworld',
  year: '2016',
  rating: '8.5',
  color: '#7e22ce',
  image:
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop'
},
{
  title: 'Altered Carbon',
  year: '2018',
  rating: '7.9',
  color: '#be123c',
  image:
  'https://images.unsplash.com/photo-1506318137071-a8bcbf6755dd?q=80&w=800&auto=format&fit=crop'
},
{
  title: 'Black Mirror',
  year: '2011',
  rating: '8.7',
  color: '#1e293b',
  image:
  'https://images.unsplash.com/photo-1509347528160-9a9e33742cd4?q=80&w=800&auto=format&fit=crop'
},
{
  title: 'The Expanse',
  year: '2015',
  rating: '8.5',
  color: '#15803d',
  image:
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop'
}];

interface SectionProps {
  title: string;
  items: typeof movies;
  onMovieClick: (movie: any) => void;
}
function GridSection({ title, items, onMovieClick }: SectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-100px'
  });
  return (
    <div ref={ref} className="mb-16 pl-16">
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

      <div className="overflow-x-auto pb-12 scrollbar-hide">
        <div className="flex gap-6 pr-16 min-w-max">
          {items.map((movie, index) =>
          <MovieCard
            key={movie.title}
            {...movie}
            delay={index * 0.1}
            onClick={() => onMovieClick(movie)} />

          )}
        </div>
      </div>
    </div>);

}
interface MovieGridProps {
  onMovieClick: (movie: any) => void;
}
export function MovieGrid({ onMovieClick }: MovieGridProps) {
  return (
    <div className="relative z-10 pb-20">
      <GridSection
        title="Trending Now"
        items={movies}
        onMovieClick={onMovieClick} />
      
      <GridSection
        title="New Releases"
        items={[...movies].reverse()}
        onMovieClick={onMovieClick} />
      
      <GridSection
        title="Top Series"
        items={series}
        onMovieClick={onMovieClick} />
      
      <GridSection
        title="Critically Acclaimed"
        items={[...series].reverse()}
        onMovieClick={onMovieClick} />
      
    </div>);

}