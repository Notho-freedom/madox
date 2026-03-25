import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { ActorCard } from '../components/ActorCard';
import {
  FacetButton,
  FacetField,
  FacetPanel,
  FacetSectionHeader,
  FacetSelect
} from '../components/design';
import { LoadMoreSentinel } from '../components/LoadMoreSentinel';
import { ErrorState, GridSkeleton } from '../components/LoadingSkeleton';
import { useI18n } from '../i18n/useI18n';
import { useActorsCatalog } from '../hooks/useTMDB';

type ActorSort = 'alphabetical' | 'popular';
type KnownForFilter = 'all' | 'mixed' | 'movies' | 'series';

interface ActorsPageProps {
  onActorClick: (personId: number) => void;
}

function matchesKnownFor(
  mediaKinds: ('movie' | 'tv')[],
  filter: KnownForFilter
) {
  const hasMovie = mediaKinds.includes('movie');
  const hasSeries = mediaKinds.includes('tv');

  switch (filter) {
    case 'movies':
      return hasMovie;
    case 'series':
      return hasSeries;
    case 'mixed':
      return hasMovie && hasSeries;
    default:
      return true;
  }
}

export function ActorsPage({ onActorClick }: ActorsPageProps) {
  const { t } = useI18n();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<ActorSort>('popular');
  const [knownForFilter, setKnownForFilter] = useState<KnownForFilter>('all');
  const actorsQuery = useActorsCatalog(searchQuery);

  const visibleActors = useMemo(() => {
    const filtered = actorsQuery.data
      .filter((actor) => actor.knownForDepartment === 'Acting')
      .filter((actor) => matchesKnownFor(actor.mediaKinds, knownForFilter));

    return filtered.sort((left, right) => {
      if (sortBy === 'alphabetical') {
        return left.name.localeCompare(right.name);
      }

      return right.popularity - left.popularity;
    });
  }, [actorsQuery.data, knownForFilter, sortBy]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const showSkeleton = actorsQuery.loading && actorsQuery.data.length === 0;
  const showError = Boolean(actorsQuery.error && actorsQuery.data.length === 0);

  return (
    <motion.div
      className="px-16 py-12 pb-32 pt-8 md:pt-20"
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
      }}
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <FacetSectionHeader
            className="mb-2"
            count={
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-400">
                {t('common.results', { count: visibleActors.length })}
              </span>
            }
            title={t('actorsPage.title')}
            titleClassName="text-5xl tracking-tight"
          />
          <p className="ml-5 max-w-2xl tracking-wide text-gray-400">
            {t('actorsPage.description')}
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
          <FacetField
            inputClassName="w-72 bg-white/5 py-2"
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={t('actorsPage.searchPlaceholder')}
            prefixIcon={<Search size={16} />}
            type="text"
            value={searchInput}
          />
          <FacetButton shape="buttonCut8" size="sm" type="submit" variant="outline">
            {t('common.search')}
          </FacetButton>
        </form>
      </div>

      <FacetPanel className="mb-8" chrome="subtle" contentClassName="flex flex-wrap items-center gap-4 p-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs uppercase tracking-[0.22em] text-cyan-200">
          <Sparkles size={14} />
          <span>{t('actorsPage.loadHint')}</span>
        </div>

        <div className="min-w-[240px]">
          <FacetSelect
            label={t('actorsPage.sort')}
            labelClassName="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-gray-500"
            selectClassName="bg-[#0d111b] py-2"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as ActorSort)}
          >
            <option value="popular">{t('actorsPage.sortOptions.popular')}</option>
            <option value="alphabetical">
              {t('actorsPage.sortOptions.alphabetical')}
            </option>
          </FacetSelect>
        </div>

        <div className="min-w-[240px]">
          <FacetSelect
            label={t('actorsPage.knownForFilter')}
            labelClassName="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-gray-500"
            selectClassName="bg-[#0d111b] py-2"
            value={knownForFilter}
            onChange={(event) =>
              setKnownForFilter(event.target.value as KnownForFilter)
            }
          >
            <option value="all">{t('actorsPage.knownForOptions.all')}</option>
            <option value="movies">{t('actorsPage.knownForOptions.movies')}</option>
            <option value="series">{t('actorsPage.knownForOptions.series')}</option>
            <option value="mixed">{t('actorsPage.knownForOptions.mixed')}</option>
          </FacetSelect>
        </div>
      </FacetPanel>

      {showSkeleton ? (
        <GridSkeleton count={12} />
      ) : showError ? (
        <ErrorState message={actorsQuery.error} onRetry={actorsQuery.refetch} />
      ) : visibleActors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center text-gray-500">
          <Sparkles size={42} className="mb-4 opacity-25" />
          <p className="text-lg text-white/80">{t('actorsPage.emptyTitle')}</p>
          <p className="mt-2 text-sm text-gray-500">
            {t('actorsPage.emptyDescription')}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
            {visibleActors.map((actor, index) => (
              <motion.div
                key={actor.id}
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
                  delay: index * 0.025
                }}
              >
                <ActorCard
                  actor={actor}
                  className="w-full max-w-[220px] xl:max-w-[228px] 2xl:max-w-[236px]"
                  delay={0}
                  onClick={() => onActorClick(actor.tmdbId)}
                />
              </motion.div>
            ))}
          </div>
          <LoadMoreSentinel
            canLoadMore={actorsQuery.hasMore}
            className="mt-10 h-10"
            isLoadingMore={actorsQuery.isLoadingMore}
            onLoadMore={actorsQuery.loadMore}
          />
        </>
      )}
    </motion.div>
  );
}
