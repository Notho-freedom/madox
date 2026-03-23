import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MovieCard } from './MovieCard';
import { ChevronRight } from 'lucide-react';
import { CardSkeleton, ErrorState } from './LoadingSkeleton';
import {
  useTrending,
  usePopular,
  useTopRated,
  useNowPlaying } from
'../hooks/useTMDB';
import { type MovieData } from '../data/movies';
export interface CategoryData {
  id: string;
  title: string;
  description: string;
  items: MovieData[];
}
interface SectionProps {
  title: string;
  data: MovieData[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onMovieClick: (movie: MovieData) => void;
  onViewAll?: () => void;
}
function GridSection({
  title,
  data,
  loading,
  error,
  onRetry,
  onMovieClick,
  onViewAll
}: SectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-50px'
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
        {data.length > 0 &&
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors mr-16 uppercase tracking-widest group">
          
            View All{' '}
            <ChevronRight
            size={16}
            className="group-hover:translate-x-1 transition-transform" />
          
          </button>
        }
      </motion.div>

      {loading ?
      <CardSkeleton count={6} /> :
      error ?
      <ErrorState message={error} onRetry={onRetry} /> :

      <div className="overflow-x-auto pb-12 scrollbar-hide">
          <div className="flex gap-6 pr-16 min-w-max">
            {data.slice(0, 10).map((movie, index) =>
          <MovieCard
            key={movie.id}
            {...movie}
            delay={index * 0.06}
            onClick={() => onMovieClick(movie)} />

          )}
          </div>
        </div>
      }
    </div>);

}
interface MovieGridProps {
  onMovieClick: (movie: MovieData) => void;
  onViewAll?: (category: CategoryData) => void;
}
export function MovieGrid({ onMovieClick, onViewAll }: MovieGridProps) {
  const trending = useTrending('all', 'week');
  const popularMovies = usePopular('movie');
  const topRated = useTopRated('movie');
  const popularTV = usePopular('tv');
  const sections = [
  {
    id: 'trending',
    title: 'Trending Now',
    desc: 'The most popular content this week.',
    ...trending
  },
  {
    id: 'popular-movies',
    title: 'Popular Movies',
    desc: 'Movies everyone is watching right now.',
    ...popularMovies
  },
  {
    id: 'top-rated',
    title: 'Top Rated',
    desc: 'The highest rated movies of all time.',
    ...topRated
  },
  {
    id: 'popular-tv',
    title: 'Popular Series',
    desc: 'Binge-worthy series everyone is talking about.',
    ...popularTV
  }];

  return (
    <div className="relative z-10 pb-20">
      {sections.map((s) =>
      <GridSection
        key={s.id}
        title={s.title}
        data={s.data}
        loading={s.loading}
        error={s.error}
        onRetry={s.refetch}
        onMovieClick={onMovieClick}
        onViewAll={() =>
        onViewAll?.({
          id: s.id,
          title: s.title,
          description: s.desc,
          items: s.data
        })
        } />

      )}
    </div>);

}