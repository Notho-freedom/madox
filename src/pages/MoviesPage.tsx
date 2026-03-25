import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HorizontalCarousel } from '../components/HorizontalCarousel';
import { LoadMoreSentinel } from '../components/LoadMoreSentinel';
import { MovieCard } from '../components/MovieCard';
import { GridSkeleton, ErrorState } from '../components/LoadingSkeleton';
import { Search } from 'lucide-react';
import {
  usePopular,
  useTopRated,
  useNowPlaying,
  useDiscover,
  useTMDBSearch } from
'../hooks/useTMDB';
import { type MovieData } from '../data/movies';
const CATEGORIES = [
{
  label: 'Popular',
  hook: 'popular'
},
{
  label: 'Top Rated',
  hook: 'topRated'
},
{
  label: 'Now Playing',
  hook: 'nowPlaying'
},
{
  label: 'Action',
  hook: 'genre',
  genreId: 28
},
{
  label: 'Sci-Fi',
  hook: 'genre',
  genreId: 878
},
{
  label: 'Horror',
  hook: 'genre',
  genreId: 27
},
{
  label: 'Comedy',
  hook: 'genre',
  genreId: 35
},
{
  label: 'Drama',
  hook: 'genre',
  genreId: 18
},
{
  label: 'Animation',
  hook: 'genre',
  genreId: 16
},
{
  label: 'Thriller',
  hook: 'genre',
  genreId: 53
}] as
const;
interface MoviesPageProps {
  onMovieClick: (movie: MovieData) => void;
}
export function MoviesPage({ onMovieClick }: MoviesPageProps) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const popular = usePopular('movie');
  const topRated = useTopRated('movie');
  const nowPlaying = useNowPlaying('movie');
  const cat = CATEGORIES[activeCategory];
  const genreId = 'genreId' in cat ? cat.genreId : 28;
  const genre = useDiscover('movie', genreId);
  const searchResults = useTMDBSearch(searchQuery, 'movie');
  const isSearching = searchQuery.length > 0;
  const activeData = isSearching ?
  searchResults :
  cat.hook === 'popular' ?
  popular :
  cat.hook === 'topRated' ?
  topRated :
  cat.hook === 'nowPlaying' ?
  nowPlaying :
  genre;
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
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
      
      <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="h-8 w-1 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            <h1 className="text-5xl font-bold text-white tracking-tight font-['Advent_Pro']">
              Movies
            </h1>
            <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-400 border border-white/10">
              {activeData.data.length} results
            </span>
          </div>
          <p className="text-gray-400 ml-5 tracking-wide">
            Discover movies powered by TMDB.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search movies..."
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 text-white text-sm rounded-lg focus:outline-none focus:border-cyan-500/50 w-64 placeholder-gray-500" />
            
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-sm uppercase tracking-widest hover:bg-cyan-500/30 transition-colors"
            style={{
              clipPath:
              'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
            }}>
            
            Search
          </button>
        </form>
      </div>

      <HorizontalCarousel
        className="mb-10 pb-2"
        contentClassName="flex min-w-max gap-3"
        scrollerClassName="py-1"
        buttonClassName="h-9 w-9"
      >
        {CATEGORIES.map((c, i) =>
        <button
          key={c.label}
          onClick={() => {
            setActiveCategory(i);
            setSearchQuery('');
            setSearchInput('');
          }}
          className={`relative px-5 py-2 text-sm uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === i && !isSearching ? 'text-cyan-300 bg-cyan-500/10' : 'text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white'}`}
          style={{
            clipPath:
            'polygon(15% 0, 100% 0, 100% 70%, 85% 100%, 0 100%, 0 30%)'
          }}>
          
            {c.label}
          </button>
        )}
      </HorizontalCarousel>

      {activeData.loading ?
      <GridSkeleton count={8} /> :
      activeData.error ?
      <ErrorState message={activeData.error} onRetry={activeData.refetch} /> :

      <>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
            {activeData.data.map((movie, index) =>
              <motion.div
                key={movie.id}
                className="flex justify-center"
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: index * 0.03
                }}>
                <MovieCard
                  {...movie}
                  className="w-full max-w-[220px] xl:max-w-[228px] 2xl:max-w-[236px]"
                  delay={0}
                  onClick={() => onMovieClick(movie)} />
              </motion.div>
            )}
          </div>
          <LoadMoreSentinel
            canLoadMore={activeData.hasMore}
            className="mt-10 h-10"
            isLoadingMore={activeData.isLoadingMore}
            onLoadMore={activeData.loadMore} />
        </>
      }
    </motion.div>);

}
