import React, { useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import {
  getHomeSectionSet,
  type HomeSectionConfig
} from '../data/homeContent';
import {
  getHomeGenreOption,
  type HomeGenreId
} from '../data/homeGenres';
import { type MovieData } from '../data/movies';
import {
  type TMDBCatalogSource,
  useTMDBCatalog
} from '../hooks/useTMDB';
import { type MoviePageResult } from '../services/tmdb';
import { HorizontalCarousel } from './HorizontalCarousel';
import { CardSkeleton, ErrorState } from './LoadingSkeleton';
import { LoadMoreSentinel } from './LoadMoreSentinel';
import { MovieCard } from './MovieCard';

export interface CategoryData {
  id: string;
  source: TMDBCatalogSource;
  title: string;
  description: string;
  items: MovieData[];
}

interface SectionProps {
  config: HomeSectionConfig;
  initialPageData?: MoviePageResult | null;
  onMovieClick: (movie: MovieData) => void;
  onViewAll?: () => void;
}

function GridSection({
  config,
  initialPageData,
  onMovieClick,
  onViewAll
}: SectionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isVisible = useInView(sectionRef, {
    once: true,
    margin: '320px 0px'
  });
  const {
    data,
    error,
    hasMore,
    isRefreshing,
    isLoadingMore,
    loading,
    loadMore,
    refetch
  } = useTMDBCatalog(config.source, {
    enabled: isVisible || Boolean(initialPageData),
    initialPageBatch: initialPageData?.page ?? 1,
    initialPageData,
    pageBatchSize: 1
  });

  return (
    <div ref={sectionRef} className="mb-16 pl-16">
      <motion.div
        className="mb-8 flex items-center gap-4"
        initial={{
          opacity: 0,
          x: -20
        }}
        animate={
          isVisible ?
            {
              opacity: 1,
              x: 0
            } :
            {}
        }
        transition={{
          duration: 0.6
        }}>
        <div className="h-8 w-1 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
        <h2 className="text-3xl font-bold tracking-wide text-white">
          {config.title}
        </h2>
        <div className="ml-4 h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        {data.length > 0 &&
          <button
            type="button"
            onClick={onViewAll}
            className="group mr-16 flex items-center gap-1 text-sm uppercase tracking-widest text-cyan-400 transition-colors hover:text-cyan-300">
            View All
            <ChevronRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        }
      </motion.div>

      {!isVisible ?
        <div className="h-[290px]" /> :
      loading && data.length === 0 ?
        <CardSkeleton count={6} /> :
      error && data.length === 0 ?
        <ErrorState message={error} onRetry={refetch} /> :
        <HorizontalCarousel
          className="pb-12"
          contentClassName="flex min-w-max gap-6 pr-16"
          scrollerRef={scrollRef}
        >
            {data.map((movie, index) =>
              <MovieCard
                key={movie.id}
                {...movie}
                delay={index * 0.06}
                onClick={() => onMovieClick(movie)} />
            )}
            <LoadMoreSentinel
              canLoadMore={hasMore}
              className="w-16 shrink-0"
              isLoadingMore={isLoadingMore || isRefreshing}
              onLoadMore={loadMore}
              rootMargin="0px 320px 0px 0px"
              rootRef={scrollRef} />
        </HorizontalCarousel>
      }
    </div>
  );
}

interface MovieGridProps {
  activeGenre?: HomeGenreId;
  initialPageDataBySection?: Partial<Record<string, MoviePageResult>>;
  onMovieClick: (movie: MovieData) => void;
  onViewAll?: (category: CategoryData) => void;
}

export function MovieGrid({
  activeGenre,
  initialPageDataBySection,
  onMovieClick,
  onViewAll
}: MovieGridProps) {
  const activeGenreOption = getHomeGenreOption(activeGenre ?? 'all');
  const sectionSet = useMemo(() => {
    return getHomeSectionSet(activeGenreOption);
  }, [activeGenreOption]);
  const sections = useMemo(() => {
    return [
      sectionSet.trending,
      sectionSet.popularMovies,
      sectionSet.topRated,
      sectionSet.popularSeries
    ];
  }, [sectionSet]);

  return (
    <div className="relative z-10 pb-20">
      {sections.map((section) =>
        <GridSection
          key={section.id}
          config={section}
          initialPageData={initialPageDataBySection?.[section.id] ?? null}
          onMovieClick={onMovieClick}
          onViewAll={() =>
            onViewAll?.({
              id: section.id,
              source: section.source,
              title: section.title,
              description: section.description,
              items: section.data
            })
          } />
      )}
    </div>
  );
}
