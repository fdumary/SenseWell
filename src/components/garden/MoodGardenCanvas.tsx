import React, { useState, useEffect } from 'react';
import { useGarden } from '../../context/GardenContext';
import { useKinetic } from '../../context/KineticContext';
import { CompanionAvatar } from './CompanionAvatar';
import { Timer } from 'lucide-react';

export const MoodGardenCanvas: React.FC = () => {
  const { bloomFactor } = useGarden();
  const { currentMood } = useKinetic();

  const [activeRipple, setActiveRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const [walkX, setWalkX] = useState<number>(0);
  const [walkDir, setWalkDir] = useState<'left' | 'right'>('right');

  // Ambient gentle roaming along the path
  useEffect(() => {
    const interval = setInterval(() => {
      setWalkX(prev => {
        if (prev >= 20) {
          setWalkDir('left');
          return prev - 4;
        } else if (prev <= -20) {
          setWalkDir('right');
          return prev + 4;
        }
        return walkDir === 'right' ? prev + 3 : prev - 3;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [walkDir]);

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

  // Dynamic Plant Asset based on bloom health
  const getPlantAsset = () => {
    if (bloomFactor >= 0.8) return '/assets/trimmed/Plant_Life/blooming.png';
    if (bloomFactor >= 0.5) return '/assets/trimmed/Plant_Life/growing.png';
    if (bloomFactor >= 0.25) return '/assets/trimmed/Plant_Life/seedling.png';
    return '/assets/trimmed/Plant_Life/wilted.png';
  };

  return (
    <div
      onClick={handleGardenClick}
      className="relative w-full h-[400px] sm:h-[450px] rounded-3xl overflow-hidden shadow-sm border border-[#DCE8D8] select-none cursor-pointer group"
      style={{
        background:
          currentMood === 'tired'
            ? 'linear-gradient(180deg, #1E293B 0%, #334155 45%, #475569 70%)'
            : currentMood === 'meh'
            ? 'linear-gradient(180deg, #64748B 0%, #94A3B8 45%, #CBD5E1 70%)'
            : 'linear-gradient(180deg, #7EA2C6 0%, #90B4D8 35%, #A7C7E7 60%)',
      }}
    >
      {/* Sun / Moon / Weather Asset */}
      {currentMood === 'tired' ? (
        <div className="absolute top-4 right-8 z-10 animate-float-gentle pointer-events-none">
          <img
            src="/assets/trimmed/Extra decor/moon.png"
            alt="Moon"
            className="w-14 h-14 object-contain drop-shadow-md"
          />
        </div>
      ) : currentMood === 'meh' ? (
        <div className="absolute top-3 right-6 z-10 animate-float-gentle pointer-events-none">
          <img
            src="/assets/trimmed/Extra decor/rain_cloud.png"
            alt="Rain Cloud"
            className="w-20 h-20 object-contain drop-shadow-sm"
          />
        </div>
      ) : (
        <div className="absolute top-3 right-6 z-10 animate-float-gentle pointer-events-none">
          <img
            src="/assets/trimmed/Extra decor/sun.png"
            alt="Sun"
            className="w-16 h-16 object-contain drop-shadow-md"
          />
        </div>
      )}

      {/* Fluffy Ambient Clouds */}
      <div className="absolute top-3 left-6 w-24 h-12 bg-white/75 rounded-full blur-[1px] pointer-events-none" />
      <div className="absolute top-6 left-16 w-28 h-10 bg-white/70 rounded-full blur-[1px] pointer-events-none" />

      {/* Top HUD overlay matching Figma */}
      <div className="absolute top-3.5 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        {/* Left Timer Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A7C59]/85 backdrop-blur-sm text-white text-xs font-bold font-pixel tracking-wide border border-white/20 shadow-sm">
          <Timer className="w-3.5 h-3.5" />
          <span>25m</span>
        </div>

        {/* Right Mood Badge */}
        <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/95 text-[#2D3748] text-xs font-bold shadow-sm border border-[#EAE6DC]">
          <span>{moodPill.emoji}</span>
          <span className="capitalize">{moodPill.label}</span>
        </div>
      </div>

      {/* Click Ripple */}
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

      {/* Rolling Hills Scenic Landscape Base */}
      <svg
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 400 450"
      >
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
        <path d="M -10 170 Q 80 115 200 150 T 410 120 L 410 450 L -10 450 Z" fill="url(#hillBack)" />

        {/* Middle Hills Layer 2 */}
        <path d="M -10 200 Q 120 155 260 190 T 410 170 L 410 450 L -10 450 Z" fill="url(#hillMid)" />

        {/* Foreground Meadow Base */}
        <path d="M -10 225 Q 180 210 410 220 L 410 450 L -10 450 Z" fill="url(#grassFront)" />

        {/* Center Path */}
        <path
          d="M 185 185 C 180 255 170 325 150 450 L 205 450 C 220 325 215 255 205 185 Z"
          fill="#D6C4A2"
          stroke="#C4B08C"
          strokeWidth="1.5"
        />
      </svg>

      {/* --- SCENIC DECOR ASSETS --- */}

      {/* Large Scenic Trees in Background */}
      <div className="absolute top-[85px] left-3 z-10 pointer-events-none opacity-90">
        <img src="/assets/trimmed/Extra decor/Tree.png" alt="Tree" className="w-20 h-24 object-contain" />
      </div>
      <div className="absolute top-[75px] right-8 z-10 pointer-events-none opacity-85">
        <img src="/assets/trimmed/Extra decor/Tree.png" alt="Tree" className="w-22 h-26 object-contain" />
      </div>

      {/* Bush & Tree Stump on Far Left */}
      <div className="absolute top-[200px] left-2 z-15 pointer-events-none">
        <img src="/assets/trimmed/Extra decor/Bush.png" alt="Bush" className="w-14 h-14 object-contain" />
      </div>
      <div className="absolute top-[225px] left-16 z-15 pointer-events-none">
        <img src="/assets/trimmed/Extra decor/Tree stump.png" alt="Stump" className="w-12 h-10 object-contain" />
      </div>

      {/* Left Wooden Fence with Lantern */}
      <div className="absolute top-[210px] left-[55px] z-15 pointer-events-none flex items-end">
        <img src="/assets/trimmed/Extra decor/Fence.png" alt="Fence" className="w-16 h-12 object-contain" />
        <img
          src="/assets/trimmed/Extra decor/Light post.png"
          alt="Lantern"
          className="w-6 h-14 object-contain -ml-2 -mb-1"
        />
      </div>

      {/* Right Wooden Fence & Cozy Bench */}
      <div className="absolute top-[210px] right-[55px] z-15 pointer-events-none flex items-end">
        <img src="/assets/trimmed/Extra decor/Fence.png" alt="Fence" className="w-16 h-12 object-contain" />
        <img
          src="/assets/trimmed/Extra decor/Bench.png"
          alt="Bench"
          className="w-14 h-10 object-contain -ml-1 -mb-1"
        />
      </div>

      {/* Stepping Stones / Pebbles on Path */}
      <div className="absolute top-[320px] left-[44%] -translate-x-1/2 z-15 pointer-events-none opacity-85">
        <img src="/assets/trimmed/Extra decor/Pebbles.png" alt="Pebbles" className="w-14 h-9 object-contain" />
      </div>

      {/* Red Mushrooms near Path */}
      <div className="absolute top-[265px] right-[105px] z-15 pointer-events-none">
        <img
          src="/assets/trimmed/Extra decor/Mushrooms.png"
          alt="Mushrooms"
          className="w-10 h-8 object-contain drop-shadow-sm"
        />
      </div>
      <div className="absolute top-[340px] left-[70px] z-15 pointer-events-none">
        <img
          src="/assets/trimmed/Extra decor/Mushrooms.png"
          alt="Mushrooms"
          className="w-9 h-7 object-contain drop-shadow-sm"
        />
      </div>

      {/* Watering Can on Grass */}
      <div className="absolute top-[330px] right-[75px] z-15 pointer-events-none">
        <img
          src="/assets/trimmed/Extra decor/Watering can.png"
          alt="Watering Can"
          className="w-11 h-9 object-contain drop-shadow-sm"
        />
      </div>

      {/* Dynamic Potted Plant Life (blooming / growing / seedling) */}
      <div className="absolute top-[245px] right-[18px] z-20 pointer-events-none transition-all duration-500 transform hover:scale-105">
        <img
          src={getPlantAsset()}
          alt="Garden Plant"
          className="w-20 h-26 object-contain drop-shadow-lg animate-float-gentle"
        />
      </div>

      {/* Water Pool / Drops in Bottom Right */}
      <div className="absolute bottom-2 right-2 z-15 pointer-events-none">
        <img
          src="/assets/trimmed/Extra decor/water.png"
          alt="Water"
          className="w-28 h-12 object-contain opacity-90"
        />
      </div>

      {/* Fluttering Butterflies & Bee */}
      <div className="absolute top-[185px] left-[90px] z-25 pointer-events-none animate-flutter">
        <img
          src="/assets/trimmed/Extra decor/pink_butterfly.png"
          alt="Butterfly"
          className="w-9 h-9 object-contain drop-shadow-sm"
        />
      </div>
      <div className="absolute top-[175px] right-[85px] z-25 pointer-events-none animate-flutter">
        <img
          src="/assets/trimmed/Extra decor/blue_butterfly.png"
          alt="Butterfly"
          className="w-9 h-9 object-contain drop-shadow-sm"
        />
      </div>
      <div className="absolute top-[270px] left-[40px] z-25 pointer-events-none animate-float-gentle">
        <img
          src="/assets/trimmed/Extra decor/bee.png"
          alt="Bee"
          className="w-10 h-8 object-contain drop-shadow-sm"
        />
      </div>

      {/* Floating Sakura Petals / Leaves in Breeze */}
      <div className="absolute top-[140px] left-[35%] z-20 pointer-events-none animate-float-gentle opacity-75">
        <img src="/assets/trimmed/Extra decor/petals.png" alt="Petals" className="w-6 h-12 object-contain" />
      </div>
      <div className="absolute top-[290px] right-[30%] z-20 pointer-events-none animate-float-gentle opacity-70">
        <img src="/assets/trimmed/Extra decor/leaves.png" alt="Leaves" className="w-8 h-10 object-contain" />
      </div>

      {/* Walking Fairy Companion on the Path */}
      <div
        className="absolute top-[48%] z-25 transition-transform duration-1000 ease-in-out"
        style={{
          left: `calc(50% + ${walkX}px)`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <CompanionAvatar
          mood={currentMood}
          size="sm"
          showBubble={false}
          isWalking={Math.abs(walkX) > 0}
          walkingDirection={walkDir}
        />
      </div>
    </div>
  );
};
