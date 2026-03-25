import React from 'react';
import { motion } from 'framer-motion';
import { Flame, UserRound } from 'lucide-react';
import { useI18n } from '../i18n/useI18n';
import { profile, type PersonCardData } from '../services/tmdb';
import { FacetPosterCard } from './design';

interface ActorCardProps {
  actor: PersonCardData;
  className?: string;
  delay?: number;
  onClick?: () => void;
}

export function ActorCard({
  actor,
  className = '',
  delay = 0,
  onClick
}: ActorCardProps) {
  const { t } = useI18n();
  const thumbnail = profile(actor.profilePath, 'h632');

  return (
    <motion.button
      type="button"
      className={`group relative w-[280px] flex-shrink-0 cursor-pointer text-left ${className}`}
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
        duration: 0.5,
        delay,
        ease: 'easeOut'
      }}
      whileHover={{
        y: -8,
        scale: 1.02
      }}
      onClick={onClick}
    >
      <FacetPosterCard
        backgroundImage={thumbnail}
        className="w-full"
        fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-black">
            <UserRound size={56} className="text-white/25" />
          </div>
        }
        frameClassName="h-[390px]"
        tintColor={actor.color}
        topOverlay={
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-black/45 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-orange-200 backdrop-blur-md">
            <Flame size={12} />
            <span>
              {t('actorsPage.popularity')} {actor.popularity.toFixed(0)}
            </span>
          </div>
        }
        metaOverlay={
          <div className="absolute inset-x-0 bottom-0 p-5">
            <span className="mb-2 inline-block text-[10px] uppercase tracking-[0.24em] text-cyan-300/75">
              {actor.knownForDepartment}
            </span>
            <h3 className="mb-2 line-clamp-2 font-['Advent_Pro'] text-2xl font-bold text-white transition-colors group-hover:text-cyan-200">
              {actor.name}
            </h3>
            <div className="space-y-1 text-sm text-gray-300">
              <div className="text-[10px] uppercase tracking-[0.22em] text-gray-500">
                {t('actorsPage.knownFor')}
              </div>
              <p className="min-h-[2.75rem] line-clamp-2">
                {actor.knownForTitles.join(' • ') || actor.primaryKnownFor}
              </p>
            </div>
          </div>
        }
      />
    </motion.button>
  );
}
