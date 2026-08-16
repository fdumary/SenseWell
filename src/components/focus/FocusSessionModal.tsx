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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-6 bg-[#8FAECB] bg-gradient-to-b from-[#7CA0C7] via-[#8BB3DD] to-[#5A9451] overflow-y-auto animate-in fade-in duration-300 select-none">
      {/* Top Header Bar */}
      <div className="w-full max-w-md flex items-center justify-between z-20 pt-2">
        {/* Back to Garden Button */}
        <button
          onClick={endFocusSession}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 text-[#2D3748] text-xs font-bold shadow-sm border border-[#EAE6DC] hover:bg-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Garden</span>
        </button>

        {/* Center Title */}
        <span className="font-pixel text-xs sm:text-sm font-bold text-white tracking-widest uppercase drop-shadow-md">
          Focus Session
        </span>

        {/* Right Mood Pill */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 text-[#2D3748] text-xs font-bold shadow-sm border border-[#EAE6DC]">
          <span>{moodTag.emoji}</span>
          <span className="capitalize">{moodTag.label}</span>
        </div>
      </div>

      {/* Main Centered Floating Card */}
      <div className="w-full max-w-md my-auto pt-4 pb-2">
        <div className="relative rounded-[32px] bg-[#FFFDF9] border border-[#EAE6DC] p-6 sm:p-8 shadow-xl text-center flex flex-col items-center">
          {/* Subtle Decorative Leaf Sprigs & Sparkles in Corners */}
          <div className="absolute top-3 left-4 pointer-events-none">
            <img src="/assets/trimmed/Extra decor/yellow_stars.png" alt="Stars" className="w-5 h-5 object-contain opacity-80" />
          </div>
          <div className="absolute top-3 right-4 pointer-events-none">
            <img src="/assets/trimmed/Extra decor/yellow_stars.png" alt="Stars" className="w-5 h-5 object-contain opacity-80" />
          </div>

          {/* Session Header Tag */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-pixel text-[11px] text-[#718096] uppercase tracking-wider">
              Session {bondStats.sessionsCompleted + 1} &bull;
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#FFF1F2] border border-[#FBCFE8] text-xs font-bold text-[#E11D48] flex items-center gap-1">
              <span>{moodTag.emoji}</span>
              <span>{moodTag.label}</span>
            </span>
          </div>

          {/* Message Prompt */}
          <h2 className="text-sm sm:text-base font-bold text-[#2D3748] mb-4">
            {!isSessionPaused
              ? 'Great vibes today — let us bloom! 🌸'
              : 'Ready when you are! 🌸'}
          </h2>

          {/* Big Retro 8-bit Pixel Timer Display */}
          <div className="my-2 select-none">
            <div className="text-6xl sm:text-7xl font-pixel font-bold tracking-widest text-[#234E32] drop-shadow-sm">
              {formatTimer(sessionRemainingSeconds)}
            </div>
          </div>

          {/* Decorative Vine Progress Line */}
          <div className="w-3/4 flex items-center justify-center my-3 text-[#A89FDC] opacity-70">
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#A89FDC] to-transparent" />
          </div>

          {/* Next Break Indicator Sub-box */}
          <div className="w-full p-3 rounded-2xl bg-[#FAF7F0] border border-[#E8E3D7] mb-6 text-left">
            <div className="flex items-center justify-between text-xs font-bold text-[#4A7C59] mb-1.5">
              <div className="flex items-center gap-1.5">
                <span>🍃</span>
                <span>Next break in {Math.ceil(sessionRemainingSeconds / 60)} min</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-[#EAE6DC] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#4A7C59] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${((25 * 60 - sessionRemainingSeconds) / (25 * 60)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Primary Action Button: Pause / Resume */}
          {!isSessionPaused ? (
            <button
              onClick={pauseFocusSession}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#A89FDC] hover:bg-[#958ACF] text-white font-bold text-base shadow-figma-lavender flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Pause className="w-5 h-5 fill-white" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={resumeFocusSession}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#4A7C59] hover:bg-[#3D684A] text-white font-bold text-base shadow-figma-button flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Resume</span>
            </button>
          )}

          {/* Secondary End Session Link */}
          <button
            onClick={endFocusSession}
            className="mt-3 text-xs text-[#718096] hover:text-[#2D3748] font-bold underline cursor-pointer"
          >
            end session
          </button>
        </div>
      </div>

      {/* Bottom Area: Speech Bubble, Fern waving, and Daily Focus Note */}
      <div className="flex flex-col items-center z-20 pb-2">
        {/* Speech Bubble */}
        <div className="mb-1 px-4 py-2 rounded-2xl bg-white border border-[#EAE6DC] shadow-md text-xs font-bold text-[#2D3748] relative">
          <span>{!isSessionPaused ? 'I believe in you! 🌟' : "Whenever you're ready! 🌸"}</span>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r border-b border-[#EAE6DC] transform rotate-45" />
        </div>

        {/* Waving Fern Avatar */}
        <div className="mb-2">
          <CompanionAvatar
            mood={currentMood}
            size="md"
            showBubble={false}
            isWaving={true}
          />
        </div>

        {/* Daily Focus Footer */}
        <div className="text-xs font-bold text-white drop-shadow-sm flex items-center gap-1">
          <span>{bondStats.focusMinutesToday + 1}m focused today</span>
          <span>🌿</span>
        </div>
      </div>
    </div>
  );
};
