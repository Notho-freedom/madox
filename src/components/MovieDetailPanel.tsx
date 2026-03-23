import React from 'react';
import { motion } from 'framer-motion';
import { X, Play, Plus, Star, Share2, ThumbsUp } from 'lucide-react';
interface MovieDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
}
export function MovieDetailPanel({ isOpen, onClose }: MovieDetailPanelProps) {
  return (
    <motion.div
      className="fixed top-0 right-0 bottom-0 w-[500px] z-50 bg-[#08080f]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl"
      initial={{
        x: '100%'
      }}
      animate={{
        x: isOpen ? 0 : '100%'
      }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 300
      }}>
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
        style={{
          clipPath:
          'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
        }}>
        
        <X
          size={20}
          className="text-gray-400 group-hover:text-white transition-colors" />
        
      </button>

      <div className="h-full overflow-y-auto scrollbar-hide">
        {/* Hero Image Area */}
        <div className="relative h-[300px] w-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
              'url(https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop)',
              filter: 'brightness(0.8)'
            }} />
          
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#08080f]/50 to-[#08080f]" />

          {/* Prismatic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10 mix-blend-overlay" />
        </div>

        {/* Content */}
        <div className="px-8 -mt-20 relative z-10">
          {/* Title Block */}
          <div className="mb-8">
            <motion.h2
              className="text-5xl font-bold text-white mb-2 font-['Advent_Pro'] leading-none"
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.2
              }}>
              
              BLADE RUNNER <br />
              <span className="text-cyan-400 text-glow">2049</span>
            </motion.h2>

            <div className="flex items-center gap-4 text-sm text-gray-400 font-medium tracking-wide">
              <span className="text-white">2017</span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span className="flex items-center gap-1 text-yellow-500">
                <Star size={14} fill="currentColor" /> 8.0
              </span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span>2h 44m</span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span className="px-2 py-0.5 border border-white/20 rounded text-xs">
                R
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              className="flex-1 py-3 bg-white text-black font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-cyan-50 transition-colors"
              style={{
                clipPath:
                'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
              }}>
              
              <Play size={18} fill="currentColor" /> Watch
            </button>
            <button
              className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
              style={{
                clipPath:
                'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
              }}>
              
              <Plus size={18} /> List
            </button>
            <button
              className="p-3 bg-white/5 border border-white/10 text-white hover:text-cyan-300 transition-colors"
              style={{
                clipPath:
                'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
              }}>
              
              <ThumbsUp size={18} />
            </button>
          </div>

          {/* Synopsis */}
          <div className="mb-8">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-3">
              Synopsis
            </h3>
            <p className="text-gray-300 leading-relaxed font-light">
              Young Blade Runner K's discovery of a long-buried secret leads him
              to track down former Blade Runner Rick Deckard, who's been missing
              for thirty years.
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {['Sci-Fi', 'Thriller', 'Mystery', 'Cyberpunk'].map((tag) =>
            <span
              key={tag}
              className="px-3 py-1 bg-white/5 border border-white/10 text-xs text-cyan-200 tracking-wider">
              
                {tag}
              </span>
            )}
          </div>

          {/* Cast */}
          <div>
            <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
              Cast
            </h3>
            <div className="space-y-3">
              {[
              {
                name: 'Ryan Gosling',
                role: 'K'
              },
              {
                name: 'Harrison Ford',
                role: 'Rick Deckard'
              },
              {
                name: 'Ana de Armas',
                role: 'Joi'
              },
              {
                name: 'Sylvia Hoeks',
                role: 'Luv'
              }].
              map((actor, i) =>
              <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">
                      {actor.name}
                    </div>
                    <div className="text-gray-500 text-xs">{actor.role}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>);

}