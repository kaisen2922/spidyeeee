import React, { useState } from 'react';
import { useHeroStore } from '../../store/useHeroStore';
import type { BottomTab } from '../../types/heroTracker';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const BottomControlPanel: React.FC = () => {
  const { 
    bottomTab,
    setBottomTab,
    isRightDrawerOpen,
    setIsRightDrawerOpen,
    toggleReplayMode,
    isReplayActive,
    setIsAssistantOpen,
    setSelectedTab
  } = useHeroStore();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs: { key: BottomTab; label: string; mobileLabel: string; tooltip: string }[] = [
    { key: 'FEED', label: 'Live Feed', mobileLabel: 'Feed', tooltip: 'Continuous Live Activity Feed' },
    { key: 'HISTORY', label: 'Patrol History', mobileLabel: 'History', tooltip: 'View Patrol Route History' },
    { key: 'TIMELINE', label: 'Timeline', mobileLabel: 'Timeline', tooltip: 'Detailed Movement Timeline' },
    { key: 'INCIDENTS', label: 'Incidents', mobileLabel: 'Incidents', tooltip: 'Observed NYC Incidents' },
    { key: 'HEATMAP', label: 'Heat Map', mobileLabel: 'Heatmap', tooltip: 'District Patrol Density Heatmap' },
    { key: 'STATS', label: 'Statistics', mobileLabel: 'Stats', tooltip: 'Live Patrol Metrics & Stats' },
    { key: 'REPLAY', label: 'Replay', mobileLabel: 'Replay', tooltip: 'Scrub & Replay Historical Movement' },
    { key: 'SPIDER_NET', label: 'Spider-Net', mobileLabel: 'AI Net', tooltip: 'AI Intelligence Network' },
    { key: 'SCANNER', label: 'Scanner', mobileLabel: 'Scanner', tooltip: 'NYPD Radio Scanner Band' },
    { key: 'SETTINGS', label: 'Settings', mobileLabel: 'Settings', tooltip: 'Tracker Display Preferences' },
  ];

  const handleTabClick = (key: BottomTab) => {
    if (key === 'REPLAY') {
      toggleReplayMode();
    } else if (key === 'SPIDER_NET') {
      setIsAssistantOpen(true);
    } else if (key === 'FEED') {
      if (bottomTab === 'FEED' && isRightDrawerOpen) {
        setIsRightDrawerOpen(false);
      } else {
        setSelectedTab('O');
        setBottomTab('FEED');
        setIsRightDrawerOpen(true);
      }
    } else if (key === 'STATS') {
      if (bottomTab === 'STATS' && isRightDrawerOpen) {
        setIsRightDrawerOpen(false);
      } else {
        setSelectedTab('T');
        setBottomTab('STATS');
        setIsRightDrawerOpen(true);
      }
    } else {
      if (bottomTab === key && isRightDrawerOpen) {
        setIsRightDrawerOpen(false);
      } else {
        setBottomTab(key);
        setIsRightDrawerOpen(true);
      }
    }
  };

  return (
    <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto w-full max-w-5xl px-2 sm:px-4 font-cyber transition-all">
      {/* Control Grid with 10 Viewer Tabs matching specification */}
      <div className="bg-slate-950/95 border-2 sm:border-4 border-rose-500/70 p-1.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-2xl backdrop-blur-md relative">
        
        {/* Collapse / Expand Toggle Handle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-rose-500/60 text-rose-300 rounded-full p-0.5 shadow-lg hover:bg-rose-950 transition-all cursor-pointer z-10"
          title={isCollapsed ? 'Expand Bottom Control Bar' : 'Collapse Bottom Control Bar'}
        >
          {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {!isCollapsed && (
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 text-[8px] xs:text-[9px] sm:text-[10px]">
            {tabs.map((t) => {
              const isActive = bottomTab === t.key || (t.key === 'REPLAY' && isReplayActive);
              return (
                <button
                  key={t.key}
                  onClick={() => handleTabClick(t.key)}
                  title={t.tooltip}
                  className={`py-1.5 sm:py-2 px-0.5 sm:px-1 rounded-md sm:rounded-lg text-center font-bold tracking-wider transition-all cursor-pointer truncate ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-[0_0_12px_#f43f5e] border border-white scale-102 sm:scale-105'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-rose-950/70 hover:border-rose-500/50'
                  }`}
                >
                  <span className="hidden sm:inline">{t.label}</span>
                  <span className="sm:hidden">{t.mobileLabel}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
