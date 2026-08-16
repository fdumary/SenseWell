import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
import { useGarden } from '../../context/GardenContext';
import { useKinetic } from '../../context/KineticContext';

type TimerMode = 'countup' | '25m' | '50m';

export const FocusTimer: React.FC = () => {
  const { fertilizeGarden } = useGarden();
  const { setPresenceStatus } = useKinetic();

  const [mode, setMode] = useState<TimerMode>('25m');
  const [seconds, setSeconds] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [totalElapsed, setTotalElapsed] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  // Set preset duration based on mode
  const handleModeChange = (newMode: TimerMode) => {
    setIsActive(false);
    setMode(newMode);
    if (newMode === 'countup') {
      setSeconds(0);
    } else if (newMode === '25m') {
      setSeconds(25 * 60);
    } else if (newMode === '50m') {
      setSeconds(50 * 60);
    }
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setSeconds(prev => {
          if (mode === 'countup') {
            setTotalElapsed(e => e + 1);
            return prev + 1;
          } else {
            if (prev <= 1) {
              setIsActive(false);
              fertilizeGarden();
              setPresenceStatus('break');
              return 0;
            }
            setTotalElapsed(e => e + 1);
            return prev - 1;
          }
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, mode, fertilizeGarden, setPresenceStatus]);

  const handleStart = () => {
    setIsActive(true);
    setPresenceStatus('working');
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    if (mode === 'countup') {
      setSeconds(0);
    } else if (mode === '25m') {
      setSeconds(25 * 60);
    } else if (mode === '50m') {
      setSeconds(50 * 60);
    }
  };

  // Format seconds into HH:MM:SS
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl glass-panel-glow border border-emerald-500/30 text-center flex flex-col items-center justify-center relative overflow-hidden group">
      {/* Background soft ambient radial pulse when running */}
      {isActive && (
        <div className="absolute inset-0 bg-emerald-500/5 blur-3xl pointer-events-none animate-pulse-slow" />
      )}

      {/* Top Header & Mode Selectors */}
      <div className="flex items-center justify-between w-full max-w-md mb-6 z-10">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <Timer className="w-4 h-4 text-emerald-400" />
          <span>Focus Timer</span>
        </div>

        {/* Preset Mode Chips */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-emerald-950/70 border border-emerald-500/20 text-xs">
          <button
            onClick={() => handleModeChange('25m')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              mode === '25m'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            25m Sprint
          </button>
          <button
            onClick={() => handleModeChange('50m')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              mode === '50m'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            50m Deep
          </button>
          <button
            onClick={() => handleModeChange('countup')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              mode === 'countup'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Open Flow
          </button>
        </div>
      </div>

      {/* Big Centered Digital Timer Display */}
      <div className="my-3 z-10 select-none">
        <div className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-display tracking-widest text-slate-100 drop-shadow-md">
          {formatTime(seconds)}
        </div>
        <div className="flex items-center justify-center gap-2 mt-2 text-xs text-slate-400">
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
          <span>{isActive ? 'Deep Session in Progress' : 'Timer Paused / Ready'}</span>
          {totalElapsed > 0 && (
            <span className="text-emerald-400 font-medium">
              &bull; {Math.floor(totalElapsed / 60)}m focused
            </span>
          )}
        </div>
      </div>

      {/* Controls Row: Start, Pause, Reset */}
      <div className="flex items-center justify-center gap-3 mt-6 z-10">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-glow-md flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Start Focus</span>
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-glow-amber flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Pause className="w-4 h-4 fill-slate-950" />
            <span>Pause</span>
          </button>
        )}

        <button
          onClick={handleReset}
          className="px-4 py-3 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-slate-300 hover:text-slate-100 font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer"
          title="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>
  );
};
