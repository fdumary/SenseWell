import React from 'react';
import { NavTab } from './Navigation';
import { useKinetic } from '../../context/KineticContext';
import { StatusBadge } from '../common/StatusBadge';
import { Wind } from 'lucide-react';

interface TopHeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ activeTab }) => {
  const { metrics, triggerMicroBreak } = useKinetic();

  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'chat':
        return {
          title: 'Companion Chat',
          subtitle: 'Talk with Sprout — aware of your kinetic rhythm with zero judgment',
        };
      case 'stats':
        return {
          title: 'Kinetic & Mood Stats',
          subtitle: 'Passive velocity, jitter and flow telemetry captured without forms',
        };
      case 'focus':
      default:
        return {
          title: 'Mood Garden & Focus',
          subtitle: 'Watch your garden bloom as you move through your day with steady flow',
        };
    }
  };

  const info = getHeaderInfo();

  return (
    <header className="px-6 py-5 border-b border-emerald-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-100 flex items-center gap-2.5">
          <span>{info.title}</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-sans font-medium">
            SenseWell v0.1
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">{info.subtitle}</p>
      </div>

      {/* Top Quick Status Pill & Action */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Live Presence Status Badge (🟢 Working / 🟡 On Break / ⚪ Away) */}
        <StatusBadge />

        {/* Kinetic Rhythm Live Pill */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-pill text-xs text-slate-200">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-400 font-medium">Kinetic Vibe:</span>
          <span className="font-bold text-emerald-300 capitalize">
            {metrics.inferredMood.replace('-', ' ')}
          </span>
          <span className="text-slate-500">&bull;</span>
          <span className="text-emerald-400 font-semibold">{metrics.smoothnessScore}% Smooth</span>
        </div>

        {/* Quick Grounding Trigger */}
        <button
          onClick={triggerMicroBreak}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-glow-sm transition-all"
        >
          <Wind className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Zone Out</span>
        </button>
      </div>
    </header>
  );
};
