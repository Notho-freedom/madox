import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FacetField, FacetNavRow } from './design';
import { useI18n } from '../i18n/useI18n';
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
  const { t } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
                <FacetField
                  inputClassName="min-h-[58px] bg-[#08080f]/55 tracking-[0.18em] placeholder:text-gray-500"
                  placeholder={t('sidebar.searchPlaceholder')}
                  shape="buttonCut14"
                  type="text"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-between pb-5">
          <div className="space-y-3 pt-4">
            {primaryNavItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <FacetNavRow
                  active={isActive}
                  icon={<item.icon size={22} />}
                  key={item.id}
                  title={t(item.labelKey)}
                  aria-label={t(item.labelKey)}
                  onClick={() => handleSelect(item.id)}
                  label={
                    <span
                      className={`block whitespace-nowrap text-sm uppercase tracking-[0.24em] transition-all duration-200 ${
                        isExpanded ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'
                      }`}
                    >
                      {t(item.labelKey)}
                    </span>
                  }
                />
              );
            })}

            {sidebarUtilityActions.length > 0 && (
              <div className="space-y-3 pt-3">
                {sidebarUtilityActions.map((item) => (
                <FacetNavRow
                  icon={<item.icon size={20} />}
                  key={item.id}
                  onClick={() => handleSelect()}
                  label={
                    <div
                      className={`flex items-center gap-3 whitespace-nowrap text-sm uppercase tracking-[0.2em] transition-all duration-200 ${
                        isExpanded ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'
                      }`}>
                      <span>{t(item.labelKey)}</span>
                      {item.hasIndicator && (
                        <span className="h-2 w-2 rounded-full bg-cyan-400" />
                      )}
                    </div>
                  }
                />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <FacetNavRow
              icon={
                <div className="relative h-10 w-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 p-[2px]">
                  <img
                    src={sidebarProfile.avatarUrl}
                    alt="User"
                    className="h-full w-full rounded-full border-2 border-[#08080f] object-cover"
                  />
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#08080f] bg-green-500" />
                </div>
              }
              label={
                <div
                  className={`transition-all duration-200 ${
                    isExpanded ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'
                  }`}>
                  <div className="truncate text-sm font-medium text-white group-hover:text-cyan-200">
                    {sidebarProfile.name}
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-400/80">
                    {t(sidebarProfile.membershipKey)}
                  </div>
                </div>
              }
              onClick={() => handleSelect()}
            />

            <FacetNavRow
              icon={<sidebarFooterAction.icon size={20} />}
              label={
                <span
                  className={`block whitespace-nowrap text-sm uppercase tracking-[0.2em] transition-all duration-200 ${
                    isExpanded ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'
                  }`}>
                  {t(sidebarFooterAction.labelKey)}
                </span>
              }
              onClick={() => handleSelect()}
              tone="danger"
            />
          </div>
        </div>
      </div>
    </motion.aside>
  );

}
