import React from 'react';
import { Search } from 'lucide-react';
import { primaryNavItems, type NavPageId } from '../navigation/primaryNav';
import {
  sidebarFooterAction,
  sidebarProfile,
  sidebarUtilityActions
} from '../navigation/sidebarUtilities';

type SidebarMenuLayout = 'desktop' | 'mobile';

interface CrystalSidebarMenuContentProps {
  activePage: NavPageId;
  layout: SidebarMenuLayout;
  onNavigate: (page: NavPageId) => void;
  searchAutoFocus?: boolean;
}

export function CrystalSidebarMenuContent({
  activePage,
  layout,
  onNavigate,
  searchAutoFocus = false
}: CrystalSidebarMenuContentProps) {
  const isDesktop = layout === 'desktop';
  const navSpacingClass = isDesktop ? 'space-y-4' : 'space-y-3';
  const searchSectionClass = isDesktop ?
  'flex min-h-24 items-center border-b border-white/10 px-6' :
  'border-b border-white/10 px-6 pb-5 pt-6 pr-16';

  return (
    <div className="flex h-full flex-col">
      <div className={searchSectionClass}>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
          <div
            className="relative flex items-center bg-white/5 border border-white/10 px-4 py-3 transition-colors group-hover:border-white/20"
            style={{
              clipPath:
                'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
            }}
          >
            <Search
              size={18}
              className="text-gray-400 transition-colors group-hover:text-cyan-300"
            />
            <input
              type="text"
              placeholder="Search..."
              autoFocus={searchAutoFocus}
              className="ml-3 w-full bg-transparent border-none text-sm tracking-wide text-white outline-none placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className={`px-4 pt-6 ${isDesktop ? 'pb-6' : 'pb-5'}`}>
          <div className={`${navSpacingClass}`}>
            {primaryNavItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`flex h-12 w-full items-center rounded-xl border px-4 text-left transition-colors ${
                    isActive
                      ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200'
                      : 'border-white/5 text-gray-400 hover:border-white/10 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {isDesktop ? (
                    <span className="text-sm uppercase tracking-[0.24em]">
                      {item.label}
                    </span>
                  ) : (
                    <>
                      <item.icon size={18} />
                      <span className="ml-3 text-sm uppercase tracking-[0.2em]">
                        {item.label}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto border-t border-white/5 px-6 py-6">
          <div className="mb-4 text-[11px] uppercase tracking-[0.32em] text-cyan-300/70">
            Utility
          </div>
          <div className="space-y-2">
            {sidebarUtilityActions.map((item) => (
              <button
                key={item.id}
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <item.icon size={18} />
                <span className="text-sm uppercase tracking-[0.2em]">
                  {item.label}
                </span>
                {item.hasIndicator && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-cyan-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto border-t border-white/10 p-6">
          <div className="mb-5 flex items-center gap-4">
            <div className="relative h-12 w-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 p-[2px]">
              <img
                src={sidebarProfile.avatarUrl}
                alt="User"
                className="h-full w-full rounded-full border-2 border-[#08080f] object-cover"
              />
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#08080f] bg-green-500" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-white font-medium">
                {sidebarProfile.name}
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                {sidebarProfile.membership}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <sidebarFooterAction.icon size={18} />
            <span className="text-sm uppercase tracking-[0.2em]">
              {sidebarFooterAction.label}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
