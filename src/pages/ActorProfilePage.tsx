import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Film,
  Images,
  MapPin,
  Sparkles,
  Star,
  Tv,
  User
} from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { type MovieData } from '../data/movies';
import { usePersonProfile } from '../hooks/useTMDB';
import { profile } from '../services/tmdb';
import { type PersonMediaCredit } from '../services/tmdbShared';
import { openExternal } from '../utils/desktop';

type FilmographyTypeFilter = 'all' | 'movie' | 'tv';
type FilmographySortOption = 'popular' | 'rating' | 'year-new' | 'year-old';

interface ActorProfilePageProps {
  onBack: () => void;
  onMovieClick: (movie: MovieData) => void;
  personId: number;
}

const EMPTY_CREDITS: PersonMediaCredit[] = [];

function formatDate(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function getAge(birthday: string | null, deathday?: string | null): number | null {
  if (!birthday) {
    return null;
  }

  const birthDate = new Date(birthday);
  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const endDate = deathday ? new Date(deathday) : new Date();
  if (Number.isNaN(endDate.getTime())) {
    return null;
  }

  let age = endDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = endDate.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && endDate.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

function buildExternalLinks(
  imdbId: string | null | undefined,
  externalIds: {
    facebook_id?: string | null;
    instagram_id?: string | null;
    twitter_id?: string | null;
  } | null,
  homepage?: string | null
) {
  return [
    homepage
      ? {
          label: 'Official Site',
          url: homepage
        }
      : null,
    imdbId
      ? {
          label: 'IMDb',
          url: `https://www.imdb.com/name/${imdbId}/`
        }
      : null,
    externalIds?.instagram_id
      ? {
          label: 'Instagram',
          url: `https://www.instagram.com/${externalIds.instagram_id}/`
        }
      : null,
    externalIds?.twitter_id
      ? {
          label: 'X / Twitter',
          url: `https://x.com/${externalIds.twitter_id}`
        }
      : null,
    externalIds?.facebook_id
      ? {
          label: 'Facebook',
          url: `https://www.facebook.com/${externalIds.facebook_id}`
        }
      : null
  ].filter((item): item is { label: string; url: string } => Boolean(item));
}

function sortCredits(
  items: PersonMediaCredit[],
  sortBy: FilmographySortOption
): PersonMediaCredit[] {
  const nextItems = [...items];

  switch (sortBy) {
    case 'rating':
      nextItems.sort((left, right) => {
        return (
          parseFloat(right.rating) - parseFloat(left.rating) ||
          right.voteCount - left.voteCount
        );
      });
      break;
    case 'year-new':
      nextItems.sort((left, right) => Number(right.year || 0) - Number(left.year || 0));
      break;
    case 'year-old':
      nextItems.sort((left, right) => Number(left.year || 0) - Number(right.year || 0));
      break;
    default:
      nextItems.sort((left, right) => {
        return right.popularity - left.popularity || right.voteCount - left.voteCount;
      });
      break;
  }

  return nextItems;
}

export function ActorProfilePage({
  onBack,
  onMovieClick,
  personId
}: ActorProfilePageProps) {
  const [activeType, setActiveType] = useState<FilmographyTypeFilter>('all');
  const [activeGenre, setActiveGenre] = useState('All');
  const [bioExpanded, setBioExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<FilmographySortOption>('popular');
  const { data, error, loading, refetch } = usePersonProfile(personId);

  const person = data?.person;
  const filmography = useMemo(() => data?.filmography ?? EMPTY_CREDITS, [data]);
  const knownFor = useMemo(() => data?.knownFor ?? EMPTY_CREDITS, [data]);
  const stats = data?.stats;

  const galleryImages = useMemo(() => {
    if (!data || !person) {
      return [];
    }

    const seen = new Set<string>();
    const images: string[] = [];

    if (person.profile_path) {
      seen.add(person.profile_path);
      images.push(person.profile_path);
    }

    for (const image of data.images) {
      if (seen.has(image.file_path)) {
        continue;
      }

      seen.add(image.file_path);
      images.push(image.file_path);

      if (images.length >= 10) {
        break;
      }
    }

    return images;
  }, [data, person]);

  const genreOptions = useMemo(() => {
    const genres = new Set<string>();

    for (const item of filmography) {
      const parts = (item.genre ?? '')
        .split(' / ')
        .map((part) => part.trim())
        .filter(Boolean);

      for (const part of parts) {
        genres.add(part);
      }
    }

    return ['All', ...Array.from(genres)];
  }, [filmography]);

  const filteredFilmography = useMemo(() => {
    const byType =
      activeType === 'all'
        ? filmography
        : filmography.filter((item) => item.mediaType === activeType);
    const byGenre =
      activeGenre === 'All'
        ? byType
        : byType.filter((item) => (item.genre ?? '').includes(activeGenre));

    return sortCredits(byGenre, sortBy);
  }, [activeGenre, activeType, filmography, sortBy]);

  const biography = person?.biography?.trim() || '';
  const biographyNeedsClamp = biography.length > 420;
  const displayedBiography =
    biographyNeedsClamp && !bioExpanded ? `${biography.slice(0, 420).trim()}...` : biography;
  const portraitPath = galleryImages[0] ?? null;
  const portraitImage = profile(portraitPath, 'h632');
  const backgroundImage = profile(galleryImages[1] ?? portraitPath, 'h632');
  const bornOn = formatDate(person?.birthday);
  const age = person ? getAge(person.birthday, person.deathday) : null;
  const externalLinks = person
    ? buildExternalLinks(person.imdb_id, data?.externalIds ?? null, person.homepage)
    : [];

  const sortLabels: Record<FilmographySortOption, string> = {
    popular: 'Popularité',
    rating: 'Mieux notés',
    'year-new': 'Plus récents',
    'year-old': 'Plus anciens'
  };

  const typeLabels: Record<FilmographyTypeFilter, string> = {
    all: 'All',
    movie: 'Movies',
    tv: 'Series'
  };

  if (loading && !data) {
    return (
      <motion.div
        className="relative z-40 min-h-screen bg-[#08080f] px-6 pb-24 pt-8 md:px-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
      >
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-sm uppercase tracking-widest text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-6">
            <div className="h-[420px] animate-pulse rounded-[34px] bg-white/5" />
            <div className="h-40 animate-pulse rounded-[28px] bg-white/5" />
            <div className="h-96 animate-pulse rounded-[28px] bg-white/5" />
          </div>
          <div className="space-y-6">
            <div className="h-80 animate-pulse rounded-[28px] bg-white/5" />
            <div className="h-72 animate-pulse rounded-[28px] bg-white/5" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (!person || !data) {
    return (
      <motion.div
        className="relative z-40 flex min-h-screen flex-col items-center justify-center bg-[#08080f] px-6 text-center md:px-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
      >
        <User size={48} className="mb-4 text-gray-600" />
        <h1 className="mb-3 font-['Advent_Pro'] text-4xl font-bold text-white">
          Actor profile unavailable
        </h1>
        <p className="mb-6 max-w-md text-gray-400">
          {error || 'We could not load this actor profile right now.'}
        </p>
        <div className="flex gap-4">
          <button
            onClick={refetch}
            className="clip-facet-btn bg-white px-6 py-3 text-sm font-bold uppercase tracking-widest text-black"
          >
            Retry
          </button>
          <button
            onClick={onBack}
            className="clip-facet-btn border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative z-40 min-h-screen bg-[#08080f] pb-24"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.45 }}
    >
      <button
        onClick={onBack}
        className="fixed left-4 top-20 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-white backdrop-blur-md transition-colors hover:bg-white/10 md:left-32 md:top-8"
      >
        <ArrowLeft size={20} />
        <span className="text-sm uppercase tracking-widest">Back</span>
      </button>

      <section className="relative overflow-hidden px-6 pb-16 pt-24 md:px-16 md:pb-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#090b14]/70 via-[#08080f]/70 to-[#08080f]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.14),transparent_28%)]" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr_0.85fr] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="clip-facet-btn border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-cyan-200">
                Actor Spotlight
              </span>
              <span className="border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-cyan-300">
                {person.known_for_department || 'Acting'}
              </span>
            </div>

            <h1 className="mb-4 font-['Advent_Pro'] text-5xl font-bold leading-[0.92] tracking-tight text-white md:text-7xl">
              {person.name}
            </h1>

            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm tracking-wide text-gray-300">
              {bornOn && (
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-cyan-300" />
                  {bornOn}
                  {age !== null && <span className="text-gray-500">({age})</span>}
                </span>
              )}
              {person.place_of_birth && (
                <>
                  <span className="hidden h-4 w-px bg-white/15 md:block" />
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-cyan-300" />
                    {person.place_of_birth}
                  </span>
                </>
              )}
            </div>

            <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
                <div className="mb-2 text-[11px] uppercase tracking-[0.22em] text-gray-500">
                  Popularity
                </div>
                <div className="flex items-center gap-2 text-xl font-semibold text-white">
                  <Star size={18} className="text-yellow-500" fill="currentColor" />
                  {person.popularity.toFixed(1)}
                </div>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
                <div className="mb-2 text-[11px] uppercase tracking-[0.22em] text-gray-500">
                  Acting Credits
                </div>
                <div className="text-xl font-semibold text-white">
                  {stats?.actingCredits ?? 0}
                </div>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
                <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-gray-500">
                  <Film size={14} className="text-cyan-300" />
                  Movies
                </div>
                <div className="text-xl font-semibold text-white">
                  {stats?.movies ?? 0}
                </div>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
                <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-gray-500">
                  <Tv size={14} className="text-cyan-300" />
                  Series
                </div>
                <div className="text-xl font-semibold text-white">
                  {stats?.series ?? 0}
                </div>
              </div>
            </div>

            {externalLinks.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {externalLinks.map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => {
                      void openExternal(link.url);
                    }}
                    className="clip-facet-btn flex items-center gap-2 border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-white/[0.08] hover:text-white"
                  >
                    <ExternalLink size={14} />
                    {link.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="justify-self-center lg:justify-self-end">
            <div className="relative w-[min(82vw,380px)]">
              <div className="absolute -inset-5 bg-gradient-to-tr from-cyan-500/25 via-transparent to-orange-500/20 blur-3xl" />
              <div
                className="relative aspect-[0.76] overflow-hidden bg-white/[0.05] shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
                style={{
                  clipPath:
                    'polygon(16% 0, 100% 0, 100% 84%, 84% 100%, 0 100%, 0 16%)'
                }}
              >
                {portraitImage ? (
                  <img
                    src={portraitImage}
                    alt={person.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
                    <User size={72} className="text-white/25" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-10 px-6 md:px-16 lg:grid-cols-[1.4fr_0.92fr]">
        <div className="space-y-10">
          <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-7 backdrop-blur-md">
            <div className="mb-5 flex items-center gap-3">
              <div className="h-8 w-1 bg-cyan-500 shadow-[0_0_16px_rgba(34,211,238,0.5)]" />
              <h2 className="font-['Advent_Pro'] text-3xl font-bold text-white">
                Biography
              </h2>
            </div>

            <p className="text-base leading-8 text-gray-300">
              {displayedBiography ||
                'No biography is available yet for this actor, but the filmography below already maps out the most visible chapters of the career.'}
            </p>

            {biographyNeedsClamp && (
              <button
                onClick={() => setBioExpanded((current) => !current)}
                className="mt-5 text-sm font-medium uppercase tracking-[0.22em] text-cyan-300 transition-colors hover:text-cyan-200"
              >
                {bioExpanded ? 'Show Less' : 'Read More'}
              </button>
            )}
          </section>

          <section>
            <div className="mb-5 flex items-center gap-3">
              <Sparkles size={18} className="text-cyan-300" />
              <h2 className="font-['Advent_Pro'] text-3xl font-bold text-white">
                Known For
              </h2>
            </div>

            {knownFor.length > 0 ? (
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {knownFor.map((credit, index) => (
                  <div key={`${credit.mediaType}-${credit.tmdbId}`} className="space-y-3">
                    <MovieCard
                      {...credit}
                      delay={index * 0.04}
                      onClick={() => onMovieClick(credit)}
                    />
                    {credit.character && (
                      <div className="px-2 text-sm text-gray-400">
                        as <span className="text-cyan-200">{credit.character}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-6 text-gray-400">
                No highlighted titles are available yet for this profile.
              </div>
            )}
          </section>

          <section>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <Film size={18} className="text-cyan-300" />
                  <h2 className="font-['Advent_Pro'] text-3xl font-bold text-white">
                    Filmography
                  </h2>
                </div>
                <p className="text-sm uppercase tracking-[0.22em] text-gray-500">
                  {filteredFilmography.length} titles after filters
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(Object.keys(sortLabels) as FilmographySortOption[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSortBy(option)}
                    className={`clip-facet-btn px-4 py-2 text-sm uppercase tracking-[0.18em] transition-colors ${
                      sortBy === option
                        ? 'border border-cyan-500/30 bg-cyan-500/12 text-cyan-200'
                        : 'border border-white/8 bg-white/[0.03] text-gray-400 hover:text-white'
                    }`}
                  >
                    {sortLabels[option]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {(Object.keys(typeLabels) as FilmographyTypeFilter[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveType(type)}
                  className={`clip-facet-btn px-4 py-2 text-sm uppercase tracking-[0.22em] transition-colors ${
                    activeType === type
                      ? 'border border-cyan-500/30 bg-cyan-500/12 text-cyan-200'
                      : 'border border-white/8 bg-white/[0.03] text-gray-400 hover:text-white'
                  }`}
                >
                  {typeLabels[type]}
                </button>
              ))}
            </div>

            {genreOptions.length > 1 && (
              <div className="mb-8 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {genreOptions.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => setActiveGenre(genre)}
                    className={`clip-facet-btn whitespace-nowrap px-4 py-2 text-sm uppercase tracking-[0.18em] transition-colors ${
                      activeGenre === genre
                        ? 'border border-cyan-500/30 bg-cyan-500/12 text-cyan-200'
                        : 'border border-white/8 bg-white/[0.03] text-gray-400 hover:text-white'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            )}

            {filteredFilmography.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {filteredFilmography.map((credit, index) => (
                  <div key={`${credit.mediaType}-${credit.tmdbId}`} className="space-y-3">
                    <div className="flex justify-center">
                      <MovieCard
                        {...credit}
                        delay={index * 0.02}
                        onClick={() => onMovieClick(credit)}
                      />
                    </div>
                    <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
                          {credit.mediaType === 'tv' ? 'Series' : 'Movie'}
                        </span>
                        <span className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                          {credit.primaryGenre}
                        </span>
                      </div>
                      <div className="line-clamp-2 text-sm text-gray-300">
                        {credit.character
                          ? `as ${credit.character}`
                          : 'Character details unavailable'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-6 text-gray-400">
                No filmography entries match the current filters.
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-7 backdrop-blur-md">
            <div className="mb-5 flex items-center gap-3">
              <Star size={18} className="text-cyan-300" />
              <h2 className="font-['Advent_Pro'] text-2xl font-bold text-white">
                Profile Highlights
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-gray-500">
                  Known For Department
                </div>
                <div className="mt-1 text-white">{person.known_for_department}</div>
              </div>
              {bornOn && (
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-gray-500">
                    Born
                  </div>
                  <div className="mt-1 text-white">{bornOn}</div>
                </div>
              )}
              {person.place_of_birth && (
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-gray-500">
                    Place of Birth
                  </div>
                  <div className="mt-1 text-white">{person.place_of_birth}</div>
                </div>
              )}
              {person.also_known_as && person.also_known_as.length > 0 && (
                <div>
                  <div className="mb-2 text-[11px] uppercase tracking-[0.22em] text-gray-500">
                    Also Known As
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {person.also_known_as.slice(0, 6).map((alias) => (
                      <span
                        key={alias}
                        className="clip-facet-btn border border-white/8 bg-white/[0.04] px-3 py-2 text-xs uppercase tracking-[0.16em] text-gray-300"
                      >
                        {alias}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-7 backdrop-blur-md">
            <div className="mb-5 flex items-center gap-3">
              <Images size={18} className="text-cyan-300" />
              <h2 className="font-['Advent_Pro'] text-2xl font-bold text-white">
                Photo Gallery
              </h2>
            </div>

            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {galleryImages.slice(0, 8).map((imagePath, index) => (
                  <motion.div
                    key={imagePath}
                    className={`overflow-hidden rounded-[22px] bg-white/[0.04] ${
                      index === 0 ? 'col-span-2 aspect-[1.45]' : 'aspect-[0.82]'
                    }`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, delay: index * 0.04 }}
                  >
                    <img
                      src={profile(imagePath, index === 0 ? 'original' : 'h632')}
                      alt={`${person.name} portrait ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-6 text-gray-400">
                No additional photos are available for this actor yet.
              </div>
            )}
          </section>
        </div>
      </div>
    </motion.div>
  );
}
