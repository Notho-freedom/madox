import React from 'react';
import { motion } from 'framer-motion';
import { HorizontalCarousel } from './HorizontalCarousel';
import {
  homeGenreOptions,
  type HomeGenreId
} from '../data/homeGenres';

interface GenreFilterProps {
  activeGenre: HomeGenreId;
  onChange: (genreId: HomeGenreId) => void;
}

export function GenreFilter({ activeGenre, onChange }: GenreFilterProps) {
  return (
    <HorizontalCarousel
      className="w-full px-16 py-8"
      contentClassName="flex min-w-max items-center gap-4"
      scrollerClassName="py-1"
      buttonClassName="h-9 w-9"
    >
        {homeGenreOptions.map((genre) => {
          const isActive = activeGenre === genre.id;
          return (
            <button
              key={genre.id}
              onClick={() => onChange(genre.id)}
              className="relative group px-6 py-2 outline-none">
              
              {isActive &&
              <motion.div
                layoutId="activeGenre"
                className="absolute inset-0 bg-white/10 prism-border"
                style={{
                  clipPath:
                  'polygon(15% 0, 100% 0, 100% 70%, 85% 100%, 0 100%, 0 30%)'
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30
                }} />

              }

              {!isActive &&
              <div
                className="absolute inset-0 bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors duration-300"
                style={{
                  clipPath:
                  'polygon(15% 0, 100% 0, 100% 70%, 85% 100%, 0 100%, 0 30%)'
                }} />

              }

              <span
                className={`relative z-10 text-sm tracking-widest uppercase font-medium transition-colors duration-300 ${isActive ? 'text-cyan-300 text-glow' : 'text-gray-400 group-hover:text-white'}`}>
                
                {genre.label}
              </span>
            </button>);

        })}
    </HorizontalCarousel>);

}
