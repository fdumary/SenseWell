import React, { useState } from 'react';
import { MoodState } from '../../types';
import { Heart } from 'lucide-react';

interface CompanionAvatarProps {
  mood?: MoodState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBubble?: boolean;
  bubbleText?: string;
  isWaving?: boolean;
  onInteract?: () => void;
}

export const CompanionAvatar: React.FC<CompanionAvatarProps> = ({
  mood = 'happy',
  size = 'md',
  showBubble = true,
  bubbleText,
  isWaving = false,
  onInteract,
}) => {
  const [isPetted, setIsPetted] = useState(false);

  const getMoodConfig = () => {
    switch (mood) {
      case 'hyped':
        return {
          quote: "Buzzing with excitement! Let's conquer this session! ⚡",
          status: 'Hyped & Focused',
          tag: '✨ Hyped',
          bodyColor: '#48bb78',
          bellyColor: '#c6f6d5',
        };
      case 'calm':
        return {
          quote: 'Taking it one steady breath at a time. 🍃',
          status: 'Calm & Grounded',
          tag: '🍃 Calm',
          bodyColor: '#38a169',
          bellyColor: '#e6fffa',
        };
      case 'tired':
        return {
          quote: 'Gentle pace today. Remember to rest your eyes. 🌙',
          status: 'Resting softly',
          tag: '🌙 Tired',
          bodyColor: '#4a5568',
          bellyColor: '#e2e8f0',
        };
      case 'meh':
        return {
          quote: "I'm right here with you. No pressure today. ☁️",
          status: 'Quietly present',
          tag: '☁️ Meh',
          bodyColor: '#5a677d',
          bellyColor: '#edf2f7',
        };
      case 'happy':
      default:
        return {
          quote: 'Great vibes today — let us bloom! 🌸',
          status: 'Happy & content',
          tag: '🌸 Happy',
          bodyColor: '#4a9b59',
          bellyColor: '#d8f3dc',
        };
    }
  };

  const config = getMoodConfig();

  const handlePet = () => {
    setIsPetted(true);
    if (onInteract) onInteract();
    setTimeout(() => setIsPetted(false), 1500);
  };

  const sizeDimensions = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-44 h-44',
  }[size];

  return (
    <div className="relative flex flex-col items-center select-none group">
      {/* Speech Bubble */}
      {showBubble && (
        <div className="mb-2 max-w-xs transition-all duration-300 transform group-hover:-translate-y-0.5">
          <div className="relative px-3.5 py-1.5 rounded-2xl bg-white border border-[#EAE6DC] shadow-sm text-xs font-semibold text-[#2D3748] flex items-center gap-1.5">
            <span>{bubbleText || config.quote}</span>
            {/* Bubble arrow */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r border-b border-[#EAE6DC] transform rotate-45" />
          </div>
        </div>
      )}

      {/* Vector Illustration of "Fern" */}
      <div
        onClick={handlePet}
        className={`${sizeDimensions} relative cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95`}
        title="Click to pet Fern"
      >
        <svg
          viewBox="0 0 120 120"
          className={`w-full h-full relative z-10 transition-all duration-500 ${
            isPetted ? 'animate-bounce' : 'animate-float-gentle'
          }`}
        >
          <defs>
            {/* Soft Shadow */}
            <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2D3748" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2D3748" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Under-shadow */}
          <ellipse cx="60" cy="112" rx="30" ry="6" fill="url(#shadowGrad)" />

          {/* --- EARS --- */}
          {/* Left Ear */}
          <ellipse cx="38" cy="30" rx="14" ry="16" fill="#4a9b59" />
          <ellipse cx="38" cy="30" rx="9" ry="11" fill="#367442" />

          {/* Right Ear */}
          <ellipse cx="82" cy="30" rx="14" ry="16" fill="#4a9b59" />
          <ellipse cx="82" cy="30" rx="9" ry="11" fill="#367442" />

          {/* --- WHITE FLOWER ON RIGHT EAR (Signature Fern Feature) --- */}
          <g transform="translate(82, 25)">
            {/* 5 White Petals */}
            <circle cx="0" cy="-9" r="6" fill="#FFFFFF" />
            <circle cx="8" cy="-3" r="6" fill="#FFFFFF" />
            <circle cx="5" cy="7" r="6" fill="#FFFFFF" />
            <circle cx="-5" cy="7" r="6" fill="#FFFFFF" />
            <circle cx="-8" cy="-3" r="6" fill="#FFFFFF" />
            {/* Flower Center */}
            <circle cx="0" cy="0" r="4.5" fill="#FBBF24" />
          </g>

          {/* --- BODY --- */}
          {/* Main Body */}
          <ellipse cx="60" cy="74" rx="30" ry="28" fill="#4a9b59" />

          {/* Light Green Belly Patch */}
          <ellipse cx="60" cy="77" rx="19" ry="18" fill="#D8F3DC" />

          {/* --- FEET --- */}
          <ellipse cx="44" cy="100" rx="11" ry="8" fill="#367442" />
          <ellipse cx="76" cy="100" rx="11" ry="8" fill="#367442" />

          {/* --- ARMS / PAWS --- */}
          {isWaving ? (
            /* Waving Up Arms */
            <g>
              <ellipse cx="30" cy="56" rx="8" ry="12" fill="#4a9b59" transform="rotate(-30 30 56)" />
              <ellipse cx="90" cy="56" rx="8" ry="12" fill="#4a9b59" transform="rotate(30 90 56)" />
            </g>
          ) : (
            /* Resting Paws */
            <g>
              <ellipse cx="34" cy="72" rx="7" ry="10" fill="#4a9b59" transform="rotate(15 34 72)" />
              <ellipse cx="86" cy="72" rx="7" ry="10" fill="#4a9b59" transform="rotate(-15 86 72)" />
            </g>
          )}

          {/* --- HEAD --- */}
          <circle cx="60" cy="48" r="27" fill="#5cb36d" />

          {/* Soft Cheeks */}
          <ellipse cx="42" cy="53" rx="4.5" ry="2.5" fill="#F472B6" fillOpacity="0.45" />
          <ellipse cx="78" cy="53" rx="4.5" ry="2.5" fill="#F472B6" fillOpacity="0.45" />

          {/* --- EYES --- */}
          {mood === 'tired' ? (
            /* Sleepy Closed Eyes */
            <g stroke="#1F2937" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M 44 48 Q 48 53 52 48" />
              <path d="M 68 48 Q 72 53 76 48" />
            </g>
          ) : (
            /* Big Glossy Dark Eyes */
            <g>
              {/* Left Eye */}
              <circle cx="48" cy="46" r="6" fill="#1F2937" />
              <circle cx="46" cy="44" r="2.2" fill="#FFFFFF" />
              <circle cx="50" cy="47" r="1.1" fill="#FFFFFF" />

              {/* Right Eye */}
              <circle cx="72" cy="46" r="6" fill="#1F2937" />
              <circle cx="70" cy="44" r="2.2" fill="#FFFFFF" />
              <circle cx="74" cy="47" r="1.1" fill="#FFFFFF" />
            </g>
          )}

          {/* --- NOSE & MOUTH --- */}
          <ellipse cx="60" cy="50" rx="3.5" ry="2.5" fill="#2E6B39" />
          <path
            d="M 55 54 Q 60 59 65 54"
            fill="none"
            stroke="#2E6B39"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>

        {/* Heart effect when petted */}
        {isPetted && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-pink-500 animate-bounce flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-pink-200 text-[11px] shadow-sm">
            <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
            <span className="font-bold text-pink-600">Loved!</span>
          </div>
        )}
      </div>
    </div>
  );
};
