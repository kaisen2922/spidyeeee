import React from 'react';
import { useHeroStore } from '../../store/useHeroStore';
import { BrainCircuit, Compass, ShieldCheck, Route, Shield, X } from 'lucide-react';

export const AIPredictionCard: React.FC = () => {
  const { prediction, setIsRightDrawerOpen } = useHeroStore();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'EXTREME': return 'text-rose-500 bg-rose-950/60 border-rose-600/60';
      case 'SEVERE': return 'text-orange-400 bg-orange-950/60 border-orange-600/60';
      case 'MODERATE': return 'text-amber-400 bg-amber-950/60 border-amber-600/60';
      default: return 'text-emerald-400 bg-emerald-950/60 border-emerald-600/60';
    }
  };

  return (
    <div className="bg-slate-950/90 border-2 border-rose-500/50 rounded-xl p-3 sm:p-4 shadow-2xl backdrop-blur-md font-cyber text-xs">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-rose-500/40 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="w-4 h-4 text-rose-400 animate-pulse" />
          <span className="font-orbitron font-bold text-rose-300 tracking-wider">PREDICTION MATRIX</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="font-tech text-[10px] text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/40 hidden sm:inline">
            CONFIDENCE: {prediction.successProbability}%
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

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        
        {/* Next Destination */}
        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex items-start space-x-2">
          <Compass className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 font-tech uppercase block">PREDICTED DESTINATION</span>
            <span className="font-bold text-slate-100">{prediction.nextDestinationName}</span>
          </div>
        </div>

        {/* Estimated Arrival */}
        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex items-start space-x-2">
          <Route className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 font-tech uppercase block">ESTIMATED SWING ETA</span>
            <span className="font-bold text-amber-300 font-mono">{prediction.etaFormatted}</span>
          </div>
        </div>

        {/* Mission Success Probability */}
        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex items-start space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <div className="w-full">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-tech uppercase">
              <span>SUCCESS PROBABILITY</span>
              <span className="font-bold text-emerald-400 font-mono">{prediction.successProbability}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden mt-1 border border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                style={{ width: `${prediction.successProbability}%` }}
              />
            </div>
          </div>
        </div>

        {/* NYC Coverage Percentage & Risk Badge */}
        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex items-start space-x-2">
          <Shield className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 font-tech uppercase block">NYC COVERAGE & RISK</span>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="font-bold text-cyan-300 font-mono">{prediction.coveragePercent}%</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getRiskColor(prediction.riskLevel)}`}>
                {prediction.riskLevel}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Recommended Route & Threat Analysis */}
      <div className="bg-slate-900/90 p-2.5 rounded-lg border border-rose-500/30 text-[11px] text-slate-300">
        <div className="text-[10px] text-rose-400 font-tech uppercase font-bold mb-1">
          RECOMMENDED ROUTE: <span className="text-slate-100 font-normal">{prediction.recommendedRoute}</span>
        </div>
        <p className="text-slate-400 text-[11px] italic">{prediction.threatAnalysis}</p>
      </div>
    </div>
  );
};
