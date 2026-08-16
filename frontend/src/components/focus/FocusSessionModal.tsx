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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-[#2B3D23] via-[#33482A] to-[#201609] overflow-y-auto animate-in fade-in duration-300 select-none">
      <div className="w-full max-w-md flex items-center justify-between z-20 pt-2">
        <button
          onClick={endFocusSession}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#251A0B]/90 text-[#EDE6D6] text-xs font-bold shadow-sm border border-[#4E391F] hover:bg-[#382810] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Garden</span>
        </button>

        <span className="font-pixel text-xs sm:text-sm font-bold text-[#D4E8CF] tracking-widest uppercase drop-shadow-2xs">
          Focus Session
        </span>

        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#251A0B]/90 text-[#EDE6D6] text-xs font-bold shadow-sm border border-[#4E391F]">
          <span>{moodTag.emoji}</span>
          <span className="capitalize">{moodTag.label}</span>
        </div>
      </div>

      <div className="w-full max-w-md my-auto pt-4 pb-2">
        <div className="relative rounded-[32px] bg-[#3E2714] border-2 border-[#6E5033] p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center">
          <div className="absolute top-3 left-4 pointer-events-none">
            <img src="/assets/trimmed/Extra decor/yellow_stars.png" alt="Stars" className="w-5 h-5 object-contain opacity-80" />
          </div>
          <div className="absolute top-3 right-4 pointer-events-none">
            <img src="/assets/trimmed/Extra decor/yellow_stars.png" alt="Stars" className="w-5 h-5 object-contain opacity-80" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-pixel text-[11px] text-[#A68F78] uppercase tracking-wider">
              Session {bondStats.sessionsCompleted + 1} &bull;
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#2A1C0E] border border-[#5C442A] text-xs font-bold text-[#EADBB7] flex items-center gap-1">
              <span>{moodTag.emoji}</span>
              <span>{moodTag.label}</span>
            </span>
          </div>

          <h2 className="text-sm sm:text-base font-bold text-[#EDE6D6] mb-4">
            {!isSessionPaused
              ? 'Great vibes today — let us bloom! 🌸'
              : 'Ready when you are! 🌸'}
          </h2>

          <div className="my-2 select-none">
            <div className="text-6xl sm:text-7xl font-pixel font-bold tracking-widest text-[#EDE6D6] drop-shadow-md">
              {formatTimer(sessionRemainingSeconds)}
            </div>
          </div>

          <div className="w-3/4 flex items-center justify-center my-3 opacity-60">
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#6E5033] to-transparent" />
          </div>

          <div className="w-full p-3 rounded-2xl bg-[#2A1C0E] border border-[#5C442A] mb-6 text-left">
            <div className="flex items-center justify-between text-xs font-bold text-[#98C992] mb-1.5">
              <div className="flex items-center gap-1.5">
                <span>🍃</span>
                <span>Next break in {Math.ceil(sessionRemainingSeconds / 60)} min</span>
              </div>
            </div>
            <div className="w-full bg-[#1A1208] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#4D7C54] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${((25 * 60 - sessionRemainingSeconds) / (25 * 60)) * 100}%`,
                }}
              />
            </div>
          </div>

          {!isSessionPaused ? (
            <button
              onClick={pauseFocusSession}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#433868] hover:bg-[#362D54] text-white border border-[#594B8A] font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Pause className="w-5 h-5 fill-white text-white" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={resumeFocusSession}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#48694B] hover:bg-[#3D5C3F] text-white border border-[#5D8460] font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white text-white" />
              <span>Resume</span>
            </button>
          )}

          <button
            onClick={endFocusSession}
            className="mt-3 text-xs text-[#A68F78] hover:text-[#EDE6D6] font-bold underline cursor-pointer"
          >
            end session
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center z-20 pb-2">
        <div className="mb-1 px-4 py-1.5 rounded-2xl bg-[#4A3720] border border-[#6E5033] shadow-md text-xs font-bold text-[#EDE6D6] relative">
          <span>{!isSessionPaused ? 'I believe in you! 🌟' : "Whenever you're ready! 🌸"}</span>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#4A3720] border-r border-b border-[#6E5033] transform rotate-45" />
        </div>

        <div className="mb-1">
          <CompanionAvatar
            mood={currentMood}
            size="md"
            showBubble={false}
            isWaving={true}
          />
        </div>

        <div className="text-xs font-bold text-[#D4E8CF] drop-shadow-sm flex items-center gap-1">
          <span>{bondStats.focusMinutesToday + 1}m focused today</span>
          <span>🌿</span>
        </div>
      </div>
    </div>
  );
};
