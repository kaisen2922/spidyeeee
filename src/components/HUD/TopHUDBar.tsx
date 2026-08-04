import React, { useState, useEffect } from 'react';
import { useHeroStore } from '../../store/useHeroStore';
import { 
  ShieldAlert, 
  Activity, 
  Volume2, 
  VolumeX, 
  Search, 
  Clock, 
  Radio,
  Navigation,
  RadioTower,
  Sun,
  Rss,
  Gauge
} from 'lucide-react';

interface TopHUDBarProps {
  onOpenSearch: () => void;
}

export const TopHUDBar: React.FC<TopHUDBarProps> = ({ onOpenSearch }) => {
  const { 
    hero, 
    activeMissions, 
    isSoundMuted, 
    toggleSound, 
    policeScannerChatter,
    isRightDrawerOpen,
    toggleRightDrawer,
    isLiveTrackingOpen,
    toggleLiveTracking
  } = useHeroStore();

  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-950/95 border-b-2 border-rose-500/50 px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between shadow-2xl relative z-40 backdrop-blur-md font-cyber text-xs">
      
      {/* Left Section: Spider-Man Status & Weather */}
      <div className="flex items-center space-x-1.5 sm:space-x-4">
        <div className="flex items-center space-x-2">
          {/* Spider-Man Logo Image Badge */}
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-rose-500 bg-slate-950 p-0.5 flex items-center justify-center shadow-[0_0_12px_#f43f5e] shrink-0 overflow-hidden">
            <img src="/logo.png" alt="Spider-Man Logo" className="w-full h-full object-contain drop-shadow" style={{ width: '100%', height: '100%', display: 'block' }} />
          </div>
          <span className="font-orbitron font-black text-rose-400 tracking-wider text-[11px] sm:text-sm truncate max-w-[120px] sm:max-w-none">
            SPIDER-MAN <span className="text-emerald-400 font-mono hidden xs:inline">[{hero.status}]</span>
          </span>
        </div>

        {/* Search District/Borough trigger button */}
        <button
          onClick={onOpenSearch}
          className="p-1 sm:px-2 sm:py-1 bg-slate-900 hover:bg-rose-950 rounded border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-white transition-colors cursor-pointer text-[10px] flex items-center space-x-1"
          title="Search NYC Boroughs or Incidents (⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">Search NYC</span>
        </button>

        {/* Current Time */}
        <div className="hidden lg:flex items-center space-x-1.5 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800 font-tech text-cyan-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{timeStr || '23:57:02'}</span>
          <span className="text-slate-500">EST</span>
        </div>

        {/* Weather */}
        <div className="hidden md:flex items-center space-x-1 bg-slate-900/80 px-2 py-1 rounded border border-slate-800 text-amber-300 font-tech">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>Clear 68°F</span>
        </div>
      </div>

      {/* Center Section: District, Speed, Altitude, Heading & Scanner */}
      <div className="hidden xl:flex items-center space-x-4 bg-slate-900/90 px-4 py-1.5 rounded-full border border-rose-500/40 shadow-inner">
        <div className="flex items-center space-x-1.5">
          <Navigation className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-slate-400">DISTRICT:</span>
          <span className="font-bold text-slate-100">{hero.district}</span>
        </div>

        <div className="w-px h-3.5 bg-slate-800" />

        <div className="flex items-center space-x-1.5">
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">SPEED:</span>
          <span className="font-mono font-bold text-cyan-300">{hero.speed} MPH</span>
        </div>

        <div className="w-px h-3.5 bg-slate-800" />

        <div className="flex items-center space-x-1.5">
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">ALTITUDE:</span>
          <span className="font-mono font-bold text-amber-300">{hero.altitude} FT</span>
        </div>

        <div className="w-px h-3.5 bg-slate-800" />

        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400">HEADING:</span>
          <span className="font-bold text-emerald-400">{hero.headingDirectionName}</span>
        </div>

        <div className="w-px h-3.5 bg-slate-800" />

        {/* Police Scanner Ticker */}
        <div className="flex items-center space-x-1.5 text-[11px] text-amber-200/90 font-tech">
          <RadioTower className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="truncate max-w-[180px]">{policeScannerChatter}</span>
        </div>
      </div>

      {/* Right Section: Panel Toggles, Active Incidents Count & Sound */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Toggle Live Activity Feed Panel */}
        <button
          onClick={toggleRightDrawer}
          className={`p-1.5 sm:px-2.5 sm:py-1 rounded border text-[11px] font-tech transition-all cursor-pointer flex items-center space-x-1 ${
            isRightDrawerOpen 
              ? 'bg-rose-600 text-white border-white shadow-[0_0_10px_#f43f5e] font-bold' 
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-rose-950/70 hover:border-rose-500/50'
          }`}
          title={isRightDrawerOpen ? 'Close Live Activity Feed Panel' : 'Open Live Activity Feed Panel'}
        >
          <Rss className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">LIVE FEED</span>
        </button>

        {/* Toggle Telemetry Matrix LCD Panel */}
        <button
          onClick={toggleLiveTracking}
          className={`p-1.5 sm:px-2.5 sm:py-1 rounded border text-[11px] font-tech transition-all cursor-pointer flex items-center space-x-1 ${
            isLiveTrackingOpen 
              ? 'bg-emerald-600 text-white border-white shadow-[0_0_10px_#10b981] font-bold' 
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-emerald-950/70 hover:border-emerald-500/50'
          }`}
          title={isLiveTrackingOpen ? 'Close Live Telemetry Panel' : 'Open Live Telemetry Panel'}
        >
          <Gauge className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">TELEMETRY</span>
        </button>

        {/* Active Incidents Badge */}
        <div className="flex items-center space-x-1 bg-rose-950/70 px-1.5 sm:px-2.5 py-1 rounded border border-rose-500/50 text-rose-300 font-tech">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="text-slate-400 hidden md:inline">INCIDENTS:</span>
          <span className="font-bold text-rose-400 text-xs">{activeMissions.length}</span>
        </div>

        {/* 60 FPS Network Badge */}
        <div className="hidden md:flex items-center space-x-1 text-emerald-400 font-tech text-[10px] bg-slate-900 px-2 py-1 rounded border border-slate-800">
          <span>60 FPS</span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className={`p-1.5 rounded border transition-all cursor-pointer ${
            isSoundMuted 
              ? 'bg-red-950/70 border-red-600/50 text-red-400 hover:bg-red-900' 
              : 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900'
          }`}
          title={isSoundMuted ? 'Unmute SFX Audio' : 'Mute SFX Audio'}
        >
          {isSoundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
