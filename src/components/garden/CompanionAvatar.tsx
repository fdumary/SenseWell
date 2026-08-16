import React, { useState } from 'react';
import { MoodState } from '../../types';

interface CompanionAvatarProps {
  mood?: MoodState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBubble?: boolean;
  bubbleText?: string;
  isWaving?: boolean;
  isWalking?: boolean;
  walkingDirection?: 'left' | 'right';
  onInteract?: () => void;
}

export const CompanionAvatar: React.FC<CompanionAvatarProps> = ({
  mood = 'happy',
  size = 'md',
  showBubble = true,
  bubbleText,
  isWaving = false,
  isWalking = false,
  walkingDirection = 'right',
  onInteract,
}) => {
  const [isPetted, setIsPetted] = useState(false);

  const getMoodConfig = () => {
    switch (mood) {
      case 'hyped':
        return {
          quote: "Buzzing with excitement! Let's conquer this session! ⚡",
          status: 'Hyped & Focused',
          sprite: '/assets/trimmed/Companion/companion_surprised.png',
        };
      case 'calm':
        return {
          quote: 'Taking it one steady breath at a time. 🍃',
          status: 'Calm & Grounded',
          sprite: '/assets/trimmed/Companion/companion_idle.png',
        };
      case 'tired':
        return {
          quote: 'Gentle pace today. Remember to rest your eyes. 🌙',
          status: 'Resting softly',
          sprite: '/assets/trimmed/Companion/companion_sleeping.png',
        };
      case 'meh':
        return {
          quote: "I'm right here with you. No pressure today. ☁️",
          status: 'Quietly present',
          sprite: '/assets/trimmed/Companion/companion_idle.png',
        };
      case 'happy':
      default:
        return {
          quote: 'Great vibes today — let us bloom! 🌸',
          status: 'Happy & content',
          sprite: '/assets/trimmed/Companion/companion_happy.png',
        };
    }
  };

  const config = getMoodConfig();

  // Pick sprite based on state
  let currentSprite = config.sprite;
  if (isWalking) {
    currentSprite =
      walkingDirection === 'left'
        ? '/assets/trimmed/Companion/companion_walking_left.png'
        : '/assets/trimmed/Companion/companion_walking_right.png';
  } else if (isWaving) {
    currentSprite = '/assets/trimmed/Companion/companion_happy.png';
  }

  const handlePet = () => {
    setIsPetted(true);
    if (onInteract) onInteract();
    setTimeout(() => setIsPetted(false), 1500);
  };

  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-44 h-44',
  }[size];

  return (
    <div className="relative flex flex-col items-center select-none group">
      {/* Speech Bubble */}
      {showBubble && (
        <div className="mb-2 max-w-xs transition-all duration-300 transform group-hover:-translate-y-0.5 z-20">
          <div className="relative px-3.5 py-1.5 rounded-2xl bg-white border border-[#EAE6DC] shadow-sm text-xs font-semibold text-[#2D3748] flex items-center gap-1.5">
            <span>{bubbleText || config.quote}</span>
            {/* Bubble arrow */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r border-b border-[#EAE6DC] transform rotate-45" />
          </div>
        </div>
      )}

      {/* Real Imported Companion Sprite */}
      <div
        onClick={handlePet}
        className={`${sizeClasses} relative cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 flex items-center justify-center`}
        title="Click to pet your companion"
      >
        <img
          src={currentSprite}
          alt="Companion"
          className={`w-full h-full object-contain drop-shadow-md transition-all duration-300 ${
            isPetted ? 'animate-bounce' : 'animate-float-gentle'
          }`}
          onError={e => {
            // Graceful fallback to idle sprite if needed
            (e.currentTarget as HTMLImageElement).src = '/assets/trimmed/Companion/companion_idle.png';
          }}
        />

        {/* Floating Hearts effect when clicked */}
        {isPetted && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center animate-bounce z-30 pointer-events-none">
            <img
              src="/assets/trimmed/Extra decor/hearts.png"
              alt="Love"
              className="w-10 h-10 object-contain drop-shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};
