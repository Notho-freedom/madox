import React, { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CrystalBackground } from './components/CrystalBackground';
import { CrystalMenuTrigger } from './components/CrystalMenuTrigger';
import { CrystalSidePanel } from './components/CrystalSidePanel';
import { CrystalSidebar } from './components/CrystalSidebar';
import { DesktopWindowControls } from './components/DesktopWindowControls';
import { type CategoryData } from './components/MovieGrid';
import { defaultHomeGenreId, type HomeGenreId } from './data/homeGenres';
import { type MovieData } from './data/movies';
import { type NavPageId } from './navigation/primaryNav';
import { HomePage } from './pages/HomePage';
import { HistoryPage } from './pages/HistoryPage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { MoviesPage } from './pages/MoviesPage';
import { PlayerPage } from './pages/PlayerPage';
import { SeriesPage } from './pages/SeriesPage';
import { SettingsPage } from './pages/SettingsPage';
import { TrendingPage } from './pages/TrendingPage';
import { ViewAllPage } from './pages/ViewAllPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { getTrailerId } from './services/tmdb';
import { type WatchHistoryEntry } from './services/watchHistory';

export function App() {
  const [activePage, setActivePage] = useState<NavPageId>('home');
  const [activeHomeGenre, setActiveHomeGenre] =
    useState<HomeGenreId>(defaultHomeGenreId);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieData | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [viewAllCategory, setViewAllCategory] = useState<CategoryData | null>(
    null
  );
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const handleMovieClick = (movie: MovieData) => {
    setSelectedMovie(movie);
    setIsPlayerOpen(false);
    setIsPanelOpen(false);
    setIsHistoryOpen(false);
    setViewAllCategory(null);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const handlePlay = useCallback(
    async (movie?: MovieData) => {
      const target = movie || selectedMovie;
      if (!target) {
        return;
      }

      if (target.videoId) {
        setSelectedMovie(target);
        setIsPanelOpen(false);
        setIsHistoryOpen(false);
        setIsPlayerOpen(true);
        return;
      }

      setIsLoadingTrailer(true);

      try {
        const tmdbId = target.tmdbId || parseInt(target.id);
        const mediaType = target.mediaType || 'movie';
        const trailerId = await getTrailerId(mediaType, tmdbId);
        if (trailerId) {
          const updatedMovie = {
            ...target,
            videoId: trailerId
          };
          setSelectedMovie(updatedMovie);
          setIsPanelOpen(false);
          setIsHistoryOpen(false);
          setIsPlayerOpen(true);
        }
      } catch (err) {
        console.error('Failed to fetch trailer:', err);
      } finally {
        setIsLoadingTrailer(false);
      }
    },
    [selectedMovie]
  );

  const handlePlayerBack = () => {
    setIsPlayerOpen(false);
  };

  const handleViewAll = (category: CategoryData) => {
    setViewAllCategory(category);
    setIsPanelOpen(false);
    setIsHistoryOpen(false);
    setSelectedMovie(null);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleViewAllBack = () => {
    setViewAllCategory(null);
  };

  const handleHistoryOpen = () => {
    setIsHistoryOpen(true);
    setIsPanelOpen(false);
    setSelectedMovie(null);
    setViewAllCategory(null);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleHistoryBack = () => {
    setIsHistoryOpen(false);
  };

  const handleResumeHistoryItem = useCallback(
    (entry: WatchHistoryEntry) => {
      setIsHistoryOpen(false);
      setIsPanelOpen(false);
      setViewAllCategory(null);

      if (entry.videoId) {
        setSelectedMovie(entry);
        setIsPlayerOpen(true);
        return;
      }

      void handlePlay(entry);
    },
    [handlePlay]
  );

  const handleNavigate = useCallback((page: NavPageId) => {
    setActivePage(page);
    setIsPanelOpen(false);
    setIsHistoryOpen(false);
    setSelectedMovie(null);
    setIsPlayerOpen(false);
    setViewAllCategory(null);
    window.scrollTo({
      top: 0
    });
  }, []);

  const renderContent = () => {
    if (selectedMovie && isPlayerOpen) {
      return null;
    }

    if (selectedMovie && !isPlayerOpen) {
      return (
        <MovieDetailPage
          movie={selectedMovie}
          onBack={() => setSelectedMovie(null)}
          onPlay={() => handlePlay()}
          onMovieClick={handleMovieClick}
        />
      );
    }

    if (isHistoryOpen) {
      return (
        <HistoryPage
          onBack={handleHistoryBack}
          onMovieClick={handleMovieClick}
          onResume={handleResumeHistoryItem}
        />
      );
    }

    if (viewAllCategory) {
      return (
        <ViewAllPage
          title={viewAllCategory.title}
          description={viewAllCategory.description}
          source={viewAllCategory.source}
          onBack={handleViewAllBack}
          onMovieClick={handleMovieClick}
        />
      );
    }

    switch (activePage) {
      case 'home':
        return (
          <HomePage
            activeGenre={activeHomeGenre}
            onGenreChange={setActiveHomeGenre}
            onHistoryOpen={handleHistoryOpen}
            onMovieClick={handleMovieClick}
            onPlay={handlePlay}
            onResumeHistoryItem={handleResumeHistoryItem}
            onViewAll={handleViewAll}
          />
        );
      case 'movies':
        return <MoviesPage onMovieClick={handleMovieClick} />;
      case 'series':
        return <SeriesPage onMovieClick={handleMovieClick} />;
      case 'trending':
        return <TrendingPage onMovieClick={handleMovieClick} />;
      case 'watchlist':
        return <WatchlistPage onMovieClick={handleMovieClick} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full text-white selection:bg-cyan-500/30 selection:text-cyan-100">
      <CrystalBackground />
      <DesktopWindowControls />

      {!isPlayerOpen && (
        <>
          <CrystalSidebar
            activePage={activePage}
            onNavigate={handleNavigate}
          />
          <div className="fixed left-6 top-6 z-50 md:hidden">
            <CrystalMenuTrigger
              className="h-12 w-12 overflow-hidden"
              onClick={() => setIsPanelOpen(true)}
            />
          </div>
        </>
      )}

      {!isPlayerOpen && (
        <CrystalSidePanel
          activePage={activePage}
          isOpen={isPanelOpen}
          onNavigate={handleNavigate}
          onClose={() => setIsPanelOpen(false)}
        />
      )}

      <main className={`relative z-10 ${!isPlayerOpen ? 'md:pl-24' : ''}`}>
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </main>

      <AnimatePresence>
        {isPlayerOpen && selectedMovie && selectedMovie.videoId && (
          <PlayerPage movie={selectedMovie} onBack={handlePlayerBack} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoadingTrailer && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80"
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
          >
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
              <p className="text-gray-400 uppercase tracking-widest text-sm">
                Loading trailer...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isPlayerOpen && (
        <div className="fixed inset-0 z-30 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,8,15,0.4)_100%)]" />
      )}
    </div>
  );
}
