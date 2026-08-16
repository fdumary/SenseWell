import React, { useState } from 'react';
import { KineticProvider } from './context/KineticContext';
import { GardenProvider } from './context/GardenContext';
import { Navigation, NavTab } from './components/layout/Navigation';
import { TopHeader } from './components/layout/TopHeader';
import { FocusView } from './components/focus/FocusView';
import { ChatView } from './components/chat/ChatView';
import { StatsView } from './components/stats/StatsView';
import { BreathingModal } from './components/modals/BreathingModal';
import { BreakReminderModal } from './components/modals/BreakReminderModal';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('focus');

  return (
    <div className="min-h-screen bg-[#070e0a] text-slate-100 flex flex-col md:flex-row garden-ambient-glow">
      {/* Sidebar Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <TopHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Section View */}
        <main className="flex-1 p-3 sm:p-5 md:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
          {activeTab === 'focus' && <FocusView />}
          {activeTab === 'chat' && <ChatView />}
          {activeTab === 'stats' && <StatsView />}
        </main>
      </div>

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
