import React from 'react';
import { MoodGardenCanvas } from '../garden/MoodGardenCanvas';
import { FocusSessionModal } from './FocusSessionModal';
import { useKinetic } from '../../context/KineticContext';
import { useGarden } from '../../context/GardenContext';
import { MoodState } from '../../types';
import { Play } from 'lucide-react';

export const FocusView: React.FC = () => {
  const {
    currentMood,
    setMood,
    startFocusSession,
    bondStats,
  } = useKinetic();

  const { dewDrops } = useGarden();

  const moodsList: Array<{ id: MoodState; label: string; emoji: string; iconBg: string; activeBorder: string }> = [
    {
      id: 'happy',
      label: 'Happy',
      emoji: '🌸',
      iconBg: 'bg-[#4A2D3A]',
      activeBorder: 'border-[#F472B6] ring-2 ring-[#F472B6]/40',
    },
    {
      id: 'hyped',
      label: 'Hyped',
      emoji: '✨',
      iconBg: 'bg-[#4A3D20]',
      activeBorder: 'border-[#F59E0B] ring-2 ring-[#F59E0B]/40',
    },
    {
      id: 'calm',
      label: 'Calm',
      emoji: '🍃',
      iconBg: 'bg-[#253822]',
      activeBorder: 'border-[#4A7C59] ring-2 ring-[#4A7C59]/40',
    },
    {
      id: 'tired',
      label: 'Tired',
      emoji: '🌙',
      iconBg: 'bg-[#3D3A20]',
      activeBorder: 'border-[#CA8A04] ring-2 ring-[#CA8A04]/40',
    },
    {
      id: 'meh',
      label: 'Meh',
      emoji: '☁️',
      iconBg: 'bg-[#2A353D]',
      activeBorder: 'border-[#94A3B8] ring-2 ring-[#94A3B8]/40',
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-3 animate-in fade-in duration-500 select-none pb-6">
      {/* Screen 1 Header: Soft Dusty Mint Header Bar */}
      <div className="p-3 rounded-2xl bg-[#A8C7C9] border border-[#8FB1B3] text-center shadow-md">
        <h1 className="font-pixel text-sm sm:text-base font-bold text-[#1A3336] tracking-wide flex items-center justify-center gap-2">
          <span>✿</span>
          <span>My Mood Garden</span>
          <span>✿</span>
        </h1>

        <div className="mt-1.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8EA] border border-[#E5DAC2] text-xs font-bold text-[#2A4B32] shadow-2xs">
          <span>🌿 Sprouting</span>
          <span className="text-[#CFC2A7]">|</span>
          <span className="text-[#3B82F6]">💧 {dewDrops || bondStats.waterDrops} drops</span>
        </div>
      </div>

      <MoodGardenCanvas />

      {/* HOW ARE YOU FEELING TODAY?: Dark Moss Bar */}
      <div className="p-3 rounded-2xl bg-[#25331E] border border-[#3B5234] text-center shadow-sm">
        <h3 className="font-pixel text-[10px] font-bold text-[#A8C79E] uppercase tracking-wider mb-2.5">
          How are you feeling today?
        </h3>

        <div className="flex items-center justify-center gap-2 sm:gap-2.5">
          {moodsList.map(item => {
            const isSelected = currentMood === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setMood(item.id)}
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer border ${item.iconBg} ${
                  isSelected
                    ? `${item.activeBorder} scale-105 shadow-md`
                    : 'border-[#4B3B28] opacity-85 hover:opacity-100 shadow-2xs'
                }`}
                title={`Feel ${item.label}`}
              >
                <span>{item.emoji}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary CTA: Start Focus Session Button */}
      <div className="pt-0.5">
        <button
          onClick={startFocusSession}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#48694B] hover:bg-[#3D5C3F] text-white border border-[#5D8460] font-pixel text-xs tracking-wider shadow-md flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white text-white" />
          <span>Start Focus Session</span>
        </button>
      </div>

      <FocusSessionModal />
    </div>
  );
};
