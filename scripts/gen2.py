with open("src/components/garden/MoodGardenCanvas.tsx", "w", encoding="utf-8") as f:
    f.write("""import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const interval = setInterval(() => {
      setWalkX(prev => {
        if (prev >= 25) {
          setWalkDir('left');
          return prev - 4;
        } else if (prev <= -25) {
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

  const getPlantAsset = () => {
    if (bloomFactor >= 0.8) return '/assets/trimmed/Plant_Life/blooming.png';
    if (bloomFactor >= 0.5) return '/assets/trimmed/Plant_Life/growing.png';
    if (bloomFactor >= 0.25) return '/assets/trimmed/Plant_Life/seedling.png';
    return '/assets/trimmed/Plant_Life/wilted.png';
  };

  return (
    <div
      onClick={handleGardenClick}
      className="relative w-full h-[380px] sm:h-[420px] rounded-3xl overflow-hidden shadow-lg border-2 border-[#5C442A] select-none cursor-pointer group"
    >
      {/* Real Cozy Cottage Garden Pixel Art Background from Mockup */}
      <img
        src="/assets/garden_cottage_bg.jpg"
        alt="Garden Cottage Scene"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/assets/garden_cottage_bg.png';
        }}
      />

      {currentMood === 'tired' && (
        <div className="absolute inset-0 bg-[#0F172A]/45 pointer-events-none transition-opacity duration-700" />
      )}
      {currentMood === 'meh' && (
        <div className="absolute inset-0 bg-[#334155]/35 pointer-events-none transition-opacity duration-700" />
      )}

      {/* Top HUD overlay */}
      <div className="absolute top-3.5 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#243322]/90 backdrop-blur-md text-[#E8F0E4] text-xs font-bold font-pixel tracking-wide border border-[#486344] shadow-sm">
          <Timer className="w-3.5 h-3.5 text-[#86C27D]" />
          <span>25m</span>
        </div>

        <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF8EA]/95 text-[#2D3748] text-xs font-bold shadow-sm border border-[#E5DAC2]">
          <span>{moodPill.emoji}</span>
          <span className="capitalize">{moodPill.label}</span>
        </div>
      </div>

      {activeRipple && (
        <div
          key={activeRipple.id}
          className="absolute rounded-full border-2 border-white/70 pointer-events-none animate-ping z-30"
          style={{
            left: activeRipple.x - 20,
            top: activeRipple.y - 20,
            width: 40,
            height: 40,
          }}
        />
      )}

      {/* Dynamic Potted Plant on Lawn */}
      <div className="absolute bottom-5 right-6 z-20 pointer-events-none transition-all duration-500 transform hover:scale-105">
        <img
          src={getPlantAsset()}
          alt="Plant"
          className="w-16 h-20 sm:w-18 sm:h-22 object-contain drop-shadow-lg animate-float-gentle"
        />
      </div>

      {/* Animated Fluttering Wildlife */}
      <div className="absolute top-[110px] left-[65px] z-25 pointer-events-none animate-flutter">
        <img
          src="/assets/trimmed/Extra decor/pink_butterfly.png"
          alt="Butterfly"
          className="w-8 h-8 object-contain drop-shadow-sm"
        />
      </div>
      <div className="absolute top-[130px] right-[85px] z-25 pointer-events-none animate-flutter">
        <img
          src="/assets/trimmed/Extra decor/blue_butterfly.png"
          alt="Butterfly"
          className="w-8 h-8 object-contain drop-shadow-sm"
        />
      </div>
      <div className="absolute bottom-[90px] left-[45px] z-25 pointer-events-none animate-float-gentle">
        <img
          src="/assets/trimmed/Extra decor/bee.png"
          alt="Bee"
          className="w-9 h-7 object-contain drop-shadow-sm"
        />
      </div>

      {/* Floating Sakura Petals */}
      <div className="absolute top-[80px] left-[32%] z-20 pointer-events-none animate-float-gentle opacity-85">
        <img src="/assets/trimmed/Extra decor/petals.png" alt="Petals" className="w-6 h-12 object-contain" />
      </div>

      {/* Princess Lumi avatar standing on the grass */}
      <div className="absolute bottom-[75px] right-[80px] z-20 pointer-events-none">
        <img
          src="/assets/trimmed/lumi.png"
          alt="Lumi"
          className="w-14 h-18 object-contain drop-shadow-md animate-float-gentle"
        />
      </div>

      {/* Walking Fairy Bunny Companion along the path */}
      <div
        className="absolute top-[50%] z-25 transition-transform duration-1000 ease-in-out"
        style={{
          left: `calc(38% + ${walkX}px)`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <CompanionAvatar
          mood={currentMood}
          size="md"
          showBubble={false}
          isWalking={Math.abs(walkX) > 0}
          walkingDirection={walkDir}
        />
      </div>
    </div>
  );
};
""")

