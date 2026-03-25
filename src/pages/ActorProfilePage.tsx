import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronRight,
  Film,
  Images,
  MapPin,
  Search,
  Sparkles,
  Star,
  Tv,
  User
} from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { type MovieData } from '../data/movies';
import { usePersonProfile } from '../hooks/useTMDB';
import { profile } from '../services/tmdb';
import { genreName, type PersonMediaCredit } from '../services/tmdbShared';

type FilmographyTypeFilter = 'all' | 'movie' | 'tv';
type TopSectionCardKey = 'biography' | 'gallery' | 'profile';
type TopSectionCardVariant = 'featured' | 'compact';

interface ActorProfilePageProps {
  onBack: () => void;
  onMovieClick: (movie: MovieData) => void;
  personId: number;
}

const EMPTY_CREDITS: PersonMediaCredit[] = [];
const PANEL_CLIP_PATH =
  'polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px)';

function FacetPanel({
  children,
  className = '',
  contentClassName = ''
}: {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        clipPath: PANEL_CLIP_PATH
      }}
    >
      <div className="absolute inset-0 bg-[#0b0d16]/86 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(34,211,238,0.08),transparent_30%,transparent_72%,rgba(249,115,22,0.08))]" />
      <div
        className="absolute inset-0 prism-border opacity-35"
        style={{
          clipPath: PANEL_CLIP_PATH
        }}
      />
      <div className="absolute -left-10 top-0 h-28 w-28 bg-cyan-500/12 blur-3xl" />
      <div className="absolute -bottom-12 right-0 h-32 w-32 bg-orange-500/10 blur-3xl" />
      <div className={`relative z-10 ${contentClassName}`}>{children}</div>
    </div>
  );
}

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

function sortCredits(
  items: PersonMediaCredit[]
): PersonMediaCredit[] {
  const nextItems = [...items];
  nextItems.sort((left, right) => {
    return right.popularity - left.popularity || right.voteCount - left.voteCount;
  });

  return nextItems;
}

