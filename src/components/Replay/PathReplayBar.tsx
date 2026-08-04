import React from 'react';
import { useHeroStore } from '../../store/useHeroStore';
import { Play, X, History } from 'lucide-react';

export const PathReplayBar: React.FC = () => {
  const { 
    hero, 
    isReplayActive, 
    toggleReplayMode, 
    replayStepIndex, 
    setReplayStepIndex,
    flyToCoords 
  } = useHeroStore();

  if (!isReplayActive) return null;

  const trail = hero.historyTrail;
  const maxSteps = Math.max(0, trail.length - 1);
  const currentPoint = trail[replayStepIndex] || trail[0];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value, 10);
    setReplayStepIndex(idx);
    if (trail[idx]) {
      flyToCoords(trail[idx].coords, 16);
    }
  };

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4 pointer-events-auto font-cyber">
      <div className="bg-slate-950/95 border-2 border-rose-500/80 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md text-xs">
        
        {/* Replay Header */}
        <div className="flex items-center justify-between border-b border-rose-500/30 pb-2 mb-2">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-rose-400 animate-spin" />
            <span className="font-orbitron font-bold text-rose-300">SPIDER-MAN PATH REPLAY MATRIX</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-amber-400 font-mono">STEP {replayStepIndex + 1} / {trail.length}</span>
            <button 
              onClick={toggleReplayMode}
              className="p-1 bg-rose-950 text-rose-300 rounded hover:bg-rose-900 border border-rose-600/50 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Replay Point Telemetry */}
        {currentPoint && (
          <div className="flex items-center justify-between bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-tech text-cyan-300 mb-2">
            <span>TIME: <strong className="text-slate-100">{currentPoint.timestamp}</strong></span>
            <span>ALTITUDE: <strong className="text-amber-300">{currentPoint.altitude} FT</strong></span>
            <span>COORDS: <strong className="text-cyan-400">[{currentPoint.coords[0].toFixed(4)}, {currentPoint.coords[1].toFixed(4)}]</strong></span>
          </div>
        )}

        {/* Slider Controls */}
        <div className="flex items-center space-x-3">
          <input
            type="range"
            min={0}
            max={maxSteps}
            value={replayStepIndex}
            onChange={handleSliderChange}
            className="flex-1 accent-rose-500 cursor-pointer h-2 bg-slate-900 rounded-lg border border-slate-700"
          />
          <button
            onClick={() => {
              const next = (replayStepIndex + 1) % trail.length;
              setReplayStepIndex(next);
              if (trail[next]) flyToCoords(trail[next].coords, 16);
            }}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1 rounded text-xs transition-colors cursor-pointer flex items-center space-x-1"
          >
            <Play className="w-3 h-3" />
            <span>STEP</span>
          </button>
        </div>

      </div>
    </div>
  );
};
