import React, { useState, useEffect } from 'react';
import { useGarden } from '../../context/GardenContext';
import { useKinetic } from '../../context/KineticContext';
import { CompanionAvatar } from './CompanionAvatar';
import { Timer } from 'lucide-react';

export const MoodGardenCanvas: React.FC = () => {
  const { bloomFactor } = useGarden();
  const { currentMood, isFocusSessionActive, timerData, bondStats } = useKinetic();

  const [activeRipple, setActiveRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const [walkX, setWalkX] = useState<number>(0);
  const [walkDir, setWalkDir] = useState<'left' | 'right'>('right');
  const [lumiX, setLumiX] = useState<number>(0);
  const [lumiDir, setLumiDir] = useState<'left' | 'right'>('left');
  const timerRunning = isFocusSessionActive || timerData?.status === 'working';

  useEffect(() => {
    if (!timerRunning) return;
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
      setLumiX(prev => {
        if (prev >= 20) { setLumiDir('left'); return prev - 3; }
        if (prev <= -20) { setLumiDir('right'); return prev + 3; }
        return lumiDir === 'right' ? prev + 2 : prev - 2;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [timerRunning, walkDir, lumiDir]);

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
          <span>{bondStats.focusMinutesToday}m</span>
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

      {/* Lumi roams only while the focus timer is running. */}
      <div
        className="absolute bottom-[75px] right-[80px] z-20 pointer-events-none transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(${lumiX}px) scaleX(${lumiDir === 'left' ? -1 : 1})` }}
      >
        <img
          src="/assets/trimmed/lumi.png"
          alt="Lumi"
          className={`w-14 h-18 object-contain drop-shadow-md ${timerRunning ? 'animate-float-gentle' : ''}`}
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
          isWalking={timerRunning}
          walkingDirection={walkDir}
        />
      </div>
    </div>
  );
};
