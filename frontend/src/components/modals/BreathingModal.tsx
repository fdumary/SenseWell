import React, { useState, useEffect } from 'react';
import { useKinetic } from '../../context/KineticContext';
import { useGarden } from '../../context/GardenContext';
import { X, Sparkles, Wind, CheckCircle2, Trophy, RotateCcw } from 'lucide-react';

export const BreathingModal: React.FC = () => {
  const { isBreathingModalOpen, setIsBreathingModalOpen, simulateMood } = useKinetic();
  const { fertilizeGarden } = useGarden();

  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [timer, setTimer] = useState<number>(4);
  const [cycleCount, setCycleCount] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'breathing' | 'micro-wins' | 'stretch'>('breathing');
  const [selectedWin, setSelectedWin] = useState<string | null>(null);

  // 4-7-8 Breathing Cycle Timer
  useEffect(() => {
    if (!isBreathingModalOpen || activeTab !== 'breathing') return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          if (phase === 'Inhale') {
            setPhase('Hold');
            return 7;
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            return 8;
          } else {
            setPhase('Inhale');
            setCycleCount(c => c + 1);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingModalOpen, phase, activeTab]);

  if (!isBreathingModalOpen) return null;

  const handleFinishBreak = () => {
    fertilizeGarden();
    simulateMood('calm');
    setIsBreathingModalOpen(false);
  };

  const sampleMicroWins = [
    { id: '1', title: 'Closed a complex browser tab', xp: '+10 Peace' },
    { id: '2', title: 'Drank a glass of water', xp: '+15 Refresh' },
    { id: '3', title: 'Wrote one clean line of thought', xp: '+20 Flow' },
    { id: '4', title: 'Relaxed my jaw and shoulders', xp: '+25 Ease' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-300 select-none">
      <div className="relative w-full max-w-lg rounded-[32px] bg-[#D8EBD6] border border-[#B8DCB6] p-6 md:p-8 shadow-2xl text-[#243E29]">
        {/* Close Button */}
        <button
          onClick={() => setIsBreathingModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-[#527057] hover:text-[#243E29] hover:bg-white/40 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Header */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#B8DCB6] pb-4">
          <button
            onClick={() => setActiveTab('breathing')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold font-sans transition-all cursor-pointer ${
              activeTab === 'breathing'
                ? 'bg-[#EAF5E8] text-[#2C5E3B] border border-[#C4E4C2] shadow-2xs'
                : 'text-[#527057] hover:text-[#243E29]'
            }`}
          >
            4-7-8 Breathing
          </button>
          <button
            onClick={() => setActiveTab('micro-wins')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold font-sans transition-all cursor-pointer ${
              activeTab === 'micro-wins'
                ? 'bg-[#FFF5DA] text-[#5C4A26] border border-[#ECD59B] shadow-2xs'
                : 'text-[#527057] hover:text-[#243E29]'
            }`}
          >
            Claim Micro-Win
          </button>
          <button
            onClick={() => setActiveTab('stretch')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold font-sans transition-all cursor-pointer ${
              activeTab === 'stretch'
                ? 'bg-[#D4E9F5] text-[#1F3847] border border-[#B8DAED] shadow-2xs'
                : 'text-[#527057] hover:text-[#243E29]'
            }`}
          >
            Quick Stretch
          </button>
        </div>

        {/* Tab 1: 4-7-8 Breathing Sanctuary */}
        {activeTab === 'breathing' && (
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 text-[#2C5E3B] text-[11px] font-pixel uppercase tracking-wider mb-2">
              <Wind className="w-4 h-4" />
              <span>Grounding Sanctuary &bull; Cycle {cycleCount} of 3</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-pixel text-[#243E29] mb-1">
              {phase === 'Inhale'
                ? 'Breathe In Gently'
                : phase === 'Hold'
                ? 'Hold Softly'
                : 'Release Slowly'}
            </h3>
            <p className="text-xs text-[#4A6850] max-w-xs mb-6 font-semibold">
              {phase === 'Inhale'
                ? 'Draw breath deep through your nose.'
                : phase === 'Hold'
                ? 'Let your body be still and calm.'
                : 'Exhale fully through your mouth with a soft whoosh.'}
            </p>

            {/* Pulsing Breathing Orb */}
            <div className="relative w-44 h-44 flex items-center justify-center mb-6">
              <div
                className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                  phase === 'Inhale'
                    ? 'scale-110 bg-[#A9D4A7]/50 blur-xl'
                    : phase === 'Hold'
                    ? 'scale-100 bg-[#90C8D6]/50 blur-2xl'
                    : 'scale-75 bg-[#DEC7EB]/50 blur-lg'
                }`}
              />
              <div
                className={`relative z-10 w-32 h-32 rounded-full flex flex-col items-center justify-center border-2 border-[#A9D4A7] bg-white/80 shadow-md transition-transform duration-1000 ${
                  phase === 'Inhale'
                    ? 'scale-110'
                    : phase === 'Hold'
                    ? 'scale-105'
                    : 'scale-90'
                }`}
              >
                <span className="text-4xl font-pixel font-bold text-[#243E29]">
                  {timer}
                </span>
                <span className="text-[11px] uppercase tracking-widest text-[#2C5E3B] font-bold mt-1">
                  {phase}
                </span>
              </div>
            </div>

            <button
              onClick={handleFinishBreak}
              className="w-full py-3 rounded-2xl bg-[#EAF5E8] hover:bg-[#DDF0DB] border border-[#C4E4C2] text-[#2A5430] font-pixel text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#2A5430]" />
              <span>I feel Grounded &bull; Return to Garden</span>
            </button>
          </div>
        )}

        {/* Tab 2: Micro-Wins Generator */}
        {activeTab === 'micro-wins' && (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-[#5C4A26] text-[11px] font-pixel uppercase tracking-wider mb-2">
              <Trophy className="w-4 h-4" />
              <span>Zero-Guilt Micro-Wins</span>
            </div>
            <h3 className="text-xl font-bold font-pixel text-[#243E29] mb-1">
              Celebrate Any Small Effort
            </h3>
            <p className="text-xs text-[#4A6850] font-semibold mb-5">
              You don&apos;t need a massive milestone to earn a moment of pride.
            </p>

            <div className="space-y-2.5 mb-5">
              {sampleMicroWins.map(win => (
                <div
                  key={win.id}
                  onClick={() => setSelectedWin(win.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedWin === win.id
                      ? 'bg-[#FFF5DA] border-[#ECD59B] text-[#5C4A26] shadow-xs'
                      : 'bg-white/60 border-[#B8DCB6] text-[#243E29] hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        selectedWin === win.id ? 'text-[#5C4A26]' : 'text-[#A4C4A4]'
                      }`}
                    />
                    <span className="text-xs font-bold">{win.title}</span>
                  </div>
                  <span className="text-xs font-bold text-[#5C4A26] font-pixel">{win.xp}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleFinishBreak}
              disabled={!selectedWin}
              className={`w-full py-3 rounded-2xl font-pixel text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                selectedWin
                  ? 'bg-[#FFF5DA] hover:bg-[#FCE7A2] border border-[#ECD59B] text-[#5C4A26] shadow-sm cursor-pointer'
                  : 'bg-white/30 text-[#A4C4A4] border border-[#B8DCB6] cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Claim &amp; Water the Garden</span>
            </button>
          </div>
        )}

        {/* Tab 3: Gentle Stretch Guide */}
        {activeTab === 'stretch' && (
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 text-[#1F3847] text-[11px] font-pixel uppercase tracking-wider mb-2">
              <RotateCcw className="w-4 h-4" />
              <span>Kinetic Decompression</span>
            </div>
            <h3 className="text-xl font-bold font-pixel text-[#243E29] mb-1">
              30-Second Shoulder &amp; Wrist Release
            </h3>
            <p className="text-xs text-[#4A6850] font-semibold mb-5">
              When mouse friction rises, tension settles in the neck and wrists.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3.5 rounded-2xl bg-white/70 border border-[#B8DCB6] text-xs">
                <div className="w-7 h-7 rounded-full bg-[#D4E9F5] text-[#1F3847] font-bold flex items-center justify-center mb-2 font-pixel">
                  1
                </div>
                <h4 className="font-bold text-[#243E29] mb-1">Shoulder Roll</h4>
                <p className="text-[#4A6850] text-[11px]">Roll shoulders up to ears, then back and down 5 times.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/70 border border-[#B8DCB6] text-xs">
                <div className="w-7 h-7 rounded-full bg-[#D4E9F5] text-[#1F3847] font-bold flex items-center justify-center mb-2 font-pixel">
                  2
                </div>
                <h4 className="font-bold text-[#243E29] mb-1">Wrist Flex</h4>
                <p className="text-[#4A6850] text-[11px]">Extend arm and gently pull fingers backward for 10s.</p>
              </div>
            </div>

            <button
              onClick={handleFinishBreak}
              className="w-full py-3 rounded-2xl bg-[#D4E9F5] hover:bg-[#C2E0F0] border border-[#B8DAED] text-[#1F3847] font-pixel text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Feel Refreshed &bull; Resume</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
