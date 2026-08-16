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
    <header className="px-4 md:px-8 py-4 md:py-5 border-b border-emerald-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none">
      {/* Mobile Branding & Title */}
      <div className="flex items-center justify-between sm:justify-start gap-3">
        {/* Mobile Brand Logo Icon */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-sm flex items-center justify-center">
            <div className="w-full h-full bg-[#08120d] rounded-[10px] flex items-center justify-center text-emerald-300 font-bold text-xs">
              SW
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold font-display text-slate-100">
              {info.title}
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-sans font-medium">
              v0.1
            </span>
          </div>
          <p className="text-[11px] md:text-xs text-slate-400 mt-0.5 line-clamp-1">
            {info.subtitle}
          </p>
        </div>
      </div>

      {/* Quick Status Bar */}
      <div className="flex items-center gap-2.5 flex-wrap justify-between sm:justify-end">
        {/* Live Presence Status Badge */}
        <StatusBadge />

        {/* Kinetic Rhythm Live Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl glass-pill text-xs text-slate-200">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Vibe:</span>
          <span className="font-bold text-emerald-300 capitalize text-xs">
            {metrics.inferredMood.replace('-', ' ')}
          </span>
          <span className="text-slate-500 hidden sm:inline">&bull;</span>
          <span className="text-emerald-400 font-semibold text-xs">{metrics.smoothnessScore}%</span>
        </div>

        {/* Desktop Zone Out Button */}
        <button
          onClick={triggerMicroBreak}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-glow-sm transition-all cursor-pointer"
        >
          <Wind className="w-3.5 h-3.5" />
          <span>Zone Out</span>
        </button>
      </div>
    </header>
  );
};
