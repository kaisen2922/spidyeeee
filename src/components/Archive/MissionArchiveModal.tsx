import React from 'react';
import { useHeroStore } from '../../store/useHeroStore';
import { X, CheckCircle2, Award } from 'lucide-react';

export const MissionArchiveModal: React.FC = () => {
  const { isArchiveOpen, setIsArchiveOpen, completedMissions } = useHeroStore();

  if (!isArchiveOpen) return null;

  const totalXP = completedMissions.reduce((acc, m) => acc + m.rewardXP, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md font-cyber">
      <div className="bg-slate-950 border-2 border-cyan-500/70 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[540px]">
        
        {/* Header */}
        <div className="bg-slate-900 px-4 py-3 border-b border-cyan-500/40 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-orbitron font-bold text-cyan-300 text-sm">MISSION ARCHIVES & REPUTATION</h3>
          </div>
          <button
            onClick={() => setIsArchiveOpen(false)}
            className="p-1 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Summary Row */}
        <div className="p-4 bg-slate-900/60 border-b border-slate-800 grid grid-cols-3 gap-3 text-center">
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 font-tech uppercase block">RESOLVED MISSIONS</span>
            <span className="text-lg font-bold text-emerald-400">{completedMissions.length}</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 font-tech uppercase block">TOTAL HERO XP</span>
            <span className="text-lg font-bold text-amber-400 font-mono">+{totalXP} XP</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 font-tech uppercase block">CITY RATING</span>
            <span className="text-lg font-bold text-cyan-300 font-mono">99.8%</span>
          </div>
        </div>

        {/* Resolved Missions Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {completedMissions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 italic text-xs">
              No archived missions yet. The hero is currently patrolling metropolis.
            </div>
          ) : (
            completedMissions.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-lg bg-slate-900 border border-emerald-500/30 flex items-start justify-between text-xs"
              >
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-100">{m.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{m.description}</p>
                    <span className="text-[10px] text-slate-500 font-tech mt-1 block">District: {m.district}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0 ml-2">
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded">
                    RESOLVED
                  </span>
                  <span className="text-amber-400 font-mono text-[11px] font-bold mt-1">+{m.rewardXP} XP</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
