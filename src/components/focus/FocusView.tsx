import React from 'react';
import { MoodGardenCanvas } from '../garden/MoodGardenCanvas';
import { useKinetic } from '../../context/KineticContext';
import { useGarden } from '../../context/GardenContext';
import { Zap, Compass, Wind, AlertCircle, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { MoodState } from '../../types';

export const FocusView: React.FC = () => {
  const { metrics, simulateMood, activeSimulationState, triggerMicroBreak, recentVelocities } = useKinetic();
  const { gardenHealth } = useGarden();

  const getMoodBadge = (mood: MoodState) => {
    switch (mood) {
      case 'deep-flow':
        return { label: 'Deep Flow', color: 'text-emerald-300 bg-emerald-950/80 border-emerald-500/40', icon: Zap };
      case 'stressed':
        return { label: 'Tension / Jitter', color: 'text-rose-300 bg-rose-950/80 border-rose-500/40', icon: AlertCircle };
      case 'fatigued':
        return { label: 'Rest Needed', color: 'text-purple-300 bg-purple-950/80 border-purple-500/40', icon: Wind };
      case 'wandering':
        return { label: 'Free Wandering', color: 'text-amber-300 bg-amber-950/80 border-amber-500/40', icon: Compass };
      case 'serene':
      default:
        return { label: 'Serene Presence', color: 'text-teal-300 bg-teal-950/80 border-teal-500/40', icon: ShieldCheck };
    }
  };

  const badge = getMoodBadge(metrics.inferredMood);
  const BadgeIcon = badge.icon;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Simulation & Passive Mode Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl glass-panel border border-emerald-500/20">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-200">
            {metrics.isSimulated ? 'Simulated Telemetry Mode' : 'Live Passive Kinetic Tracking'}
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">&bull; Move your mouse to feel garden reaction</span>
        </div>

        {/* Simulator buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 mr-1">Demo states:</span>
          <button
            onClick={() => simulateMood('live')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeSimulationState === null
                ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-emerald-950/40'
            }`}
          >
            Live Mouse
          </button>
          <button
            onClick={() => simulateMood('deep-flow')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeSimulationState === 'deep-flow'
                ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-emerald-950/40'
            }`}
          >
            Flow
          </button>
          <button
            onClick={() => simulateMood('stressed')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeSimulationState === 'stressed'
                ? 'bg-rose-500/30 text-rose-200 border border-rose-500/50'
                : 'text-slate-400 hover:text-rose-300 hover:bg-rose-950/40'
            }`}
          >
            Tension
          </button>
          <button
            onClick={() => simulateMood('fatigued')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeSimulationState === 'fatigued'
                ? 'bg-purple-500/30 text-purple-200 border border-purple-500/50'
                : 'text-slate-400 hover:text-purple-300 hover:bg-purple-950/40'
            }`}
          >
            Fatigue
          </button>
          <button
            onClick={() => simulateMood('serene')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeSimulationState === 'serene'
                ? 'bg-teal-500/30 text-teal-200 border border-teal-500/50'
                : 'text-slate-400 hover:text-teal-300 hover:bg-teal-950/40'
            }`}
          >
            Serene
          </button>
        </div>
      </div>

      {/* Main Mood Garden Canvas */}
      <MoodGardenCanvas />

      {/* Telemetry Metrics & Zoning Out Quick Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Kinetic Rhythm Card */}
        <div className="p-5 rounded-3xl glass-panel border border-emerald-500/15 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Kinetic Smoothness
              </span>
              <div className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold flex items-center gap-1 ${badge.color}`}>
                <BadgeIcon className="w-3 h-3" />
                <span>{badge.label}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold font-display text-slate-100">
                {metrics.smoothnessScore}%
              </span>
              <span className="text-xs text-emerald-400 font-medium">Arc Consistency</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Passive cursor curves are calculated in real-time. Smooth continuous sweeps nurture the garden.
            </p>
          </div>

          {/* Mini Sparkline Visualization */}
          <div className="mt-4 pt-3 border-t border-emerald-950 flex items-end gap-1 h-12">
            {recentVelocities.map((v, idx) => {
              const height = Math.min(100, Math.max(15, v * 40));
              return (
                <div
                  key={idx}
                  className="flex-1 bg-emerald-500/40 hover:bg-emerald-400 rounded-t-sm transition-all"
                  style={{ height: `${height}%` }}
                  title={`Velocity sample ${idx + 1}: ${v} px/ms`}
                />
              );
            })}
          </div>
        </div>

        {/* Jitter & Tension Indicator */}
        <div className="p-5 rounded-3xl glass-panel border border-emerald-500/15 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Micro-Jitter Index
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {metrics.jitterIndex < 25 ? 'Low Friction' : metrics.jitterIndex < 50 ? 'Moderate' : 'High Friction'}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold font-display text-slate-100">
                {metrics.jitterIndex}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 100 Jitter</span>
            </div>

            {/* Tension Meter Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden my-3 border border-emerald-950">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  metrics.tensionScore > 60
                    ? 'bg-rose-500'
                    : metrics.tensionScore > 35
                    ? 'bg-amber-500'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${metrics.tensionScore}%` }}
              />
            </div>

            <p className="text-xs text-slate-400">
              {metrics.tensionScore > 50
                ? 'Rapid jerky directional corrections detected. Sprout is ready to help you decompress.'
                : 'Steady gliding trajectories. No mental strain detected.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-950 flex items-center justify-between text-xs text-slate-400">
            <span>Garden Bloom: {gardenHealth}%</span>
            <span className="text-emerald-400 font-medium">No forms required</span>
          </div>
        </div>

        {/* Zoning Out & Sanctuary Actions */}
        <div className="p-5 rounded-3xl glass-panel-glow border border-emerald-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Zoning Out Sanctuary</span>
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Zero Guilt
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-100 font-display mb-1.5">
              Decompress with Sprout
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Step away without losing momentum. Re-center your nervous system in 60 seconds.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={triggerMicroBreak}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs transition-all shadow-glow-sm flex items-center justify-center gap-2"
            >
              <Wind className="w-4 h-4" />
              <span>4-7-8 Breathing Reset</span>
            </button>
            <button
              onClick={triggerMicroBreak}
              className="w-full py-2 px-4 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/25 text-emerald-200 font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Acknowledge a Micro-Win</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
