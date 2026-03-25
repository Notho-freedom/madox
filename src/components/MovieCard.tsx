import React from 'react';
import { motion } from 'framer-motion';
import { Star, PlayCircle } from 'lucide-react';
import { poster } from '../services/tmdb';
import { getYouTubeThumbnail } from '../data/movies';
import { FacetPosterCard } from './design';
interface MovieCardProps {
  title: string;
  year: string;
  rating: string;
  color: string;
  videoId: string;
  posterPath?: string | null;
  image?: string;
  genre?: string;
  delay?: number;
  onClick?: () => void;
  className?: string;
  [key: string]: any;
}
export function MovieCard({
  title,
  year,
  rating,
  color,
  videoId,
  posterPath,
  image,
  genre,
  delay = 0,
  onClick,
  className = ''
}: MovieCardProps) {
  // Prefer TMDB poster, fallback to YouTube thumbnail
  const thumbnail = posterPath ?
  poster(posterPath, 'w500') :
  image || (videoId ? getYouTubeThumbnail(videoId, 'maxres') : '');
  return (
    <motion.button
      type="button"
      className={`group relative w-[280px] flex-shrink-0 cursor-pointer text-left ${className}`}
      initial={{
        opacity: 0,
        y: 20
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once: true
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: 'easeOut'
      }}
      whileHover={{
        y: -10,
        scale: 1.02
      }}
      onClick={onClick}>
      <FacetPosterCard
        backgroundImage={thumbnail}
        tintColor={color}
        hoverOverlay={
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
              <PlayCircle size={28} className="text-white" />
            </div>
          </div>
        }
        metaOverlay={
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            {genre &&
              <span className="mb-1 text-[10px] uppercase tracking-widest text-cyan-400/80">
                {genre}
              </span>
            }
            <h3 className="mb-1 line-clamp-2 font-['Advent_Pro'] text-xl font-bold leading-tight tracking-wide text-white drop-shadow-lg transition-colors group-hover:text-cyan-200">
              {title}
            </h3>

            <div className="flex items-center justify-between text-sm font-medium text-gray-300">
              <span>{year}</span>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={14} fill="currentColor" />
                <span>{rating}</span>
              </div>
            </div>

            <div className="h-0 overflow-hidden transition-all duration-300 ease-out group-hover:h-12">
              <div className="flex items-center gap-2 pt-4 text-cyan-300">
                <PlayCircle size={20} />
                <span className="text-sm uppercase tracking-widest">
                  View Details
                </span>
              </div>
            </div>
          </div>
        }
      />
    </motion.button>);

}
