import React, { useState } from 'react';
import { useHeroStore } from '../../store/useHeroStore';
import { X } from 'lucide-react';

export const VicinityAlertBanner: React.FC = () => {
  const { currentMission, timerCounter } = useHeroStore();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const formattedTimer = `${Math.floor(timerCounter / 10).toString().padStart(2, '0')}.${(timerCounter % 10).toString().padStart(2, '0')}`;

  return (
    <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-col items-center max-w-[88vw] sm:max-w-md">
      {/* Vicinity Alert Box matching UI reference */}
      <div className="relative bg-orange-200 border-2 sm:border-4 border-amber-900 rounded-xl p-2 sm:p-3 shadow-2xl flex flex-col items-center text-amber-950 font-pixel w-full">
        
        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute -top-2 -right-2 bg-amber-900 text-amber-100 hover:bg-rose-900 rounded-full p-0.5 shadow border border-amber-400 cursor-pointer transition-colors"
          title="Dismiss Alert"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Character Icon + Timers Row */}
        <div className="flex items-center justify-between w-full mb-1 px-1 sm:px-2">
          <span className="text-[10px] sm:text-sm font-bold text-slate-900">{formattedTimer}</span>

          {/* Spider-Man Head Icon matching UI ref */}
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-rose-600 border-2 border-rose-950 flex items-center justify-center shadow shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-white">
              <path d="M12 2C9.5 2 7.5 4 7.5 6.5C7.5 8.5 9 10 11 10.5V13.5C9 13 7.5 11.5 7.5 9.5H5.5C5.5 12.5 7.5 15 10 15.8V22H14V15.8C16.5 15 18.5 12.5 18.5 9.5H16.5C16.5 11.5 15 13 13 13.5V10.5C15 10 16.5 8.5 16.5 6.5C16.5 4 14.5 2 12 2Z" />
            </svg>
          </div>

          <span className="text-[10px] sm:text-sm font-bold text-slate-900">{formattedTimer}</span>
        </div>

        {/* Warning Banner Text */}
        <div className="bg-orange-300 border border-amber-900 px-2 sm:px-3 py-1 rounded-md text-center text-[9px] sm:text-xs tracking-wider text-rose-950 font-extrabold uppercase shadow-inner truncate w-full">
          {currentMission 
            ? `[${currentMission.borough}] ${currentMission.title}` 
            : 'SPIDER-SENSE TINGLING: INCIDENT IN VICINITY'}
        </div>
      </div>
    </div>
  );
};
