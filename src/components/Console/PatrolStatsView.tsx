import React from 'react';
import { useHeroStore } from '../../store/useHeroStore';
import { formatPatrolDuration } from '../../services/aiSimulator';
import { BarChart3, Route, Clock, Eye, ShieldCheck, Building2, MapPin, Zap, Navigation, X } from 'lucide-react';

export const PatrolStatsView: React.FC = () => {
  const { hero, setIsRightDrawerOpen } = useHeroStore();

  return (
    <div className="bg-slate-950/90 border-2 border-rose-500/50 rounded-xl p-4 shadow-2xl backdrop-blur-md font-cyber text-xs flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-rose-500/40 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-amber-400" />
          <span className="font-orbitron font-bold text-rose-300 tracking-wider">LIVE PATROL STATISTICS</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="font-tech text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40 hidden sm:inline">
            REAL-TIME TELEMETRY
          </span>
          <button
            onClick={() => setIsRightDrawerOpen(false)}
            className="p-1 rounded bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-colors"
            title="Close Panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 overflow-y-auto pr-1">
        
        {/* Distance Travelled Today */}
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-tech uppercase mb-1">
            <Route className="w-3.5 h-3.5 text-rose-400" />
            <span>DISTANCE TODAY</span>
          </div>
          <span className="text-base font-bold text-slate-100 font-mono">{hero.distanceTodayMiles} MILES</span>
        </div>

        {/* Current Patrol Duration */}
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-tech uppercase mb-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>PATROL DURATION</span>
          </div>
          <span className="text-base font-bold text-emerald-300 font-mono">{formatPatrolDuration(Math.floor(hero.patrolDurationMinutes))}</span>
        </div>

        {/* Incidents Observed */}
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-tech uppercase mb-1">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>INCIDENTS OBSERVED</span>
          </div>
          <span className="text-base font-bold text-amber-300 font-mono">{hero.incidentsObservedCount}</span>
        </div>

        {/* Incidents Responded To */}
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-tech uppercase mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>INCIDENTS RESPONDED</span>
          </div>
          <span className="text-base font-bold text-emerald-400 font-mono">{hero.incidentsRespondedCount}</span>
        </div>

        {/* Average Response Time */}
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-tech uppercase mb-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>AVG RESPONSE TIME</span>
          </div>
          <span className="text-base font-bold text-cyan-300 font-mono">1m 45s</span>
        </div>

        {/* Buildings Crossed */}
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-tech uppercase mb-1">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>BUILDINGS CROSSED</span>
          </div>
          <span className="text-base font-bold text-slate-100 font-mono">{hero.buildingsCrossedCount}</span>
        </div>

        {/* Top Patrol District */}
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-tech uppercase mb-1">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>TOP PATROL DISTRICT</span>
          </div>
          <span className="text-xs font-bold text-rose-300 truncate">Midtown Manhattan</span>
        </div>

        {/* Average Swing Speed */}
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-tech uppercase mb-1">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span>AVG SWING SPEED</span>
          </div>
          <span className="text-base font-bold text-cyan-300 font-mono">{hero.avgSpeed} MPH</span>
        </div>

        {/* Maximum Altitude */}
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-tech uppercase mb-1">
            <Navigation className="w-3.5 h-3.5 text-amber-400" />
            <span>MAXIMUM ALTITUDE</span>
          </div>
          <span className="text-base font-bold text-amber-300 font-mono">{hero.maxAltitude} FT</span>
        </div>

      </div>
    </div>
  );
};
