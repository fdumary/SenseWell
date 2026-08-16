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
    simulateMood('serene');
    setIsBreathingModalOpen(false);
  };

  const sampleMicroWins = [
    { id: '1', title: 'Closed a complex browser tab', xp: '+10 Peace' },
    { id: '2', title: 'Drank a glass of water', xp: '+15 Refresh' },
    { id: '3', title: 'Wrote one clean line of thought', xp: '+20 Flow' },
    { id: '4', title: 'Relaxed my jaw and shoulders', xp: '+25 Ease' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0e1913] border border-emerald-500/30 p-6 md:p-8 shadow-2xl shadow-emerald-950/80">
        {/* Close Button */}
        <button
          onClick={() => setIsBreathingModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-emerald-900/40 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Header */}
        <div className="flex items-center gap-2 mb-6 border-b border-emerald-950 pb-4">
          <button
            onClick={() => setActiveTab('breathing')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'breathing'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            4-7-8 Breathing
          </button>
          <button
            onClick={() => setActiveTab('micro-wins')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'micro-wins'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Claim Micro-Win
          </button>
          <button
            onClick={() => setActiveTab('stretch')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'stretch'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Quick Stretch
          </button>
        </div>

        {/* Tab 1: 4-7-8 Breathing Sanctuary */}
        {activeTab === 'breathing' && (
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium uppercase tracking-wider mb-2">
              <Wind className="w-4 h-4" />
              <span>Grounding Sanctuary &bull; Cycle {cycleCount} of 3</span>
            </div>

            <h3 className="text-2xl font-bold text-slate-100 font-display mb-1">
              {phase === 'Inhale'
                ? 'Breathe In Gently'
                : phase === 'Hold'
                ? 'Hold Softly'
                : 'Release Slowly'}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mb-8">
              {phase === 'Inhale'
                ? 'Draw breath deep through your nose.'
                : phase === 'Hold'
                ? 'Let your body be still and calm.'
                : 'Exhale fully through your mouth with a soft whoosh.'}
            </p>

            {/* Pulsing Breathing Orb */}
            <div className="relative w-48 h-48 flex items-center justify-center mb-8">
              <div
                className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                  phase === 'Inhale'
                    ? 'scale-110 bg-emerald-500/25 blur-xl'
                    : phase === 'Hold'
                    ? 'scale-100 bg-teal-500/30 blur-2xl'
                    : 'scale-75 bg-indigo-500/20 blur-lg'
                }`}
              />
              <div
                className={`relative z-10 w-36 h-36 rounded-full flex flex-col items-center justify-center border-2 border-emerald-400/40 bg-gradient-to-br from-emerald-900/80 to-[#0b1610] shadow-inner transition-transform duration-1000 ${
                  phase === 'Inhale'
                    ? 'scale-110'
                    : phase === 'Hold'
                    ? 'scale-105'
                    : 'scale-90'
                }`}
              >
                <span className="text-4xl font-extrabold text-emerald-200 font-display">
                  {timer}
                </span>
                <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-semibold mt-1">
                  {phase}
                </span>
              </div>
            </div>

            <button
              onClick={handleFinishBreak}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-semibold text-sm transition-all shadow-glow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-950" />
              <span>I feel Grounded &bull; Return to Garden</span>
            </button>
          </div>
        )}

        {/* Tab 2: Micro-Wins Generator */}
        {activeTab === 'micro-wins' && (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-medium uppercase tracking-wider mb-2">
              <Trophy className="w-4 h-4" />
              <span>Zero-Guilt Micro-Wins</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 font-display mb-1">
              Celebrate Any Small Effort
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              You don't need a massive milestone to earn a moment of pride.
            </p>

            <div className="space-y-3 mb-6">
              {sampleMicroWins.map(win => (
                <div
                  key={win.id}
                  onClick={() => setSelectedWin(win.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedWin === win.id
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-100'
                      : 'bg-emerald-950/20 border-emerald-500/15 text-slate-300 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2
                      className={`w-5 h-5 ${
                        selectedWin === win.id ? 'text-amber-400' : 'text-slate-500'
                      }`}
                    />
                    <span className="text-sm font-medium">{win.title}</span>
                  </div>
                  <span className="text-xs font-bold text-amber-400/90">{win.xp}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleFinishBreak}
              disabled={!selectedWin}
              className={`w-full py-3 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                selectedWin
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-glow-amber cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Claim & Water the Garden</span>
            </button>
          </div>
        )}

        {/* Tab 3: Gentle Stretch Guide */}
        {activeTab === 'stretch' && (
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-medium uppercase tracking-wider mb-2">
              <RotateCcw className="w-4 h-4" />
              <span>Kinetic Decompression</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 font-display mb-1">
              30-Second Shoulder & Wrist Release
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              When mouse friction rises, tension settles in the neck and wrists.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center mb-2">
                  1
                </div>
                <h4 className="font-semibold text-slate-200 mb-1">Shoulder Roll</h4>
                <p className="text-slate-400">Roll shoulders up to your ears, then back and down 5 times.</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center mb-2">
                  2
                </div>
                <h4 className="font-semibold text-slate-200 mb-1">Wrist Flex</h4>
                <p className="text-slate-400">Extend your arm and gently pull fingers backward for 10 seconds.</p>
              </div>
            </div>

            <button
              onClick={handleFinishBreak}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-slate-950 font-semibold text-sm transition-all shadow-glow-md flex items-center justify-center gap-2"
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
