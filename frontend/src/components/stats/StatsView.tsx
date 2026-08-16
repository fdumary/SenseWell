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
      <div className="flex items-center justify-between pt-1 pb-1">
        <div>
          <h1 className="font-pixel text-base sm:text-lg font-bold text-[#EDE6D6] tracking-wide">
            Today's Stats
          </h1>
          <p className="text-xs text-[#AFA28C] font-semibold">Saturday, August 15</p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#25331E] border border-[#486344] text-[#98C992] text-xs font-bold font-pixel shadow-2xs">
          <span>🌸</span>
          <span>Sprouting</span>
          <span>🌿</span>
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-[#3E2B18] border-2 border-[#5C4229] shadow-md">
        <div className="flex items-center gap-2 text-[11px] font-pixel font-bold uppercase tracking-wider text-[#AFA28C] mb-2">
          <Timer className="w-3.5 h-3.5 text-[#98C992]" />
          <span>Focus Time</span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-pixel font-bold text-[#EDE6D6]">
            {bondStats.focusMinutesToday}m
          </span>
          <span className="text-xs text-[#AFA28C] font-semibold">today</span>
        </div>

        <div className="w-full bg-[#24190E] rounded-full h-3 overflow-hidden border border-[#4E391F] mb-2">
          <div
            className="bg-[#4D7C54] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (bondStats.focusMinutesToday / (bondStats.dailyGoalHours * 60)) * 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[#AFA28C] font-bold">
          <span>{Math.round((bondStats.focusMinutesToday / (bondStats.dailyGoalHours * 60)) * 100)}% of daily goal</span>
          <span>{bondStats.dailyGoalHours}h goal</span>
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-[#3E2B18] border-2 border-[#5C4229] shadow-md">
        <div className="flex items-center gap-2 text-[11px] font-pixel font-bold uppercase tracking-wider text-[#AFA28C] mb-2">
          <Droplets className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span>Breaks Today</span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-pixel font-bold text-[#EDE6D6]">
            {bondStats.breaksToday}
          </span>
          <span className="text-xs text-[#AFA28C] font-semibold">break taken</span>
        </div>

        <div className="flex items-center gap-3 text-lg">
          <span className="text-[#3B82F6]">💧</span>
          <span className="text-[#64503C]">💧</span>
          <span className="text-[#64503C]">💧</span>
          <span className="text-[#64503C]">💧</span>
          <span className="text-[#64503C]">💧</span>
          <span className="text-[#64503C]">💧</span>
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-[#3E2B18] border-2 border-[#5C4229] shadow-md">
        <div className="flex items-center gap-2 text-[11px] font-pixel font-bold uppercase tracking-wider text-[#AFA28C] mb-2">
          <Flame className="w-3.5 h-3.5 text-[#D96B43]" />
          <span>Streak</span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-pixel font-bold text-[#EDE6D6]">
            {bondStats.streakDays}
          </span>
          <span className="text-xs text-[#AFA28C] font-semibold">days in a row</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysList.map((d, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div
                className={`w-full h-10 rounded-xl flex items-center justify-center border transition-all ${
                  d.active
                    ? 'bg-[#D96B43] border-[#B85732] text-white shadow-xs'
                    : 'bg-[#24190E] border-[#4E391F] text-[#64503C]'
                }`}
              >
                {d.active && <Flame className="w-4 h-4 fill-white" />}
              </div>
              <span className="text-[10px] font-pixel font-bold text-[#AFA28C]">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-[#3E2B18] border-2 border-[#5C4229] shadow-md">
        <div className="flex items-center gap-2 text-[11px] font-pixel font-bold uppercase tracking-wider text-[#AFA28C] mb-2">
          <span>🌸</span>
          <span>Garden Health</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-pixel font-bold text-[#EDE6D6]">Sprouting</span>
          <span className="text-lg">🌿</span>
        </div>

        <div className="flex items-center gap-2.5 mb-3 text-base">
          <span>🌸</span>
          <span>🌸</span>
          <span className="w-4 h-4 rounded-full border-2 border-[#64503C]" />
          <span className="w-4 h-4 rounded-full border-2 border-[#64503C]" />
          <span className="w-4 h-4 rounded-full border-2 border-[#64503C]" />
        </div>

        <p className="text-xs text-[#98C992] font-bold mb-3">
          Your garden is growing well!
        </p>

        <div className="p-3 rounded-2xl bg-[#24190E] border border-[#4E391F] flex items-center gap-2 text-xs font-bold text-[#EDE6D6]">
          <span className="text-[#3B82F6]">💧</span>
          <span>{dewDrops || bondStats.waterDrops} water drops collected from breaks</span>
        </div>
      </div>
    </div>
  );
};
