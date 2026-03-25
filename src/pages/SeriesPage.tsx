import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HorizontalCarousel } from '../components/HorizontalCarousel';
import { LoadMoreSentinel } from '../components/LoadMoreSentinel';
import { MovieCard } from '../components/MovieCard';
import {
  FacetButton,
  FacetField,
  FacetSectionHeader,
  facetClipPaths
} from '../components/design';
import { GridSkeleton, ErrorState } from '../components/LoadingSkeleton';
import { Play, Search } from 'lucide-react';
import { useI18n } from '../i18n/useI18n';
import {
  usePopular,
  useTopRated,
  useNowPlaying,
  useDiscover,
  useTMDBSearch } from
'../hooks/useTMDB';
import { backdrop } from '../services/tmdb';
import { type MovieData } from '../data/movies';
const CATEGORIES = [
{
  labelKey: 'common.popular',
  hook: 'popular'
},
{
  labelKey: 'common.topRated',
  hook: 'topRated'
},
{
  labelKey: 'common.onTheAir',
  hook: 'nowPlaying'
},
{
  labelKey: 'common.scifiFantasy',
  hook: 'genre',
  genreId: 10765
},
{
  labelKey: 'common.drama',
  hook: 'genre',
  genreId: 18
},
{
  labelKey: 'common.action',
  hook: 'genre',
  genreId: 10759
},
{
  labelKey: 'common.animation',
  hook: 'genre',
  genreId: 16
},
{
  labelKey: 'common.crime',
  hook: 'genre',
  genreId: 80
}] as
const;
interface SeriesPageProps {
  onMovieClick: (movie: MovieData) => void;
}
export function SeriesPage({ onMovieClick }: SeriesPageProps) {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const popular = usePopular('tv');
  const topRated = useTopRated('tv');
  const onAir = useNowPlaying('tv');
  const cat = CATEGORIES[activeCategory];
  const genreId = 'genreId' in cat ? cat.genreId : 10765;
  const genre = useDiscover('tv', genreId);
  const searchResults = useTMDBSearch(searchQuery, 'tv');
  const isSearching = searchQuery.length > 0;
  const activeData = isSearching ?
  searchResults :
  cat.hook === 'popular' ?
  popular :
  cat.hook === 'topRated' ?
  topRated :
  cat.hook === 'nowPlaying' ?
  onAir :
  genre;
  const featured = activeData.data[0];
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };
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
      }}>
      
      {featured && !activeData.loading &&
      <div className="relative w-full h-[400px] mb-16 overflow-hidden group">
          <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backdrop(featured.backdropPath || null)})`,
            clipPath: facetClipPaths.seriesHero
          }} />
        
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080f] via-[#08080f]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-12 w-full max-w-3xl">
            <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs tracking-[0.2em] uppercase backdrop-blur-md mb-4 inline-block">
              {t('seriesPage.featured')}
            </span>
            <h1 className="text-4xl font-bold text-white mb-3 font-['Advent_Pro'] line-clamp-2">
              {featured.title}
            </h1>
            <p className="text-gray-300 text-sm mb-6 line-clamp-2 max-w-xl">
              {featured.description}
            </p>
            <FacetButton
            onClick={() => onMovieClick(featured)}
            leadingIcon={<Play size={20} fill="currentColor" />}
            shape="buttonCut10"
            variant="solid">
              {t('common.watchNow')}
            </FacetButton>
          </div>
        </div>
      }

      <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-6">
        <FacetSectionHeader
          title={t('seriesPage.title')}
          titleClassName="text-4xl tracking-tight"
        />
        <form onSubmit={handleSearch} className="flex gap-2">
          <FacetField
            inputClassName="w-64 bg-white/5 py-2"
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('seriesPage.searchPlaceholder')}
            prefixIcon={<Search size={16} />}
            type="text"
            value={searchInput}
          />
          <FacetButton shape="buttonCut8" size="sm" type="submit" variant="outline">
            {t('common.search')}
          </FacetButton>
        </form>
      </div>

      <HorizontalCarousel
        className="mb-10 pb-2"
        contentClassName="flex min-w-max gap-3"
        scrollerClassName="py-1"
        buttonClassName="h-9 w-9"
      >
        {CATEGORIES.map((c, i) =>
        <FacetButton
          key={c.labelKey}
          onClick={() => {
            setActiveCategory(i);
            setSearchQuery('');
            setSearchInput('');
          }}
          className="whitespace-nowrap"
          size="sm"
          variant={activeCategory === i && !isSearching ? 'outline' : 'ghost'}>
            {t(c.labelKey)}
          </FacetButton>
        )}
      </HorizontalCarousel>

      {activeData.loading ?
      <GridSkeleton count={8} /> :
      activeData.error ?
      <ErrorState message={activeData.error} onRetry={activeData.refetch} /> :

      <>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
            {activeData.data.slice(1).map((s, index) =>
              <motion.div
                key={s.id}
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
                  delay: index * 0.03
                }}>
                <MovieCard
                  {...s}
                  className="w-full max-w-[220px] xl:max-w-[228px] 2xl:max-w-[236px]"
                  delay={0}
                  onClick={() => onMovieClick(s)}
                />
              </motion.div>
            )}
          </div>
          <LoadMoreSentinel
            canLoadMore={activeData.hasMore}
            className="mt-10 h-10"
            isLoadingMore={activeData.isLoadingMore}
            onLoadMore={activeData.loadMore} />
        </>
      }
    </motion.div>);

}
