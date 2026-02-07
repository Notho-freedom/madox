import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, User } from 'lucide-react';
export function CrystalHeader() {
  return (
    <motion.header
      className="sticky top-0 z-40 w-full px-8 py-4 flex items-center justify-between bg-[#08080f]/80 backdrop-blur-md border-b border-white/5"
      initial={{
        y: -100,
        opacity: 0
      }}
      animate={{
        y: 0,
        opacity: 1
      }}
      transition={{
        duration: 0.8,
        ease: 'easeOut'
      }}>

      {/* Search Bar */}
      <div className="relative group w-96">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
        <div
          className="relative flex items-center bg-white/5 border border-white/10 px-4 py-2 transition-colors group-hover:border-white/20"
          style={{
            clipPath:
            'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
          }}>

          <Search
            size={18}
            className="text-gray-400 group-hover:text-cyan-300 transition-colors" />

          <input
            type="text"
            placeholder="Search movies, series, cast..."
            className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 ml-3 font-['Advent_Pro'] tracking-wide" />

        </div>
      </div>

      {/* Branding */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <h1 className="text-2xl font-bold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white opacity-80 font-['Advent_Pro']">
          CRYSTALLINE
        </h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <button className="relative group p-2 hover:bg-white/5 rounded-full transition-colors">
          <Bell
            size={20}
            className="text-gray-400 group-hover:text-white transition-colors" />

          <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right hidden md:block">
            <div className="text-sm text-white font-medium tracking-wide">
              Alex Chen
            </div>
            <div className="text-xs text-cyan-400/80 uppercase tracking-wider">
              Premium
            </div>
          </div>

          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-full blur opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-white/20 to-white/5">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"
                alt="User"
                className="w-full h-full rounded-full object-cover border border-black/50" />

            </div>
          </div>
        </div>
      </div>
    </motion.header>);

}