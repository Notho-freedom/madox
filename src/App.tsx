import React, { useCallback, useState } from 'react';
import { CrystalBackground } from './components/CrystalBackground';
import { CrystalMenuTrigger } from './components/CrystalMenuTrigger';
import { CrystalSidePanel } from './components/CrystalSidePanel';
import { CrystalSidebar } from './components/CrystalSidebar';
import { DesktopWindowControls } from './components/DesktopWindowControls';
import { HeroSection } from './components/HeroSection';
import { GenreFilter } from './components/GenreFilter';
import { ContinueWatching } from './components/ContinueWatching';
import { MovieGrid, type CategoryData } from './components/MovieGrid';
import { AnimatePresence, motion } from 'framer-motion';
import { MoviesPage } from './pages/MoviesPage';
import { SeriesPage } from './pages/SeriesPage';
import { TrendingPage } from './pages/TrendingPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { SettingsPage } from './pages/SettingsPage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { PlayerPage } from './pages/PlayerPage';
import { ViewAllPage } from './pages/ViewAllPage';
import { type MovieData } from './data/movies';
import { getTrailerId } from './services/tmdb';
import { type NavPageId } from './navigation/primaryNav';
export function App() {
  const [activePage, setActivePage] = useState<NavPageId>('home');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieData | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [viewAllCategory, setViewAllCategory] = useState<CategoryData | null>(
    null
  );
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const handleMovieClick = (movie: MovieData) => {
    setSelectedMovie(movie);
    setIsPlayerOpen(false);
    setIsPanelOpen(false);
    setViewAllCategory(null);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const handlePlay = useCallback(
    async (movie?: MovieData) => {
      const target = movie || selectedMovie;
      if (!target) return;
      // If we already have a videoId, play immediately
      if (target.videoId) {
        setSelectedMovie(target);
        setIsPanelOpen(false);
        setIsPlayerOpen(true);
        return;
      }
      // Fetch trailer from TMDB
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
    setSelectedMovie(null);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const handleViewAllBack = () => {
    setViewAllCategory(null);
  };
  const handleNavigate = useCallback((page: NavPageId) => {
    setActivePage(page);
    setIsPanelOpen(false);
    setSelectedMovie(null);
    setIsPlayerOpen(false);
    setViewAllCategory(null);
    window.scrollTo({
      top: 0
    });
  }, []);
  const renderContent = () => {
    if (selectedMovie && isPlayerOpen) return null;
    if (selectedMovie && !isPlayerOpen) {
      return (
        <MovieDetailPage
          movie={selectedMovie}
          onBack={() => setSelectedMovie(null)}
          onPlay={() => handlePlay()}
          onMovieClick={handleMovieClick} />);


    }
    if (viewAllCategory) {
      return (
        <ViewAllPage
          title={viewAllCategory.title}
          description={viewAllCategory.description}
          source={viewAllCategory.source}
          onBack={handleViewAllBack}
          onMovieClick={handleMovieClick} />);


    }
    switch (activePage) {
      case 'home':
        return (
          <>
            <HeroSection onMovieClick={handleMovieClick} onPlay={handlePlay} />
            <GenreFilter />
            <ContinueWatching onMovieClick={handleMovieClick} />
            <MovieGrid
              onMovieClick={handleMovieClick}
              onViewAll={handleViewAll} />
            
          </>);

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

      {!isPlayerOpen &&
      <>
          <CrystalSidebar
            activePage={activePage}
            onNavigate={handleNavigate}
          />
          <div className="fixed left-6 top-6 z-50 md:hidden">
            <CrystalMenuTrigger className="h-12 w-12 overflow-hidden" onClick={() => setIsPanelOpen(true)} />
          </div>
        </>
      }

      {!isPlayerOpen &&
      <CrystalSidePanel
        activePage={activePage}
        isOpen={isPanelOpen}
        onNavigate={handleNavigate}
        onClose={() => setIsPanelOpen(false)} />
      }
      

      <main className={`relative z-10 ${!isPlayerOpen ? 'md:pl-24' : ''}`}>
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </main>

      <AnimatePresence>
        {isPlayerOpen && selectedMovie && selectedMovie.videoId &&
        <PlayerPage movie={selectedMovie} onBack={handlePlayerBack} />
        }
      </AnimatePresence>

      {/* Trailer loading overlay */}
      <AnimatePresence>
        {isLoadingTrailer &&
        <motion.div
          className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}>
          
            <div className="text-center">
              <div className="w-16 h-16 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400 uppercase tracking-widest text-sm">
                Loading trailer...
              </p>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {!isPlayerOpen &&
      <div className="fixed inset-0 z-30 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,8,15,0.4)_100%)]" />
      }
    </div>);

}
