import React from 'react';
import { motion } from 'framer-motion';
import { Star, PlayCircle } from 'lucide-react';
interface MovieCardProps {
  title: string;
  year: string;
  rating: string;
  color: string;
  image: string;
  delay?: number;
  onClick?: () => void;
}
export function MovieCard({
  title,
  year,
  rating,
  color,
  image,
  delay = 0,
  onClick
}: MovieCardProps) {
  return (
    <motion.div
      className="group relative w-[280px] flex-shrink-0 cursor-pointer"
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

      {/* Card Container with Clip Path */}
      <div
        className="relative h-[400px] w-full bg-[#12121a] overflow-hidden transition-all duration-500"
        style={{
          clipPath: 'polygon(10% 0, 100% 0, 100% 85%, 90% 100%, 0 100%, 0 15%)'
        }}>

        {/* Real Image Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{
            backgroundImage: `url(${image})`
          }} />


        {/* Gradient Overlay (always visible for text readability) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Color Tint Overlay (subtle) */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay group-hover:opacity-30 transition-opacity"
          style={{
            backgroundColor: color
          }} />


        {/* Geometric Overlay Pattern */}
        <div
          className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{
            backgroundImage:
            'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.4) 0%, transparent 60%)'
          }} />


        {/* Content Overlay */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <h3 className="text-2xl font-bold text-white mb-1 leading-tight tracking-wide font-['Advent_Pro'] group-hover:text-cyan-200 transition-colors drop-shadow-lg">
            {title}
          </h3>

          <div className="flex items-center justify-between text-gray-300 text-sm font-medium">
            <span>{year}</span>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={14} fill="currentColor" />
              <span>{rating}</span>
            </div>
          </div>

          {/* Hover Action */}
          <div className="h-0 overflow-hidden group-hover:h-12 transition-all duration-300 ease-out">
            <div className="pt-4 flex items-center gap-2 text-cyan-300">
              <PlayCircle size={20} />
              <span className="text-sm uppercase tracking-widest">
                View Details
              </span>
            </div>
          </div>
        </div>

        {/* Prismatic Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </div>

      {/* Border Glow Effect */}
      <div
        className="absolute inset-[-1px] z-[-1] bg-gradient-to-br from-white/20 via-transparent to-white/20 opacity-30 group-hover:opacity-60 transition-opacity duration-300"
        style={{
          clipPath: 'polygon(10% 0, 100% 0, 100% 85%, 90% 100%, 0 100%, 0 15%)'
        }} />

    </motion.div>);

}