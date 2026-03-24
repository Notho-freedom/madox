import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { primaryNavItems, type NavPageId } from '../navigation/primaryNav';
import {
  sidebarFooterAction,
  sidebarProfile,
  sidebarUtilityActions
} from '../navigation/sidebarUtilities';
import { CrystalMenuTrigger } from './CrystalMenuTrigger';

interface CrystalSidebarProps {
  activePage: NavPageId;
  onNavigate: (page: NavPageId) => void;
}
export function CrystalSidebar({
  activePage,
  onNavigate
}: CrystalSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rowClipPath =
    'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)';
  const iconClipPath =
    'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)';

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const openSidebar = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setIsExpanded(true);
  };

  const closeSidebar = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 150);
  };

  const handleSelect = (page?: NavPageId) => {
    if (page) {
      onNavigate(page);
    }

    setIsExpanded(false);
  };

  return (
    <motion.aside
      className="fixed left-0 top-0 bottom-0 z-[70] hidden overflow-hidden md:block"
      initial={{
        x: -100
      }}
      onPointerEnter={openSidebar}
      onPointerLeave={closeSidebar}
      animate={{
        x: 0,
        width: isExpanded ? 420 : 96
      }}
      transition={{
        duration: 0.28,
        ease: 'easeOut'
      }}>
      <div className="flex h-full flex-col bg-[#08080f]/92 backdrop-blur-2xl shadow-[0_0_70px_rgba(6,16,30,0.42)]">
        <div className="grid min-h-24 grid-cols-[96px_minmax(0,1fr)] items-center">
          <div className="flex items-center justify-center">
            <CrystalMenuTrigger
              ariaExpanded={isExpanded}
              ariaLabel="Browse menu"
              className="h-12 w-12 overflow-hidden"
              onClick={() => undefined}
            />
          </div>
          <div className="overflow-hidden pr-6">
            <div
              className={`transition-all duration-200 ${
                isExpanded ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'
              }`}>
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/15 to-blue-400/15 blur-xl" />
                <div
                  className="relative flex min-h-[58px] items-center px-5"
                  style={{
                    clipPath:
                      'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)'
                  }}>
                  <input
                    type="text"
                    placeholder="Search for anything..."
                    className="w-full bg-transparent text-sm tracking-[0.18em] text-white outline-none placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-between pb-5">
          <div className="space-y-3 pt-4">
            {primaryNavItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  title={item.label}
                  aria-label={item.label}
                  onClick={() => handleSelect(item.id)}
                  className="group relative grid h-12 w-full grid-cols-[96px_minmax(0,1fr)] items-center overflow-hidden text-left"
                  style={{
                    clipPath: rowClipPath
                  }}>
                  <div
                    className={`pointer-events-none absolute inset-y-[2px] left-3 right-4 transition-all duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                    style={{
                      clipPath: rowClipPath
                    }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/12 via-white/[0.04] to-transparent" />
                    <div
                      className="absolute inset-0 prism-border"
                      style={{
                        clipPath: rowClipPath
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <div
                      className={`relative flex h-12 w-12 items-center justify-center overflow-hidden transition-all duration-300 ${
                        isActive ?
                          'bg-cyan-500/10 shadow-[0_0_22px_rgba(34,211,238,0.16)]' :
                          'bg-white/[0.015] group-hover:bg-white/[0.03]'
                      }`}
                      style={{
                        clipPath: iconClipPath
                      }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-cyan-400/10" />
                      <div
                        className={`absolute inset-0 prism-border transition-opacity duration-300 ${
                          isActive ? 'opacity-90' : 'opacity-45 group-hover:opacity-80'
                        }`}
                        style={{
                          clipPath: iconClipPath
                        }}
                      />
                      <item.icon
                        size={22}
                        className={`relative z-10 transition-all duration-200 ${
                          isActive ?
                            'text-cyan-300 drop-shadow-[0_0_10px_rgba(103,232,249,0.45)]' :
                            'text-gray-500 group-hover:text-white'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="relative z-10 overflow-hidden pr-6">
                    <span
                      className={`block whitespace-nowrap text-sm uppercase tracking-[0.24em] transition-all duration-200 ${
                        isExpanded ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'
                      } ${
                        isActive ? 'text-cyan-300' : 'text-gray-500 group-hover:text-white'
                      }`}>
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            })}

            <div className="space-y-3 pt-3">
              {sidebarUtilityActions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect()}
                  className="group relative grid h-12 w-full grid-cols-[96px_minmax(0,1fr)] items-center overflow-hidden text-left"
                  style={{
                    clipPath: rowClipPath
                  }}>
                  <div
                    className="pointer-events-none absolute inset-y-[2px] left-3 right-4 opacity-0 transition-all duration-300 group-hover:opacity-100"
                    style={{
                      clipPath: rowClipPath
                    }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/8 via-white/[0.02] to-transparent" />
                    <div
                      className="absolute inset-0 prism-border"
                      style={{
                        clipPath: rowClipPath
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <div
                      className="relative flex h-12 w-12 items-center justify-center overflow-hidden bg-white/[0.015] transition-all duration-300 group-hover:bg-white/[0.03]"
                      style={{
                        clipPath: iconClipPath
                      }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-cyan-400/10" />
                      <div
                        className="absolute inset-0 prism-border opacity-30 transition-opacity duration-300 group-hover:opacity-65"
                        style={{
                          clipPath: iconClipPath
                        }}
                      />
                      <item.icon
                        size={20}
                        className="relative z-10 text-gray-500 transition-colors duration-200 group-hover:text-white"
                      />
                    </div>
                  </div>
                  <div className="relative z-10 overflow-hidden pr-6">
                    <div
                      className={`flex items-center gap-3 whitespace-nowrap text-sm uppercase tracking-[0.2em] transition-all duration-200 ${
                        isExpanded ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'
                      } text-gray-500 group-hover:text-white`}>
                      <span>{item.label}</span>
                      {item.hasIndicator && (
                        <span className="h-2 w-2 rounded-full bg-cyan-400" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSelect()}
              className="group relative grid h-14 w-full grid-cols-[96px_minmax(0,1fr)] items-center overflow-hidden text-left"
              style={{
                clipPath: rowClipPath
              }}>
              <div
                className="pointer-events-none absolute inset-y-[2px] left-3 right-4 opacity-0 transition-all duration-300 group-hover:opacity-100"
                style={{
                  clipPath: rowClipPath
                }}>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-white/[0.04] to-transparent" />
                <div
                  className="absolute inset-0 prism-border"
                  style={{
                    clipPath: rowClipPath
                  }}
                />
              </div>
              <div className="flex items-center justify-center">
                <div
                  className="relative flex h-12 w-12 items-center justify-center overflow-hidden bg-white/[0.015]"
                  style={{
                    clipPath: iconClipPath
                  }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-cyan-400/10" />
                  <div
                    className="absolute inset-0 prism-border opacity-38 transition-opacity duration-300 group-hover:opacity-68"
                    style={{
                      clipPath: iconClipPath
                    }}
                  />
                  <div className="relative h-10 w-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 p-[2px]">
                    <img
                      src={sidebarProfile.avatarUrl}
                      alt="User"
                      className="h-full w-full rounded-full border-2 border-[#08080f] object-cover"
                    />
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#08080f] bg-green-500" />
                  </div>
                </div>
              </div>
              <div className="relative z-10 overflow-hidden pr-6">
                <div
                  className={`transition-all duration-200 ${
                    isExpanded ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'
                  }`}>
                  <div className="truncate text-sm font-medium text-white group-hover:text-cyan-200">
                    {sidebarProfile.name}
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-400/80">
                    {sidebarProfile.membership}
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelect()}
              className="group relative grid h-12 w-full grid-cols-[96px_minmax(0,1fr)] items-center overflow-hidden text-left"
              style={{
                clipPath: rowClipPath
              }}>
              <div
                className="pointer-events-none absolute inset-y-[2px] left-3 right-4 opacity-0 transition-all duration-300 group-hover:opacity-100"
                style={{
                  clipPath: rowClipPath
                }}>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-white/[0.04] to-transparent" />
                <div
                  className="absolute inset-0 prism-border"
                  style={{
                    clipPath: rowClipPath
                  }}
                />
              </div>
              <div className="flex items-center justify-center">
                <div
                  className="relative flex h-12 w-12 items-center justify-center overflow-hidden bg-white/[0.015] transition-all duration-300 group-hover:bg-red-500/[0.05]"
                  style={{
                    clipPath: iconClipPath
                  }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-red-400/10" />
                  <div
                    className="absolute inset-0 prism-border opacity-30 transition-opacity duration-300 group-hover:opacity-65"
                    style={{
                      clipPath: iconClipPath
                    }}
                  />
                  <sidebarFooterAction.icon
                    size={20}
                    className="relative z-10 text-red-400 transition-colors duration-200 group-hover:text-red-300" />
                </div>
              </div>
              <div className="relative z-10 overflow-hidden pr-6">
                <span
                  className={`block whitespace-nowrap text-sm uppercase tracking-[0.2em] text-red-400 transition-all duration-200 group-hover:text-red-300 ${
                    isExpanded ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'
                  }`}>
                  {sidebarFooterAction.label}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.aside>
  );

}
