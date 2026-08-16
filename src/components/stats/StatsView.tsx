import React from 'react';
import { useKinetic } from '../../context/KineticContext';
import { useGarden } from '../../context/GardenContext';
import { Timer, Droplets, Flame } from 'lucide-react';

export const StatsView: React.FC = () => {
  const { bondStats } = useKinetic();
  const { dewDrops } = useGarden();

  const daysList = [
    { day: 'M', active: true },
    { day: 'T', active: true },
    { day: 'W', active: true },
    { day: 'T', active: false },
    { day: 'F', active: false },
    { day: 'S', active: false },
    { day: 'S', active: false },
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-3 animate-in fade-in duration-500 select-none pb-6">
      {/* Header matching Screenshot 5 */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div>
          <h1 className="font-pixel text-base sm:text-lg font-bold text-[#243E29] tracking-wide">
            Today&apos;s Stats
          </h1>
          <p className="text-xs text-[#527057] font-semibold">Saturday, August 15</p>
        </div>

        {/* Sprouting Status Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D2EBD2] border border-[#B5DCB5] text-[#2C5E3B] text-xs font-bold font-pixel shadow-2xs">
          <span>🌸</span>
          <span>Sprouting</span>
          <span>🌿</span>
        </div>
      </div>

      {/* Card 1: FOCUS TIME in Soft Mint Green */}
      <div className="p-5 rounded-3xl bg-[#D2EBD2] border border-[#B5DCB5] shadow-sm">
        <div className="flex items-center gap-2 text-[11px] font-pixel font-bold uppercase tracking-wider text-[#3D6643] mb-2">
          <Timer className="w-3.5 h-3.5 text-[#2C5E3B]" />
          <span>Focus Time</span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-pixel font-bold text-[#243E29]">
            {bondStats.focusMinutesToday}m
          </span>
          <span className="text-xs text-[#527057] font-semibold">today</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#E4F5E4] rounded-full h-3 overflow-hidden border border-[#C6E8C6] mb-2">
          <div
            className="bg-[#4D7C54] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (bondStats.focusMinutesToday / (bondStats.dailyGoalHours * 60)) * 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[#436348] font-bold">
          <span>{Math.round((bondStats.focusMinutesToday / (bondStats.dailyGoalHours * 60)) * 100)}% of daily goal</span>
          <span>{bondStats.dailyGoalHours}h goal</span>
        </div>
      </div>

      {/* Card 2: BREAKS TODAY */}
      <div className="p-5 rounded-3xl bg-[#D2EBD2] border border-[#B5DCB5] shadow-sm">
        <div className="flex items-center gap-2 text-[11px] font-pixel font-bold uppercase tracking-wider text-[#3D6643] mb-2">
          <Droplets className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span>Breaks Today</span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-pixel font-bold text-[#243E29]">
            {bondStats.breaksToday}
          </span>
          <span className="text-xs text-[#527057] font-semibold">break taken</span>
        </div>

        {/* 6 Droplets Display */}
        <div className="flex items-center gap-3 text-lg">
          <span className="text-[#3B82F6]">💧</span>
          <span className="text-[#A4C4A4]">💧</span>
          <span className="text-[#A4C4A4]">💧</span>
          <span className="text-[#A4C4A4]">💧</span>
          <span className="text-[#A4C4A4]">💧</span>
          <span className="text-[#A4C4A4]">💧</span>
        </div>
      </div>

      {/* Card 3: STREAK */}
      <div className="p-5 rounded-3xl bg-[#D2EBD2] border border-[#B5DCB5] shadow-sm">
        <div className="flex items-center gap-2 text-[11px] font-pixel font-bold uppercase tracking-wider text-[#3D6643] mb-2">
          <Flame className="w-3.5 h-3.5 text-[#E07A5F]" />
          <span>Streak</span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-pixel font-bold text-[#243E29]">
            {bondStats.streakDays}
          </span>
          <span className="text-xs text-[#527057] font-semibold">days in a row</span>
        </div>

        {/* 7-Day Tiles (M T W T F S S) */}
        <div className="grid grid-cols-7 gap-2">
          {daysList.map((d, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div
                className={`w-full h-10 rounded-xl flex items-center justify-center border transition-all ${
                  d.active
                    ? 'bg-[#E07A5F] border-[#C8644A] text-white shadow-xs'
                    : 'bg-[#E4F5E4] border-[#C6E8C6] text-[#A4C4A4]'
                }`}
              >
                {d.active && <Flame className="w-4 h-4 fill-white" />}
              </div>
              <span className="text-[10px] font-pixel font-bold text-[#3D6643]">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card 4: GARDEN HEALTH */}
      <div className="p-5 rounded-3xl bg-[#D2EBD2] border border-[#B5DCB5] shadow-sm">
        <div className="flex items-center gap-2 text-[11px] font-pixel font-bold uppercase tracking-wider text-[#3D6643] mb-2">
          <span>🌸</span>
          <span>Garden Health</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-pixel font-bold text-[#243E29]">Sprouting</span>
          <span className="text-lg">🌿</span>
        </div>

        {/* 5 Bloom Progress Circles */}
        <div className="flex items-center gap-2.5 mb-3 text-base">
          <span>🌸</span>
          <span>🌸</span>
          <span className="w-4 h-4 rounded-full border-2 border-[#A4C4A4]" />
          <span className="w-4 h-4 rounded-full border-2 border-[#A4C4A4]" />
          <span className="w-4 h-4 rounded-full border-2 border-[#A4C4A4]" />
        </div>

        <p className="text-xs text-[#2C5E3B] font-bold mb-3">
          Your garden is growing well!
        </p>

        {/* Sub-box: water drops */}
        <div className="p-3 rounded-2xl bg-[#E4F5E4] border border-[#C6E8C6] flex items-center gap-2 text-xs font-bold text-[#3D6643]">
          <span className="text-[#3B82F6]">💧</span>
          <span>{dewDrops || bondStats.waterDrops} water drops collected from breaks</span>
        </div>
      </div>

      {/* Bottom Sparkle Star Cross from Screenshot 5 */}
      <div className="flex justify-center pt-2 pb-1 opacity-75">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <span className="text-2xl text-[#A89FDC] animate-pulse">✦</span>
          <span className="absolute top-0 right-1 text-sm text-[#A89FDC]">✦</span>
          <span className="absolute bottom-0 left-1 text-sm text-[#A89FDC]">✦</span>
        </div>
      </div>
    </div>
  );
};
