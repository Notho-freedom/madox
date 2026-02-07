import React, { useState } from 'react';
import { CrystalBackground } from './components/CrystalBackground';
import { CrystalSidebar } from './components/CrystalSidebar';
import { CrystalHeader } from './components/CrystalHeader';
import { HeroSection } from './components/HeroSection';
import { GenreFilter } from './components/GenreFilter';
import { ContinueWatching } from './components/ContinueWatching';
import { MovieGrid } from './components/MovieGrid';
import { MovieDetailPanel } from './components/MovieDetailPanel';
// Import Pages
import { MoviesPage } from './pages/MoviesPage';
import { SeriesPage } from './pages/SeriesPage';
import { TrendingPage } from './pages/TrendingPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { SettingsPage } from './pages/SettingsPage';
export function App() {
  const [activePage, setActivePage] = useState('home');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return (
          <>
            <HeroSection />
            <GenreFilter />
            <ContinueWatching />
            <MovieGrid />
          </>);

      case 'movies':
        return <MoviesPage />;
      case 'series':
        return <SeriesPage />;
      case 'trending':
        return <TrendingPage />;
      case 'watchlist':
        return <WatchlistPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen w-full text-white selection:bg-cyan-500/30 selection:text-cyan-100">
      <CrystalBackground />

      <div className="flex">
        <CrystalSidebar activePage={activePage} onNavigate={setActivePage} />

        <main className="flex-1 ml-24 relative z-10">
          <CrystalHeader />
          {renderContent()}
        </main>
      </div>

      {/* Detail Panel Overlay */}
      <MovieDetailPanel
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)} />


      {/* Global Vignette */}
      <div className="fixed inset-0 z-40 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,8,15,0.4)_100%)]" />

      {/* Demo Toggle for Panel (Only show on Home) */}
      {activePage === 'home' && !isDetailOpen &&
      <button
        onClick={() => setIsDetailOpen(true)}
        className="fixed bottom-8 right-8 z-50 px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 backdrop-blur-md transition-all uppercase tracking-widest text-sm font-bold"
        style={{
          clipPath:
          'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
        }}>

          Open Demo Panel
        </button>
      }
    </div>);

}