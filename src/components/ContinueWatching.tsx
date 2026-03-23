import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { series, getYouTubeThumbnail, type MovieData } from '../data/movies';
const continueItems = [
{
  ...series.find((s) => s.id === 'severance')!,
  episode: 'S2 E4',
  progress: 65
},
{
  ...series.find((s) => s.id === 'dark')!,
  episode: 'S3 E2',
  progress: 30
},
{
  ...series.find((s) => s.id === 'the-last-of-us')!,
  episode: 'S2 E3',
  progress: 80
},
{
  ...series.find((s) => s.id === 'shogun')!,
  episode: 'S1 E7',
  progress: 45
},
{
  ...series.find((s) => s.id === 'arcane')!,
  episode: 'S2 E5',
  progress: 55
},
{
  ...series.find((s) => s.id === 'the-bear')!,
  episode: 'S3 E1',
  progress: 15
}].
filter((item) => item.id);
interface ContinueWatchingProps {
  onMovieClick?: (movie: MovieData) => void;
}
export function ContinueWatching({ onMovieClick }: ContinueWatchingProps) {
  return (
    <div className="w-full px-16 mb-12">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-6 w-1 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
        <h2 className="text-2xl font-bold text-white tracking-wide">
          Continue Watching
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
            delay: index * 0.08
          }}
          whileHover={{
            scale: 1.03
          }}
          onClick={() => onMovieClick?.(item)}>
          
            <div
            className="relative aspect-video bg-[#12121a] overflow-hidden"
            style={{
              clipPath:
              'polygon(8% 0, 100% 0, 100% 88%, 92% 100%, 0 100%, 0 12%)'
            }}>
            
              <div
              className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-90 transition-opacity duration-500 group-hover:scale-110 transition-transform"
              style={{
                backgroundImage: `url(${getYouTubeThumbnail(item.videoId, 'mq')})`
              }} />
            

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <Play size={16} fill="white" className="text-white ml-0.5" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-sm font-bold text-white leading-tight mb-0.5 truncate">
                  {item.title}
                </h3>
                <p className="text-[10px] text-cyan-300 tracking-wider mb-2">
                  {item.episode}
                </p>

                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                  className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                  style={{
                    width: `${item.progress}%`
                  }} />
                
                </div>
              </div>
            </div>

            <div
            className="absolute inset-[-1px] z-[-1] bg-gradient-to-br from-white/10 via-transparent to-white/10 opacity-30 group-hover:opacity-60 transition-opacity duration-300"
            style={{
              clipPath:
              'polygon(8% 0, 100% 0, 100% 88%, 92% 100%, 0 100%, 0 12%)'
            }} />
          
          </motion.div>
        )}
      </div>
    </div>);

}