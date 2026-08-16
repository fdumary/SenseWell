import React, { useState } from 'react';
import { useKinetic } from '../../context/KineticContext';
import { CompanionAvatar } from './CompanionAvatar';
import { Timer } from 'lucide-react';

export const MoodGardenCanvas: React.FC = () => {
  const { currentMood } = useKinetic();

  const [activeRipple, setActiveRipple] = useState<{ x: number; y: number; id: number } | null>(null);

  const handleGardenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setActiveRipple({ x, y, id: Date.now() });
  };

  const getMoodPill = () => {
    switch (currentMood) {
      case 'hyped':
        return { label: 'Hyped', emoji: '✨' };
      case 'calm':
        return { label: 'Calm', emoji: '🍃' };
      case 'tired':
        return { label: 'Tired', emoji: '🌙' };
      case 'meh':
        return { label: 'Meh', emoji: '☁️' };
      case 'happy':
      default:
        return { label: 'Happy', emoji: '🌸' };
    }
  };

  const moodPill = getMoodPill();

  return (
    <div
      onClick={handleGardenClick}
      className="relative w-full h-[400px] sm:h-[450px] rounded-3xl overflow-hidden shadow-sm border border-[#DCE8D8] select-none cursor-pointer group"
      style={{
        background: 'linear-gradient(180deg, #7EA2C6 0%, #90B4D8 35%, #A7C7E7 60%)',
      }}
    >
      {/* Sun */}
      <div className="absolute top-4 right-14 w-16 h-16 rounded-full bg-[#FEF08A]/40 blur-md pointer-events-none" />
      <div className="absolute top-6 right-16 w-12 h-12 rounded-full bg-[#FEF3C7] opacity-80 pointer-events-none" />

      {/* Fluffy Clouds */}
      <div className="absolute top-3 left-6 w-24 h-12 bg-white/75 rounded-full blur-[1px] pointer-events-none" />
      <div className="absolute top-6 left-12 w-28 h-10 bg-white/70 rounded-full blur-[1px] pointer-events-none" />
      <div className="absolute top-4 left-44 w-32 h-14 bg-white/60 rounded-full blur-[1px] pointer-events-none" />

      {/* Top HUD overlay matching Figma */}
      <div className="absolute top-3.5 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Left Timer Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A7C59]/80 backdrop-blur-sm text-white text-xs font-bold font-pixel tracking-wide border border-white/20 shadow-sm">
          <Timer className="w-3.5 h-3.5" />
          <span>25m</span>
        </div>

        {/* Right Mood Badge */}
        <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/95 text-[#2D3748] text-xs font-bold shadow-sm border border-[#EAE6DC]">
          <span>{moodPill.emoji}</span>
          <span className="capitalize">{moodPill.label}</span>
        </div>
      </div>

      {/* Ripple Animation on tap */}
      {activeRipple && (
        <div
          key={activeRipple.id}
          className="absolute rounded-full border-2 border-white/60 pointer-events-none animate-ping z-30"
          style={{
            left: activeRipple.x - 20,
            top: activeRipple.y - 20,
            width: 40,
            height: 40,
          }}
        />
      )}

      {/* Scenic Vector Landscape matching Figma Screenshot 3 */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 450">
        <defs>
          <linearGradient id="hillBack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A4CCA0" />
            <stop offset="100%" stopColor="#8FB88A" />
          </linearGradient>
          <linearGradient id="hillMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7EAA75" />
            <stop offset="100%" stopColor="#67945E" />
          </linearGradient>
          <linearGradient id="grassFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#55884D" />
            <stop offset="100%" stopColor="#46733E" />
          </linearGradient>
        </defs>

        {/* Distant Hills Layer 1 */}
        <path d="M -10 180 Q 80 120 200 155 T 410 130 L 410 450 L -10 450 Z" fill="url(#hillBack)" />

        {/* Distant Trees */}
        <g fill="#4A7545">
          <ellipse cx="68" cy="140" rx="6" ry="12" />
          <ellipse cx="130" cy="130" rx="7" ry="14" />
          <ellipse cx="275" cy="130" rx="7" ry="13" />
          <ellipse cx="330" cy="170" rx="9" ry="17" />
          <ellipse cx="365" cy="160" rx="10" ry="19" />
        </g>

        {/* Middle Hills Layer 2 */}
        <path d="M -10 205 Q 120 160 260 195 T 410 175 L 410 450 L -10 450 Z" fill="url(#hillMid)" />

        {/* Mid-ground Trees */}
        <g fill="#3D683A">
          <ellipse cx="30" cy="185" rx="12" ry="20" />
          <ellipse cx="65" cy="195" rx="10" ry="16" />
          <ellipse cx="108" cy="190" rx="11" ry="18" />
        </g>

        {/* Foreground Meadow Base */}
        <path d="M -10 230 Q 180 215 410 225 L 410 450 L -10 450 Z" fill="url(#grassFront)" />

        {/* Winding Cobblestone / Dirt Path in Center */}
        <path
          d="M 185 190 C 180 260 170 330 150 450 L 205 450 C 220 330 215 260 205 190 Z"
          fill="#D6C4A2"
          stroke="#C4B08C"
          strokeWidth="1.5"
        />

        {/* Path Stepping Stones */}
        <g fill="#E3D5B9" opacity="0.8">
          <ellipse cx="193" cy="220" rx="8" ry="4" />
          <ellipse cx="190" cy="250" rx="9" ry="5" />
          <ellipse cx="186" cy="285" rx="10" ry="6" />
          <ellipse cx="180" cy="325" rx="11" ry="6.5" />
          <ellipse cx="174" cy="370" rx="13" ry="7" />
          <ellipse cx="168" cy="415" rx="15" ry="8" />
        </g>

        {/* --- LEFT WOODEN TRELLIS WITH FLOWERS --- */}
        <g transform="translate(40, 215)">
          {/* Wood Lattice */}
          <rect x="0" y="0" width="6" height="50" fill="#C48E59" rx="1" />
          <rect x="25" y="0" width="6" height="50" fill="#C48E59" rx="1" />
          <rect x="50" y="0" width="6" height="50" fill="#C48E59" rx="1" />
          <rect x="-4" y="8" width="62" height="5" fill="#C48E59" rx="1" />
          <rect x="-4" y="24" width="62" height="5" fill="#C48E59" rx="1" />
          <rect x="-4" y="40" width="62" height="5" fill="#C48E59" rx="1" />

          {/* Climbing Blossom Foliage */}
          <ellipse cx="28" cy="30" rx="32" ry="14" fill="#3D683A" />
          {/* Pink and Lavender Flowers */}
          <circle cx="10" cy="25" r="7" fill="#F472B6" />
          <circle cx="10" cy="25" r="2.5" fill="#FDE047" />
          <circle cx="28" cy="32" r="8" fill="#FBCFE8" />
          <circle cx="28" cy="32" r="3" fill="#FDE047" />
          <circle cx="45" cy="28" r="7.5" fill="#C4B5FD" />
          <circle cx="45" cy="28" r="2.5" fill="#FDE047" />
          <circle cx="20" cy="40" r="6" fill="#F472B6" />
          <circle cx="36" cy="42" r="6" fill="#FBCFE8" />
        </g>

        {/* --- RIGHT WOODEN TRELLIS WITH FLOWERS --- */}
        <g transform="translate(270, 215)">
          {/* Wood Lattice */}
          <rect x="0" y="0" width="6" height="50" fill="#C48E59" rx="1" />
          <rect x="25" y="0" width="6" height="50" fill="#C48E59" rx="1" />
          <rect x="50" y="0" width="6" height="50" fill="#C48E59" rx="1" />
          <rect x="-4" y="8" width="62" height="5" fill="#C48E59" rx="1" />
          <rect x="-4" y="24" width="62" height="5" fill="#C48E59" rx="1" />
          <rect x="-4" y="40" width="62" height="5" fill="#C48E59" rx="1" />

          {/* Climbing Blossom Foliage */}
          <ellipse cx="28" cy="30" rx="32" ry="14" fill="#3D683A" />
          {/* Pink and Purple Flowers */}
          <circle cx="12" cy="28" r="8" fill="#C4B5FD" />
          <circle cx="12" cy="28" r="3" fill="#FDE047" />
          <circle cx="30" cy="24" r="7" fill="#F472B6" />
          <circle cx="30" cy="24" r="2.5" fill="#FDE047" />
          <circle cx="46" cy="32" r="7.5" fill="#FBCFE8" />
          <circle cx="46" cy="32" r="2.5" fill="#FDE047" />
          <circle cx="22" cy="38" r="6" fill="#FBCFE8" />
          <circle cx="38" cy="40" r="6" fill="#F472B6" />
        </g>

        {/* --- BUTTERFLIES FLUTTERING --- */}
        {/* Left Pink Butterfly */}
        <g transform="translate(85, 205)" className="animate-flutter">
          <ellipse cx="-4" cy="-4" rx="6" ry="8" fill="#FBCFE8" transform="rotate(-20 -4 -4)" />
          <ellipse cx="4" cy="-4" rx="6" ry="8" fill="#FBCFE8" transform="rotate(20 4 -4)" />
          <line x1="0" y1="-8" x2="0" y2="4" stroke="#4B5563" strokeWidth="1" />
        </g>
        {/* Right Lavender Butterfly */}
        <g transform="translate(260, 220)" className="animate-flutter">
          <ellipse cx="-4" cy="-4" rx="6" ry="8" fill="#DDD6FE" transform="rotate(-20 -4 -4)" />
          <ellipse cx="4" cy="-4" rx="6" ry="8" fill="#DDD6FE" transform="rotate(20 4 -4)" />
          <line x1="0" y1="-8" x2="0" y2="4" stroke="#4B5563" strokeWidth="1" />
        </g>

        {/* --- LITTLE LILY POND (Bottom Right) --- */}
        <g transform="translate(320, 360)">
          <ellipse cx="30" cy="18" rx="35" ry="16" fill="#7EADC7" stroke="#A4CDDD" strokeWidth="1.5" />
          {/* Lily pad */}
          <ellipse cx="25" cy="18" rx="10" ry="5" fill="#4B8845" />
          <circle cx="28" cy="16" r="3" fill="#FDE047" />
        </g>

        {/* --- MUSHROOMS & WILD FLOWERS IN MEADOW --- */}
        {/* Red Mushrooms */}
        <g transform="translate(230, 245)">
          <rect x="2" y="5" width="3" height="6" fill="#E2DDD0" />
          <path d="M 0 5 Q 3.5 0 7 5 Z" fill="#EF4444" />
          <circle cx="3.5" cy="3" r="0.7" fill="#FFFFFF" />
        </g>
        <g transform="translate(150, 310)">
          <rect x="2" y="5" width="2.5" height="5" fill="#E2DDD0" />
          <path d="M 0 5 Q 3 0 6 5 Z" fill="#EF4444" />
          <circle cx="3" cy="3" r="0.6" fill="#FFFFFF" />
        </g>

        {/* Meadow Daisies */}
        <circle cx="130" cy="275" r="3.5" fill="#FDE2E4" />
        <circle cx="130" cy="275" r="1.2" fill="#FDE047" />
        <circle cx="240" cy="290" r="3.5" fill="#E0AAFF" />
        <circle cx="240" cy="290" r="1.2" fill="#FDE047" />
        <circle cx="260" cy="330" r="4" fill="#BEE1E6" />
        <circle cx="260" cy="330" r="1.5" fill="#FDE047" />
        <circle cx="105" cy="340" r="4" fill="#FDE2E4" />
        <circle cx="105" cy="340" r="1.5" fill="#FDE047" />
        <circle cx="75" cy="380" r="4.5" fill="#BEE1E6" />
        <circle cx="75" cy="380" r="1.5" fill="#FDE047" />

        {/* Wooden Sign on Left "my garden" */}
        <g transform="translate(10, 255)">
          <rect x="18" y="16" width="4" height="24" fill="#8C653C" rx="1" />
          <rect x="0" y="0" width="38" height="20" fill="#B88A58" stroke="#8C653C" strokeWidth="1" rx="3" />
          <text x="5" y="12" fill="#4B331A" fontSize="6.5" fontFamily="monospace" fontWeight="bold">my garden</text>
        </g>
      </svg>

      {/* Fern Walking in the Path */}
      <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 z-20">
        <CompanionAvatar
          mood={currentMood}
          size="sm"
          showBubble={false}
        />
      </div>
    </div>
  );
};
