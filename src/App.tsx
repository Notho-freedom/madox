import React, { useState } from 'react';
import { CrystalBackground } from './components/CrystalBackground';
import { CrystalNavbar } from './components/CrystalNavbar';
import { CrystalSidePanel } from './components/CrystalSidePanel';
import { HeroSection } from './components/HeroSection';
import { GenreFilter } from './components/GenreFilter';
import { ContinueWatching } from './components/ContinueWatching';
import { MovieGrid } from './components/MovieGrid';
import { AnimatePresence } from 'framer-motion';
import { MoviesPage } from './pages/MoviesPage';
import { SeriesPage } from './pages/SeriesPage';
import { TrendingPage } from './pages/TrendingPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { SettingsPage } from './pages/SettingsPage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { PlayerPage } from './pages/PlayerPage';
export function App() {
  const [activePage, setActivePage] = useState('home');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const handleMovieClick = (movie: any) => {
    setSelectedMovie(movie);
    setIsPlayerOpen(false);
  };
  const handlePlay = () => {
    setIsPlayerOpen(true);
  };
  const handlePlayerBack = () => {
    setIsPlayerOpen(false);
  };
  const renderContent = () => {
    if (selectedMovie && !isPlayerOpen) {
      return (
        <MovieDetailPage
          movie={selectedMovie}
          onBack={() => setSelectedMovie(null)}
          onPlay={handlePlay} />);


    }
    switch (activePage) {
      case 'home':
        return (
          <>
            <HeroSection />
            <GenreFilter />
            <ContinueWatching />
            <MovieGrid onMovieClick={handleMovieClick} />
          </>);

      case 'movies':
        return <MoviesPage onMovieClick={handleMovieClick} />;
      case 'series':
        return <SeriesPage onMovieClick={handleMovieClick} />;
      case 'trending':
        return <TrendingPage />;
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
        }}
        onTogglePanel={() => setIsPanelOpen(true)} />

      }

      <CrystalSidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)} />
      

      <main className={`relative z-10 ${!isPlayerOpen ? 'pt-16' : ''}`}>
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </main>

      {/* Player Overlay */}
      <AnimatePresence>
        {isPlayerOpen && selectedMovie &&
        <PlayerPage movie={selectedMovie} onBack={handlePlayerBack} />
        }
      </AnimatePresence>

      {/* Global Vignette */}
      {!isPlayerOpen &&
      <div className="fixed inset-0 z-30 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,8,15,0.4)_100%)]" />
      }
    </div>);

}