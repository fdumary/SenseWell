import React from 'react';
import { Compass, MessageCircle, BarChart3, Wind, ShieldCheck } from 'lucide-react';
import { useKinetic } from '../../context/KineticContext';
import { useGarden } from '../../context/GardenContext';
import { CompanionAvatar } from '../garden/CompanionAvatar';

export type NavTab = 'focus' | 'chat' | 'stats';

interface NavigationProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { metrics, triggerMicroBreak } = useKinetic();
  const { gardenHealth } = useGarden();

  const navItems = [
    {
      id: 'focus' as NavTab,
      label: 'Focus',
      sublabel: 'Mood Garden',
      icon: Compass,
      badge: `${gardenHealth}% Bloom`,
    },
    {
      id: 'chat' as NavTab,
      label: 'Chat',
      sublabel: 'Companion Sprout',
      icon: MessageCircle,
      badge: 'Active',
    },
    {
      id: 'stats' as NavTab,
      label: 'Stats',
      sublabel: 'Passive Insights',
      icon: BarChart3,
      badge: 'Zero Forms',
    },
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR (Visible on md and up) */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex w-64 min-h-screen bg-[#0a120e] border-r border-emerald-500/15 flex-col justify-between p-6 select-none z-30 flex-shrink-0 sticky top-0 h-screen">
        {/* Brand Header */}
        <div>
          <div className="flex items-center gap-3 px-2 py-2 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-glow-sm flex-shrink-0">
              <div className="w-full h-full bg-[#08120d] rounded-[14px] flex items-center justify-center text-emerald-300">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3C8 3 4 7 4 12C4 16.5 7.5 20 12 20C16.5 20 20 16.5 20 12C20 7 16 3 12 3Z"
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 7V17M12 12C9 10 7 11 7 14M12 10C15 8 17 9 17 12"
                    stroke="#4ade80"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg font-display tracking-tight text-slate-100">
                  SenseWell
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-emerald-400/80 font-medium">Kinetic Mood Companion</p>
            </div>
          </div>

          {/* Navigation Items (Focus, Chat, Stats) */}
          <nav className="space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-950/90 to-teal-950/60 border border-emerald-500/35 text-slate-100 shadow-glow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-emerald-950/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950 shadow-sm'
                          : 'bg-emerald-950/60 text-emerald-400 group-hover:bg-emerald-900/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold font-display">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.sublabel}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-emerald-950/40 text-slate-500 border-emerald-500/10'
                    }`}
                  >
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Companion Status & Grounding Prompt */}
        <div className="mt-6 pt-5 border-t border-emerald-950 space-y-4">
          {/* Companion Mini Status */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/15 flex items-center gap-3">
            <div className="w-10 h-10 flex-shrink-0">
              <CompanionAvatar mood={metrics.inferredMood} size="sm" showBubble={false} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Sprout</span>
                <span className="text-[10px] text-emerald-400 font-medium capitalize">
                  {metrics.inferredMood}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {metrics.tensionScore > 50 ? 'Ready with a breath' : 'Living in garden'}
              </p>
            </div>
          </div>

          {/* Quick Grounding Action */}
          <button
            onClick={triggerMicroBreak}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/25 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Wind className="w-3.5 h-3.5 text-emerald-300" />
            <span>Zone Out &bull; Take a Breath</span>
          </button>

          {/* Passive Tracking Badge */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Passive Zero-Effort Tracking</span>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MOBILE BOTTOM NAVIGATION BAR (Visible on mobile screens < md) */}
      {/* ========================================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a140f]/90 backdrop-blur-xl border-t border-emerald-500/20 px-3 py-2 flex items-center justify-around shadow-2xl safe-bottom">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-emerald-400 scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-emerald-500/20 text-emerald-300' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* Mobile Quick Zone Out Button */}
        <button
          onClick={triggerMicroBreak}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-teal-300 hover:text-teal-200 transition-all cursor-pointer"
          title="Take a quick breath"
        >
          <div className="p-1.5 rounded-xl bg-teal-500/20 text-teal-300">
            <Wind className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold mt-0.5 tracking-tight">Zone Out</span>
        </button>
      </nav>
    </>
  );
};
