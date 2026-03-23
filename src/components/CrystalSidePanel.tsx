import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, X, User, LogOut, HelpCircle } from 'lucide-react';
import { primaryNavItems, type NavPageId } from '../navigation/primaryNav';
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
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
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
          className="fixed top-0 left-0 bottom-0 z-[70] flex w-[calc(100vw-1rem)] max-w-sm flex-col border-r border-white/10 bg-[#08080f]/95 shadow-2xl md:w-80"
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
          
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-white/10">
              <h2 className="text-xl font-bold text-white font-['Advent_Pro'] tracking-widest">
                MENU
              </h2>
              <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors">
              
                <X size={20} className="text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Primary Navigation */}
            <div className="px-6 py-5 border-b border-white/5">
              <div className="mb-3 text-[11px] uppercase tracking-[0.3em] text-cyan-300/70">
                Explore
              </div>
              <div className="space-y-2">
                {primaryNavItems.map((item) => {
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onNavigate(item.id);
                        onClose();
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                        isActive
                          ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200'
                          : 'border-white/5 bg-white/0 text-gray-400 hover:border-white/10 hover:bg-white/5 hover:text-white'
                      }`}>
                      <item.icon size={18} />
                      <span className="text-sm uppercase tracking-[0.2em]">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search */}
            <div className="p-6 border-b border-white/5">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
                <div
                className="relative flex items-center bg-white/5 border border-white/10 px-4 py-3 transition-colors group-hover:border-white/20"
                style={{
                  clipPath:
                  'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                }}>
                
                  <Search
                  size={18}
                  className="text-gray-400 group-hover:text-cyan-300 transition-colors" />
                
                  <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 ml-3 font-['Advent_Pro'] tracking-wide"
                  autoFocus />
                
                </div>
              </div>
            </div>

            {/* User Profile */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-cyan-500 to-purple-500">
                  <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"
                  alt="User"
                  className="w-full h-full rounded-full object-cover border-2 border-[#08080f]" />
                
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#08080f]" />
                </div>
                <div>
                  <div className="text-white font-medium">Alex Chen</div>
                  <div className="text-xs text-cyan-400 uppercase tracking-wider">
                    Premium Member
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors rounded-lg">
                  <User size={18} />
                  <span className="text-sm uppercase tracking-widest">
                    Profile
                  </span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors rounded-lg">
                  <Bell size={18} />
                  <span className="text-sm uppercase tracking-widest">
                    Notifications
                  </span>
                  <span className="ml-auto w-2 h-2 bg-cyan-400 rounded-full" />
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors rounded-lg">
                  <HelpCircle size={18} />
                  <span className="text-sm uppercase tracking-widest">
                    Help & Support
                  </span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto p-6 border-t border-white/10">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors rounded-lg">
                <LogOut size={18} />
                <span className="text-sm uppercase tracking-widest">
                  Sign Out
                </span>
              </button>
            </div>
          </motion.div>
        </>
      }
    </AnimatePresence>);

}
