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
