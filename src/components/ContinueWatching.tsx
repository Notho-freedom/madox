import React from 'react';
import { motion } from 'framer-motion';
import { Play, MoreVertical } from 'lucide-react';
const continueItems = [
{
  id: 1,
  title: 'Severance',
  episode: 'S2 E4',
  progress: 65,
  image:
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop'
},
{
  id: 2,
  title: 'Dark',
  episode: 'S3 E2',
  progress: 30,
  image:
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop'
},
{
  id: 3,
  title: 'Westworld',
  episode: 'S4 E1',
  progress: 80,
  image:
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop'
},
{
  id: 4,
  title: 'Altered Carbon',
  episode: 'S1 E7',
  progress: 45,
  image:
  'https://images.unsplash.com/photo-1506318137071-a8bcbf6755dd?q=80&w=800&auto=format&fit=crop'
}];

export function ContinueWatching() {
  return (
    <div className="w-full px-16 mb-12">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-6 w-1 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
        <h2 className="text-2xl font-bold text-white tracking-wide">
          Continue Watching
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {continueItems.map((item, index) =>
        <motion.div
          key={item.id}
          className="group relative cursor-pointer"
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            delay: index * 0.1
          }}
          whileHover={{
            scale: 1.02
          }}>
          
            {/* Card Container */}
            <div
            className="relative aspect-video bg-[#12121a] overflow-hidden"
            style={{
              clipPath:
              'polygon(10% 0, 100% 0, 100% 85%, 90% 100%, 0 100%, 0 15%)'
            }}>
            
              {/* Image */}
              <div
              className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity duration-500"
              style={{
                backgroundImage: `url(${item.image})`
              }} />
            

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <Play size={20} fill="white" className="text-white ml-1" />
                </div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-bold text-white leading-tight mb-1 truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-cyan-300 tracking-wider mb-3">
                  {item.episode}
                </p>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                  className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                  style={{
                    width: `${item.progress}%`
                  }} />
                
                </div>
              </div>
            </div>

            {/* Border Glow */}
            <div
            className="absolute inset-[-1px] z-[-1] bg-gradient-to-br from-white/10 via-transparent to-white/10 opacity-30 group-hover:opacity-60 transition-opacity duration-300"
            style={{
              clipPath:
              'polygon(10% 0, 100% 0, 100% 85%, 90% 100%, 0 100%, 0 15%)'
            }} />
          
          </motion.div>
        )}
      </div>
    </div>);

}