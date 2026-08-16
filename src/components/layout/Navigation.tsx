import React from 'react';

export type NavTab = 'focus' | 'stats' | 'chat';

interface NavigationProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs: Array<{ id: NavTab; label: string; emoji: string }> = [
    { id: 'focus', label: 'Garden', emoji: '🌸' },
    { id: 'stats', label: 'Stats', emoji: '📊' },
    { id: 'chat', label: 'Companion', emoji: '🐾' },
  ];

  return (
    <nav className="w-full max-w-md mx-auto pt-2 pb-2 px-2 flex items-center justify-center select-none">
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/75 backdrop-blur-md border border-white/50 shadow-sm">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold font-sans transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-[#2D3748] border border-white/80 shadow-sm scale-105'
                  : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-white/40'
              }`}
            >
              <span className="text-sm">{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