with open("src/components/focus/FocusView.tsx", "w", encoding="utf-8") as f:
    f.write("""import React from 'react';
import { MoodGardenCanvas } from '../garden/MoodGardenCanvas';
import { FocusSessionModal } from './FocusSessionModal';
import { useKinetic } from '../../context/KineticContext';
import { useGarden } from '../../context/GardenContext';
import { MoodState } from '../../types';
import { Play } from 'lucide-react';

export const FocusView: React.FC = () => {
  const {
    currentMood,
    setMood,
    startFocusSession,
    bondStats,
  } = useKinetic();

  const { dewDrops } = useGarden();

  const moodsList: Array<{ id: MoodState; label: string; emoji: string; iconBg: string; activeBorder: string }> = [
    {
      id: 'happy',
      label: 'Happy',
      emoji: '🌸',
      iconBg: 'bg-[#4A2D3A]',
      activeBorder: 'border-[#F472B6] ring-2 ring-[#F472B6]/40',
    },
    {
      id: 'hyped',
      label: 'Hyped',
      emoji: '✨',
      iconBg: 'bg-[#4A3D20]',
      activeBorder: 'border-[#F59E0B] ring-2 ring-[#F59E0B]/40',
    },
    {
      id: 'calm',
      label: 'Calm',
      emoji: '🍃',
      iconBg: 'bg-[#253822]',
      activeBorder: 'border-[#4A7C59] ring-2 ring-[#4A7C59]/40',
    },
    {
      id: 'tired',
      label: 'Tired',
      emoji: '🌙',
      iconBg: 'bg-[#3D3A20]',
      activeBorder: 'border-[#CA8A04] ring-2 ring-[#CA8A04]/40',
    },
    {
      id: 'meh',
      label: 'Meh',
      emoji: '☁️',
      iconBg: 'bg-[#2A353D]',
      activeBorder: 'border-[#94A3B8] ring-2 ring-[#94A3B8]/40',
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-3 animate-in fade-in duration-500 select-none pb-6">
      {/* Screen 1 Header: Soft Dusty Mint Header Bar */}
      <div className="p-3 rounded-2xl bg-[#A8C7C9] border border-[#8FB1B3] text-center shadow-md">
        <h1 className="font-pixel text-sm sm:text-base font-bold text-[#1A3336] tracking-wide flex items-center justify-center gap-2">
          <span>✿</span>
          <span>My Mood Garden</span>
          <span>✿</span>
        </h1>

        <div className="mt-1.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8EA] border border-[#E5DAC2] text-xs font-bold text-[#2A4B32] shadow-2xs">
          <span>🌿 Sprouting</span>
          <span className="text-[#CFC2A7]">|</span>
          <span className="text-[#3B82F6]">💧 {dewDrops || bondStats.waterDrops} drops</span>
        </div>
      </div>

      <MoodGardenCanvas />

      {/* HOW ARE YOU FEELING TODAY?: Dark Moss Bar */}
      <div className="p-3 rounded-2xl bg-[#25331E] border border-[#3B5234] text-center shadow-sm">
        <h3 className="font-pixel text-[10px] font-bold text-[#A8C79E] uppercase tracking-wider mb-2.5">
          How are you feeling today?
        </h3>

        <div className="flex items-center justify-center gap-2 sm:gap-2.5">
          {moodsList.map(item => {
            const isSelected = currentMood === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setMood(item.id)}
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer border ${item.iconBg} ${
                  isSelected
                    ? `${item.activeBorder} scale-105 shadow-md`
                    : 'border-[#4B3B28] opacity-85 hover:opacity-100 shadow-2xs'
                }`}
                title={`Feel ${item.label}`}
              >
                <span>{item.emoji}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary CTA: Start Focus Session Button */}
      <div className="pt-0.5">
        <button
          onClick={startFocusSession}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#48694B] hover:bg-[#3D5C3F] text-white border border-[#5D8460] font-pixel text-xs tracking-wider shadow-md flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white text-white" />
          <span>Start Focus Session</span>
        </button>
      </div>

      <FocusSessionModal />
    </div>
  );
};
""")
print("Gen2 complete")