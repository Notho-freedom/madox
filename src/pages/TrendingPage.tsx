import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Minus,
  Star,
  Play } from
'lucide-react';
import { useI18n } from '../i18n/useI18n';
import { useTrending } from '../hooks/useTMDB';
import { type MovieData } from '../data/movies';
import { LoadMoreSentinel } from '../components/LoadMoreSentinel';
import { ListSkeleton, ErrorState } from '../components/LoadingSkeleton';
interface TrendingPageProps {
  onMovieClick?: (movie: MovieData) => void;
}
export function TrendingPage({ onMovieClick }: TrendingPageProps) {
  const { t } = useI18n();
  const {
    data,
    loading,
    error,
    refetch,
    hasMore,
    isLoadingMore,
    loadMore
  } = useTrending('all', 'week');
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
      
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
          <TrendingUp size={32} className="text-cyan-400" />
        </div>
        <div>
          <h1 className="text-5xl font-bold text-white font-['Advent_Pro']">
            {t('trendingPage.title')}
          </h1>
          <p className="text-gray-400 tracking-wide">
            {t('trendingPage.description')}
          </p>
        </div>
      </div>

      {loading ?
      <ListSkeleton count={10} /> :
      error ?
      <ErrorState message={error} onRetry={refetch} /> :

      <>
          <div className="space-y-4">
            {data.map((item, index) => {
              const change = index < 5 ? 'up' : index < 12 ? 'same' : 'down';
              const bgImage = item.backdropPath ?
                `https://image.tmdb.org/t/p/w780${item.backdropPath}` :
                '';

              return (
                <motion.div
                  key={item.id}
                  initial={{
                    opacity: 0,
                    x: -20
                  }}
                  animate={{
                    opacity: 1,
                    x: 0
                  }}
                  transition={{
                    delay: index * 0.04
                  }}
                  className="group relative flex items-center gap-8 overflow-hidden border border-white/5 bg-white/5 p-6 transition-colors hover:bg-white/10 cursor-pointer"
                  style={{
                    clipPath:
                      'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
                  }}
                  onClick={() => onMovieClick?.(item)}>
                  <div className="w-24 text-center text-6xl font-bold text-white/10 transition-colors group-hover:text-cyan-500/20 font-['Advent_Pro']">
                    {index + 1}
                  </div>

                  <div className="relative h-28 w-48 flex-shrink-0 overflow-hidden rounded bg-gray-800">
                    {bgImage &&
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-80 transition-transform duration-500 group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${bgImage})`
                        }} />
                    }
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                      <Play size={24} fill="white" className="text-white" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="mb-2 line-clamp-1 text-xl font-bold text-white transition-colors group-hover:text-cyan-200">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <span>{item.year}</span>
                      <span className="h-1 w-1 rounded-full bg-gray-600" />
                      <span className="text-cyan-400">{item.genre}</span>
                      {item.mediaType &&
                        <>
                          <span className="h-1 w-1 rounded-full bg-gray-600" />
                          <span className="text-xs uppercase">
                            {item.mediaType === 'tv' ? t('common.series') : t('common.movie')}
                          </span>
                        </>
                      }
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star
                      size={16}
                      fill="currentColor"
                      className="text-yellow-500" />
                    <span className="font-bold text-white">{item.rating}</span>
                  </div>

                  <div className="w-28 flex-shrink-0 pr-8">
                    {change === 'up' &&
                      <div className="flex items-center gap-2 text-green-400">
                        <ArrowUp size={20} />
                        <span className="text-sm font-bold">{t('trendingPage.rising').toUpperCase()}</span>
                      </div>
                    }
                    {change === 'down' &&
                      <div className="flex items-center gap-2 text-red-400">
                        <ArrowDown size={20} />
                        <span className="text-sm font-bold">{t('trendingPage.falling').toUpperCase()}</span>
                      </div>
                    }
                    {change === 'same' &&
                      <div className="flex items-center gap-2 text-gray-500">
                        <Minus size={20} />
                        <span className="text-sm font-bold">{t('trendingPage.stable').toUpperCase()}</span>
                      </div>
                    }
                  </div>

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </motion.div>
              );
            })}
          </div>
          <LoadMoreSentinel
            canLoadMore={hasMore}
            className="mt-10 h-10"
            isLoadingMore={isLoadingMore}
            onLoadMore={loadMore} />
        </>
      }
    </motion.div>);

}
