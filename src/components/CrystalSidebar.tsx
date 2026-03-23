import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { primaryNavItems, type NavPageId } from '../navigation/primaryNav';
import { CrystalMenuTrigger } from './CrystalMenuTrigger';

interface CrystalSidebarProps {
  activePage: NavPageId;
  onNavigate: (page: NavPageId) => void;
  onOpenMenu: () => void;
}
export function CrystalSidebar({
  activePage,
  onNavigate,
  onOpenMenu
}: CrystalSidebarProps) {
  const [hovered, setHovered] = useState<NavPageId | null>(null);
  return (
    <motion.nav
      className="fixed left-0 top-0 bottom-0 z-50 hidden w-24 flex-col items-center border-r border-white/5 bg-[#08080f]/80 py-8 backdrop-blur-md md:flex"
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
      <div className="mb-12">
        <CrystalMenuTrigger className="h-12 w-12 overflow-hidden" onClick={onOpenMenu} />
      </div>

      {/* Nav Items */}
      <div className="flex-1 flex flex-col gap-8 w-full px-2">
        {primaryNavItems.map((item) => {
          const isActive = activePage === item.id;
          const isHovered = hovered === item.id;
          return (
            <button
              key={item.id}
              type="button"
              title={item.label}
              aria-label={item.label}
              onClick={() => onNavigate(item.id)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              className="relative group flex w-full items-center justify-center p-3">

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
