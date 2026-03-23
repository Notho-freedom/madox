import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Filter,
  ChevronDown,
  LayoutList,
  Star,
  Clock,
  Calendar,
  SortAsc } from
'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { getYouTubeThumbnail, type MovieData } from '../data/movies';
type SortOption = 'popular' | 'rating' | 'year-new' | 'year-old' | 'title';
type ViewMode = 'grid' | 'list';
interface ViewAllPageProps {
  title: string;
  description: string;
  items: MovieData[];
  onBack: () => void;
  onMovieClick: (movie: MovieData) => void;
}
export function ViewAllPage({
  title,
  description,
  items,
  onBack,
  onMovieClick
}: ViewAllPageProps) {
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [activeGenre, setActiveGenre] = useState('All');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const genres = useMemo(() => {
    const g = new Set(items.map((m) => m.genre).filter(Boolean));
    return ['All', ...Array.from(g)] as string[];
  }, [items]);
  const filteredAndSorted = useMemo(() => {
    let result = [...items];
    if (activeGenre !== 'All') {
      result = result.filter((m) => m.genre === activeGenre);
    }
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
      case 'year-new':
        result.sort((a, b) => parseInt(b.year) - parseInt(a.year));
        break;
      case 'year-old':
        result.sort((a, b) => parseInt(a.year) - parseInt(b.year));
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    return result;
  }, [items, sortBy, activeGenre]);
  const sortLabels: Record<SortOption, string> = {
    popular: 'Popular',
    rating: 'Top Rated',
    'year-new': 'Newest',
    'year-old': 'Oldest',
    title: 'A–Z'
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
      
      {/* Back + Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
        
        <ArrowLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform" />
        
        <span className="uppercase tracking-widest text-sm">Back to Home</span>
      </button>

      <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="h-8 w-1 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            <h1 className="text-5xl font-bold text-white tracking-tight font-['Advent_Pro']">
              {title}
            </h1>
            <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-400 border border-white/10">
              {filteredAndSorted.length} titles
            </span>
          </div>
          <p className="text-gray-400 ml-5 tracking-wide">{description}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex bg-white/5 border border-white/10 rounded overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:text-white'}`}>
              
              <div size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:text-white'}`}>
              
              <LayoutList size={18} />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm uppercase tracking-widest text-gray-300"
              style={{
                clipPath:
                'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
              }}>
              
              <SortAsc size={16} /> {sortLabels[sortBy]}{' '}
              <ChevronDown size={14} />
            </button>

            {showSortMenu &&
            <>
                <div
                className="fixed inset-0 z-40"
                onClick={() => setShowSortMenu(false)} />
              
                <motion.div
                className="absolute right-0 top-full mt-2 z-50 bg-[#08080f]/95 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden min-w-[180px]"
                initial={{
                  opacity: 0,
                  y: -10
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}>
                
                  {(Object.keys(sortLabels) as SortOption[]).map((key) =>
                <button
                  key={key}
                  onClick={() => {
                    setSortBy(key);
                    setShowSortMenu(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors flex items-center justify-between ${sortBy === key ? 'text-cyan-300' : 'text-gray-300'}`}>
                  
                      {sortLabels[key]}
                      {sortBy === key &&
                  <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                  }
                    </button>
                )}
                </motion.div>
              </>
            }
          </div>
        </div>
      </div>

      {/* Genre Filter */}
      <div className="flex gap-3 mb-10 overflow-x-auto scrollbar-hide pb-2">
        {genres.map((genre) =>
        <button
          key={genre}
          onClick={() => setActiveGenre(genre)}
          className={`relative px-5 py-2 text-sm uppercase tracking-widest transition-all whitespace-nowrap ${activeGenre === genre ? 'text-cyan-300 bg-cyan-500/10' : 'text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white'}`}
          style={{
            clipPath:
            'polygon(15% 0, 100% 0, 100% 70%, 85% 100%, 0 100%, 0 30%)'
          }}>
          
            {genre}
          </button>
        )}
      </div>

      {/* Content */}
      {filteredAndSorted.length === 0 ?
      <div className="flex flex-col items-center justify-center py-32 text-gray-500">
          <Filter size={48} className="mb-4 opacity-20" />
          <p className="text-lg">No titles match your filters.</p>
          <button
          onClick={() => {
            setActiveGenre('All');
            setSortBy('popular');
          }}
          className="mt-4 px-6 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors uppercase tracking-widest text-sm">
          
            Reset Filters
          </button>
        </div> :
      viewMode === 'grid' ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAndSorted.map((movie, index) =>
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
            delay={0}
            onClick={() => onMovieClick(movie)} />
          
            </motion.div>
        )}
        </div> :

      <div className="space-y-4">
          {filteredAndSorted.map((movie, index) =>
        <motion.div
          key={movie.id}
          className="group relative flex items-center gap-6 p-4 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer overflow-hidden"
          style={{
            clipPath:
            'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)'
          }}
          initial={{
            opacity: 0,
            x: -20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          transition={{
            delay: index * 0.03
          }}
          onClick={() => onMovieClick(movie)}>
          
              {/* Rank */}
              <div className="text-4xl font-bold text-white/10 font-['Advent_Pro'] w-12 text-center group-hover:text-cyan-500/20 transition-colors">
                {index + 1}
              </div>

              {/* Thumbnail */}
              <div className="w-40 h-24 bg-gray-800 rounded overflow-hidden flex-shrink-0 relative">
                <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
              style={{
                backgroundImage: `url(${getYouTubeThumbnail(movie.videoId, 'mq')})`
              }} />
            
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-200 transition-colors">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{movie.year}</span>
                  </div>
                  <span className="w-1 h-1 bg-gray-600 rounded-full" />
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{movie.duration || '2h 15m'}</span>
                  </div>
                  <span className="w-1 h-1 bg-gray-600 rounded-full" />
                  <span className="text-cyan-400">{movie.genre}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 pr-4">
                <Star
              size={18}
              fill="currentColor"
              className="text-yellow-500" />
            
                <span className="text-white font-bold text-lg">
                  {movie.rating}
                </span>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
        )}
        </div>
      }
    </motion.div>);

}