import React from 'react';
import { useHeroStore } from '../../store/useHeroStore';
import { formatPatrolDuration } from '../../services/aiSimulator';
import { X } from 'lucide-react';

export const TopRightMatrixLCD: React.FC = () => {
  const { hero, isLiveTrackingOpen, setIsLiveTrackingOpen } = useHeroStore();

  if (!isLiveTrackingOpen) return null;

  return (
    <div className="absolute top-14 sm:top-20 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-4 z-30 flex flex-col items-end pointer-events-auto font-cyber">
      {/* Mint Green Retro Matrix Display Container - LIVE TRACKING STATUS PANEL */}
      <div className="bg-slate-950/95 border-2 border-rose-500/80 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-2xl w-[90vw] sm:w-80 backdrop-blur-md text-xs">
        
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-rose-500/40 pb-2 mb-2.5">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-orbitron font-bold text-rose-300 tracking-wider">LIVE TRACKING</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="font-tech text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
              ONLINE
            </span>
            <button
              onClick={() => setIsLiveTrackingOpen(false)}
              className="p-1 rounded bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-colors"
              title="Close Telemetry Panel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Status Metrics List */}
        <div className="space-y-1.5 font-tech text-[11px]">
          
          {/* Current Status */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-1">
            <span className="text-slate-400">Current Status</span>
            <span className="font-bold text-emerald-400 uppercase">{hero.status}</span>
          </div>

          {/* Current Activity */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-1">
            <span className="text-slate-400">Current Activity</span>
            <span className="font-bold text-cyan-300 truncate max-w-[140px]">{hero.movementState}</span>
          </div>

          {/* Current District */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-1">
            <span className="text-slate-400">Current District</span>
            <span className="font-bold text-slate-100">{hero.district}</span>
          </div>

          {/* Speed & Altitude */}
          <div className="grid grid-cols-2 gap-2 border-b border-slate-800 pb-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Speed</span>
              <span className="font-bold text-amber-300 font-mono">{hero.speed} MPH</span>
            </div>
            <div className="flex justify-between border-l border-slate-800 pl-2">
              <span className="text-slate-400">Altitude</span>
              <span className="font-bold text-cyan-300 font-mono">{hero.altitude} FT</span>
            </div>
          </div>

          {/* Heading */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-1">
            <span className="text-slate-400">Heading</span>
            <span className="font-bold text-amber-400">{hero.headingDirectionName} ({hero.heading}°)</span>
          </div>

          {/* Current Building */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-1">
            <span className="text-slate-400">Current Building</span>
            <span className="font-bold text-slate-200 truncate max-w-[140px]">{hero.currentBuilding}</span>
          </div>

          {/* Patrol Time & Distance Today */}
          <div className="grid grid-cols-2 gap-2 border-b border-slate-800 pb-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Patrol Time</span>
              <span className="font-bold text-emerald-400 font-mono">{formatPatrolDuration(Math.floor(hero.patrolDurationMinutes))}</span>
            </div>
            <div className="flex justify-between border-l border-slate-800 pl-2">
              <span className="text-slate-400">Distance</span>
              <span className="font-bold text-rose-300 font-mono">{hero.distanceTodayMiles} Mi</span>
            </div>
          </div>

          {/* Last Seen */}
          <div className="flex justify-between items-center pt-0.5">
            <span className="text-slate-400">Last Seen</span>
            <span className="font-bold text-emerald-300">{hero.lastSeen}</span>
          </div>

        </div>

      </div>
    </div>
  );
};
