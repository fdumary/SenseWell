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
    <nav className="w-full max-w-md mx-auto pt-4 pb-2 px-2 flex items-center justify-center select-none">
      <div className="flex items-center gap-2 p-1 rounded-full bg-[#FAF7F0] border border-[#E8E3D7] shadow-sm">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold font-sans transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#EEF4ED] text-[#2D3748] border border-[#DCE8D8] shadow-sm scale-105'
                  : 'text-[#718096] hover:text-[#2D3748] hover:bg-[#F5F1E8]'
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
