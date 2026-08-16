import React, { useState } from 'react';
import { MoodState } from '../../types';
import { Heart } from 'lucide-react';

interface CompanionAvatarProps {
  mood: MoodState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBubble?: boolean;
  onInteract?: () => void;
}

export const CompanionAvatar: React.FC<CompanionAvatarProps> = ({
  mood,
  size = 'md',
  showBubble = true,
  onInteract,
}) => {
  const [isPetted, setIsPetted] = useState(false);

  const getCompanionState = () => {
    switch (mood) {
      case 'stressed':
        return {
          name: 'Sprout',
          expression: 'concerned',
          glow: 'rgba(251, 113, 133, 0.4)',
          leafColor: '#f43f5e',
          bodyColor: '#334155',
          blush: '#fda4af',
          message: 'I sensed rapid jitter... take a gentle breath with me?',
          action: '4-7-8 Breath',
          status: 'Holding space for you',
        };
      case 'deep-flow':
        return {
          name: 'Sprout',
          expression: 'starry',
          glow: 'rgba(52, 211, 153, 0.5)',
          leafColor: '#34d399',
          bodyColor: '#064e3b',
          blush: '#a7f3d0',
          message: 'You are in a beautiful rhythm. The garden is glowing.',
          action: 'Keep Flowing',
          status: 'In Deep Flow with you',
        };
      case 'fatigued':
        return {
          name: 'Sprout',
          expression: 'sleepy',
          glow: 'rgba(167, 139, 250, 0.4)',
          leafColor: '#a78bfa',
          bodyColor: '#1e1b4b',
          blush: '#ddd6fe',
          message: 'Your cursor has slowed down. Rest your eyes for 20 seconds?',
          action: 'Micro Rest',
          status: 'Resting quietly',
        };
      case 'wandering':
        return {
          name: 'Sprout',
          expression: 'curious',
          glow: 'rgba(251, 191, 36, 0.4)',
          leafColor: '#fbbf24',
          bodyColor: '#292524',
          blush: '#fde68a',
          message: 'Exploring thoughts? Gentle wandering is part of creating.',
          action: 'Ground Self',
          status: 'Daydreaming alongside',
        };
      case 'serene':
      default:
        return {
          name: 'Sprout',
          expression: 'gentle',
          glow: 'rgba(45, 212, 191, 0.4)',
          leafColor: '#2dd4bf',
          bodyColor: '#0f3a33',
          blush: '#99f6e4',
          message: 'All is peaceful. I am watching over the garden.',
          action: 'Rest Easy',
          status: 'Serene & Present',
        };
    }
  };

  const current = getCompanionState();

  const handlePet = () => {
    setIsPetted(true);
    if (onInteract) onInteract();
    setTimeout(() => setIsPetted(false), 1500);
  };

  const sizeDimensions = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
  }[size];

  return (
    <div className="relative flex flex-col items-center select-none group">
      {/* Interactive Speech Bubble */}
      {showBubble && (
        <div className="mb-3 max-w-xs transition-all duration-300 transform group-hover:-translate-y-1">
          <div className="relative px-4 py-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/25 backdrop-blur-md shadow-lg text-xs text-emerald-100 flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-emerald-200">{current.message}</p>
              <div className="mt-1 flex items-center justify-between text-[10px] text-emerald-400/80">
                <span>{current.status}</span>
                <span className="font-semibold underline cursor-pointer hover:text-emerald-300">
                  {current.action} &rarr;
                </span>
              </div>
            </div>
            {/* Bubble arrow */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-950/90 border-r border-b border-emerald-500/25 transform rotate-45" />
          </div>
        </div>
      )}

      {/* Companion Vector Creature */}
      <div
        onClick={handlePet}
        className={`${sizeDimensions} relative cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95`}
        title="Click to pet Sprout"
      >
        {/* Soft bioluminescent aura glow */}
        <div
          className="absolute inset-0 rounded-full blur-xl transition-all duration-700 opacity-70 animate-pulse-slow"
          style={{ backgroundColor: current.glow }}
        />

        {/* Animated Pure SVG Companion Creature */}
        <svg
          viewBox="0 0 120 120"
          className={`w-full h-full relative z-10 transition-all duration-500 ${
            isPetted ? 'animate-bounce' : 'animate-float-gentle'
          }`}
        >
          <defs>
            <radialGradient id="bodyGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="60%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#065f46" />
            </radialGradient>
            <radialGradient id="stressedGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="60%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#881337" />
            </radialGradient>
            <radialGradient id="flowGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="60%" stopColor="#059669" />
              <stop offset="100%" stopColor="#064e3b" />
            </radialGradient>
            <radialGradient id="fatigueGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="60%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#4c1d95" />
            </radialGradient>
            <radialGradient id="wanderingGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fcd34d" />
              <stop offset="60%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>
          </defs>

          {/* Plant Sprout Antenna with leaves */}
          <g className="origin-bottom transition-transform duration-700 animate-sway">
            {/* Stem */}
            <path
              d="M 60 40 Q 60 22 55 12"
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Left Leaf */}
            <path
              d="M 55 16 C 42 14 38 24 54 20 Z"
              fill={current.leafColor}
              stroke="#15803d"
              strokeWidth="1"
            />
            {/* Right Leaf */}
            <path
              d="M 55 12 C 68 8 72 20 56 16 Z"
              fill={current.leafColor}
              stroke="#15803d"
              strokeWidth="1"
            />
            {/* Dewdrop on leaf */}
            <circle cx="62" cy="11" r="2" fill="#ecfeff" fillOpacity="0.8" />
          </g>

          {/* Main Round Blob Body */}
          <ellipse
            cx="60"
            cy="70"
            rx="38"
            ry="34"
            fill={
              mood === 'stressed'
                ? 'url(#stressedGrad)'
                : mood === 'deep-flow'
                ? 'url(#flowGrad)'
                : mood === 'fatigued'
                ? 'url(#fatigueGrad)'
                : mood === 'wandering'
                ? 'url(#wanderingGrad)'
                : 'url(#bodyGrad)'
            }
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
          />

          {/* Soft Cheeks / Blush */}
          <ellipse cx="38" cy="74" rx="6" ry="3.5" fill={current.blush} fillOpacity="0.55" />
          <ellipse cx="82" cy="74" rx="6" ry="3.5" fill={current.blush} fillOpacity="0.55" />

          {/* Eyes depending on expression */}
          {current.expression === 'starry' ? (
            /* Deep Flow Starry Eyes */
            <g fill="#fef08a">
              <polygon points="46,62 48,67 53,68 49,71 50,76 46,73 42,76 43,71 39,68 44,67" />
              <polygon points="74,62 76,67 81,68 77,71 78,76 74,73 70,76 71,71 67,68 72,67" />
            </g>
          ) : current.expression === 'concerned' ? (
            /* Stressed / Concerned Eyes */
            <g>
              <circle cx="46" cy="66" r="4.5" fill="#0f172a" />
              <circle cx="74" cy="66" r="4.5" fill="#0f172a" />
              <circle cx="47.5" cy="64.5" r="1.5" fill="#ffffff" />
              <circle cx="75.5" cy="64.5" r="1.5" fill="#ffffff" />
              {/* Worried Eyebrows */}
              <path d="M 40 60 Q 46 58 50 63" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
              <path d="M 80 60 Q 74 58 70 63" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            </g>
          ) : current.expression === 'sleepy' ? (
            /* Fatigued Sleepy Closed Eyes */
            <g stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none">
              <path d="M 42 66 Q 46 72 50 66" />
              <path d="M 70 66 Q 74 72 78 66" />
              {/* Zzz floating */}
              <text x="86" y="50" fill="#a78bfa" fontSize="12" fontWeight="bold">z</text>
              <text x="94" y="42" fill="#c4b5fd" fontSize="10" fontWeight="bold">z</text>
            </g>
          ) : (
            /* Gentle / Serene / Default Eyes */
            <g fill="#062e24">
              <ellipse cx="46" cy="65" rx="4" ry="5.5" />
              <ellipse cx="74" cy="65" rx="4" ry="5.5" />
              {/* Highlights */}
              <circle cx="44.5" cy="63" r="1.8" fill="#ffffff" />
              <circle cx="72.5" cy="63" r="1.8" fill="#ffffff" />
              <circle cx="47.5" cy="67" r="0.8" fill="#ffffff" />
              <circle cx="75.5" cy="67" r="0.8" fill="#ffffff" />
            </g>
          )}

          {/* Mouth */}
          {current.expression === 'concerned' ? (
            <path
              d="M 55 77 Q 60 74 65 77"
              fill="none"
              stroke="#0f172a"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : current.expression === 'sleepy' ? (
            <ellipse cx="60" cy="76" rx="2.5" ry="3" fill="#334155" />
          ) : (
            <path
              d="M 54 74 Q 60 80 66 74"
              fill="none"
              stroke="#062e24"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Little stubby hands */}
          <ellipse cx="30" cy="78" rx="5" ry="4" fill="#10b981" />
          <ellipse cx="90" cy="78" rx="5" ry="4" fill="#10b981" />
        </svg>

        {/* Heart effect when petted */}
        {isPetted && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-rose-400 animate-bounce flex items-center gap-1 bg-emerald-950/90 px-2 py-0.5 rounded-full border border-rose-500/30 text-[11px]">
            <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
            <span className="font-semibold text-rose-200">Purr!</span>
          </div>
        )}
      </div>

      {/* Under-shadow */}
      <div className="w-20 h-3 bg-emerald-950/80 rounded-full blur-sm mt-1" />
    </div>
  );
};
