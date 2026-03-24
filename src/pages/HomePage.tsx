import React, { useMemo } from 'react';
import { ContinueWatching } from '../components/ContinueWatching';
import { GenreFilter } from '../components/GenreFilter';
import { HeroSection } from '../components/HeroSection';
import { MovieGrid, type CategoryData } from '../components/MovieGrid';
import { type MovieData } from '../data/movies';
import { type HomeGenreId } from '../data/homeGenres';
import { useHomeBootstrap } from '../hooks/useHomeBootstrap';
import { type WatchHistoryEntry } from '../services/watchHistory';

interface HomePageProps {
  activeGenre: HomeGenreId;
  onGenreChange: (genre: HomeGenreId) => void;
  onHistoryOpen: () => void;
  onMovieClick: (movie: MovieData) => void;
  onPlay: (movie?: MovieData) => void | Promise<void>;
  onResumeHistoryItem: (entry: WatchHistoryEntry) => void;
  onViewAll: (category: CategoryData) => void;
}

export function HomePage({
  activeGenre,
  onGenreChange,
  onHistoryOpen,
  onMovieClick,
  onPlay,
  onResumeHistoryItem,
  onViewAll
}: HomePageProps) {
  const bootstrap = useHomeBootstrap(activeGenre);

  const initialPageDataBySection = useMemo(() => {
    if (!bootstrap.data?.primarySection) {
      return {};
    }

    return {
      [bootstrap.data.primarySection.id]: bootstrap.data.primarySection.page
    };
  }, [bootstrap.data]);

  return (
    <>
      <HeroSection
        activeGenre={activeGenre}
        bootstrapCandidates={bootstrap.data?.heroCandidates}
        bootstrapLoading={bootstrap.loading}
        onMovieClick={onMovieClick}
        onPlay={onPlay}
      />
      <GenreFilter activeGenre={activeGenre} onChange={onGenreChange} />
      <ContinueWatching
        onResumeMovie={onResumeHistoryItem}
        onViewAll={onHistoryOpen}
      />
      <MovieGrid
        activeGenre={activeGenre}
        initialPageDataBySection={initialPageDataBySection}
        onMovieClick={onMovieClick}
        onViewAll={onViewAll}
      />
    </>
  );
}
