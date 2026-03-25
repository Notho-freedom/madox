import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HorizontalCarousel } from '../components/HorizontalCarousel';
import { LoadMoreSentinel } from '../components/LoadMoreSentinel';
import { MovieCard } from '../components/MovieCard';
import { FacetButton, FacetField, FacetSectionHeader } from '../components/design';
import { GridSkeleton, ErrorState } from '../components/LoadingSkeleton';
import { Search } from 'lucide-react';
import { useI18n } from '../i18n/useI18n';
import {
  usePopular,
  useTopRated,
  useNowPlaying,
  useDiscover,
  useTMDBSearch } from
'../hooks/useTMDB';
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
  labelKey: 'common.nowPlaying',
  hook: 'nowPlaying'
},
{
  labelKey: 'common.action',
  hook: 'genre',
  genreId: 28
},
{
  labelKey: 'common.scifi',
  hook: 'genre',
  genreId: 878
},
{
  labelKey: 'common.horror',
  hook: 'genre',
  genreId: 27
},
{
  labelKey: 'common.comedy',
  hook: 'genre',
  genreId: 35
},
{
  labelKey: 'common.drama',
  hook: 'genre',
  genreId: 18
},
{
  labelKey: 'common.animation',
  hook: 'genre',
  genreId: 16
},
{
  labelKey: 'common.thriller',
  hook: 'genre',
  genreId: 53
}] as
const;
interface MoviesPageProps {
  onMovieClick: (movie: MovieData) => void;
}
export function MoviesPage({ onMovieClick }: MoviesPageProps) {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const popular = usePopular('movie');
  const topRated = useTopRated('movie');
  const nowPlaying = useNowPlaying('movie');
  const cat = CATEGORIES[activeCategory];
  const genreId = 'genreId' in cat ? cat.genreId : 28;
  const genre = useDiscover('movie', genreId);
  const searchResults = useTMDBSearch(searchQuery, 'movie');
  const isSearching = searchQuery.length > 0;
  const activeData = isSearching ?
  searchResults :
  cat.hook === 'popular' ?
  popular :
  cat.hook === 'topRated' ?
  topRated :
  cat.hook === 'nowPlaying' ?
  nowPlaying :
  genre;
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
      
      <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-6">
        <div>
          <FacetSectionHeader
            className="mb-2"
            count={
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-400">
                {t('common.results', { count: activeData.data.length })}
              </span>
            }
            title={t('moviesPage.title')}
            titleClassName="text-5xl tracking-tight"
          />
          <p className="text-gray-400 ml-5 tracking-wide">
            {t('moviesPage.description')}
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <FacetField
            inputClassName="w-64 bg-white/5 py-2"
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('moviesPage.searchPlaceholder')}
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
            {activeData.data.map((movie, index) =>
              <motion.div
                key={movie.id}
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
                  {...movie}
                  className="w-full max-w-[220px] xl:max-w-[228px] 2xl:max-w-[236px]"
                  delay={0}
                  onClick={() => onMovieClick(movie)} />
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
