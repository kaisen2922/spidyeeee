import React from 'react';
import { useHeroStore } from '../../store/useHeroStore';
import { ShieldAlert, CheckCircle2, Navigation, Radio, X } from 'lucide-react';

export const MissionFeedDrawer: React.FC = () => {
  const { activityLogs, hero, setIsRightDrawerOpen } = useHeroStore();

  return (
    <div className="bg-slate-950/90 border-2 border-rose-500/50 rounded-xl p-3 shadow-2xl backdrop-blur-md font-cyber text-xs flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-rose-500/40 pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span className="font-orbitron font-bold text-rose-300 tracking-wider">LIVE ACTIVITY FEED</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="font-tech text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 hidden sm:inline">
            REAL-TIME STREAM
          </span>
          <button
            onClick={() => setIsRightDrawerOpen(false)}
            className="p-1 rounded bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-colors"
            title="Close Live Feed Panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Current Objective Live Focus Box */}
      <div className="bg-rose-950/40 border border-rose-500/60 p-2.5 rounded-lg mb-3 shadow-inner">
        <div className="flex items-center justify-between text-[10px] text-rose-300 font-bold mb-1">
          <span>SPIDER-MAN CURRENT INTENT</span>
          <span className="bg-rose-900/90 px-1.5 py-0.5 rounded uppercase">{hero.status}</span>
        </div>
        <h4 className="font-bold text-slate-100 text-sm mb-1">{hero.currentObjective}</h4>
        <div className="flex items-center justify-between text-[11px] text-slate-300 font-tech">
          <span>{hero.district} ({hero.borough})</span>
          <span className="text-amber-400 font-mono font-bold">{hero.speed} MPH • {hero.altitude} FT</span>
        </div>
      </div>

      {/* Live Timeline Stream Entries */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {activityLogs.map((log) => {
          let icon = <Navigation className="w-3.5 h-3.5 text-cyan-400" />;
          let borderColor = 'border-cyan-500/20';
          let textColor = 'text-cyan-200';

          if (log.category === 'INCIDENT') {
            icon = <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
            borderColor = 'border-rose-500/40';
            textColor = 'text-rose-200';
          } else if (log.category === 'ROOFTOP') {
            icon = <Radio className="w-3.5 h-3.5 text-amber-400" />;
            borderColor = 'border-amber-500/40';
            textColor = 'text-amber-200';
          } else if (log.type === 'success') {
            icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
            borderColor = 'border-emerald-500/40';
            textColor = 'text-emerald-200';
          }

          return (
            <div
              key={log.id}
              className={`p-2 rounded bg-slate-900/80 border ${borderColor} flex items-start space-x-2 transition-all hover:bg-slate-900`}
            >
              <div className="mt-0.5 shrink-0">{icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-tech">
                  <span>{log.time}</span>
                  <span className="uppercase text-[9px] text-rose-400">{log.borough || log.category}</span>
                </div>
                <p className={`text-xs ${textColor} break-words mt-0.5 font-sans`}>{log.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
