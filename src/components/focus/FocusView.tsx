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
      iconBg: 'bg-[#FDF2F8]',
      activeBorder: 'border-[#F472B6] ring-2 ring-[#F472B6]/40',
    },
    {
      id: 'hyped',
      label: 'Hyped',
      emoji: '✨',
      iconBg: 'bg-[#FEF3C7]',
      activeBorder: 'border-[#F59E0B] ring-2 ring-[#F59E0B]/40',
    },
    {
      id: 'calm',
      label: 'Calm',
      emoji: '🍃',
      iconBg: 'bg-[#EEF4ED]',
      activeBorder: 'border-[#4A7C59] ring-2 ring-[#4A7C59]/40',
    },
    {
      id: 'tired',
      label: 'Tired',
      emoji: '🌙',
      iconBg: 'bg-[#FEF9C3]',
      activeBorder: 'border-[#CA8A04] ring-2 ring-[#CA8A04]/40',
    },
    {
      id: 'meh',
      label: 'Meh',
      emoji: '☁️',
      iconBg: 'bg-[#F1F5F9]',
      activeBorder: 'border-[#94A3B8] ring-2 ring-[#94A3B8]/40',
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-in fade-in duration-500 select-none pb-6">
      {/* Screen 3 Header: My Mood Garden */}
      <div className="text-center pt-1 pb-2">
        <h1 className="font-pixel text-base sm:text-lg font-bold text-[#2D3748] tracking-wide flex items-center justify-center gap-2">
          <span>✿</span>
          <span>My Mood Garden</span>
          <span>✿</span>
        </h1>

        {/* Status Sub-badge: Sprouting | 3 drops */}
        <div className="mt-1.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#E8E3D7] text-xs font-bold text-[#4A7C59]">
          <span>🌿 Sprouting</span>
          <span className="text-[#CBD5E1]">|</span>
          <span className="text-[#60A5FA]">💧 {dewDrops || bondStats.waterDrops} drops</span>
        </div>
      </div>

      {/* Main Mood Garden Scenic Canvas */}
      <MoodGardenCanvas />

      {/* "HOW ARE YOU FEELING TODAY?" Section */}
      <div className="pt-2 text-center">
        <h3 className="font-pixel text-[11px] font-bold text-[#718096] uppercase tracking-wider mb-3">
          How are you feeling today?
        </h3>

        {/* 5 Circular Mood Buttons (Happy, Hyped, Calm, Tired, Meh) */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3">
          {moodsList.map(item => {
            const isSelected = currentMood === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setMood(item.id)}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer border ${item.iconBg} ${
                  isSelected
                    ? `${item.activeBorder} scale-105 shadow-md`
                    : 'border-[#EAE6DC] opacity-85 hover:opacity-100 shadow-sm'
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
      <div className="pt-2">
        <button
          onClick={startFocusSession}
          className="w-full py-4 px-6 rounded-2xl bg-[#4A7C59] hover:bg-[#3D684A] text-white font-bold text-base shadow-figma-button flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>Start Focus Session</span>
        </button>
      </div>

      {/* Focus Session Modal (Active / Paused overlay) */}
      <FocusSessionModal />
    </div>
  );
};
