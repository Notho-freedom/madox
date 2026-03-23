import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUp, ArrowDown, Minus } from 'lucide-react';
const trendingItems = [
{
  rank: 1,
  title: 'Dune: Part Two',
  views: '2.4M',
  change: 'up',
  image:
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2576&auto=format&fit=crop'
},
{
  rank: 2,
  title: 'Severance',
  views: '1.8M',
  change: 'up',
  image:
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop'
},
{
  rank: 3,
  title: 'Oppenheimer',
  views: '1.5M',
  change: 'down',
  image:
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop'
},
{
  rank: 4,
  title: 'The Batman',
  views: '1.2M',
  change: 'same',
  image:
  'https://images.unsplash.com/photo-1509347528160-9a9e33742cd4?q=80&w=800&auto=format&fit=crop'
},
{
  rank: 5,
  title: 'Arcane',
  views: '1.1M',
  change: 'up',
  image:
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop'
}];

export function TrendingPage() {
  return (
    <motion.div
      className="px-16 py-12 pb-32"
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
      
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
          <TrendingUp size={32} className="text-cyan-400" />
        </div>
        <div>
          <h1 className="text-5xl font-bold text-white font-['Advent_Pro']">
            Trending Now
          </h1>
          <p className="text-gray-400 tracking-wide">
            Most watched content this week globally.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {trendingItems.map((item, index) =>
        <motion.div
          key={item.rank}
          initial={{
            opacity: 0,
            x: -20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          transition={{
            delay: index * 0.1
          }}
          className="group relative flex items-center gap-8 p-6 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors overflow-hidden"
          style={{
            clipPath:
            'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
          }}>
          
            {/* Rank Number */}
            <div className="text-6xl font-bold text-white/10 font-['Advent_Pro'] w-24 text-center group-hover:text-cyan-500/20 transition-colors">
              {item.rank}
            </div>

            {/* Thumbnail */}
            <div className="w-48 h-28 bg-gray-800 relative overflow-hidden">
              <div
              className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:scale-110 transition-transform duration-500"
              style={{
                backgroundImage: `url(${item.image})`
              }} />
            
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">
                {item.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{item.views} views</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                <span className="text-cyan-400">Sci-Fi</span>
              </div>
            </div>

            {/* Trend Indicator */}
            <div className="pr-8">
              {item.change === 'up' &&
            <div className="flex items-center gap-2 text-green-400">
                  <ArrowUp size={20} />{' '}
                  <span className="text-sm font-bold">RISING</span>
                </div>
            }
              {item.change === 'down' &&
            <div className="flex items-center gap-2 text-red-400">
                  <ArrowDown size={20} />{' '}
                  <span className="text-sm font-bold">FALLING</span>
                </div>
            }
              {item.change === 'same' &&
            <div className="flex items-center gap-2 text-gray-500">
                  <Minus size={20} />{' '}
                  <span className="text-sm font-bold">STABLE</span>
                </div>
            }
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </motion.div>
        )}
      </div>
    </motion.div>);

}