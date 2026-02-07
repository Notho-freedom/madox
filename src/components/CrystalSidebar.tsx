import React, { useState } from 'react';
import { Home, Film, Tv, TrendingUp, Bookmark, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
const navItems = [
{
  icon: Home,
  label: 'Home',
  id: 'home'
},
{
  icon: Film,
  label: 'Movies',
  id: 'movies'
},
{
  icon: Tv,
  label: 'Series',
  id: 'series'
},
{
  icon: TrendingUp,
  label: 'Trending',
  id: 'trending'
},
{
  icon: Bookmark,
  label: 'Watchlist',
  id: 'watchlist'
},
{
  icon: Settings,
  label: 'Settings',
  id: 'settings'
}];

interface CrystalSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}
export function CrystalSidebar({
  activePage,
  onNavigate
}: CrystalSidebarProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <motion.nav
      className="fixed left-0 top-0 bottom-0 w-24 z-50 flex flex-col items-center py-8 bg-[#08080f]/80 backdrop-blur-md border-r border-white/5"
      initial={{
        x: -100
      }}
      animate={{
        x: 0
      }}
      transition={{
        duration: 0.8,
        ease: 'easeOut'
      }}>

      {/* Logo Area */}
      <div
        className="mb-12 relative group cursor-pointer"
        onClick={() => onNavigate('home')}>

        <div
          className="w-12 h-12 bg-white/5 border border-white/20 flex items-center justify-center relative overflow-hidden"
          style={{
            clipPath:
            'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
          }}>

          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="text-2xl font-bold text-white tracking-tighter">
            C
          </span>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 flex flex-col gap-8 w-full px-2">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          const isHovered = hovered === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              className="relative group w-full flex flex-col items-center justify-center gap-1 p-2">

              {/* Active/Hover Indicator Background */}
              {(isActive || isHovered) &&
              <motion.div
                layoutId="nav-bg"
                className="absolute inset-0 bg-white/5 border-l-2 border-l-cyan-400/50"
                style={{
                  clipPath: 'polygon(0 0, 100% 10%, 100% 90%, 0 100%)'
                }}
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                exit={{
                  opacity: 0
                }} />

              }

              {/* Icon */}
              <item.icon
                size={24}
                className={`relative z-10 transition-all duration-300 ${isActive ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.5)]' : isHovered ? 'text-white' : 'text-gray-500'}`} />


              {/* Label */}
              <span
                className={`text-[10px] uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-cyan-300' : 'text-gray-500'}`}>

                {item.label}
              </span>

              {/* Prismatic Edge Effect on Hover */}
              {isHovered &&
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-50 blur-[1px]" />
                </div>
              }
            </button>);

        })}
      </div>

      {/* Bottom Decoration */}
      <div className="mt-auto w-1 h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
    </motion.nav>);

}