import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { type NavPageId } from '../navigation/primaryNav';
import { CrystalSidebarMenuContent } from './CrystalSidebarMenuContent';
interface CrystalSidePanelProps {
  activePage: NavPageId;
  isOpen: boolean;
  onNavigate: (page: NavPageId) => void;
  onClose: () => void;
}
export function CrystalSidePanel({
  activePage,
  isOpen,
  onNavigate,
  onClose
}: CrystalSidePanelProps) {
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          {/* Backdrop */}
          <motion.div
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm md:hidden"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose} />
        

          {/* Panel */}
          <motion.div
          className="fixed top-0 left-0 bottom-0 z-[90] flex w-[calc(100vw-1rem)] max-w-sm flex-col border-r border-white/10 bg-[#08080f]/95 shadow-2xl backdrop-blur-xl md:hidden"
          initial={{
            x: '-100%'
          }}
          animate={{
            x: 0
          }}
          exit={{
            x: '-100%'
          }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 300
          }}>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white">
              <X size={20} />
            </button>

            <CrystalSidebarMenuContent
              activePage={activePage}
              layout="mobile"
              onNavigate={(page) => {
                onNavigate(page);
                onClose();
              }}
              searchAutoFocus
            />
          </motion.div>
        </>
      }
    </AnimatePresence>);

}
