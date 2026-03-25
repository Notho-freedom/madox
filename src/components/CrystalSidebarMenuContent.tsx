import React from 'react';
import { Search } from 'lucide-react';
import { FacetField, FacetNavRow } from './design';
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

  return (
    <div className="flex h-full flex-col">
      <div className={`${isDesktop ? 'hidden' : 'px-6 pb-5 pt-6 pr-16'}`}>
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/15 to-blue-400/15 blur-xl" />
          <FacetField
            autoFocus={searchAutoFocus}
            inputClassName="min-h-[58px] bg-[#08080f]/55 pl-11 tracking-[0.18em] placeholder:text-gray-500"
            placeholder={t('sidebar.searchPlaceholder')}
            prefixIcon={<Search size={18} className="text-gray-400" />}
            shape="buttonCut10"
            type="text"
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className={`px-6 pt-3 ${isDesktop ? 'pb-6' : 'pb-5'}`}>
          <div className={navSpacingClass}>
            {primaryNavItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <FacetNavRow
                  active={isActive}
                  icon={<item.icon size={18} />}
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onItemSelect?.();
                  }}
                  label={t(item.labelKey)}
                  layout="mobile"
                />
              );
            })}
          </div>
        </div>

        {sidebarUtilityActions.length > 0 && (
          <div className="flex-1 overflow-y-auto px-6 py-3">
            <div className="space-y-2">
              {sidebarUtilityActions.map((item) => (
              <FacetNavRow
                icon={<item.icon size={18} />}
                key={item.id}
                onClick={() => onItemSelect?.()}
                label={t(item.labelKey)}
                layout="mobile"
                rightSlot={
                  item.hasIndicator ?
                    <span className="h-2 w-2 rounded-full bg-cyan-400" /> :
                    undefined
                }
              />
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

          <FacetNavRow
            icon={<sidebarFooterAction.icon size={18} />}
            label={t(sidebarFooterAction.labelKey)}
            layout="mobile"
            onClick={() => onItemSelect?.()}
            tone="danger"
          />
        </div>
      </div>
    </div>
  );
}
