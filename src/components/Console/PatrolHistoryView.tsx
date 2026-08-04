import React from 'react';
import { useHeroStore } from '../../store/useHeroStore';
import type { HistoryRange } from '../../types/heroTracker';
import { Building2, History, X } from 'lucide-react';

export const PatrolHistoryView: React.FC = () => {
  const { hero, historyRange, setHistoryRange, flyToCoords, setIsRightDrawerOpen } = useHeroStore();

  const ranges: { key: HistoryRange; label: string }[] = [
    { key: '10m', label: 'Last 10 Min' },
    { key: '1h', label: 'Last 1 Hour' },
    { key: 'Today', label: 'Today' },
    { key: 'Yesterday', label: 'Yesterday' },
  ];

  return (
    <div className="bg-slate-950/90 border-2 border-rose-500/50 rounded-xl p-3 sm:p-4 shadow-2xl backdrop-blur-md font-cyber text-xs flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-rose-500/40 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-rose-400" />
          <span className="font-orbitron font-bold text-rose-300 tracking-wider">PATROL HISTORY</span>
        </div>
        <div className="flex items-center space-x-1.5">
          {ranges.map((r) => (
            <button
              key={r.key}
              onClick={() => setHistoryRange(r.key)}
              className={`px-2 py-0.5 rounded text-[10px] font-tech cursor-pointer transition-colors ${
                historyRange === r.key
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
          <button
            onClick={() => setIsRightDrawerOpen(false)}
            className="p-1 rounded bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-colors"
            title="Close Panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Historical Breadcrumb Rooftops Feed */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {hero.historyTrail.map((point, idx) => (
          <div
            key={idx}
            onClick={() => flyToCoords(point.coords, 16)}
            className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 flex items-center justify-between cursor-pointer transition-all text-xs"
          >
            <div className="flex items-center space-x-2.5">
              <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-100">{point.buildingName || 'NYC High-Rise Rooftop'}</h4>
                <div className="text-[10px] text-slate-400 font-tech">Coords: [{point.coords[0].toFixed(4)}, {point.coords[1].toFixed(4)}]</div>
              </div>
            </div>
            <div className="flex flex-col items-end text-[10px] font-tech">
              <span className="text-cyan-300 font-bold">{point.altitude} FT</span>
              <span className="text-slate-500">{point.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
