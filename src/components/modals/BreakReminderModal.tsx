import React from 'react';
import { useKinetic } from '../../context/KineticContext';
import { useGarden } from '../../context/GardenContext';
import { CompanionAvatar } from '../garden/CompanionAvatar';
import { Coffee, BellOff, X, Sparkles, Heart } from 'lucide-react';

export const BreakReminderModal: React.FC = () => {
  const {
    isBreakReminderOpen,
    setIsBreakReminderOpen,
    setIsBreathingModalOpen,
    setPresenceStatus,
    metrics,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0c1812] border border-emerald-500/30 p-6 md:p-8 shadow-2xl shadow-emerald-950/80 text-center flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={() => setIsBreakReminderOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-emerald-900/40 transition-all cursor-pointer"
          title="Dismiss reminder"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Companion Avatar */}
        <div className="mb-2">
          <CompanionAvatar mood={metrics.inferredMood === 'tired' ? 'tired' : 'happy'} size="md" showBubble={false} />
        </div>

        {/* Header Tag */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Coffee className="w-3.5 h-3.5 text-emerald-400" />
          <span>Gentle Break Reminder</span>
        </div>

        {/* Caring Message */}
        <h3 className="text-xl font-bold font-display text-slate-100 mb-2">
          Time for a gentle pause?
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-xs mb-6">
          You've been giving this your full focus. Taking a quick 5-minute break recharges your flow and helps the garden bloom.
        </p>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5">
          {/* Take 5-min Break Button */}
          <button
            onClick={handleTakeBreak}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-glow-md flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>Take 5-min Break</span>
          </button>

          {/* Snooze 10 min Button */}
          <button
            onClick={() => handleSnooze()}
            className="w-full py-2.5 px-4 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/25 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <BellOff className="w-3.5 h-3.5 text-amber-400" />
            <span>Snooze 10 min</span>
          </button>
        </div>

        {/* Gentle Footer Note */}
        <div className="mt-5 flex items-center gap-1.5 text-[11px] text-slate-400">
          <Heart className="w-3 h-3 text-rose-400" />
          <span>Zero guilt &bull; Sprout will be right here</span>
        </div>
      </div>
    </div>
  );
};
