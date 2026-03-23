import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  User,
  Shield,
  CreditCard,
  Bell,
  Monitor,
  Eye,
  EyeOff,
  Check,
  Lock,
  Globe,
  Volume2,
  Subtitles,
  Smartphone,
  Laptop,
  Tv } from
'lucide-react';
const sectionClip =
'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)';
function Toggle({
  enabled,
  onToggle



}: {enabled: boolean;onToggle: () => void;}) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${enabled ? 'bg-cyan-500' : 'bg-white/10'}`}>
      
      <motion.div
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
        animate={{
          left: enabled ? 28 : 4
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30
        }} />
      
    </button>);

}
const sections = [
{
  icon: User,
  label: 'Profile',
  id: 'profile'
},
{
  icon: Shield,
  label: 'Security',
  id: 'security'
},
{
  icon: CreditCard,
  label: 'Subscription',
  id: 'subscription'
},
{
  icon: Bell,
  label: 'Notifications',
  id: 'notifications'
},
{
  icon: Monitor,
  label: 'Display',
  id: 'display'
}];

function ProfileSection() {
  return (
    <section
      className="bg-white/5 border border-white/10 p-8 relative overflow-hidden"
      style={{
        clipPath: sectionClip
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
          <p className="text-xs text-gray-500">JPG, GIF or PNG. Max 1MB.</p>
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
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
            Bio
          </label>
          <textarea
            defaultValue="Cinephile. Sci-fi enthusiast. Always looking for the next great story."
            rows={3}
            className="w-full bg-black/30 border border-white/10 px-4 py-3 text-white outline-none focus:border-cyan-500/50 transition-colors resize-none" />
          
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
    </section>);

}
function SecuritySection() {
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  return (
    <div className="space-y-8">
      <section
        className="bg-white/5 border border-white/10 p-8 relative overflow-hidden"
        style={{
          clipPath: sectionClip
        }}>
        
        <h2 className="text-2xl font-bold text-white mb-6 font-['Advent_Pro']">
          Change Password
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                defaultValue="••••••••••"
                className="w-full bg-black/30 border border-white/10 px-4 py-3 text-white outline-none focus:border-cyan-500/50 transition-colors pr-12" />
              
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full bg-black/30 border border-white/10 px-4 py-3 text-white outline-none focus:border-cyan-500/50 transition-colors placeholder-gray-600" />
              
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full bg-black/30 border border-white/10 px-4 py-3 text-white outline-none focus:border-cyan-500/50 transition-colors placeholder-gray-600" />
              
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            className="px-8 py-2 bg-cyan-500 text-black font-bold uppercase tracking-widest hover:bg-cyan-400 transition-colors"
            style={{
              clipPath:
              'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
            }}>
            
            Update Password
          </button>
        </div>
      </section>

      <section
        className="bg-white/5 border border-white/10 p-8 relative overflow-hidden"
        style={{
          clipPath: sectionClip
        }}>
        
        <h2 className="text-2xl font-bold text-white mb-6 font-['Advent_Pro']">
          Security Options
        </h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Lock size={18} className="text-cyan-400" />
              <div>
                <div className="text-white font-medium">
                  Two-Factor Authentication
                </div>
                <div className="text-xs text-gray-500">
                  Add an extra layer of security to your account
                </div>
              </div>
            </div>
            <Toggle
              enabled={twoFactor}
              onToggle={() => setTwoFactor(!twoFactor)} />
            
          </div>
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-cyan-400" />
              <div>
                <div className="text-white font-medium">Login Alerts</div>
                <div className="text-xs text-gray-500">
                  Get notified of new sign-ins to your account
                </div>
              </div>
            </div>
            <Toggle
              enabled={loginAlerts}
              onToggle={() => setLoginAlerts(!loginAlerts)} />
            
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
            Active Sessions
          </h3>
          <div className="space-y-3">
            {[
            {
              device: 'MacBook Pro',
              location: 'Paris, France',
              current: true
            },
            {
              device: 'iPhone 15',
              location: 'Paris, France',
              current: false
            }].
            map((session, i) =>
            <div
              key={i}
              className="flex items-center justify-between py-3 px-4 bg-black/20 border border-white/5 rounded">
              
                <div className="flex items-center gap-3">
                  {i === 0 ?
                <Laptop size={18} className="text-gray-400" /> :

                <Smartphone size={18} className="text-gray-400" />
                }
                  <div>
                    <div className="text-white text-sm">{session.device}</div>
                    <div className="text-xs text-gray-500">
                      {session.location}
                    </div>
                  </div>
                </div>
                {session.current ?
              <span className="text-xs text-cyan-400 uppercase tracking-widest">
                    Current
                  </span> :

              <button className="text-xs text-red-400 hover:text-red-300 uppercase tracking-widest transition-colors">
                    Revoke
                  </button>
              }
              </div>
            )}
          </div>
        </div>
      </section>
    </div>);

}
function SubscriptionSection() {
  return (
    <div className="space-y-8">
      <section
        className="bg-white/5 border border-white/10 p-8 relative overflow-hidden"
        style={{
          clipPath: sectionClip
        }}>
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white font-['Advent_Pro']">
            Current Plan
          </h2>
          <span className="px-4 py-1 text-xs uppercase tracking-widest font-bold text-cyan-300 prism-border bg-cyan-500/10">
            Premium
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-5xl font-bold text-white font-['Advent_Pro']">
            $14.99
          </span>
          <span className="text-gray-500 text-sm">/month</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
          '4K Ultra HD',
          'Multiple Devices',
          'Offline Downloads',
          'No Ads',
          'Early Access',
          'Dolby Atmos'].
          map((feature) =>
          <div key={feature} className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-cyan-400" />
              <span className="text-gray-300">{feature}</span>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">
              Next billing date
            </div>
            <div className="text-white">April 23, 2026</div>
          </div>
          <button className="px-6 py-2 bg-white/10 border border-white/20 text-white text-sm uppercase tracking-widest hover:bg-white/20 transition-colors">
            Manage Plan
          </button>
        </div>
      </section>

      <section
        className="bg-white/5 border border-white/10 p-8 relative overflow-hidden"
        style={{
          clipPath: sectionClip
        }}>
        
        <h2 className="text-2xl font-bold text-white mb-6 font-['Advent_Pro']">
          Payment Method
        </h2>
        <div className="flex items-center gap-4 p-4 bg-black/20 border border-white/5 rounded mb-4">
          <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
            VISA
          </div>
          <div>
            <div className="text-white text-sm">•••• •••• •••• 4829</div>
            <div className="text-xs text-gray-500">Expires 08/2027</div>
          </div>
          <button className="ml-auto text-xs text-cyan-400 hover:text-cyan-300 uppercase tracking-widest transition-colors">
            Edit
          </button>
        </div>
        <button className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
          + Add Payment Method
        </button>
      </section>
    </div>);

}
function NotificationsSection() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [newReleases, setNewReleases] = useState(true);
  const [recommendations, setRecommendations] = useState(false);
  const [watchlistUpdates, setWatchlistUpdates] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  return (
    <section
      className="bg-white/5 border border-white/10 p-8 relative overflow-hidden"
      style={{
        clipPath: sectionClip
      }}>
      
      <h2 className="text-2xl font-bold text-white mb-8 font-['Advent_Pro']">
        Notification Preferences
      </h2>

      <div className="space-y-1">
        <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
          Channels
        </h3>
        {[
        {
          label: 'Email Notifications',
          desc: 'Receive updates via email',
          enabled: emailNotifs,
          toggle: () => setEmailNotifs(!emailNotifs)
        },
        {
          label: 'Push Notifications',
          desc: 'Receive push notifications on your devices',
          enabled: pushNotifs,
          toggle: () => setPushNotifs(!pushNotifs)
        }].
        map((item) =>
        <div
          key={item.label}
          className="flex items-center justify-between py-4 border-b border-white/5">
          
            <div>
              <div className="text-white font-medium">{item.label}</div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </div>
            <Toggle enabled={item.enabled} onToggle={item.toggle} />
          </div>
        )}
      </div>

      <div className="mt-8 space-y-1">
        <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
          Content Alerts
        </h3>
        {[
        {
          label: 'New Releases',
          desc: 'When new movies or series are added',
          enabled: newReleases,
          toggle: () => setNewReleases(!newReleases)
        },
        {
          label: 'Personalized Recommendations',
          desc: 'Curated picks based on your taste',
          enabled: recommendations,
          toggle: () => setRecommendations(!recommendations)
        },
        {
          label: 'Watchlist Updates',
          desc: 'When items in your watchlist become available',
          enabled: watchlistUpdates,
          toggle: () => setWatchlistUpdates(!watchlistUpdates)
        },
        {
          label: 'Weekly Newsletter',
          desc: 'A digest of top content every week',
          enabled: newsletter,
          toggle: () => setNewsletter(!newsletter)
        }].
        map((item) =>
        <div
          key={item.label}
          className="flex items-center justify-between py-4 border-b border-white/5">
          
            <div>
              <div className="text-white font-medium">{item.label}</div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </div>
            <Toggle enabled={item.enabled} onToggle={item.toggle} />
          </div>
        )}
      </div>
    </section>);

}
function DisplaySection() {
  const [quality, setQuality] = useState('auto');
  const [language, setLanguage] = useState('en');
  const [autoplay, setAutoplay] = useState(true);
  const [subtitles, setSubtitles] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const qualityOptions = [
  {
    id: 'auto',
    label: 'Auto'
  },
  {
    id: '1080p',
    label: '1080p'
  },
  {
    id: '4k',
    label: '4K'
  }];

  const languages = [
  {
    id: 'en',
    label: 'English'
  },
  {
    id: 'fr',
    label: 'Français'
  },
  {
    id: 'es',
    label: 'Español'
  },
  {
    id: 'de',
    label: 'Deutsch'
  }];

  return (
    <div className="space-y-8">
      <section
        className="bg-white/5 border border-white/10 p-8 relative overflow-hidden"
        style={{
          clipPath: sectionClip
        }}>
        
        <h2 className="text-2xl font-bold text-white mb-8 font-['Advent_Pro']">
          Playback
        </h2>

        <div className="space-y-8">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3">
              Video Quality
            </label>
            <div className="flex gap-3">
              {qualityOptions.map((opt) =>
              <button
                key={opt.id}
                onClick={() => setQuality(opt.id)}
                className={`relative px-6 py-2 text-sm uppercase tracking-widest transition-all ${quality === opt.id ? 'text-cyan-300 bg-cyan-500/10' : 'text-gray-400 bg-white/5 hover:bg-white/10'}`}
                style={{
                  clipPath:
                  'polygon(15% 0, 100% 0, 100% 70%, 85% 100%, 0 100%, 0 30%)'
                }}>
                
                  {quality === opt.id &&
                <div
                  className="absolute inset-0 prism-border"
                  style={{
                    clipPath:
                    'polygon(15% 0, 100% 0, 100% 70%, 85% 100%, 0 100%, 0 30%)'
                  }} />

                }
                  {opt.label}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Volume2 size={18} className="text-cyan-400" />
              <div>
                <div className="text-white font-medium">
                  Autoplay Next Episode
                </div>
                <div className="text-xs text-gray-500">
                  Automatically play the next episode
                </div>
              </div>
            </div>
            <Toggle
              enabled={autoplay}
              onToggle={() => setAutoplay(!autoplay)} />
            
          </div>

          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Subtitles size={18} className="text-cyan-400" />
              <div>
                <div className="text-white font-medium">Subtitles</div>
                <div className="text-xs text-gray-500">
                  Show subtitles by default
                </div>
              </div>
            </div>
            <Toggle
              enabled={subtitles}
              onToggle={() => setSubtitles(!subtitles)} />
            
          </div>
        </div>
      </section>

      <section
        className="bg-white/5 border border-white/10 p-8 relative overflow-hidden"
        style={{
          clipPath: sectionClip
        }}>
        
        <h2 className="text-2xl font-bold text-white mb-8 font-['Advent_Pro']">
          Interface
        </h2>

        <div className="space-y-8">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3">
              Language
            </label>
            <div className="flex gap-3">
              {languages.map((lang) =>
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`relative px-6 py-2 text-sm uppercase tracking-widest transition-all ${language === lang.id ? 'text-cyan-300 bg-cyan-500/10' : 'text-gray-400 bg-white/5 hover:bg-white/10'}`}
                style={{
                  clipPath:
                  'polygon(15% 0, 100% 0, 100% 70%, 85% 100%, 0 100%, 0 30%)'
                }}>
                
                  {language === lang.id &&
                <div
                  className="absolute inset-0 prism-border"
                  style={{
                    clipPath:
                    'polygon(15% 0, 100% 0, 100% 70%, 85% 100%, 0 100%, 0 30%)'
                  }} />

                }
                  {lang.label}
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3">
              Theme
            </label>
            <div className="flex gap-4">
              <div className="p-4 bg-cyan-500/10 border-2 border-cyan-500/50 rounded-lg flex items-center gap-3 cursor-pointer">
                <div className="w-8 h-8 rounded bg-[#08080f] border border-white/20" />
                <div>
                  <div className="text-white text-sm font-medium">
                    Dark Crystal
                  </div>
                  <div className="text-xs text-cyan-400">Active</div>
                </div>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg flex items-center gap-3 cursor-pointer opacity-50">
                <div className="w-8 h-8 rounded bg-gray-200 border border-gray-300" />
                <div>
                  <div className="text-gray-400 text-sm font-medium">Light</div>
                  <div className="text-xs text-gray-600">Coming Soon</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div>
              <div className="text-white font-medium">Reduced Motion</div>
              <div className="text-xs text-gray-500">
                Minimize animations throughout the app
              </div>
            </div>
            <Toggle
              enabled={reducedMotion}
              onToggle={() => setReducedMotion(!reducedMotion)} />
            
          </div>
        </div>
      </section>
    </div>);

}
export function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'security':
        return <SecuritySection />;
      case 'subscription':
        return <SubscriptionSection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'display':
        return <DisplaySection />;
      default:
        return null;
    }
  };
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
          {sections.map((item) =>
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${activeSection === item.id ? 'bg-cyan-500/10 border-l-2 border-cyan-400 text-cyan-300' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            
              <item.icon size={18} />
              <span className="uppercase tracking-widest text-sm">
                {item.label}
              </span>
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: -20
              }}
              transition={{
                duration: 0.3
              }}>
              
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>);

}