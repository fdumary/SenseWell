import React from 'react';
import { useKinetic } from '../../context/KineticContext';
import { useGarden } from '../../context/GardenContext';
import { CompanionAvatar } from '../garden/CompanionAvatar';
import { Coffee, X } from 'lucide-react';

export const BreakReminderModal: React.FC = () => {
  const {
    isBreakReminderOpen,
    setIsBreakReminderOpen,
    setIsBreathingModalOpen,
    setPresenceStatus,
  } = useKinetic();

  const { fertilizeGarden } = useGarden();

  if (!isBreakReminderOpen) return null;

  const handleTakeBreak = () => {
    setIsBreakReminderOpen(false);
    setPresenceStatus('break');
    fertilizeGarden();
    setIsBreathingModalOpen(true);
  };

  const handleSnooze = () => {
    setIsBreakReminderOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-300 select-none">
      {/* Light Sage Mint Card matching Screenshot 3 */}
      <div className="relative w-full max-w-sm rounded-[32px] bg-[#D8EBD6] border border-[#B8DCB6] p-6 shadow-2xl text-center flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={() => setIsBreakReminderOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#527057] hover:text-[#243E29] hover:bg-white/40 transition-all cursor-pointer"
          title="Dismiss reminder"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Companion Avatar (Alert / Excited with Hearts) */}
        <div className="mb-2">
          <CompanionAvatar mood="hyped" size="lg" showBubble={false} />
        </div>

        {/* Header Tag */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-[#B8DCB6] text-[#2C5E3B] text-[11px] font-pixel font-bold uppercase tracking-wider mb-2.5">
          <Coffee className="w-3 h-3 text-[#2C5E3B]" />
          <span>Fern</span>
        </div>

        {/* Title */}
        <h3 className="text-base font-pixel font-bold text-[#243E29] mb-1.5">
          Hey!! It&apos;s time for a break! 🌸
        </h3>
        <p className="text-xs text-[#4A6850] font-semibold leading-relaxed max-w-xs mb-5">
          You&apos;ve been working hard. Let&apos;s take a little breather.
        </p>

        {/* Action Buttons in 2 columns (Take a Break / Later) */}
        <div className="w-full grid grid-cols-2 gap-2.5">
          {/* Take a Break Button */}
          <button
            onClick={handleTakeBreak}
            className="py-2.5 px-4 rounded-2xl bg-[#EAF5E8] hover:bg-[#DDF0DB] border border-[#C4E4C2] text-[#2A5430] font-pixel text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>☕</span>
            <span>Take a Break</span>
          </button>

          {/* Later Button */}
          <button
            onClick={handleSnooze}
            className="py-2.5 px-4 rounded-2xl bg-[#FAF6EE] hover:bg-[#F2ECE0] border border-[#E4DFC8] text-[#5C4A26] font-pixel text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Later</span>
          </button>
        </div>
      </div>
    </div>
  );
};
