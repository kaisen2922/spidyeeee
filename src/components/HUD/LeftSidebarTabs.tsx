import React from 'react';
import { useHeroStore } from '../../store/useHeroStore';
import type { SidebarTab } from '../../types/heroTracker';

export const LeftSidebarTabs: React.FC = () => {
  const { 
    selectedTab, 
    setSelectedTab, 
    hero,
    showGreenSightings,
    showRedIncidents,
    showBlueHotspots,
    toggleGreenSightings,
    toggleRedIncidents,
    toggleBlueHotspots
  } = useHeroStore();

  const tabs: { key: SidebarTab; label: string; tooltip: string }[] = [
    { key: 'O', label: 'O', tooltip: 'OPERATIONS COMMAND' },
    { key: 'S', label: 'S', tooltip: 'SENSORS & THREAT MATRIX' },
    { key: 'T', label: 'T', tooltip: 'TELEMETRY & SUIT DIAGNOSTICS' },
  ];

  return (
    <div className="absolute top-16 sm:top-20 left-2 sm:left-4 z-30 flex flex-col justify-between h-[calc(100%-8rem)] pointer-events-none">
      {/* Vertical Retro Pixel Tabs (O, S, T) & Spidey Sightings Filter Badges */}
      <div className="flex flex-col space-y-2 sm:space-y-3 pointer-events-auto">
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              title={tab.tooltip}
              className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center font-pixel text-xs sm:text-base font-bold transition-all shadow-xl cursor-pointer ${
                isActive
                  ? 'retro-tab-salmon ring-2 sm:ring-4 ring-rose-400 scale-105'
                  : 'bg-rose-900 border border-rose-950 text-rose-200 hover:bg-rose-800 hover:scale-100 opacity-80'
              }`}
            >
              {tab.label}
            </button>
          );
        })}

        <div className="w-full h-px bg-rose-500/30 my-1" />

        {/* Spidey Tracker Reference Buttons (Green, Red & Blue Pointer Filters) */}
        <button
          onClick={toggleGreenSightings}
          title={showGreenSightings ? "Hide Verified Patrol Pointers (🟢)" : "Show Verified Patrol Pointers (🟢)"}
          className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center border-2 p-1 shadow-xl cursor-pointer transition-all ${
            showGreenSightings 
              ? 'bg-emerald-600 border-white scale-105 shadow-[0_0_12px_#10b981]' 
              : 'bg-slate-900 border-slate-700 opacity-50 hover:opacity-100'
          }`}
        >
          <img src="/logo.png" alt="Green Sightings" className="w-full h-full object-contain drop-shadow" />
        </button>

        <button
          onClick={toggleRedIncidents}
          title={showRedIncidents ? "Hide Crime Signal Pointers (🔴)" : "Show Crime Signal Pointers (🔴)"}
          className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center border-2 p-1 shadow-xl cursor-pointer transition-all ${
            showRedIncidents 
              ? 'bg-rose-600 border-white scale-105 shadow-[0_0_12px_#f43f5e]' 
              : 'bg-slate-900 border-slate-700 opacity-50 hover:opacity-100'
          }`}
        >
          <img src="/logo.png" alt="Red Incidents" className="w-full h-full object-contain drop-shadow" />
        </button>

        <button
          onClick={toggleBlueHotspots}
          title={showBlueHotspots ? "Hide Major HQ Star Pointers (🔵)" : "Show Major HQ Star Pointers (🔵)"}
          className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center border-2 p-1 shadow-xl cursor-pointer transition-all ${
            showBlueHotspots 
              ? 'bg-sky-600 border-white scale-105 shadow-[0_0_12px_#38bdf8]' 
              : 'bg-slate-900 border-slate-700 opacity-50 hover:opacity-100'
          }`}
        >
          <img src="/logo.png" alt="Blue HQs" className="w-full h-full object-contain drop-shadow" />
        </button>
      </div>

      {/* Hero Circular Avatar Badge at Bottom Left - Hidden on small mobile to avoid bottom console collision */}
      <div className="hidden sm:flex pointer-events-auto flex-col items-center">
        <div 
          className="relative rounded-full bg-slate-950 border-4 border-rose-500 p-1 shadow-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform"
          style={{ width: '64px', height: '64px' }}
        >
          <div className="absolute inset-0 rounded-full border-2 border-rose-500 animate-ping opacity-30" />
          
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center relative overflow-hidden p-1">
            <img src="/logo.png" alt="Spider-Man Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>
        </div>
        <span className="font-pixel text-[9px] text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded border border-rose-500/40 mt-1 shadow">
          {hero.suitVersion}
        </span>
      </div>
    </div>
  );
};
