import React from 'react';
import { Search } from 'lucide-react';
import { useI18n } from '../i18n/useI18n';
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
  onItemSelect?: () => void;
  onNavigate: (page: NavPageId) => void;
  searchAutoFocus?: boolean;
}

export function CrystalSidebarMenuContent({
  activePage,
  layout,
  onItemSelect,
  onNavigate,
  searchAutoFocus = false
}: CrystalSidebarMenuContentProps) {
  const { t } = useI18n();
  const isDesktop = layout === 'desktop';
  const navSpacingClass = isDesktop ? 'space-y-4' : 'space-y-3';
  const itemClipPath =
    'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)';

  return (
    <div className="flex h-full flex-col">
      <div className={`${isDesktop ? 'hidden' : 'px-6 pb-5 pt-6 pr-16'}`}>
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/15 to-blue-400/15 blur-xl" />
          <div
            className="relative flex min-h-[58px] items-center px-5"
            style={{
              clipPath:
                'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
            }}
          >
            <Search
              size={18}
              className="text-gray-400"
            />
            <input
              type="text"
              placeholder={t('sidebar.searchPlaceholder')}
              autoFocus={searchAutoFocus}
              className="ml-3 w-full bg-transparent border-none text-sm tracking-[0.18em] text-white outline-none placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className={`px-6 pt-3 ${isDesktop ? 'pb-6' : 'pb-5'}`}>
          <div className={navSpacingClass}>
            {primaryNavItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    onItemSelect?.();
                  }}
                  className={`group relative flex h-12 w-full items-center overflow-hidden px-3 text-left transition-colors ${
                    isActive ? 'text-cyan-300' : 'text-gray-500 hover:text-white'
                  }`}
                  style={{
                    clipPath: itemClipPath
                  }}>
                  <div
                    className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                    style={{
                      clipPath: itemClipPath
                    }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/12 via-white/[0.04] to-transparent" />
                    <div
                      className="absolute inset-0 prism-border"
                      style={{
                        clipPath: itemClipPath
                      }}
                    />
                  </div>
                  <item.icon size={18} className="relative z-10" />
                  <span className="relative z-10 ml-3 text-sm uppercase tracking-[0.2em]">
                    {t(item.labelKey)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {sidebarUtilityActions.length > 0 && (
          <div className="flex-1 overflow-y-auto px-6 py-3">
            <div className="space-y-2">
              {sidebarUtilityActions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onItemSelect?.()}
                className="group relative flex w-full items-center gap-3 overflow-hidden px-3 py-3 text-gray-500 transition-colors hover:text-white"
                style={{
                  clipPath: itemClipPath
                }}>
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    clipPath: itemClipPath
                  }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-white/[0.04] to-transparent" />
                  <div
                    className="absolute inset-0 prism-border"
                    style={{
                      clipPath: itemClipPath
                    }}
                  />
                </div>
                <item.icon size={18} className="relative z-10" />
                <span className="relative z-10 text-sm uppercase tracking-[0.2em]">
                  {t(item.labelKey)}
                </span>
                {item.hasIndicator && (
                  <span className="relative z-10 ml-auto h-2 w-2 rounded-full bg-cyan-400" />
                )}
              </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto px-6 pb-6 pt-3">
          <div className="mb-5 flex items-center gap-4">
            <div className="relative h-12 w-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 p-[2px]">
              <img
                src={sidebarProfile.avatarUrl}
                alt="User"
                className="h-full w-full rounded-full border-2 border-[#08080f] object-cover"
              />
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#08080f] bg-green-500" />
            </div>
            <button
              type="button"
              onClick={() => onItemSelect?.()}
              className="min-w-0 text-left">
              <div className="truncate text-white font-medium">
                {sidebarProfile.name}
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                {t(sidebarProfile.membershipKey)}
              </div>
            </button>
          </div>

          <button
            type="button"
            onClick={() => onItemSelect?.()}
            className="group relative flex w-full items-center gap-3 overflow-hidden px-3 py-3 text-red-400 transition-colors hover:text-red-300"
            style={{
              clipPath: itemClipPath
            }}>
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                clipPath: itemClipPath
              }}>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/12 via-white/[0.04] to-transparent" />
              <div
                className="absolute inset-0 prism-border"
                style={{
                  clipPath: itemClipPath
                }}
              />
            </div>
            <sidebarFooterAction.icon size={18} className="relative z-10" />
            <span className="relative z-10 text-sm uppercase tracking-[0.2em]">
              {t(sidebarFooterAction.labelKey)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
