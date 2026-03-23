import React, { useEffect } from 'react';
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
import { MovieCard } from '../components/MovieCard';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { useDetails, useTrailer } from '../hooks/useTMDB';
import { backdrop, poster } from '../services/tmdb';
interface MovieDetailPageProps {
  movie: MovieData;
  onBack: () => void;
  onPlay?: () => void;
  onMovieClick?: (movie: MovieData) => void;
}
export function MovieDetailPage({
  movie,
  onBack,
  onPlay,
  onMovieClick
}: MovieDetailPageProps) {
  const mediaType = movie.mediaType || 'movie';
  const tmdbId = movie.tmdbId || parseInt(movie.id);
  const { details, cast, similar, loading } = useDetails(tmdbId, mediaType);
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

  const tagline = details?.tagline || '';
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
        className="fixed top-24 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-colors rounded-full">
        
        <ArrowLeft size={20} />
        <span className="uppercase tracking-widest text-sm">Back</span>
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
              Watch Trailer
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
                  {mediaType === 'tv' ? 'Series' : 'Movie'}
                </span>
                {genres.slice(0, 2).map((g) =>
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
                  
                  <Play size={20} fill="currentColor" /> Watch Now
                </button>
                <button
                  className="px-8 py-4 bg-white/5 border border-white/20 text-white font-bold tracking-widest uppercase flex items-center gap-3 hover:bg-white/10 transition-colors"
                  style={{
                    clipPath:
                    'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                  }}>
                  
                  <Plus size={20} /> Add to List
                </button>
                <button className="p-4 bg-white/5 border border-white/20 text-white hover:text-cyan-300 transition-colors rounded-full">
                  <Share2 size={20} />
                </button>
                <button className="p-4 bg-white/5 border border-white/20 text-white hover:text-cyan-300 transition-colors rounded-full">
                  <ThumbsUp size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="px-16 py-12 grid grid-cols-3 gap-16">
        <div className="col-span-2 space-y-12">
          {/* Cast */}
          {cast.length > 0 &&
          <section>
              <h3 className="text-2xl font-bold text-white mb-6 font-['Advent_Pro'] border-l-4 border-cyan-500 pl-4">
                Top Cast
              </h3>
              <div className="grid grid-cols-4 gap-6">
                {cast.slice(0, 8).map((c) =>
              <div key={c.id} className="group">
                    <div className="w-full aspect-square bg-white/5 mb-3 overflow-hidden rounded-lg">
                      {c.profile_path ?
                  <img
                    src={`https://image.tmdb.org/t/p/w185${c.profile_path}`}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> :


                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                          <User size={32} className="text-gray-600" />
                        </div>
                  }
                    </div>
                    <div className="text-white font-bold text-sm">{c.name}</div>
                    <div className="text-gray-500 text-xs">{c.character}</div>
                  </div>
              )}
              </div>
            </section>
          }

          {/* Similar */}
          <section>
            <h3 className="text-2xl font-bold text-white mb-6 font-['Advent_Pro'] border-l-4 border-cyan-500 pl-4">
              More Like This
            </h3>
            {loading ?
            <CardSkeleton count={4} /> :
            similar.length > 0 ?
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {similar.map((m, i) =>
              <MovieCard
                key={m.id}
                {...m}
                delay={i * 0.1}
                onClick={() => onMovieClick?.(m)} />

              )}
              </div> :

            <p className="text-gray-500">No similar content found.</p>
            }
          </section>
        </div>

        <div className="space-y-8">
          <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
            <h4 className="text-gray-400 uppercase tracking-widest text-sm mb-4">
              Details
            </h4>
            <div className="space-y-4">
              {details?.production_companies &&
              details.production_companies.length > 0 &&
              <div>
                    <div className="text-gray-500 text-xs uppercase">
                      Studio
                    </div>
                    <div className="text-white">
                      {details.production_companies[0].name}
                    </div>
                  </div>
              }
              <div>
                <div className="text-gray-500 text-xs uppercase">Released</div>
                <div className="text-white">{movie.year}</div>
              </div>
              {runtime &&
              <div>
                  <div className="text-gray-500 text-xs uppercase">Runtime</div>
                  <div className="text-white">{runtime}</div>
                </div>
              }
              {details?.status &&
              <div>
                  <div className="text-gray-500 text-xs uppercase">Status</div>
                  <div className="text-white">{details.status}</div>
                </div>
              }
              <div>
                <div className="text-gray-500 text-xs uppercase">Genres</div>
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

          {/* Trailer Card */}
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
                Official Trailer
              </div>
            </div>
          }

          {/* Poster */}
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
    </motion.div>);

}
