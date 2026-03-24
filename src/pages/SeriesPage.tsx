import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LoadMoreSentinel } from '../components/LoadMoreSentinel';
import { MovieCard } from '../components/MovieCard';
import { GridSkeleton, ErrorState } from '../components/LoadingSkeleton';
import { Play, Search } from 'lucide-react';
import {
  usePopular,
  useTopRated,
  useNowPlaying,
  useDiscover,
  useTMDBSearch } from
'../hooks/useTMDB';
import { backdrop } from '../services/tmdb';
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
  label: 'On The Air',
  hook: 'nowPlaying'
},
{
  label: 'Sci-Fi & Fantasy',
  hook: 'genre',
  genreId: 10765
},
{
  label: 'Drama',
  hook: 'genre',
  genreId: 18
},
{
  label: 'Action',
  hook: 'genre',
  genreId: 10759
},
{
  label: 'Animation',
  hook: 'genre',
  genreId: 16
},
{
  label: 'Crime',
  hook: 'genre',
  genreId: 80
}] as
const;
interface SeriesPageProps {
  onMovieClick: (movie: MovieData) => void;
}
export function SeriesPage({ onMovieClick }: SeriesPageProps) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const popular = usePopular('tv');
  const topRated = useTopRated('tv');
  const onAir = useNowPlaying('tv');
  const cat = CATEGORIES[activeCategory];
  const genreId = 'genreId' in cat ? cat.genreId : 10765;
  const genre = useDiscover('tv', genreId);
  const searchResults = useTMDBSearch(searchQuery, 'tv');
  const isSearching = searchQuery.length > 0;
  const activeData = isSearching ?
  searchResults :
  cat.hook === 'popular' ?
  popular :
  cat.hook === 'topRated' ?
  topRated :
  cat.hook === 'nowPlaying' ?
  onAir :
  genre;
  const featured = activeData.data[0];
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
      
      {featured && !activeData.loading &&
      <div className="relative w-full h-[400px] mb-16 overflow-hidden group">
          <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backdrop(featured.backdropPath || null)})`,
            clipPath:
            'polygon(0 0, 100% 0, 100% 85%, 95% 100%, 5% 100%, 0 85%)'
          }} />
        
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080f] via-[#08080f]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-12 w-full max-w-3xl">
            <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs tracking-[0.2em] uppercase backdrop-blur-md mb-4 inline-block">
              Featured Series
            </span>
            <h1 className="text-4xl font-bold text-white mb-3 font-['Advent_Pro'] line-clamp-2">
              {featured.title}
            </h1>
            <p className="text-gray-300 text-sm mb-6 line-clamp-2 max-w-xl">
              {featured.description}
            </p>
            <button
            onClick={() => onMovieClick(featured)}
            className="flex items-center gap-3 px-8 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-cyan-50 transition-colors"
            style={{
              clipPath:
              'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
            }}>
            
              <Play size={20} fill="currentColor" /> Watch Now
            </button>
          </div>
        </div>
      }

      <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-1 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
          <h2 className="text-4xl font-bold text-white tracking-tight font-['Advent_Pro']">
            Series
          </h2>
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
              placeholder="Search series..."
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

      <div className="flex gap-3 mb-10 overflow-x-auto scrollbar-hide pb-2">
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
      </div>

      {activeData.loading ?
      <GridSkeleton count={8} /> :
      activeData.error ?
      <ErrorState message={activeData.error} onRetry={activeData.refetch} /> :

      <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {activeData.data.slice(1).map((s, index) =>
              <motion.div
                key={s.id}
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
                <MovieCard {...s} delay={0} onClick={() => onMovieClick(s)} />
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
