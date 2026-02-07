import React from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Shield, CreditCard, Bell, Monitor } from 'lucide-react';
export function SettingsPage() {
  return (
    <motion.div
      className="px-16 py-12 pb-32 max-w-5xl mx-auto"
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      exit={{
        opacity: 0,
        y: -20
      }}
      transition={{
        duration: 0.5
      }}>

      <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-6">
        <Settings size={32} className="text-gray-400" />
        <h1 className="text-4xl font-bold text-white font-['Advent_Pro']">
          Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Menu */}
        <div className="space-y-2">
          {[
          {
            icon: User,
            label: 'Profile',
            active: true
          },
          {
            icon: Shield,
            label: 'Security',
            active: false
          },
          {
            icon: CreditCard,
            label: 'Subscription',
            active: false
          },
          {
            icon: Bell,
            label: 'Notifications',
            active: false
          },
          {
            icon: Monitor,
            label: 'Display',
            active: false
          }].
          map((item) =>
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${item.active ? 'bg-cyan-500/10 border-l-2 border-cyan-400 text-cyan-300' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>

              <item.icon size={18} />
              <span className="uppercase tracking-widest text-sm">
                {item.label}
              </span>
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile Section */}
          <section
            className="bg-white/5 border border-white/10 p-8 relative overflow-hidden"
            style={{
              clipPath:
              'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
            }}>

            <h2 className="text-2xl font-bold text-white mb-6 font-['Advent_Pro']">
              Profile Details
            </h2>

            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 p-[2px]">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-[#08080f]" />

              </div>
              <div>
                <button className="px-4 py-2 bg-white/10 border border-white/20 text-white text-sm uppercase tracking-widest hover:bg-white/20 transition-colors mb-2">
                  Change Avatar
                </button>
                <p className="text-xs text-gray-500">
                  JPG, GIF or PNG. Max 1MB.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Alex"
                    className="w-full bg-black/30 border border-white/10 px-4 py-3 text-white outline-none focus:border-cyan-500/50 transition-colors" />

                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Chen"
                    className="w-full bg-black/30 border border-white/10 px-4 py-3 text-white outline-none focus:border-cyan-500/50 transition-colors" />

                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="alex.chen@example.com"
                  className="w-full bg-black/30 border border-white/10 px-4 py-3 text-white outline-none focus:border-cyan-500/50 transition-colors" />

              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 flex justify-end gap-4">
              <button className="px-6 py-2 text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-widest">
                Cancel
              </button>
              <button
                className="px-8 py-2 bg-cyan-500 text-black font-bold uppercase tracking-widest hover:bg-cyan-400 transition-colors"
                style={{
                  clipPath:
                  'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                }}>

                Save Changes
              </button>
            </div>
          </section>
        </div>
      </div>
    </motion.div>);

}