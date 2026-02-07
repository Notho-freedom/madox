import React from 'react';
import { motion } from 'framer-motion';
import { Home, Film, Tv, TrendingUp, Bookmark, Settings } from 'lucide-react';
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
}];

interface CrystalNavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onTogglePanel: () => void;
}
export function CrystalNavbar({
  activePage,
  onNavigate,
  onTogglePanel
}: CrystalNavbarProps) {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 h-16 px-8 flex items-center justify-between bg-[#08080f]/60 backdrop-blur-md border-b border-white/5"
      initial={{
        y: -20,
        opacity: 0
      }}
      animate={{
        y: 0,
        opacity: 1
      }}
      transition={{
        duration: 0.5
      }}>

      {/* Left: Logo Trigger */}
      <button
        onClick={onTogglePanel}
        className="group relative w-10 h-10 flex items-center justify-center bg-white/5 border border-white/20 hover:bg-white/10 transition-colors"
        style={{
          clipPath:
          'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
        }}>

        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="text-xl font-bold text-white tracking-tighter">C</span>
      </button>

      {/* Center: Branding */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <h1 className="text-xl font-bold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white opacity-80 font-['Advent_Pro']">
          CRYSTALLINE
        </h1>
      </div>

      {/* Right: Navigation */}
      <div className="flex items-center gap-8">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="relative group flex items-center gap-2 py-2">

              <item.icon
                size={16}
                className={`transition-colors ${isActive ? 'text-cyan-300' : 'text-gray-400 group-hover:text-white'}`} />

              <span
                className={`text-sm uppercase tracking-widest transition-colors ${isActive ? 'text-cyan-300' : 'text-gray-400 group-hover:text-white'}`}>

                {item.label}
              </span>

              {isActive &&
              <motion.div
                layoutId="nav-indicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30
                }} />

              }
            </button>);

        })}

        <div className="w-px h-6 bg-white/10 mx-2" />

        <button
          onClick={() => onNavigate('settings')}
          className={`p-2 transition-colors ${activePage === 'settings' ? 'text-cyan-300' : 'text-gray-400 hover:text-white'}`}>

          <Settings size={20} />
        </button>
      </div>
    </motion.nav>);

}