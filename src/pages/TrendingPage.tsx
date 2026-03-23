import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUp, ArrowDown, Minus, Star, Play } from 'lucide-react';
import {
  movies,
  series,
  getYouTubeThumbnail,
  type MovieData } from
'../data/movies';
const trendingData = [...movies, ...series].
sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).
slice(0, 10).
map((item, i) => ({
  ...item,
  rank: i + 1,
  views: `${(Math.random() * 3 + 0.5).toFixed(1)}M`,
  change: i < 3 ? 'up' : i < 6 ? 'same' : 'down'
}));
interface TrendingPageProps {
  onMovieClick?: (movie: MovieData) => void;
}
export function TrendingPage({ onMovieClick }: TrendingPageProps) {
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
            Most watched content this week globally.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {trendingData.map((item, index) =>
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
            delay: index * 0.06
          }}
          className="group relative flex items-center gap-8 p-6 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors overflow-hidden cursor-pointer"
          style={{
            clipPath:
            'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
          }}
          onClick={() => onMovieClick?.(item)}>
          
            {/* Rank Number */}
            <div className="text-6xl font-bold text-white/10 font-['Advent_Pro'] w-24 text-center group-hover:text-cyan-500/20 transition-colors">
              {item.rank}
            </div>

            {/* Thumbnail */}
            <div className="w-48 h-28 bg-gray-800 relative overflow-hidden rounded">
              <div
              className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:scale-110 transition-transform duration-500"
              style={{
                backgroundImage: `url(${getYouTubeThumbnail(item.videoId, 'mq')})`
              }} />
            
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <Play size={24} fill="white" className="text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{item.views} views</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                <span className="text-cyan-400">{item.genre}</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                <span>{item.year}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <Star size={16} fill="currentColor" className="text-yellow-500" />
              <span className="text-white font-bold">{item.rating}</span>
            </div>

            {/* Trend Indicator */}
            <div className="pr-8 w-28">
              {item.change === 'up' &&
            <div className="flex items-center gap-2 text-green-400">
                  <ArrowUp size={20} />
                  <span className="text-sm font-bold">RISING</span>
                </div>
            }
              {item.change === 'down' &&
            <div className="flex items-center gap-2 text-red-400">
                  <ArrowDown size={20} />
                  <span className="text-sm font-bold">FALLING</span>
                </div>
            }
              {item.change === 'same' &&
            <div className="flex items-center gap-2 text-gray-500">
                  <Minus size={20} />
                  <span className="text-sm font-bold">STABLE</span>
                </div>
            }
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </motion.div>
        )}
      </div>
    </motion.div>);

}