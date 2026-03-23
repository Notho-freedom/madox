import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MovieCard } from './MovieCard';
import { ChevronRight } from 'lucide-react';
import { movies, series, type MovieData } from '../data/movies';
export type CategoryId =
'trending-now' |
'new-releases' |
'top-series' |
'critically-acclaimed';
export interface CategoryData {
  id: CategoryId;
  title: string;
  description: string;
  items: MovieData[];
}
export const categories: CategoryData[] = [
{
  id: 'trending-now',
  title: 'Trending Now',
  description: 'The most popular movies this week, curated by our editors.',
  items: movies
},
{
  id: 'new-releases',
  title: 'New Releases',
  description: 'Fresh arrivals and latest premieres to watch right now.',
  items: [...movies].reverse()
},
{
  id: 'top-series',
  title: 'Top Series',
  description: 'Binge-worthy series that everyone is talking about.',
  items: series
},
{
  id: 'critically-acclaimed',
  title: 'Critically Acclaimed',
  description: 'Award-winning and critically praised masterpieces.',
  items: [...series].reverse()
}];

interface SectionProps {
  title: string;
  items: MovieData[];
  onMovieClick: (movie: MovieData) => void;
  onViewAll?: () => void;
}
function GridSection({ title, items, onMovieClick, onViewAll }: SectionProps) {
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
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors mr-16 uppercase tracking-widest group">
          
          View All{' '}
          <ChevronRight
            size={16}
            className="group-hover:translate-x-1 transition-transform" />
          
        </button>
      </motion.div>

      <div className="overflow-x-auto pb-12 scrollbar-hide">
        <div className="flex gap-6 pr-16 min-w-max">
          {items.map((movie, index) =>
          <MovieCard
            key={movie.id}
            {...movie}
            delay={index * 0.1}
            onClick={() => onMovieClick(movie)} />

          )}
        </div>
      </div>
    </div>);

}
interface MovieGridProps {
  onMovieClick: (movie: MovieData) => void;
  onViewAll?: (category: CategoryData) => void;
}
export function MovieGrid({ onMovieClick, onViewAll }: MovieGridProps) {
  return (
    <div className="relative z-10 pb-20">
      {categories.map((cat) =>
      <GridSection
        key={cat.id}
        title={cat.title}
        items={cat.items.slice(0, 6)}
        onMovieClick={onMovieClick}
        onViewAll={() => onViewAll?.(cat)} />

      )}
    </div>);

}