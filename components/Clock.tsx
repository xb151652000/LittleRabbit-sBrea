import React from 'react';
import { getRotation } from '../utils/time';

interface ClockProps {
  totalMinutes: number;
  label?: string;
  color?: string;
}

export const Clock: React.FC<ClockProps> = ({ totalMinutes, label, color = "text-slate-700" }) => {
  const { minuteRotation, hourRotation } = getRotation(totalMinutes);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32 md:w-48 md:h-48 bg-white rounded-full border-4 border-indigo-200 shadow-lg flex items-center justify-center">
        {/* Clock Face Markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-3 bg-slate-300 origin-bottom"
            style={{
              transform: `rotate(${i * 30}deg) translate(0, -56px)` // Adjusted for responsive size roughly
            }}
          />
        ))}
        
        {/* Numbers 12, 3, 6, 9 */}
        <span className="absolute top-1 text-slate-400 font-bold text-xs md:text-sm">12</span>
        <span className="absolute bottom-1 text-slate-400 font-bold text-xs md:text-sm">6</span>
        <span className="absolute left-2 text-slate-400 font-bold text-xs md:text-sm">9</span>
        <span className="absolute right-2 text-slate-400 font-bold text-xs md:text-sm">3</span>

        {/* Center Dot */}
        <div className="absolute w-3 h-3 bg-indigo-500 rounded-full z-10 shadow-sm" />

        {/* Hour Hand */}
        <div
          className="absolute w-1.5 h-10 md:h-14 bg-slate-800 rounded-full origin-bottom z-0 transition-transform duration-75 ease-linear"
          style={{
            bottom: '50%',
            transform: `rotate(${hourRotation}deg)`,
          }}
        />

        {/* Minute Hand */}
        <div
          className="absolute w-1 h-12 md:h-20 bg-indigo-500 rounded-full origin-bottom z-1 transition-transform duration-75 ease-linear"
          style={{
            bottom: '50%',
            transform: `rotate(${minuteRotation}deg)`,
          }}
        />
      </div>
      {label && <span className={`font-bold text-lg ${color}`}>{label}</span>}
    </div>
  );
};