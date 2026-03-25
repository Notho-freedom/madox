import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Plus,
  Star,
  ArrowLeft,
  Share2,
  ThumbsUp,
  Clock,
  Calendar,
  User } from
'lucide-react';
import { getYouTubeThumbnail, type MovieData } from '../data/movies';
import { HorizontalCarousel } from '../components/HorizontalCarousel';
import { LoadMoreSentinel } from '../components/LoadMoreSentinel';
import { MovieCard } from '../components/MovieCard';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { useI18n } from '../i18n/useI18n';
import { useLikes } from '../hooks/useLikes';
import { useDetails, useTrailer } from '../hooks/useTMDB';
import { useWatchlist } from '../hooks/useWatchlist';
import { addLike, removeLike } from '../services/likes';
import { shareMovie } from '../services/share';
import { backdrop, poster, type TMDBCast } from '../services/tmdb';
import { addToWatchlist, removeFromWatchlist } from '../services/watchlist';
interface MovieDetailPageProps {
  movie: MovieData;
  onBack: () => void;
  onActorClick?: (actor: TMDBCast) => void;
  onPlay?: () => void;
  onMovieClick?: (movie: MovieData) => void;
}
export function MovieDetailPage({
  movie,
  onBack,
  onActorClick,
  onPlay,
  onMovieClick
}: MovieDetailPageProps) {
  const { t } = useI18n();
  const similarScrollRef = useRef<HTMLDivElement | null>(null);
  const rightColumnRef = useRef<HTMLDivElement | null>(null);
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'shared'>('idle');
  const [topCastMaxHeight, setTopCastMaxHeight] = useState<number | null>(null);
  const mediaType = movie.mediaType || 'movie';
  const tmdbId = movie.tmdbId || parseInt(movie.id);
  const { data: watchlist } = useWatchlist();
  const { data: likes } = useLikes();
  const {
    details,
    cast,
    similar,
    loading,
    hasMoreSimilar,
    isLoadingMoreSimilar,
    loadMoreSimilar
  } = useDetails(tmdbId, mediaType);
  const { videoId: trailerId } = useTrailer(tmdbId, mediaType);
  // Store trailer ID on the movie for the player
  useEffect(() => {
    if (trailerId) {
      movie.videoId = trailerId;
    }
  }, [movie, trailerId]);
  const heroImage =
  backdrop(movie.backdropPath || null) || (
  movie.videoId ? getYouTubeThumbnail(movie.videoId, 'maxres') : '');
  const runtime = details?.runtime ?
  `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` :
  details?.number_of_seasons ?
  `${details.number_of_seasons} Seasons` :
  movie.duration || '';
  const genres = details?.genres?.map((g) => g.name) || [
  movie.genre || 'Entertainment'];
  const isInWatchlist = useMemo(() => {
    return watchlist.some((entry) => entry.tmdbId === tmdbId && entry.mediaType === mediaType);
  }, [mediaType, tmdbId, watchlist]);
  const isLiked = useMemo(() => {
    return likes.some((entry) => entry.tmdbId === tmdbId && entry.mediaType === mediaType);
  }, [likes, mediaType, tmdbId]);

  const tagline = details?.tagline || '';
  const castPreviewCount = useMemo(() => {
    if (cast.length === 0) {
      return 0;
    }

    if (!topCastMaxHeight) {
      return Math.min(cast.length, 6);
    }

    if (topCastMaxHeight < 520) {
      return Math.min(cast.length, 4);
    }

    if (topCastMaxHeight < 760) {
      return Math.min(cast.length, 6);
    }

    return Math.min(cast.length, 8);
  }, [cast.length, topCastMaxHeight]);
  const visibleCast = useMemo(() => {
    return cast.slice(0, castPreviewCount);
  }, [cast, castPreviewCount]);

  useEffect(() => {
    if (shareState === 'idle') {
      return;
    }

    const timeout = window.setTimeout(() => {
      setShareState('idle');
    }, 1800);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [shareState]);

  useEffect(() => {
    if (!rightColumnRef.current || typeof ResizeObserver === 'undefined') {
      return;
    }

    const element = rightColumnRef.current;
    const updateHeight = () => {
      setTopCastMaxHeight(Math.round(element.getBoundingClientRect().height));
    };

    updateHeight();

    const observer = new ResizeObserver(() => {
      updateHeight();
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [cast.length, details, movie.posterPath, trailerId]);

  const handleToggleWatchlist = async () => {
    if (isInWatchlist) {
      await removeFromWatchlist({
        mediaType,
        tmdbId
      });
      return;
    }

    await addToWatchlist({
      ...movie,
      mediaType,
      tmdbId
    });
  };

  const handleToggleLike = async () => {
    if (isLiked) {
      await removeLike({
        mediaType,
        tmdbId
      });
      return;
    }

    await addLike({
      ...movie,
      mediaType,
      tmdbId
    });
  };

  const handleShare = async () => {
    try {
      const result = await shareMovie({
        ...movie,
        mediaType,
        tmdbId
      });
      setShareState(result);
    } catch (error) {
      console.error('Failed to share movie', error);
    }
  };

  return (
    <motion.div
      className="relative min-h-screen w-full bg-[#08080f] z-40"
      initial={{
        opacity: 0,
        y: 50
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      exit={{
        opacity: 0,
        y: 50
      }}
      transition={{
        duration: 0.5
      }}>
      
      <button
        onClick={onBack}
        className="fixed left-4 top-16 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-white backdrop-blur-md transition-colors hover:bg-white/10 md:hidden">
        
        <ArrowLeft size={20} />
        <span className="uppercase tracking-widest text-sm">{t('common.back')}</span>
      </button>

      {/* Hero */}
      <div className="relative w-full h-[70vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`
          }} />
        
        <div className="absolute inset-0 bg-gradient-to-b from-[#08080f]/30 via-[#08080f]/60 to-[#08080f]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080f]/90 via-[#08080f]/40 to-transparent" />

        {/* Trailer preview */}
        {(trailerId || movie.videoId) &&
        <div
          className="absolute top-1/2 right-16 -translate-y-1/2 w-[400px] aspect-video rounded-lg overflow-hidden border border-white/10 shadow-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 group cursor-pointer"
          onClick={onPlay}>
          
            <img
            src={trailerId ? getYouTubeThumbnail(trailerId, 'hq') : heroImage}
            alt="Play trailer"
            className="w-full h-full object-cover" />
          
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play size={28} fill="white" className="text-white ml-1" />
              </div>
            </div>
            <div className="absolute bottom-3 left-3 text-xs text-white/80 uppercase tracking-widest">
              {t('movieDetail.watchTrailer')}
            </div>
          </div>
        }

        <div className="absolute bottom-0 left-0 w-full p-16 pb-24 flex items-end">
          <div className="max-w-3xl">
            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.2
              }}>
              
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs tracking-[0.2em] uppercase backdrop-blur-md">
                  {mediaType === 'tv' ? t('common.series') : t('common.movie')}
                </span>
                {genres.map((g) =>
                <span
                  key={g}
                  className="px-3 py-1 bg-white/10 border border-white/10 text-gray-300 text-xs tracking-[0.2em] uppercase backdrop-blur-md">
                  
                    {g}
                  </span>
                )}
                <div className="flex items-center gap-2 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <span className="font-bold">{movie.rating}</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-['Advent_Pro'] leading-none text-glow line-clamp-3">
                {movie.title}
              </h1>

              {tagline &&
              <p className="text-cyan-300/70 italic text-lg mb-4">
                  "{tagline}"
                </p>
              }

              <div className="flex items-center gap-6 text-gray-300 mb-8 font-light tracking-wide flex-wrap">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{movie.year}</span>
                </div>
                {runtime &&
                <>
                    <span className="w-px h-4 bg-white/20" />
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{runtime}</span>
                    </div>
                  </>
                }
                {movie.voteCount &&
                <>
                    <span className="w-px h-4 bg-white/20" />
                    <span>{movie.voteCount.toLocaleString()} votes</span>
                  </>
                }
              </div>

              <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-2xl line-clamp-4">
                {movie.description ||
                details?.overview ||
                'Discover this incredible content.'}
              </p>

              <div className="flex gap-6 flex-wrap">
                <button
                  onClick={onPlay}
                  className="px-8 py-4 bg-white text-black font-bold tracking-widest uppercase flex items-center gap-3 hover:bg-cyan-50 transition-colors"
                  style={{
                    clipPath:
                    'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                  }}>
                  
                  <Play size={20} fill="currentColor" /> {t('common.watchNow')}
                </button>
                <button
                  onClick={handleToggleWatchlist}
                  className="px-8 py-4 bg-white/5 border border-white/20 text-white font-bold tracking-widest uppercase flex items-center gap-3 hover:bg-white/10 transition-colors"
                  style={{
                    clipPath:
                    'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                  }}>
                  
                  <Plus size={20} /> {isInWatchlist ? t('movieDetail.inWatchlist') : t('movieDetail.addToList')}
                </button>
                <button
                  onClick={handleShare}
                  title={shareState === 'idle' ? t('movieDetail.share') : shareState === 'copied' ? t('movieDetail.linkCopied') : t('movieDetail.shared')}
                  className={`p-4 border border-white/20 transition-colors rounded-full ${
                    shareState === 'idle'
                      ? 'bg-white/5 text-white hover:text-cyan-300'
                      : 'bg-cyan-500/10 text-cyan-300'
                  }`}
                >
                  <Share2 size={20} />
                </button>
                <button
                  onClick={handleToggleLike}
                  className={`p-4 border border-white/20 transition-colors rounded-full ${
                    isLiked
                      ? 'bg-cyan-500/10 text-cyan-300'
                      : 'bg-white/5 text-white hover:text-cyan-300'
                  }`}
                >
                  <ThumbsUp size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="px-6 py-12 md:px-16 md:pt-14">
        <div
          className={`grid gap-12 ${cast.length > 0 ? 'lg:grid-cols-[minmax(0,1.3fr)_360px] lg:items-stretch' : 'lg:max-w-[360px]'}`}
        >
          {cast.length > 0 &&
          <section
            className="min-w-0"
            style={topCastMaxHeight ? { maxHeight: `${topCastMaxHeight}px` } : undefined}
          >
              <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_56px_rgba(0,0,0,0.18)]">
                <h3 className="mb-6 border-l-4 border-cyan-500 pl-4 font-['Advent_Pro'] text-2xl font-bold text-white">
                  {t('movieDetail.topCast')}
                </h3>
                <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-2 gap-4 sm:grid-cols-3 2xl:grid-cols-4">
                  {visibleCast.map((c, index) =>
                <button
                      key={c.id}
                      type="button"
                      onClick={() => onActorClick?.(c)}
                      className="group relative overflow-hidden rounded-[22px] bg-white/[0.04] text-left">
                      <div className="aspect-[0.88] overflow-hidden rounded-[22px]">
                        {c.profile_path ?
                    <img
                      src={`https://image.tmdb.org/t/p/w185${c.profile_path}`}
                      alt={c.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" /> :


                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                            <User size={32} className="text-gray-600" />
                          </div>
                    }
                      </div>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/88 via-black/45 to-transparent px-3 pb-3 pt-10">
                        <div className="line-clamp-1 text-sm font-bold text-white">{c.name}</div>
                        <div className="line-clamp-2 text-xs text-cyan-100/78">
                          {c.character || 'Cast'}
                        </div>
                      </div>
                      {index === visibleCast.length - 1 && cast.length > visibleCast.length &&
                  <div className="absolute inset-0 flex items-center justify-center bg-black/58 backdrop-blur-sm">
                          <div className="text-center">
                            <div className="font-['Advent_Pro'] text-3xl font-bold text-white">
                              +{cast.length - visibleCast.length}
                            </div>
                            <div className="mt-1 text-[11px] uppercase tracking-[0.22em] text-cyan-200">
                              more cast
                            </div>
                          </div>
                        </div>
                  }
                    </button>
                )}
                </div>
              </div>
            </section>
          }

          <div className="space-y-8" ref={rightColumnRef}>
            <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
              <h4 className="text-gray-400 uppercase tracking-widest text-sm mb-4">
                {t('movieDetail.details')}
              </h4>
              <div className="space-y-4">
                {details?.production_companies &&
                details.production_companies.length > 0 &&
                <div>
                      <div className="text-gray-500 text-xs uppercase">{t('movieDetail.studio')}</div>
                      <div className="text-white">
                        {details.production_companies[0].name}
                      </div>
                    </div>
                }
                <div>
                  <div className="text-gray-500 text-xs uppercase">{t('movieDetail.released')}</div>
                  <div className="text-white">{movie.year}</div>
                </div>
                {runtime &&
                <div>
                    <div className="text-gray-500 text-xs uppercase">{t('movieDetail.runtime')}</div>
                    <div className="text-white">{runtime}</div>
                  </div>
                }
                {details?.status &&
                <div>
                    <div className="text-gray-500 text-xs uppercase">{t('movieDetail.status')}</div>
                    <div className="text-white">{details.status}</div>
                  </div>
                }
                <div>
                  <div className="text-gray-500 text-xs uppercase">{t('movieDetail.genres')}</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {genres.map((g) =>
                    <span
                      key={g}
                      className="px-2 py-1 bg-white/10 rounded text-xs text-cyan-300">
                      
                        {g}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {(trailerId || movie.videoId) &&
            <div
              className="relative aspect-video rounded-lg overflow-hidden border border-white/10 cursor-pointer group"
              onClick={onPlay}>
              
                <img
                src={getYouTubeThumbnail(trailerId || movie.videoId, 'hq')}
                alt="Trailer"
                className="w-full h-full object-cover" />
              
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={20} fill="white" className="text-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 text-xs text-white uppercase tracking-widest">
                  {t('movieDetail.officialTrailer')}
                </div>
              </div>
            }

            {movie.posterPath &&
            <div className="rounded-lg overflow-hidden border border-white/10">
                <img
                src={poster(movie.posterPath, 'w500')}
                alt={movie.title}
                className="w-full" />
              
              </div>
            }
          </div>
        </div>

        <section className="mt-12">
            <h3 className="text-2xl font-bold text-white mb-6 font-['Advent_Pro'] border-l-4 border-cyan-500 pl-4">
              {t('movieDetail.moreLikeThis')}
            </h3>
            {loading ?
            <CardSkeleton count={4} /> :
            similar.length > 0 ?
            <HorizontalCarousel
              className="pb-4"
              contentClassName="flex min-w-max gap-6"
              scrollerRef={similarScrollRef}
            >
                {similar.map((m, i) =>
              <MovieCard
                key={m.id}
                {...m}
                delay={i * 0.1}
                onClick={() => onMovieClick?.(m)} />

              )}
                <LoadMoreSentinel
                  canLoadMore={hasMoreSimilar}
                  className="w-16 shrink-0"
                  isLoadingMore={isLoadingMoreSimilar}
                  onLoadMore={loadMoreSimilar}
                  rootMargin="0px 320px 0px 0px"
                  rootRef={similarScrollRef} />
              </HorizontalCarousel> :

            <p className="text-gray-500">No similar content found.</p>
            }
          </section>
      </div>
    </motion.div>);

}
