import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { primaryNavItems, type NavPageId } from '../navigation/primaryNav';
import { CrystalMenuTrigger } from './CrystalMenuTrigger';
import { CrystalSidebarMenuContent } from './CrystalSidebarMenuContent';

interface CrystalSidebarProps {
  activePage: NavPageId;
  onNavigate: (page: NavPageId) => void;
}
export function CrystalSidebar({
  activePage,
  onNavigate
}: CrystalSidebarProps) {
  const [hovered, setHovered] = useState<NavPageId | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <motion.aside
      className="fixed left-0 top-0 bottom-0 z-[70] hidden md:flex"
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
      <div className="flex h-full">
        <div className="flex h-full w-24 shrink-0 flex-col border-r border-white/5 bg-[#08080f]/88 backdrop-blur-xl">
          <div className="flex h-24 items-center justify-center px-4">
            <CrystalMenuTrigger
              ariaExpanded={isExpanded}
              ariaLabel={isExpanded ? 'Close menu' : 'Open menu'}
              className="h-12 w-12 overflow-hidden"
              onClick={() => setIsExpanded((current) => !current)}
            />
          </div>

          <div className="flex flex-1 flex-col px-2 pt-6">
            <div className="space-y-4">
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
                    className="relative flex h-12 w-full items-center justify-center rounded-xl"
                  >
                    {(isActive || isHovered) && (
                      <motion.div
                        layoutId="nav-bg"
                        className="absolute inset-0 border-l-2 border-l-cyan-400/50 bg-white/5"
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
                        }}
                      />
                    )}

                    <item.icon
                      size={24}
                      className={`relative z-10 transition-all duration-300 ${
                        isActive
                          ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.5)]'
                          : isHovered
                            ? 'text-white'
                            : 'text-gray-500'
                      }`}
                    />

                    {isHovered && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-60 blur-[1px]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-auto flex justify-center pb-6">
              <div className="h-16 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              className="h-full w-[304px] overflow-hidden border-r border-white/10 bg-[#090910]/96 shadow-[24px_0_80px_rgba(5,10,30,0.45)] backdrop-blur-xl"
              initial={{
                width: 0,
                opacity: 0
              }}
              animate={{
                width: 304,
                opacity: 1
              }}
              exit={{
                width: 0,
                opacity: 0
              }}
              transition={{
                duration: 0.28,
                ease: 'easeInOut'
              }}>
              <motion.div
                className="h-full"
                initial={{
                  opacity: 0,
                  x: -12
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                exit={{
                  opacity: 0,
                  x: -10
                }}
                transition={{
                  duration: 0.18,
                  delay: 0.05
                }}>
                <CrystalSidebarMenuContent
                  activePage={activePage}
                  layout="desktop"
                  onNavigate={onNavigate}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );

}
