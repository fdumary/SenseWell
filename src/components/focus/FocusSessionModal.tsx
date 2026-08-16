import React from 'react';
import { useKinetic } from '../../context/KineticContext';
import { CompanionAvatar } from '../garden/CompanionAvatar';
import { Play, Pause, ArrowLeft } from 'lucide-react';

export const FocusSessionModal: React.FC = () => {
  const {
    isFocusSessionActive,
    isSessionPaused,
    sessionRemainingSeconds,
    pauseFocusSession,
    resumeFocusSession,
    endFocusSession,
    currentMood,
    bondStats,
  } = useKinetic();

  if (!isFocusSessionActive) return null;

  // Format MM:SS
  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(mins)}:${pad(secs)}`;
  };

  const getMoodTag = () => {
    switch (currentMood) {
      case 'hyped':
        return { emoji: '✨', label: 'Hyped' };
      case 'calm':
        return { emoji: '🍃', label: 'Calm' };
      case 'tired':
        return { emoji: '🌙', label: 'Tired' };
      case 'meh':
        return { emoji: '☁️', label: 'Meh' };
      case 'happy':
      default:
        return { emoji: '🌸', label: 'Happy' };
    }
  };

  const moodTag = getMoodTag();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-[#BEDBBA] via-[#85B17E] to-[#476839] overflow-y-auto animate-in fade-in duration-300 select-none">
      {/* Top Header Bar */}
      <div className="w-full max-w-md flex items-center justify-between z-20 pt-2">
        {/* Back to Garden Button */}
        <button
          onClick={endFocusSession}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 text-[#2D3748] text-xs font-bold shadow-sm border border-white/60 hover:bg-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Garden</span>
        </button>

        {/* Center Title */}
        <span className="font-pixel text-xs sm:text-sm font-bold text-[#223D29] tracking-widest uppercase drop-shadow-2xs">
          Focus Session
        </span>

        {/* Right Mood Pill */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 text-[#2D3748] text-xs font-bold shadow-sm border border-white/60">
          <span>{moodTag.emoji}</span>
          <span className="capitalize">{moodTag.label}</span>
        </div>
      </div>

      {/* Main Centered Floating Card in Ice Blue (Screenshot 2) */}
      <div className="w-full max-w-md my-auto pt-4 pb-2">
        <div className="relative rounded-[32px] bg-[#DDF0F7] border border-[#B8D6E6] p-6 sm:p-8 shadow-xl text-center flex flex-col items-center">
          {/* Subtle Decorative Stars in Corners */}
          <div className="absolute top-3 left-4 pointer-events-none">
            <img src="/assets/trimmed/Extra decor/yellow_stars.png" alt="Stars" className="w-5 h-5 object-contain opacity-80" />
          </div>
          <div className="absolute top-3 right-4 pointer-events-none">
            <img src="/assets/trimmed/Extra decor/yellow_stars.png" alt="Stars" className="w-5 h-5 object-contain opacity-80" />
          </div>

          {/* Session Header Tag */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-pixel text-[11px] text-[#4A6878] uppercase tracking-wider">
              Session {bondStats.sessionsCompleted + 1} &bull;
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/80 border border-[#B8D6E6] text-xs font-bold text-[#2A4B5C] flex items-center gap-1">
              <span>{moodTag.emoji}</span>
              <span>{moodTag.label}</span>
            </span>
          </div>

          {/* Message Prompt */}
          <h2 className="text-sm sm:text-base font-bold text-[#243E29] mb-4">
            {!isSessionPaused
              ? 'Great vibes today — let us bloom! 🌸'
              : 'Ready when you are! 🌸'}
          </h2>

          {/* Big Retro 8-bit Pixel Timer Display */}
          <div className="my-2 select-none">
            <div className="text-6xl sm:text-7xl font-pixel font-bold tracking-widest text-[#223D29] drop-shadow-2xs">
              {formatTimer(sessionRemainingSeconds)}
            </div>
          </div>

          {/* Decorative Vine Line */}
          <div className="w-3/4 flex items-center justify-center my-3 opacity-60">
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#85B17E] to-transparent" />
          </div>

          {/* Next Break Indicator Sub-box */}
          <div className="w-full p-3 rounded-2xl bg-white/70 border border-[#B8D6E6] mb-6 text-left">
            <div className="flex items-center justify-between text-xs font-bold text-[#2E5936] mb-1.5">
              <div className="flex items-center gap-1.5">
                <span>🍃</span>
                <span>Next break in {Math.ceil(sessionRemainingSeconds / 60)} min</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-[#CCE3ED] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#4D7C54] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${((25 * 60 - sessionRemainingSeconds) / (25 * 60)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Primary Action Button: Pause (Lilac) / Resume (Sage Green) */}
          {!isSessionPaused ? (
            <button
              onClick={pauseFocusSession}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#DEC7EB] hover:bg-[#CFB5DF] text-[#3D2852] border border-[#CFB5DF] font-bold text-base shadow-sm flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Pause className="w-5 h-5 fill-[#3D2852] text-[#3D2852]" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={resumeFocusSession}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#BFE0BD] hover:bg-[#A9D4A7] text-[#223D29] border border-[#A9D4A7] font-bold text-base shadow-sm flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Play className="w-5 h-5 fill-[#223D29] text-[#223D29]" />
              <span>Resume</span>
            </button>
          )}

          {/* Secondary End Session Link */}
          <button
            onClick={endFocusSession}
            className="mt-3 text-xs text-[#52788D] hover:text-[#223D29] font-bold underline cursor-pointer"
          >
            end session
          </button>
        </div>
      </div>

      {/* Bottom Area: Speech Bubble in Lilac + Companion */}
      <div className="flex flex-col items-center z-20 pb-2">
        {/* Speech Bubble in Lilac */}
        <div className="mb-1 px-4 py-1.5 rounded-2xl bg-[#E5DAF2] border border-[#D5C6E6] shadow-sm text-xs font-bold text-[#3D2852] relative">
          <span>{!isSessionPaused ? 'I believe in you! 🌟' : "Whenever you're ready! 🌸"}</span>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#E5DAF2] border-r border-b border-[#D5C6E6] transform rotate-45" />
        </div>

        {/* Waving Fairy Companion */}
        <div className="mb-1">
          <CompanionAvatar
            mood={currentMood}
            size="md"
            showBubble={false}
            isWaving={true}
          />
        </div>

        {/* Daily Focus Footer */}
        <div className="text-xs font-bold text-white/90 drop-shadow-sm flex items-center gap-1">
          <span>{bondStats.focusMinutesToday + 1}m focused today</span>
          <span>🌿</span>
        </div>
      </div>
    </div>
  );
};
