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
    <div className="w-full max-w-md mx-auto space-y-4 animate-in fade-in duration-500 select-none pb-6">
      {/* Header matching Screenshot 1 */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div>
          <h1 className="font-pixel text-base sm:text-lg font-bold text-[#2D3748] tracking-wide">
            Today&apos;s Stats
          </h1>
          <p className="text-xs text-[#718096] font-medium">Saturday, August 15</p>
        </div>

        {/* Sprouting Status Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4ECD5] border border-[#B7DDB9] text-[#2C5E3B] text-xs font-bold font-pixel">
          <span>🌸</span>
          <span>Sprouting</span>
          <span>🌿</span>
        </div>
      </div>

      {/* Card 1: FOCUS TIME */}
      <div className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#EAE6DC] shadow-sm">
        <div className="flex items-center gap-2 text-[11px] font-pixel font-bold uppercase tracking-wider text-[#718096] mb-2">
          <Timer className="w-3.5 h-3.5 text-[#4A7C59]" />
          <span>Focus Time</span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-pixel font-bold text-[#2D3748]">
            {bondStats.focusMinutesToday}m
          </span>
          <span className="text-xs text-[#718096] font-semibold">today</span>
        </div>

        {/* Progress Bar (10% of 4h goal) */}
        <div className="w-full bg-[#EEF4ED] rounded-full h-3 overflow-hidden border border-[#DCE8D8] mb-2">
          <div
            className="bg-[#4A7C59] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (bondStats.focusMinutesToday / (bondStats.dailyGoalHours * 60)) * 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[#718096] font-semibold">
          <span>{Math.round((bondStats.focusMinutesToday / (bondStats.dailyGoalHours * 60)) * 100)}% of daily goal</span>
          <span>{bondStats.dailyGoalHours}h goal</span>
        </div>
      </div>

      {/* Card 2: BREAKS TODAY */}
      <div className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#EAE6DC] shadow-sm">
        <div className="flex items-center gap-2 text-[11px] font-pixel font-bold uppercase tracking-wider text-[#718096] mb-2">
          <Droplets className="w-3.5 h-3.5 text-[#60A5FA]" />
          <span>Breaks Today</span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-pixel font-bold text-[#2D3748]">
            {bondStats.breaksToday}
          </span>
          <span className="text-xs text-[#718096] font-semibold">break taken</span>
        </div>

        {/* 6 Droplets Display */}
        <div className="flex items-center gap-3 text-lg">
          <span className="text-[#60A5FA]">💧</span>
          <span className="text-[#CBD5E1]">💧</span>
          <span className="text-[#CBD5E1]">💧</span>
          <span className="text-[#CBD5E1]">💧</span>
          <span className="text-[#CBD5E1]">💧</span>
          <span className="text-[#CBD5E1]">💧</span>
        </div>
      </div>

      {/* Card 3: STREAK */}
      <div className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#EAE6DC] shadow-sm">
        <div className="flex items-center gap-2 text-[11px] font-pixel font-bold uppercase tracking-wider text-[#718096] mb-2">
          <Flame className="w-3.5 h-3.5 text-[#E07A5F]" />
          <span>Streak</span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-pixel font-bold text-[#2D3748]">
            {bondStats.streakDays}
          </span>
          <span className="text-xs text-[#718096] font-semibold">days in a row</span>
        </div>

        {/* 7-Day Tiles (M T W T F S S) */}
        <div className="grid grid-cols-7 gap-2">
          {daysList.map((d, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div
                className={`w-full h-10 rounded-xl flex items-center justify-center border transition-all ${
                  d.active
                    ? 'bg-[#E07A5F] border-[#C8644A] text-white shadow-sm'
                    : 'bg-[#EEF4ED] border-[#DCE8D8] text-[#CBD5E1]'
                }`}
              >
                {d.active && <Flame className="w-4 h-4 fill-white" />}
              </div>
              <span className="text-[10px] font-pixel font-bold text-[#718096]">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card 4: GARDEN HEALTH */}
      <div className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#EAE6DC] shadow-sm">
        <div className="flex items-center gap-2 text-[11px] font-pixel font-bold uppercase tracking-wider text-[#718096] mb-2">
          <span>🌸</span>
          <span>Garden Health</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-pixel font-bold text-[#2D3748]">Sprouting</span>
          <span className="text-lg">🌿</span>
        </div>

        {/* 5 Bloom Progress Circles */}
        <div className="flex items-center gap-2.5 mb-3 text-base">
          <span>🌸</span>
          <span>🌸</span>
          <span className="w-4 h-4 rounded-full border-2 border-[#CBD5E1]" />
          <span className="w-4 h-4 rounded-full border-2 border-[#CBD5E1]" />
          <span className="w-4 h-4 rounded-full border-2 border-[#CBD5E1]" />
        </div>

        <p className="text-xs text-[#4A7C59] font-bold mb-3">
          Your garden is growing well!
        </p>

        {/* Sub-box: 3 water drops collected from breaks */}
        <div className="p-3 rounded-2xl bg-[#FAF7F0] border border-[#E8E3D7] flex items-center gap-2 text-xs font-bold text-[#718096]">
          <span className="text-[#60A5FA]">💧</span>
          <span>{dewDrops || bondStats.waterDrops} water drops collected from breaks</span>
        </div>
      </div>
    </div>
  );
};
