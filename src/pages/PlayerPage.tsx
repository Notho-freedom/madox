import React, { useCallback, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  ChevronRight,
  X,
  Loader2,
  ExternalLink,
  RefreshCcw,
  AlertTriangle } from
'lucide-react';
import YouTube from 'react-youtube';
import type { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { getYouTubeThumbnail, type MovieData } from '../data/movies';
import { useTrending } from '../hooks/useTMDB';
import { isDesktopApp, openExternal } from '../utils/desktop';
interface PlayerPageProps {
  movie: MovieData;
  onBack: () => void;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getPlayerOrigin(): string | undefined {
  return /^https?:$/.test(window.location.protocol) ?
  window.location.origin :
  undefined;
}

export function PlayerPage({ movie, onBack }: PlayerPageProps) {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showUpNext, setShowUpNext] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [playerInstanceKey, setPlayerInstanceKey] = useState(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const startupTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasPlayerLoaded = useRef(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const { data: upNextData } = useTrending('all', 'week');
  const upNextItems = upNextData.filter((m) => m.id !== movie.id).slice(0, 5);
  const isDesktop = isDesktopApp();
  const playerOrigin = getPlayerOrigin();
  const trailerUrl = movie.videoId ?
  `https://www.youtube.com/watch?v=${movie.videoId}` :
  '';

  const clearStartupTimeout = useCallback(() => {
    if (startupTimeout.current) {
      clearTimeout(startupTimeout.current);
      startupTimeout.current = null;
    }
  }, []);

  useEffect(() => {
    hasPlayerLoaded.current = false;
    setPlayer(null);
    setIsPlaying(false);
    setIsBuffering(true);
    setPlayerError(null);
    clearStartupTimeout();
    startupTimeout.current = setTimeout(() => {
      if (hasPlayerLoaded.current) {
        return;
      }

      setIsBuffering(false);
      setPlayerError(
        isDesktop ?
        'The integrated desktop player could not load this trailer.' :
        'The integrated player could not load this trailer.'
      );
    }, 12000);

    return () => {
      clearStartupTimeout();
    };
  }, [movie.videoId, playerInstanceKey, isDesktop, clearStartupTimeout]);

  // Sync time from player
  const startTimeSync = useCallback(() => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = setInterval(() => {
      if (player && !isSeeking) {
        try {
          const ct = player.getCurrentTime?.() ?? 0;
          const dur = player.getDuration?.() ?? 0;
          const buf = player.getVideoLoadedFraction?.() ?? 0;
          setCurrentTime(ct);
          if (dur > 0) setDuration(dur);
          setBuffered(buf * 100);
        } catch {
          return;
        }
      }
    }, 250);
  }, [player, isSeeking]);
  useEffect(() => {
    startTimeSync();
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [startTimeSync]);
  // Auto-hide controls
  useEffect(() => {
    const resetTimer = () => {
      setShowControls(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        if (isPlaying && !showUpNext) setShowControls(false);
      }, 3500);
    };
    window.addEventListener('mousemove', resetTimer);
    resetTimer();
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [isPlaying, showUpNext]);
  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!player) return;
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          isPlaying ? player.pauseVideo() : player.playVideo();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          player.seekTo(Math.max(0, currentTime - 10), true);
          break;
        case 'ArrowRight':
          e.preventDefault();
          player.seekTo(Math.min(duration, currentTime + 10), true);
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(Math.min(100, volume + 10));
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(Math.max(0, volume - 10));
          break;
        case 'm':
          toggleMute();
          break;
        case 'Escape':
          onBack();
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [player, isPlaying, currentTime, duration, volume]);
  const onReady = (event: YouTubeEvent) => {
    const p = event.target;
    hasPlayerLoaded.current = true;
    clearStartupTimeout();
    setPlayer(p);
    setPlayerError(null);
    p.setVolume(volume);
    const dur = p.getDuration();
    if (dur > 0) setDuration(dur);
    setIsBuffering(false);
  };
  const onStateChange = (event: YouTubeEvent) => {
    const state = event.data;
    // YT states: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
    switch (state) {
      case 1:
        // playing
        setIsPlaying(true);
        setIsBuffering(false);
        break;
      case 2:
        // paused
        setIsPlaying(false);
        setIsBuffering(false);
        break;
      case 3:
        // buffering
        setIsBuffering(true);
        break;
      case 0:
        // ended
        setIsPlaying(false);
        setIsBuffering(false);
        break;
    }
  };

  const onError = () => {
    clearStartupTimeout();
    setPlayer(null);
    setIsPlaying(false);
    setIsBuffering(false);
    setPlayerError(
      isDesktop ?
      'The desktop player could not start this trailer. You can retry or open it in your browser.' :
      'The player could not start this trailer. You can retry or open it in your browser.'
    );
  };

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };
  const toggleMute = () => {
    if (!player) return;
    if (isMuted) {
      player.unMute();
      player.setVolume(volume);
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  };
  const handleVolumeChange = (val: number) => {
    if (!player) return;
    setVolume(val);
    player.setVolume(val);
    if (val > 0 && isMuted) {
      player.unMute();
      setIsMuted(false);
    }
    if (val === 0) {
      player.mute();
      setIsMuted(true);
    }
  };
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !player || duration === 0) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const seekTime = pct * duration;
    setIsSeeking(true);
    setCurrentTime(seekTime);
    player.seekTo(seekTime, true);
    setTimeout(() => setIsSeeking(false), 500);
  };
  const skipBack = () => {
    if (!player) return;
    player.seekTo(Math.max(0, currentTime - 10), true);
  };
  const skipForward = () => {
    if (!player) return;
    player.seekTo(Math.min(duration, currentTime + 30), true);
  };

  const retryPlayer = () => {
    setPlayerInstanceKey((current) => current + 1);
  };

  const openTrailerExternally = async () => {
    if (!trailerUrl) {
      return;
    }

    try {
      await openExternal(trailerUrl);
    } catch (error) {
      console.error('Failed to open trailer externally:', error);
    }
  };

  const progress = duration > 0 ? currentTime / duration * 100 : 0;
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black"
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
      
      {/* YouTube Player (hidden controls, full size) */}
      <div className="absolute inset-0 overflow-hidden">
        <YouTube
          key={`${movie.id}-${playerInstanceKey}`}
          videoId={movie.videoId}
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: 1,
              controls: 0,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              iv_load_policy: 3,
              fs: 0,
              disablekb: 1,
              playsinline: 1,
              enablejsapi: 1,
              ...(playerOrigin ? { origin: playerOrigin } : {})
            }
          }}
          onReady={onReady}
          onStateChange={onStateChange}
          onError={onError}
          className="absolute inset-0 w-full h-full"
          iframeClassName="w-full h-full"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }} />
        
      </div>

      {/* Buffering Indicator */}
      <AnimatePresence>
        {isBuffering &&
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}>
          
            <div className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
              <Loader2 size={36} className="text-cyan-400 animate-spin" />
            </div>
          </motion.div>
        }
      </AnimatePresence>

      <AnimatePresence>
        {playerError &&
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/75 px-6"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}>
          
            <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#10101a]/95 p-8 shadow-2xl">
              <div className="mb-6 flex items-center gap-3 text-cyan-300">
                <AlertTriangle size={24} />
                <div>
                  <h3 className="text-lg font-bold tracking-wide text-white">
                    Trailer playback issue
                  </h3>
                  <p className="text-sm text-gray-400">
                    {playerError}
                  </p>
                </div>
              </div>

              <p className="mb-6 text-sm leading-6 text-gray-300">
                {isDesktop ?
                'The embedded player is still the default desktop experience, but packaged apps can occasionally fail to initialize a YouTube iframe.' :
                'The embedded player did not initialize correctly in this browser session.'
                }
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={retryPlayer}
                  className="flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200 transition-colors hover:bg-cyan-400/20">
                  
                  <RefreshCcw size={16} />
                  Retry
                </button>
                <button
                  onClick={openTrailerExternally}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10">
                  
                  <ExternalLink size={16} />
                  Open In Browser
                </button>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Pause Indicator */}
      <AnimatePresence>
        {!playerError && !isPlaying && !isBuffering &&
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          initial={{
            opacity: 0,
            scale: 0.8
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          exit={{
            opacity: 0,
            scale: 0.8
          }}
          transition={{
            duration: 0.2
          }}>
          
            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
              <Play size={40} fill="white" className="text-white ml-2" />
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Click area for play/pause — only active when controls are visible */}
      {showControls && !playerError &&
      <div
        className="absolute inset-0 z-10"
        onClick={togglePlay}
        style={{
          pointerEvents: showControls ? 'auto' : 'none'
        }} />

      }

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && !playerError &&
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
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-black/80 via-black/40 to-transparent pb-24">
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
                  {movie.year} • {movie.genre || 'Sci-Fi'} •{' '}
                  {movie.duration || '2h 15m'}
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
            <div className="absolute bottom-0 left-0 right-0 pointer-events-auto bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-24">
              {/* Progress Bar */}
              <div className="px-8 mb-4">
                <div
                ref={progressRef}
                className="group relative w-full h-1.5 bg-white/15 rounded-full cursor-pointer hover:h-2.5 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSeek(e);
                }}>
                
                  {/* Buffered */}
                  <div
                  className="absolute left-0 top-0 h-full bg-white/15 rounded-full transition-all duration-300"
                  style={{
                    width: `${buffered}%`
                  }} />
                
                  {/* Progress */}
                  <div
                  className="absolute left-0 top-0 h-full bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.6)] transition-[width] duration-150"
                  style={{
                    width: `${progress}%`
                  }} />
                
                  {/* Thumb */}
                  <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_14px_rgba(34,211,238,0.9)] scale-0 group-hover:scale-100 transition-transform"
                  style={{
                    left: `calc(${progress}% - 8px)`
                  }} />
                
                  {/* Hover time tooltip */}
                  <div
                  className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    left: `${progress}%`,
                    transform: 'translateX(-50%)'
                  }}>
                  
                    <span className="px-2 py-1 bg-black/80 rounded text-xs text-white font-mono">
                      {formatTime(currentTime)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400 font-mono tracking-wider">
                  <span>{formatTime(currentTime)}</span>
                  <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="px-8 pb-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {/* Play/Pause */}
                  <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="hover:text-cyan-300 transition-colors">
                  
                    {isPlaying ?
                  <Pause size={28} /> :

                  <Play size={28} fill="white" />
                  }
                  </button>

                  {/* Skip Back 10s */}
                  <button
                  onClick={(e) => {
                    e.stopPropagation();
                    skipBack();
                  }}
                  className="hover:text-cyan-300 transition-colors relative group/skip">
                  
                    <SkipBack size={22} />
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 opacity-0 group-hover/skip:opacity-100 transition-opacity whitespace-nowrap">
                      -10s
                    </span>
                  </button>

                  {/* Skip Forward 30s */}
                  <button
                  onClick={(e) => {
                    e.stopPropagation();
                    skipForward();
                  }}
                  className="hover:text-cyan-300 transition-colors relative group/skip">
                  
                    <SkipForward size={22} />
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 opacity-0 group-hover/skip:opacity-100 transition-opacity whitespace-nowrap">
                      +30s
                    </span>
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-2 group/vol">
                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="hover:text-cyan-300 transition-colors">
                    
                      {isMuted || volume === 0 ?
                    <VolumeX size={22} /> :

                    <Volume2 size={22} />
                    }
                    </button>
                    <div className="w-0 group-hover/vol:w-28 overflow-hidden transition-all duration-300">
                      <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleVolumeChange(Number(e.target.value));
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-28 h-1 appearance-none bg-white/20 rounded-full cursor-pointer accent-cyan-400" />
                    
                    </div>
                    <span className="text-[10px] text-gray-500 w-8 text-right opacity-0 group-hover/vol:opacity-100 transition-opacity">
                      {isMuted ? 0 : volume}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
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

            <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-72px)]">
              {upNextItems.map((item, i) =>
            <motion.div
              key={item.id}
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
                delay: i * 0.08
              }}>
              
                  <div className="w-28 h-16 bg-gray-800 rounded overflow-hidden flex-shrink-0 relative">
                    <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage: `url(${item.backdropPath ? `https://image.tmdb.org/t/p/w300${item.backdropPath}` : item.posterPath ? `https://image.tmdb.org/t/p/w185${item.posterPath}` : getYouTubeThumbnail(item.videoId, 'mq')})`
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
                    <div className="text-xs text-cyan-400/60 mt-1">
                      {item.genre}
                    </div>
                  </div>
                </motion.div>
            )}
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </motion.div>);

}
