import React from 'react';
import { useHeroStore } from '../../store/useHeroStore';
import { getDistanceKm } from '../../services/aiSimulator';

export const TacticalRadar: React.FC = () => {
  const { hero, units, activeMissions } = useHeroStore();

  return (
    <div className="absolute bottom-20 right-4 z-30 pointer-events-auto hidden md:block font-cyber">
      {/* Spider Radar Frame */}
      <div className="relative w-44 h-44 bg-slate-950/95 border-2 border-rose-500/80 rounded-full shadow-2xl overflow-hidden backdrop-blur-md">
        
        {/* Animated 360 Sweep Line */}
        <div className="absolute inset-0 rounded-full animate-spin origin-center pointer-events-none" style={{ animationDuration: '4s' }}>
          <div className="w-1/2 h-1/2 bg-gradient-to-tr from-rose-500/40 to-transparent border-r border-rose-400" />
        </div>

        {/* Concentric Web Grid Rings */}
        <div className="absolute inset-2 border border-rose-500/20 rounded-full" />
        <div className="absolute inset-6 border border-rose-500/30 rounded-full" />
        <div className="absolute inset-12 border border-rose-500/40 rounded-full" />
        
        {/* Crosshair Lines */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-rose-500/30" />
        <div className="absolute left-0 right-0 top-1/2 h-px bg-rose-500/30" />

        {/* Center Spider-Man Marker Dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-rose-600 rounded-full border-2 border-white shadow-[0_0_10px_#f43f5e] z-10 animate-pulse" />

        {/* Tactical Emergency Unit Blips */}
        {units.map((unit) => {
          const dist = getDistanceKm(hero.position, unit.position);
          if (dist > 4) return null;

          const dx = (unit.position[1] - hero.position[1]) * 1800;
          const dy = (hero.position[0] - unit.position[0]) * 1800;

          const clampX = Math.max(-65, Math.min(65, dx));
          const clampY = Math.max(-65, Math.min(65, dy));

          return (
            <div
              key={unit.id}
              className="absolute w-2 h-2 rounded-full bg-cyan-400 border border-white"
              style={{
                top: `calc(50% + ${clampY}px)`,
                left: `calc(50% + ${clampX}px)`
              }}
              title={`${unit.name} (${unit.callsign})`}
            />
          );
        })}

        {/* Incident Target Blips */}
        {activeMissions.map((m) => {
          const dist = getDistanceKm(hero.position, m.location);
          if (dist > 5) return null;

          const dx = (m.location[1] - hero.position[1]) * 1800;
          const dy = (hero.position[0] - m.location[0]) * 1800;

          const clampX = Math.max(-65, Math.min(65, dx));
          const clampY = Math.max(-65, Math.min(65, dy));

          return (
            <div
              key={m.id}
              className="absolute w-2.5 h-2.5 rounded-full bg-amber-400 border border-rose-500 animate-ping"
              style={{
                top: `calc(50% + ${clampY}px)`,
                left: `calc(50% + ${clampX}px)`
              }}
              title={`[${m.borough}] ${m.title}`}
            />
          );
        })}

        {/* Footer Label */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-rose-300 font-tech uppercase tracking-widest bg-slate-950/80 px-1.5 py-0.5 rounded border border-rose-500/40">
          SPIDER-RADAR
        </div>

      </div>
    </div>
  );
};
