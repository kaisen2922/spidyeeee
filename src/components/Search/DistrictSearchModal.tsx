import React, { useState } from 'react';
import { useHeroStore } from '../../store/useHeroStore';
import { NYC_DISTRICTS } from '../../services/aiSimulator';
import { Search, MapPin, X, ChevronRight, ShieldAlert } from 'lucide-react';

interface DistrictSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DistrictSearchModal: React.FC<DistrictSearchModalProps> = ({ isOpen, onClose }) => {
  const { activeMissions, flyToCoords } = useHeroStore();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredDistricts = NYC_DISTRICTS.filter(d => 
    d.name.toLowerCase().includes(query.toLowerCase()) || 
    d.landmark.toLowerCase().includes(query.toLowerCase()) ||
    d.borough.toLowerCase().includes(query.toLowerCase())
  );

  const filteredMissions = activeMissions.filter(m =>
    m.title.toLowerCase().includes(query.toLowerCase()) ||
    m.district.toLowerCase().includes(query.toLowerCase()) ||
    m.borough.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectCoords = (coords: [number, number]) => {
    flyToCoords(coords, 16);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="bg-slate-950 border-2 border-rose-500/70 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden font-cyber">
        
        {/* Search Header Bar */}
        <div className="p-3 bg-slate-900 border-b border-rose-500/40 flex items-center space-x-2">
          <Search className="w-5 h-5 text-rose-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search NYC Borough (Manhattan, Brooklyn, Queens, Bronx), Landmark or Mission..."
            className="flex-1 bg-transparent border-none text-sm text-cyan-100 placeholder-slate-500 focus:outline-none font-cyber"
            autoFocus
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-3">
          
          {/* Active Missions Results */}
          {filteredMissions.length > 0 && (
            <div>
              <span className="text-[10px] text-rose-400 font-tech uppercase tracking-wider block mb-1">
                ACTIVE NYC INCIDENTS ({filteredMissions.length})
              </span>
              <div className="space-y-1.5">
                {filteredMissions.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleSelectCoords(m.location)}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 hover:bg-rose-950/50 border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-100">[{m.borough}] {m.title}</div>
                        <div className="text-[10px] text-slate-400">{m.district} • {m.civiliansAtRisk} Civilians</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-rose-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* City Districts & Landmarks Results */}
          <div>
            <span className="text-[10px] text-cyan-400 font-tech uppercase tracking-wider block mb-1">
              NYC 5-BOROUGH DISTRICTS & LANDMARKS ({filteredDistricts.length})
            </span>
            <div className="space-y-1.5">
              {filteredDistricts.map((d, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectCoords(d.coords)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 hover:bg-rose-950/50 border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-100">[{d.borough}] {d.name}</div>
                      <div className="text-[10px] text-slate-400">{d.landmark}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
