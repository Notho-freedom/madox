import React from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Plus,
  Star,
  ArrowLeft,
  Share2,
  ThumbsUp,
  Clock,
  Calendar } from
'lucide-react';
interface MovieDetailPageProps {
  movie: any;
  onBack: () => void;
}
export function MovieDetailPage({ movie, onBack }: MovieDetailPageProps) {
  if (!movie) return null;
  return (
    <motion.div
      className="relative min-h-screen w-full bg-[#08080f] z-40"
      initial={{
        opacity: 0,
        y: 50
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      exit={{
        opacity: 0,
        y: 50
      }}
      transition={{
        duration: 0.5
      }}>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="fixed top-24 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-colors rounded-full">

        <ArrowLeft size={20} />
        <span className="uppercase tracking-widest text-sm">Back</span>
      </button>

      {/* Hero Section */}
      <div className="relative w-full h-[70vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${movie.image})`
          }} />

        <div className="absolute inset-0 bg-gradient-to-b from-[#08080f]/30 via-[#08080f]/60 to-[#08080f]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080f]/90 via-[#08080f]/40 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-16 pb-24 flex items-end">
          <div className="max-w-3xl">
            <motion.div
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

              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs tracking-[0.2em] uppercase backdrop-blur-md">
                  Now Streaming
                </span>
                <div className="flex items-center gap-2 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <span className="font-bold">{movie.rating}</span>
                </div>
              </div>

              <h1 className="text-7xl font-bold text-white mb-6 font-['Advent_Pro'] leading-none text-glow">
                {movie.title}
              </h1>

              <div className="flex items-center gap-6 text-gray-300 mb-8 font-light tracking-wide">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{movie.year}</span>
                </div>
                <span className="w-px h-4 bg-white/20" />
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>2h 15m</span>
                </div>
                <span className="w-px h-4 bg-white/20" />
                <span className="px-2 py-0.5 border border-white/20 rounded text-xs">
                  PG-13
                </span>
              </div>

              <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-2xl">
                A visually stunning journey into a world where reality bends and
                the future is uncertain. Experience the masterpiece that critics
                are calling a defining moment in modern cinema.
              </p>

              <div className="flex gap-6">
                <button
                  className="px-8 py-4 bg-white text-black font-bold tracking-widest uppercase flex items-center gap-3 hover:bg-cyan-50 transition-colors"
                  style={{
                    clipPath:
                    'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                  }}>

                  <Play size={20} fill="currentColor" /> Watch Now
                </button>
                <button
                  className="px-8 py-4 bg-white/5 border border-white/20 text-white font-bold tracking-widest uppercase flex items-center gap-3 hover:bg-white/10 transition-colors"
                  style={{
                    clipPath:
                    'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                  }}>

                  <Plus size={20} /> Add to List
                </button>
                <button className="p-4 bg-white/5 border border-white/20 text-white hover:text-cyan-300 transition-colors rounded-full">
                  <Share2 size={20} />
                </button>
                <button className="p-4 bg-white/5 border border-white/20 text-white hover:text-cyan-300 transition-colors rounded-full">
                  <ThumbsUp size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="px-16 py-12 grid grid-cols-3 gap-16">
        <div className="col-span-2 space-y-12">
          {/* Cast */}
          <section>
            <h3 className="text-2xl font-bold text-white mb-6 font-['Advent_Pro'] border-l-4 border-cyan-500 pl-4">
              Top Cast
            </h3>
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) =>
              <div key={i} className="group">
                  <div className="w-full aspect-square bg-white/5 mb-3 overflow-hidden rounded-lg">
                    <div className="w-full h-full bg-gray-800 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="text-white font-bold">Actor Name</div>
                  <div className="text-gray-500 text-sm">Character</div>
                </div>
              )}
            </div>
          </section>

          {/* More Like This */}
          <section>
            <h3 className="text-2xl font-bold text-white mb-6 font-['Advent_Pro'] border-l-4 border-cyan-500 pl-4">
              More Like This
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map((i) =>
              <div
                key={i}
                className="aspect-video bg-white/5 rounded-lg border border-white/10" />

              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
            <h4 className="text-gray-400 uppercase tracking-widest text-sm mb-4">
              Details
            </h4>
            <div className="space-y-4">
              <div>
                <div className="text-gray-500 text-xs uppercase">Director</div>
                <div className="text-white">Denis Villeneuve</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs uppercase">Writers</div>
                <div className="text-white">Jon Spaihts, Denis Villeneuve</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs uppercase">Genres</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="px-2 py-1 bg-white/10 rounded text-xs text-cyan-300">
                    Sci-Fi
                  </span>
                  <span className="px-2 py-1 bg-white/10 rounded text-xs text-cyan-300">
                    Adventure
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>);

}