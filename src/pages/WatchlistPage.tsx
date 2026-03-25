import React from 'react';
import { motion } from 'framer-motion';
import { MovieCard } from '../components/MovieCard';
import { Bookmark, Trash2, ListX } from 'lucide-react';
import { type MovieData } from '../data/movies';
import { GridSkeleton, ErrorState } from '../components/LoadingSkeleton';
import { useI18n } from '../i18n/useI18n';
import { useWatchlist } from '../hooks/useWatchlist';
import { clearWatchlist, removeFromWatchlist } from '../services/watchlist';
interface WatchlistPageProps {
  onMovieClick: (movie: MovieData) => void;
}
export function WatchlistPage({ onMovieClick }: WatchlistPageProps) {
  const { t } = useI18n();
  const { data: watchlist, loading, error, refetch } = useWatchlist();

  const handleRemove = async (id: number, mediaType: 'movie' | 'tv') => {
    await removeFromWatchlist({
      mediaType,
      tmdbId: id
    });
  };

  const handleClearAll = async () => {
    await clearWatchlist();
  };
  return (
    <motion.div
      className="px-16 py-12 pb-32 pt-8 md:pt-20"
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
      
      <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-full">
            <Bookmark size={24} className="text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-white font-['Advent_Pro']">
            {t('watchlistPage.title')}
          </h1>
          <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-400 border border-white/10">
            {t('common.items', { count: watchlist.length })}
          </span>
        </div>
        {watchlist.length > 0 &&
        <button
          onClick={handleClearAll}
          className="text-sm text-red-400 hover:text-red-300 flex items-center gap-2 uppercase tracking-widest transition-colors">
          
            <Trash2 size={16} /> {t('common.clearAll')}
          </button>
        }
      </div>

      {loading ?
      <GridSkeleton count={8} /> :
      error ?
      <ErrorState message={error} onRetry={refetch} /> :
      watchlist.length === 0 ?
      <div className="flex flex-col items-center justify-center py-32 text-gray-500">
          <ListX size={48} className="mb-4 opacity-20" />
          <p className="text-lg">{t('watchlistPage.emptyTitle')}</p>
          <p className="text-sm text-gray-600 mt-2">
            {t('watchlistPage.emptyDescription')}
          </p>
        </div> :

      <>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
            {watchlist.map((item, index) =>
              <motion.div
                key={item.id}
                className="group relative"
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: index * 0.05
                }}>
                <div className="flex justify-center">
                  <MovieCard
                    {...item}
                    className="w-full max-w-[220px] xl:max-w-[228px] 2xl:max-w-[236px]"
                    delay={0}
                    onClick={() => onMovieClick(item)} />
                </div>
                <button
                  onClick={() => handleRemove(item.tmdbId ?? Number(item.id), item.mediaType ?? 'movie')}
                  className="absolute right-8 top-4 z-20 rounded-full border border-red-500/30 bg-black/50 p-2 text-red-400 opacity-0 transition-opacity hover:bg-red-500/20 group-hover:opacity-100 backdrop-blur-md">
                  <Trash2 size={16} />
                </button>
              </motion.div>
            )}
          </div>
        </>
      }
    </motion.div>);

}
