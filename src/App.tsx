import React, { useEffect, useState } from 'react';
import { useHeroStore } from './store/useHeroStore';
import { TopHUDBar } from './components/HUD/TopHUDBar';
import { TopRightMatrixLCD } from './components/HUD/TopRightMatrixLCD';
import { VicinityAlertBanner } from './components/HUD/VicinityAlertBanner';
import { LeftSidebarTabs } from './components/HUD/LeftSidebarTabs';
import { BottomControlPanel } from './components/HUD/BottomControlPanel';
import { LiveCityMap } from './components/Map/LiveCityMap';
import { TacticalRadar } from './components/Radar/TacticalRadar';
import { MissionFeedDrawer } from './components/Feed/MissionFeedDrawer';
import { AIPredictionCard } from './components/Prediction/AIPredictionCard';
import { AIAssistantModal } from './components/Assistant/AIAssistantModal';
import { DistrictSearchModal } from './components/Search/DistrictSearchModal';
import { MissionArchiveModal } from './components/Archive/MissionArchiveModal';
import { PathReplayBar } from './components/Replay/PathReplayBar';
import { PatrolHistoryView } from './components/Console/PatrolHistoryView';
import { PatrolStatsView } from './components/Console/PatrolStatsView';

export const App: React.FC = () => {
  const { tickSimulation, selectedTab, bottomTab, isRightDrawerOpen, isLiveTrackingOpen } = useHeroStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut ⌘K or Ctrl+K to trigger Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main Simulation Loop (runs every 1.2s)
  useEffect(() => {
    const interval = setInterval(() => {
      tickSimulation();
    }, 1200);
    return () => clearInterval(interval);
  }, [tickSimulation]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-cyan-100 flex flex-col font-cyber select-none">
      {/* Scanline CRT overlay */}
      <div className="absolute inset-0 scanline-overlay z-40 pointer-events-none" />

      {/* Top HUD Bar */}
      <TopHUDBar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* 30-Minute Web-Trail Replay Bar */}
      <PathReplayBar />

      {/* Main Map View Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        
        {/* Fullscreen Map Engine */}
        <LiveCityMap />

        {/* Current Status Panel (Top-Right Matrix LCD Box) */}
        <TopRightMatrixLCD />

        {/* Top-Center Vicinity Alert Banner */}
        <VicinityAlertBanner />

        {/* Left Sidebar Tabs (O, S, T) */}
        <LeftSidebarTabs />

        {/* Dynamic Right Floating Intelligence Drawer */}
        {isRightDrawerOpen && (
          <div 
            className={`absolute left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-4 z-30 w-[92vw] sm:w-96 pointer-events-auto transition-all duration-300 ${
              isLiveTrackingOpen 
                ? 'top-[260px] sm:top-[270px] max-h-[calc(100vh-21rem)] sm:max-h-[calc(100vh-22rem)]' 
                : 'top-14 sm:top-20 max-h-[calc(100vh-10rem)] sm:max-h-[calc(100vh-14rem)]'
            }`}
          >
            {bottomTab === 'HISTORY' ? (
              <PatrolHistoryView />
            ) : bottomTab === 'STATS' || selectedTab === 'T' ? (
              <PatrolStatsView />
            ) : selectedTab === 'S' ? (
              <AIPredictionCard />
            ) : (
              <MissionFeedDrawer />
            )}
          </div>
        )}

        {/* Bottom-Right Tactical Radar Widget */}
        <TacticalRadar />

        {/* Bottom Viewer Control Console Tabs */}
        <BottomControlPanel />

      </div>

      {/* Modals & Overlay Windows */}
      <AIAssistantModal />
      <DistrictSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MissionArchiveModal />
    </div>
  );
};

export default App;
