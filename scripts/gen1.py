with open("src/App.tsx", "w", encoding="utf-8") as f:
    f.write("""import React, { useState } from 'react';
import { KineticProvider } from './context/KineticContext';
import { GardenProvider } from './context/GardenContext';
import { Navigation, NavTab } from './components/layout/Navigation';
import { FocusView } from './components/focus/FocusView';
import { ChatView } from './components/chat/ChatView';
import { StatsView } from './components/stats/StatsView';
import { BreathingModal } from './components/modals/BreathingModal';
import { BreakReminderModal } from './components/modals/BreakReminderModal';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('focus');

  return (
    <div className="min-h-screen bg-[#382810] text-[#EDE6D6] flex flex-col items-center justify-start p-3 sm:p-5 transition-colors duration-500 selection:bg-[#4E6E3D] selection:text-white">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="w-full max-w-md mx-auto mt-1 flex-1">
        {activeTab === 'focus' && <FocusView />}
        {activeTab === 'stats' && <StatsView />}
        {activeTab === 'chat' && <ChatView />}
      </main>
      <BreathingModal />
      <BreakReminderModal />
    </div>
  );
};

export const App: React.FC = () => (
  <KineticProvider>
    <GardenProvider>
      <AppContent />
    </GardenProvider>
  </KineticProvider>
);

export default App;
""")

with open("src/components/layout/Navigation.tsx", "w", encoding="utf-8") as f:
    f.write("""import React from 'react';

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
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#251A0B]/80 backdrop-blur-md border border-[#4E391F] shadow-sm">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold font-sans transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#486940] text-white border border-[#648B57] shadow-sm scale-105'
                  : 'text-[#AFA28C] hover:text-[#EDE6D6] hover:bg-[#382810]/50'
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
""")
print("Gen1 complete")