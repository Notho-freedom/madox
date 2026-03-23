import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Minus,
  Star,
  Play,
  Eye } from
'lucide-react';
import { useTrending } from '../hooks/useTMDB';
import { backdrop } from '../services/tmdb';
import { type MovieData } from '../data/movies';
import { ListSkeleton, ErrorState } from '../components/LoadingSkeleton';
interface TrendingPageProps {
  onMovieClick?: (movie: MovieData) => void;
}
export function TrendingPage({ onMovieClick }: TrendingPageProps) {
  const { data, loading, error, refetch } = useTrending('all', 'week');
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
            Trending Now
          </h1>
          <p className="text-gray-400 tracking-wide">
            Most popular content this week — powered by TMDB.
          </p>
        </div>
      </div>

      {loading ?
      <ListSkeleton count={10} /> :
      error ?
      <ErrorState message={error} onRetry={refetch} /> :

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
              className="group relative flex items-center gap-8 p-6 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors overflow-hidden cursor-pointer"
              style={{
                clipPath:
                'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
              }}
              onClick={() => onMovieClick?.(item)}>
              
                <div className="text-6xl font-bold text-white/10 font-['Advent_Pro'] w-24 text-center group-hover:text-cyan-500/20 transition-colors">
                  {index + 1}
                </div>

                <div className="w-48 h-28 bg-gray-800 relative overflow-hidden rounded flex-shrink-0">
                  {bgImage &&
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage: `url(${bgImage})`
                  }} />

                }
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={24} fill="white" className="text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                    <span>{item.year}</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full" />
                    <span className="text-cyan-400">{item.genre}</span>
                    {item.mediaType &&
                  <>
                        <span className="w-1 h-1 bg-gray-600 rounded-full" />
                        <span className="uppercase text-xs">
                          {item.mediaType === 'tv' ? 'Series' : 'Movie'}
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
                
                  <span className="text-white font-bold">{item.rating}</span>
                </div>

                <div className="pr-8 w-28 flex-shrink-0">
                  {change === 'up' &&
                <div className="flex items-center gap-2 text-green-400">
                      <ArrowUp size={20} />
                      <span className="text-sm font-bold">RISING</span>
                    </div>
                }
                  {change === 'down' &&
                <div className="flex items-center gap-2 text-red-400">
                      <ArrowDown size={20} />
                      <span className="text-sm font-bold">FALLING</span>
                    </div>
                }
                  {change === 'same' &&
                <div className="flex items-center gap-2 text-gray-500">
                      <Minus size={20} />
                      <span className="text-sm font-bold">STABLE</span>
                    </div>
                }
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>);

        })}
        </div>
      }
    </motion.div>);

}