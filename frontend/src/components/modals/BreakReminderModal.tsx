import React from 'react';
import { useKinetic } from '../../context/KineticContext';
import { useGarden } from '../../context/GardenContext';
import { CompanionAvatar } from '../garden/CompanionAvatar';
import { Coffee, X } from 'lucide-react';
import { recordBreak } from '../../api';

export const BreakReminderModal: React.FC = () => {
  const {
    isBreakReminderOpen,
    setIsBreakReminderOpen,
    setIsBreathingModalOpen,
    setPresenceStatus,
  } = useKinetic();

  const { fertilizeGarden } = useGarden();

  if (!isBreakReminderOpen) return null;

  const handleTakeBreak = async () => {
    setIsBreakReminderOpen(false);
    setPresenceStatus('break');
    fertilizeGarden();
    setIsBreathingModalOpen(true);
    try {
      await recordBreak();
    } catch {
      // The garden interaction remains useful if the local API is unavailable.
    }
  };

  const handleSnooze = () => {
    setIsBreakReminderOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300 select-none">
      <div className="relative w-full max-w-sm rounded-[32px] bg-[#1F2C1E] border-2 border-[#3A5237] p-6 shadow-2xl text-center flex flex-col items-center">
        <button
          onClick={() => setIsBreakReminderOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#AFA28C] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          title="Dismiss reminder"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-2">
          <CompanionAvatar mood="hyped" size="lg" showBubble={false} />
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141E13] border border-[#3A5237] text-[#98C992] text-[11px] font-pixel font-bold uppercase tracking-wider mb-2.5">
          <Coffee className="w-3 h-3 text-[#98C992]" />
          <span>Fern</span>
        </div>

        <h3 className="text-base font-pixel font-bold text-[#EDE6D6] mb-1.5">
          Hey!! It's time for a break! 🌸
        </h3>
        <p className="text-xs text-[#A8C79E] font-semibold leading-relaxed max-w-xs mb-5">
          You've been working hard. Let's take a little breather.
        </p>

        <div className="w-full grid grid-cols-2 gap-2.5">
          <button
            onClick={handleTakeBreak}
            className="py-2.5 px-4 rounded-2xl bg-[#3F633B] hover:bg-[#345230] border border-[#527F4D] text-white font-pixel text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>☕</span>
            <span>Take a Break</span>
          </button>

          <button
            onClick={handleSnooze}
            className="py-2.5 px-4 rounded-2xl bg-[#273525] hover:bg-[#202B1E] border border-[#3A5237] text-[#EDE6D6] font-pixel text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Later</span>
          </button>
        </div>
      </div>
    </div>
  );
};
