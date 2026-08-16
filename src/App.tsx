import React, { useState } from 'react';
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

  const getPageBg = () => {
    switch (activeTab) {
      case 'stats':
        return 'bg-[#F8D7DF]'; // Screenshot 5 (Pastel Pink)
      case 'chat':
        return 'bg-[#D6C8E6]'; // Screenshot 6 (Pastel Lilac)
      case 'focus':
      default:
        return 'bg-[#446637]'; // Screenshot 1 (Forest Olive Green)
    }
  };

  return (
    <div className={`min-h-screen ${getPageBg()} text-[#2D3748] flex flex-col items-center justify-start p-3 sm:p-5 transition-colors duration-500`}>
      {/* Top 3-Tab Pill Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Section Screen View */}
      <main className="w-full max-w-md mx-auto mt-1 flex-1">
        {activeTab === 'focus' && <FocusView />}
        {activeTab === 'stats' && <StatsView />}
        {activeTab === 'chat' && <ChatView />}
      </main>

      {/* 4-7-8 Breathing & Grounding Sanctuary Modal */}
      <BreathingModal />

      {/* Break Reminder Modal */}
      <BreakReminderModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <KineticProvider>
      <GardenProvider>
        <AppContent />
      </GardenProvider>
    </KineticProvider>
  );
};

export default App;
