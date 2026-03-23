import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Subtitles,
  Settings,
  ChevronRight,
  X } from
'lucide-react';
interface PlayerPageProps {
  movie: any;
  onBack: () => void;
}
export function PlayerPage({ movie, onBack }: PlayerPageProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showUpNext, setShowUpNext] = useState(false);
  const [showQuality, setShowQuality] = useState(false);
  const [quality, setQuality] = useState('4K');
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState('00:12:34');
  const [totalTime] = useState('02:15:00');
  const hideTimer = useRef<any>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  // Simulate playback progress
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 0;
        const next = p + 0.05;
        const totalSeconds = 2 * 3600 + 15 * 60;
        const currentSeconds = Math.floor(next / 100 * totalSeconds);
        const h = Math.floor(currentSeconds / 3600);
        const m = Math.floor(currentSeconds % 3600 / 60);
        const s = currentSeconds % 60;
        setCurrentTime(
          `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
        );
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);
  // Auto-hide controls
  useEffect(() => {
    const resetTimer = () => {
      setShowControls(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };
    window.addEventListener('mousemove', resetTimer);
    resetTimer();
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [isPlaying]);
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width * 100;
    setProgress(Math.max(0, Math.min(100, pct)));
  };
  const upNextItems = [
  {
    title: 'Interstellar',
    duration: '2h 49m',
    image:
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop'
  },
  {
    title: 'Arrival',
    duration: '1h 56m',
    image:
    'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=400&auto=format&fit=crop'
  },
  {
    title: 'Ex Machina',
    duration: '1h 48m',
    image:
    'https://images.unsplash.com/photo-1506318137071-a8bcbf6755dd?q=80&w=400&auto=format&fit=crop'
  }];

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black cursor-none"
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      exit={{
        opacity: 0
      }}
      transition={{
        duration: 0.5
      }}
      style={{
        cursor: showControls ? 'default' : 'none'
      }}>
      
      {/* Video Background (simulated) */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${movie.image})`,
            filter: 'brightness(0.4) saturate(1.2)'
          }} />
        
        <div className="absolute inset-0 bg-black/30" />

        {/* Cinematic letterbox bars */}
        <div className="absolute top-0 left-0 right-0 h-[8%] bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[8%] bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Play/Pause Center Indicator */}
      <AnimatePresence>
        {!isPlaying &&
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}>
          
            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
              <Play size={40} fill="white" className="text-white ml-2" />
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Click to play/pause */}
      <div
        className="absolute inset-0 z-10"
        onClick={() => setIsPlaying(!isPlaying)} />
      

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls &&
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 0.3
          }}>
          
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-black/80 to-transparent pb-20">
              <button
              onClick={(e) => {
                e.stopPropagation();
                onBack();
              }}
              className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/20 transition-colors">
              
                <ArrowLeft size={20} />
                <span className="uppercase tracking-widest text-sm">Back</span>
              </button>

              <div className="text-center">
                <h2 className="text-xl font-bold text-white font-['Advent_Pro'] tracking-wide">
                  {movie.title}
                </h2>
                <p className="text-xs text-gray-400 tracking-wider">
                  {movie.year} • {quality}
                </p>
              </div>

              <button
              onClick={(e) => {
                e.stopPropagation();
                setShowUpNext(!showUpNext);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/20 transition-colors">
              
                <span className="uppercase tracking-widest text-sm">
                  Up Next
                </span>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 pointer-events-auto bg-gradient-to-t from-black/90 to-transparent pt-20">
              {/* Progress Bar */}
              <div className="px-8 mb-4">
                <div
                ref={progressRef}
                className="group relative w-full h-1 bg-white/20 rounded-full cursor-pointer hover:h-2 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  handleProgressClick(e);
                }}>
                
                  {/* Buffered */}
                  <div
                  className="absolute left-0 top-0 h-full bg-white/10 rounded-full"
                  style={{
                    width: `${Math.min(progress + 15, 100)}%`
                  }} />
                
                  {/* Progress */}
                  <div
                  className="absolute left-0 top-0 h-full bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.6)]"
                  style={{
                    width: `${progress}%`
                  }} />
                
                  {/* Thumb */}
                  <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.8)] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    left: `calc(${progress}% - 8px)`
                  }} />
                
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400 font-mono tracking-wider">
                  <span>{currentTime}</span>
                  <span>{totalTime}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="px-8 pb-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlaying(!isPlaying);
                  }}
                  className="hover:text-cyan-300 transition-colors">
                  
                    {isPlaying ?
                  <Pause size={28} /> :

                  <Play size={28} fill="white" />
                  }
                  </button>
                  <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProgress(Math.max(0, progress - 5));
                  }}
                  className="hover:text-cyan-300 transition-colors">
                  
                    <SkipBack size={22} />
                  </button>
                  <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProgress(Math.min(100, progress + 5));
                  }}
                  className="hover:text-cyan-300 transition-colors">
                  
                    <SkipForward size={22} />
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-2 group/vol">
                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                    }}
                    className="hover:text-cyan-300 transition-colors">
                    
                      {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                    </button>
                    <div className="w-0 group-hover/vol:w-24 overflow-hidden transition-all duration-300">
                      <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(Number(e.target.value));
                        setIsMuted(false);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-24 h-1 appearance-none bg-white/20 rounded-full cursor-pointer accent-cyan-400" />
                    
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="hover:text-cyan-300 transition-colors">
                  
                    <Subtitles size={22} />
                  </button>

                  {/* Quality Selector */}
                  <div className="relative">
                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowQuality(!showQuality);
                    }}
                    className="hover:text-cyan-300 transition-colors flex items-center gap-1">
                    
                      <Settings size={22} />
                    </button>
                    <AnimatePresence>
                      {showQuality &&
                    <motion.div
                      className="absolute bottom-full right-0 mb-4 bg-[#08080f]/95 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden min-w-[160px]"
                      initial={{
                        opacity: 0,
                        y: 10
                      }}
                      animate={{
                        opacity: 1,
                        y: 0
                      }}
                      exit={{
                        opacity: 0,
                        y: 10
                      }}
                      onClick={(e) => e.stopPropagation()}>
                      
                          <div className="p-2 text-xs uppercase tracking-widest text-gray-500 px-4">
                            Quality
                          </div>
                          {['4K', '1080p', '720p', 'Auto'].map((q) =>
                      <button
                        key={q}
                        onClick={() => {
                          setQuality(q);
                          setShowQuality(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors flex items-center justify-between ${quality === q ? 'text-cyan-300' : 'text-gray-300'}`}>
                        
                              {q}
                              {quality === q &&
                        <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                        }
                            </button>
                      )}
                        </motion.div>
                    }
                    </AnimatePresence>
                  </div>

                  <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="hover:text-cyan-300 transition-colors">
                  
                    <Maximize size={22} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Up Next Drawer */}
      <AnimatePresence>
        {showUpNext &&
        <motion.div
          className="fixed top-0 right-0 bottom-0 w-[350px] z-40 bg-[#08080f]/95 backdrop-blur-xl border-l border-white/10"
          initial={{
            x: '100%'
          }}
          animate={{
            x: 0
          }}
          exit={{
            x: '100%'
          }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 300
          }}
          onClick={(e) => e.stopPropagation()}>
          
            <div className="p-6 flex items-center justify-between border-b border-white/10">
              <h3 className="text-lg font-bold text-white font-['Advent_Pro'] tracking-widest">
                UP NEXT
              </h3>
              <button
              onClick={() => setShowUpNext(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors">
              
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-72px)]">
              {upNextItems.map((item, i) =>
            <motion.div
              key={item.title}
              className="group flex gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: i * 0.1
              }}>
              
                  <div className="w-28 h-16 bg-gray-800 rounded overflow-hidden flex-shrink-0 relative">
                    <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage: `url(${item.image})`
                  }} />
                
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={16} fill="white" className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500">{item.duration}</div>
                  </div>
                </motion.div>
            )}
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </motion.div>);

}