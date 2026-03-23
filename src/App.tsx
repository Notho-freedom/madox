import React, { useState } from 'react';
import { CrystalBackground } from './components/CrystalBackground';
import { CrystalNavbar } from './components/CrystalNavbar';
import { CrystalSidePanel } from './components/CrystalSidePanel';
import { HeroSection } from './components/HeroSection';
import { GenreFilter } from './components/GenreFilter';
import { ContinueWatching } from './components/ContinueWatching';
import { MovieGrid, type CategoryData } from './components/MovieGrid';
import { AnimatePresence } from 'framer-motion';
import { MoviesPage } from './pages/MoviesPage';
import { SeriesPage } from './pages/SeriesPage';
import { TrendingPage } from './pages/TrendingPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { SettingsPage } from './pages/SettingsPage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { PlayerPage } from './pages/PlayerPage';
import { ViewAllPage } from './pages/ViewAllPage';
import { type MovieData } from './data/movies';
export function App() {
  const [activePage, setActivePage] = useState('home');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieData | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [viewAllCategory, setViewAllCategory] = useState<CategoryData | null>(
    null
  );
  const handleMovieClick = (movie: MovieData) => {
    setSelectedMovie(movie);
    setIsPlayerOpen(false);
    setViewAllCategory(null);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const handlePlay = () => {
    setIsPlayerOpen(true);
  };
  const handlePlayerBack = () => {
    setIsPlayerOpen(false);
  };
  const handleViewAll = (category: CategoryData) => {
    setViewAllCategory(category);
    setSelectedMovie(null);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const handleViewAllBack = () => {
    setViewAllCategory(null);
  };
  const renderContent = () => {
    // Player takes over everything
    if (selectedMovie && isPlayerOpen) return null;
    // Movie detail page
    if (selectedMovie && !isPlayerOpen) {
      return (
        <MovieDetailPage
          movie={selectedMovie}
          onBack={() => setSelectedMovie(null)}
          onPlay={handlePlay}
          onMovieClick={handleMovieClick} />);


    }
    // View All page (from home sections)
    if (viewAllCategory) {
      return (
        <ViewAllPage
          title={viewAllCategory.title}
          description={viewAllCategory.description}
          items={viewAllCategory.items}
          onBack={handleViewAllBack}
          onMovieClick={handleMovieClick} />);


    }
    switch (activePage) {
      case 'home':
        return (
          <>
            <HeroSection />
            <GenreFilter />
            <ContinueWatching />
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

      {!isPlayerOpen &&
      <CrystalNavbar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          setSelectedMovie(null);
          setIsPlayerOpen(false);
          setViewAllCategory(null);
          window.scrollTo({
            top: 0
          });
        }}
        onTogglePanel={() => setIsPanelOpen(true)} />

      }

      <CrystalSidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)} />
      

      <main className={`relative z-10 ${!isPlayerOpen ? 'pt-16' : ''}`}>
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </main>

      <AnimatePresence>
        {isPlayerOpen && selectedMovie &&
        <PlayerPage movie={selectedMovie} onBack={handlePlayerBack} />
        }
      </AnimatePresence>

      {!isPlayerOpen &&
      <div className="fixed inset-0 z-30 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,8,15,0.4)_100%)]" />
      }
    </div>);

}