export function ActorProfilePage({
  onBack,
  onMovieClick,
  personId
}: ActorProfilePageProps) {
  const [activeType, setActiveType] = useState<FilmographyTypeFilter>('all');
  const [activeGenres, setActiveGenres] = useState<string[]>([]);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [genrePickerOpen, setGenrePickerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { data, error, loading, refetch } = usePersonProfile(personId);
  const filmographySectionRef = useRef<HTMLElement | null>(null);
  const genrePickerRef = useRef<HTMLDivElement | null>(null);

  const person = data?.person;
  const filmography = useMemo(() => data?.filmography ?? EMPTY_CREDITS, [data]);
  const knownFor = useMemo(() => data?.knownFor ?? EMPTY_CREDITS, [data]);
  const stats = data?.stats;
  const knownForPreview = useMemo(() => knownFor.slice(0, 6), [knownFor]);

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

  const galleryPreviewImages = useMemo(() => galleryImages.slice(0, 4), [galleryImages]);
  const galleryOverflowCount = Math.max(0, galleryImages.length - galleryPreviewImages.length);
  const featuredGalleryImages = useMemo(() => galleryImages.slice(0, 6), [galleryImages]);
  const featuredGalleryOverflowCount = Math.max(0, galleryImages.length - featuredGalleryImages.length);

  const genreOptions = useMemo(() => {
    const genres = new Set<string>();

    for (const item of filmography) {
      const parts = (item.genre ?? '')
        .split(' / ')
        .map((part) => part.trim())
        .filter((part) => Boolean(part) && part !== 'Entertainment');

      for (const part of parts) {
        genres.add(part);
      }

      if (parts.length === 0 && item.primaryGenre && item.primaryGenre !== 'Unknown') {
        genres.add(item.primaryGenre);
      }

      if (parts.length === 0 && item.genreIds.length > 0) {
        for (const genreId of item.genreIds) {
          const resolvedGenre = genreName(genreId);
          if (resolvedGenre !== 'Unknown') {
            genres.add(resolvedGenre);
          }
        }
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
      activeGenres.length === 0
        ? byType
        : byType.filter((item) =>
            activeGenres.some((genre) => (item.genre ?? '').includes(genre))
          );
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const bySearch =
      normalizedSearch.length === 0
        ? byGenre
        : byGenre.filter((item) => {
            const haystack = [
              item.title,
              item.genre,
              item.character,
              item.year,
              item.mediaType === 'movie' ? 'movie' : 'series'
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();

            return haystack.includes(normalizedSearch);
          });

    return sortCredits(bySearch);
  }, [activeGenres, activeType, filmography, searchQuery]);

  const biography = person?.biography?.trim() || '';
  const hasBiography = biography.length > 0;
  const hasGallery = galleryImages.length > 0;
  const biographyNeedsClamp = biography.length > 1200;
  const displayedBiography =
    biographyNeedsClamp && !bioExpanded ? `${biography.slice(0, 1200).trim()}...` : biography;
  const portraitPath = galleryImages[0] ?? null;
  const portraitImage = profile(portraitPath, 'h632');
  const backgroundImage = profile(galleryImages[1] ?? portraitPath, 'h632');
  const bornOn = formatDate(person?.birthday);
  const age = person ? getAge(person.birthday, person.deathday) : null;

  const typeLabels: Record<FilmographyTypeFilter, string> = {
    all: 'All',
    movie: 'Movies',
    tv: 'Series'
  };

  const selectedGenreLabel = useMemo(() => {
    if (activeGenres.length === 0) {
      return 'All genres';
    }

    if (activeGenres.length === 1) {
      return activeGenres[0];
    }

    if (activeGenres.length === 2) {
      return `${activeGenres[0]}, ${activeGenres[1]}`;
    }

    return `${activeGenres[0]} +${activeGenres.length - 1}`;
  }, [activeGenres]);

  const topSectionOrder = useMemo(() => {
    const cardWeight: Record<TopSectionCardKey, number> = {
      biography: 3,
      gallery: 2,
      profile: 1
    };
    const cards: { key: TopSectionCardKey; score: number }[] = [
      {
        key: 'profile',
        score:
          220 +
          (bornOn ? 40 : 0) +
          (person?.place_of_birth ? 40 : 0) +
          (person?.known_for_department ? 30 : 0) +
          Math.min(person?.also_known_as?.length ?? 0, 6) * 18
      }
    ];

    if (hasBiography) {
      cards.push({
        key: 'biography',
        score: Math.max(260, Math.min(biography.length, 2600))
      });
    }

    if (hasGallery) {
      cards.push({
        key: 'gallery',
        score: 280 + galleryImages.length * 180
      });
    }

    const sortedBySize = [...cards].sort((left, right) => {
      return right.score - left.score || cardWeight[right.key] - cardWeight[left.key];
    });

    const featured = sortedBySize[0].key;
    const sidebar = sortedBySize
      .slice(1)
      .sort((left, right) => {
        return left.score - right.score || cardWeight[left.key] - cardWeight[right.key];
      })
      .map((card) => card.key);

    return {
      featured,
      sidebar
    };
  }, [
    biography.length,
    bornOn,
    hasBiography,
    hasGallery,
    galleryImages.length,
    person?.also_known_as,
    person?.known_for_department,
    person?.place_of_birth
  ]);

  const handleViewMoreTitles = () => {
    filmographySectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const filterSelectClassName =
    "w-full rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-cyan-400/45 focus:bg-white/[0.06]";

  useEffect(() => {
    setActiveType('all');
    setActiveGenres([]);
    setBioExpanded(false);
    setGenrePickerOpen(false);
    setSearchInput('');
    setSearchQuery('');
  }, [personId]);

  useEffect(() => {
    if (!genrePickerOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!genrePickerRef.current?.contains(event.target as Node)) {
        setGenrePickerOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
    };
  }, [genrePickerOpen]);

  const renderBiographyPanel = (variant: TopSectionCardVariant) => {
    const panelTitleClass =
      variant === 'featured'
        ? "font-['Advent_Pro'] text-3xl font-bold text-white"
        : "font-['Advent_Pro'] text-2xl font-bold text-white";

    return (
      <FacetPanel className="h-full min-h-0" contentClassName="flex h-full min-h-0 flex-col p-7 md:p-8">
        <div className="mb-5 flex items-center gap-4">
          <div className="h-8 w-1 bg-cyan-500 shadow-[0_0_16px_rgba(34,211,238,0.55)]" />
          <h2 className={panelTitleClass}>Biography</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-2">
          <p className="break-words text-base leading-8 text-gray-300">
            {displayedBiography ||
              'No biography is available yet for this actor, but the filmography below already maps out the most visible chapters of the career.'}
          </p>
        </div>

        {biographyNeedsClamp && (
          <button
            onClick={() => setBioExpanded((current) => !current)}
            className="mt-6 text-sm font-medium uppercase tracking-[0.22em] text-cyan-300 transition-colors hover:text-cyan-200"
          >
            {bioExpanded ? 'Show Less' : 'Read More'}
          </button>
        )}
      </FacetPanel>
    );
  };

  const renderGalleryPanel = (variant: TopSectionCardVariant) => {
    const panelTitleClass =
      variant === 'featured'
        ? "font-['Advent_Pro'] text-3xl font-bold text-white"
        : "font-['Advent_Pro'] text-2xl font-bold text-white";
    const images = variant === 'featured' ? featuredGalleryImages : galleryPreviewImages;
    const overflowCount =
      variant === 'featured' ? featuredGalleryOverflowCount : galleryOverflowCount;
    const gridClass =
      variant === 'featured'
        ? 'grid min-h-0 flex-1 auto-rows-fr grid-cols-2 gap-4 xl:grid-cols-3'
        : 'grid min-h-0 flex-1 auto-rows-fr grid-cols-2 gap-4';
    const imageClass = 'relative min-h-0 overflow-hidden rounded-[22px] bg-white/[0.04]';

    return (
      <FacetPanel className="h-full min-h-0" contentClassName="flex h-full min-h-0 flex-col p-7">
        <div className="mb-5 flex items-center gap-3">
          <Images size={18} className="text-cyan-300" />
          <h2 className={panelTitleClass}>Photo Gallery</h2>
        </div>

        {hasGallery ? (
          <div className={gridClass}>
            {images.map((imagePath, index) => (
              <motion.div
                key={`${variant}-${imagePath}`}
                className={imageClass}
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
                {overflowCount > 0 && index === images.length - 1 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="font-['Advent_Pro'] text-3xl font-bold text-white">
                        +{overflowCount}
                      </div>
                      <div className="mt-1 text-[11px] uppercase tracking-[0.22em] text-cyan-200">
                        more photos
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 items-center text-gray-400">
            No additional photos are available for this actor yet.
          </div>
        )}
      </FacetPanel>
    );
  };

  const renderProfilePanel = (variant: TopSectionCardVariant) => {
    const panelTitleClass =
      variant === 'featured'
        ? "font-['Advent_Pro'] text-3xl font-bold text-white"
        : "font-['Advent_Pro'] text-2xl font-bold text-white";
    const bodyClass =
      variant === 'featured'
        ? 'grid gap-5 xl:grid-cols-2'
        : 'space-y-5';

    return (
      <FacetPanel className="h-full min-h-0" contentClassName="flex h-full min-h-0 flex-col p-7">
        <div className="mb-5 flex items-center gap-3">
          <Star size={18} className="text-cyan-300" />
          <h2 className={panelTitleClass}>Profile Highlights</h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-2">
          <div className={bodyClass}>
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
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-gray-500">
                Popularity
              </div>
              <div className="mt-1 text-white">{person.popularity.toFixed(1)}</div>
            </div>
            {person.also_known_as && person.also_known_as.length > 0 && (
              <div className={variant === 'featured' ? 'xl:col-span-2' : ''}>
                <div className="mb-2 text-[11px] uppercase tracking-[0.22em] text-gray-500">
                  Also Known As
                </div>
                <div className="flex flex-wrap gap-2">
                  {person.also_known_as.slice(0, variant === 'featured' ? 8 : 6).map((alias) => (
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
        </div>
      </FacetPanel>
    );
  };

  const renderTopSectionCard = (
    key: TopSectionCardKey,
    variant: TopSectionCardVariant
  ) => {
    switch (key) {
      case 'biography':
        return renderBiographyPanel(variant);
      case 'gallery':
        return renderGalleryPanel(variant);
      case 'profile':
      default:
        return renderProfilePanel(variant);
    }
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
      className="relative z-40 min-h-screen overflow-x-hidden bg-[#08080f] pb-24"
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

        <div className="relative z-10 mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[1.2fr_0.85fr] lg:items-end">
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

      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-16">
        <div
          className={
            topSectionOrder.sidebar.length === 2
              ? 'relative z-10 grid gap-8 lg:h-[860px] lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.95fr)] lg:grid-rows-[minmax(0,0.78fr)_minmax(0,1fr)] lg:items-stretch'
              : topSectionOrder.sidebar.length === 1
                ? 'relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.95fr)] lg:items-start'
                : 'relative z-10 grid gap-8'
          }
        >
          <div
            className={
              topSectionOrder.sidebar.length === 2 ? 'min-w-0 lg:row-span-2' : 'min-w-0'
            }
          >
            {renderTopSectionCard(topSectionOrder.featured, 'featured')}
          </div>

          {topSectionOrder.sidebar.length > 0 && (
            <div className="min-w-0">
              {renderTopSectionCard(topSectionOrder.sidebar[0], 'compact')}
            </div>
          )}

          {topSectionOrder.sidebar.length > 1 && (
            <div className="min-w-0">
              {renderTopSectionCard(topSectionOrder.sidebar[1], 'compact')}
            </div>
          )}
        </div>

        <div className="relative z-0 mt-16 space-y-10">
          <section className="min-w-0">
            <div className="mb-6 flex items-center gap-4">
              <Sparkles size={18} className="text-cyan-300" />
              <h2 className="font-['Advent_Pro'] text-3xl font-bold text-white">
                Known For
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              {knownFor.length > 0 && (
                <button
                  type="button"
                  onClick={handleViewMoreTitles}
                  className="group flex items-center gap-1 text-sm uppercase tracking-widest text-cyan-400 transition-colors hover:text-cyan-300"
                >
                  View More
                  <ChevronRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              )}
            </div>

            {knownFor.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                  {knownForPreview.map((credit, index) => (
                    <div key={`${credit.mediaType}-${credit.tmdbId}`} className="space-y-3">
                      <MovieCard
                        {...credit}
                        className="w-full max-w-[220px] xl:max-w-[228px] 2xl:max-w-[236px]"
                        delay={index * 0.04}
                        onClick={() => onMovieClick(credit)}
                      />
                      <div className="min-h-[40px] px-2 text-sm text-gray-500">
                        {credit.character ? (
                          <>
                            as <span className="text-cyan-200">{credit.character}</span>
                          </>
                        ) : (
                          <span className="text-gray-600">
                            {credit.year || (credit.mediaType === 'movie' ? 'Movie' : 'Series')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <FacetPanel contentClassName="p-6">
                <div className="text-gray-400">
                  No highlighted titles are available yet for this profile.
                </div>
              </FacetPanel>
            )}
          </section>

          <section ref={filmographySectionRef} className="min-w-0">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
              <div>
                <div className="mb-3 flex items-center gap-4">
                  <div className="h-8 w-1 bg-cyan-500 shadow-[0_0_16px_rgba(34,211,238,0.55)]" />
                  <h2 className="font-['Advent_Pro'] text-3xl font-bold text-white">
                    Filmography
                  </h2>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-gray-400 prism-border">
                    {filteredFilmography.length} titles
                  </span>
                </div>
                <p className="ml-5 text-sm uppercase tracking-[0.22em] text-gray-500">
                  Full acting catalog with instant local filters
                </p>
              </div>
            </div>

            <FacetPanel className="mb-8 overflow-visible" contentClassName="p-5 md:p-6">
              <div className="flex flex-col gap-4">
                <form onSubmit={handleSearchSubmit} className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row">
                  <div className="relative min-w-0 flex-1">
                    <Search
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(event) => setSearchInput(event.target.value)}
                      placeholder="Search filmography..."
                      className="w-full rounded-[18px] border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-cyan-400/45 focus:bg-white/[0.06]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="clip-facet-btn border border-cyan-500/30 bg-cyan-500/12 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300 transition-colors hover:bg-cyan-500/18"
                  >
                    Search
                  </button>
                </form>

                <div className="grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)]">
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-gray-500">
                      Type
                    </label>
                    <select
                      value={activeType}
                      onChange={(event) => setActiveType(event.target.value as FilmographyTypeFilter)}
                      className={filterSelectClassName}
                    >
                      {(Object.keys(typeLabels) as FilmographyTypeFilter[]).map((type) => (
                        <option key={type} value={type} className="bg-[#0b0d16]">
                          {typeLabels[type]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div ref={genrePickerRef} className="relative min-w-0">
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-gray-500">
                      Genres
                    </label>
                    <button
                      type="button"
                      onClick={() => setGenrePickerOpen((current) => !current)}
                      disabled={genreOptions.length <= 1}
                      className={`${filterSelectClassName} flex h-[50px] items-center justify-between gap-3 text-left disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <span className="truncate">{selectedGenreLabel}</span>
                      <ChevronDown
                        size={16}
                        className={`shrink-0 text-gray-400 transition-transform ${
                          genrePickerOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {genrePickerOpen && genreOptions.length > 1 && (
                      <FacetPanel
                        className="absolute left-0 right-0 top-full z-30 mt-3"
                        contentClassName="p-4"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="text-xs uppercase tracking-[0.22em] text-gray-500">
                            Pick genres
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveGenres([])}
                            className="text-xs uppercase tracking-[0.22em] text-cyan-300 transition-colors hover:text-cyan-200"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="grid max-h-56 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                          {genreOptions
                            .filter((genre) => genre !== 'All')
                            .map((genre) => {
                              const isSelected = activeGenres.includes(genre);

                              return (
                                <label
                                  key={genre}
                                  className="flex cursor-pointer items-center gap-3 rounded-[16px] border border-white/8 bg-white/[0.04] px-3 py-3 text-sm text-gray-200 transition-colors hover:bg-white/[0.07]"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() =>
                                      setActiveGenres((current) =>
                                        current.includes(genre)
                                          ? current.filter((item) => item !== genre)
                                          : [...current, genre]
                                      )
                                    }
                                    className="h-4 w-4 rounded border-white/15 bg-transparent text-cyan-400 focus:ring-cyan-400/30"
                                  />
                                  <span className="truncate">{genre}</span>
                                </label>
                              );
                            })}
                        </div>
                      </FacetPanel>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      {genreOptions.length > 1
                        ? 'Open the list to combine genres without creating height offsets.'
                        : 'No genre tags are available for this filmography yet.'}
                    </p>
                  </div>
                </div>
              </div>
            </FacetPanel>

            {filteredFilmography.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                {filteredFilmography.map((credit, index) => (
                  <motion.div
                    key={`${credit.mediaType}-${credit.tmdbId}`}
                    className="flex justify-center"
                    initial={{
                      opacity: 0,
                      y: 20
                    }}
                    animate={{
                      opacity: 1,
                      y: 0
                    }}
                    transition={{
                      delay: index * 0.02
                    }}
                  >
                    <MovieCard
                      {...credit}
                      className="w-full max-w-[220px] xl:max-w-[228px] 2xl:max-w-[236px]"
                      delay={0}
                      onClick={() => onMovieClick(credit)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <FacetPanel contentClassName="p-6">
                <div className="text-gray-400">
                  No filmography entries match the current filters.
                </div>
              </FacetPanel>
            )}
          </section>
        </div>
      </div>
    </motion.div>
  );
}
