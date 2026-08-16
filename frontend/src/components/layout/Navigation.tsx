import React from 'react';

export type NavTab = 'focus' | 'bloom' | 'stats' | 'chat';

interface NavigationProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs: Array<{ id: NavTab; label: string; emoji: string }> = [
    { id: 'focus', label: 'Garden', emoji: '🌸' },
    { id: 'bloom', label: 'Bloom', emoji: '🌱' },
    { id: 'stats', label: 'Stats', emoji: '📊' },
    { id: 'chat', label: 'Companion', emoji: '🐾' },
  ];

  return <nav className="w-full max-w-md mx-auto pt-2 pb-2 px-1 flex items-center justify-center select-none">
    <div className="flex items-center gap-1 p-1 rounded-full bg-[#251A0B]/80 backdrop-blur-md border border-[#4E391F] shadow-sm">
      {tabs.map(tab => {
        const active = activeTab === tab.id;
        return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${active ? 'bg-[#486940] text-white border border-[#648B57] shadow-sm scale-105' : 'text-[#AFA28C] hover:text-[#EDE6D6] hover:bg-[#382810]/50'}`}>
          <span className="text-sm">{tab.emoji}</span><span>{tab.label}</span>
        </button>;
      })}
    </div>
  </nav>;
};
