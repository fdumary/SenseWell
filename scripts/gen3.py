with open("src/components/focus/FocusSessionModal.tsx", "w", encoding="utf-8") as f:
    f.write("""import React from 'react';
import { useKinetic } from '../../context/KineticContext';
import { CompanionAvatar } from '../garden/CompanionAvatar';
import { Play, Pause, ArrowLeft } from 'lucide-react';

export const FocusSessionModal: React.FC = () => {
  const {
    isFocusSessionActive,
    isSessionPaused,
    sessionRemainingSeconds,
    pauseFocusSession,
    resumeFocusSession,
    endFocusSession,
    currentMood,
    bondStats,
  } = useKinetic();

  if (!isFocusSessionActive) return null;

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(mins)}:${pad(secs)}`;
  };

  const getMoodTag = () => {
    switch (currentMood) {
      case 'hyped':
        return { emoji: '✨', label: 'Hyped' };
      case 'calm':
        return { emoji: '🍃', label: 'Calm' };
      case 'tired':
        return { emoji: '🌙', label: 'Tired' };
      case 'meh':
        return { emoji: '☁️', label: 'Meh' };
      case 'happy':
      default:
        return { emoji: '🌸', label: 'Happy' };
    }
  };

  const moodTag = getMoodTag();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-[#2B3D23] via-[#33482A] to-[#201609] overflow-y-auto animate-in fade-in duration-300 select-none">
      <div className="w-full max-w-md flex items-center justify-between z-20 pt-2">
        <button
          onClick={endFocusSession}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#251A0B]/90 text-[#EDE6D6] text-xs font-bold shadow-sm border border-[#4E391F] hover:bg-[#382810] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Garden</span>
        </button>

        <span className="font-pixel text-xs sm:text-sm font-bold text-[#D4E8CF] tracking-widest uppercase drop-shadow-2xs">
          Focus Session
        </span>

        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#251A0B]/90 text-[#EDE6D6] text-xs font-bold shadow-sm border border-[#4E391F]">
          <span>{moodTag.emoji}</span>
          <span className="capitalize">{moodTag.label}</span>
        </div>
      </div>

      <div className="w-full max-w-md my-auto pt-4 pb-2">
        <div className="relative rounded-[32px] bg-[#3E2714] border-2 border-[#6E5033] p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center">
          <div className="absolute top-3 left-4 pointer-events-none">
            <img src="/assets/trimmed/Extra decor/yellow_stars.png" alt="Stars" className="w-5 h-5 object-contain opacity-80" />
          </div>
          <div className="absolute top-3 right-4 pointer-events-none">
            <img src="/assets/trimmed/Extra decor/yellow_stars.png" alt="Stars" className="w-5 h-5 object-contain opacity-80" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-pixel text-[11px] text-[#A68F78] uppercase tracking-wider">
              Session {bondStats.sessionsCompleted + 1} &bull;
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#2A1C0E] border border-[#5C442A] text-xs font-bold text-[#EADBB7] flex items-center gap-1">
              <span>{moodTag.emoji}</span>
              <span>{moodTag.label}</span>
            </span>
          </div>

          <h2 className="text-sm sm:text-base font-bold text-[#EDE6D6] mb-4">
            {!isSessionPaused
              ? 'Great vibes today — let us bloom! 🌸'
              : 'Ready when you are! 🌸'}
          </h2>

          <div className="my-2 select-none">
            <div className="text-6xl sm:text-7xl font-pixel font-bold tracking-widest text-[#EDE6D6] drop-shadow-md">
              {formatTimer(sessionRemainingSeconds)}
            </div>
          </div>

          <div className="w-3/4 flex items-center justify-center my-3 opacity-60">
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#6E5033] to-transparent" />
          </div>

          <div className="w-full p-3 rounded-2xl bg-[#2A1C0E] border border-[#5C442A] mb-6 text-left">
            <div className="flex items-center justify-between text-xs font-bold text-[#98C992] mb-1.5">
              <div className="flex items-center gap-1.5">
                <span>🍃</span>
                <span>Next break in {Math.ceil(sessionRemainingSeconds / 60)} min</span>
              </div>
            </div>
            <div className="w-full bg-[#1A1208] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#4D7C54] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${((25 * 60 - sessionRemainingSeconds) / (25 * 60)) * 100}%`,
                }}
              />
            </div>
          </div>

          {!isSessionPaused ? (
            <button
              onClick={pauseFocusSession}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#433868] hover:bg-[#362D54] text-white border border-[#594B8A] font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Pause className="w-5 h-5 fill-white text-white" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={resumeFocusSession}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#48694B] hover:bg-[#3D5C3F] text-white border border-[#5D8460] font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white text-white" />
              <span>Resume</span>
            </button>
          )}

          <button
            onClick={endFocusSession}
            className="mt-3 text-xs text-[#A68F78] hover:text-[#EDE6D6] font-bold underline cursor-pointer"
          >
            end session
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center z-20 pb-2">
        <div className="mb-1 px-4 py-1.5 rounded-2xl bg-[#4A3720] border border-[#6E5033] shadow-md text-xs font-bold text-[#EDE6D6] relative">
          <span>{!isSessionPaused ? 'I believe in you! 🌟' : "Whenever you're ready! 🌸"}</span>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#4A3720] border-r border-b border-[#6E5033] transform rotate-45" />
        </div>

        <div className="mb-1">
          <CompanionAvatar
            mood={currentMood}
            size="md"
            showBubble={false}
            isWaving={true}
          />
        </div>

        <div className="text-xs font-bold text-[#D4E8CF] drop-shadow-sm flex items-center gap-1">
          <span>{bondStats.focusMinutesToday + 1}m focused today</span>
          <span>🌿</span>
        </div>
      </div>
    </div>
  );
};
""")

with open("src/components/stats/StatsView.tsx", "w", encoding="utf-8") as f:
    f.write("""import React from 'react';
import { useKinetic } from '../../context/KineticContext';
import { useGarden } from '../../context/GardenContext';
import { Timer, Droplets, Flame } from 'lucide-react';

export const StatsView: React.FC = () => {
  const { bondStats } = useKinetic();
  const { dewDrops } = useGarden();

  const daysList = [
    { day: 'M', active: true },
    { day: 'T', active: true },
    { day: 'W', active: true },
    { day: 'T', active: false },
    { day: 'F', active: false },
    { day: 'S', active: false },
    { day: 'S', active: false },
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-3 animate-in fade-in duration-500 select-none pb-6">
      <div className="flex items-center justify-between pt-1 pb-1">
        <div>
          <h1 className="font-pixel text-base sm:text-lg font-bold text-[#EDE6D6] tracking-wide">
            Today's Stats
          </h1>
          <p className="text-xs text-[#AFA28C] font-semibold">Saturday, August 15</p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#25331E] border border-[#486344] text-[#98C992] text-xs font-bold font-pixel shadow-2xs">
          <span>🌸</span>
          <span>Sprouting</span>
          <span>🌿</span>
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-[#3E2B18] border-2 border-[#5C4229] shadow-md">
        <div className="flex items-center gap-2 text-[11px] font-pixel font-bold uppercase tracking-wider text-[#AFA28C] mb-2">
          <Timer className="w-3.5 h-3.5 text-[#98C992]" />
          <span>Focus Time</span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-pixel font-bold text-[#EDE6D6]">
            {bondStats.focusMinutesToday}m
          </span>
          <span className="text-xs text-[#AFA28C] font-semibold">today</span>
        </div>

        <div className="w-full bg-[#24190E] rounded-full h-3 overflow-hidden border border-[#4E391F] mb-2">
          <div
            className="bg-[#4D7C54] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (bondStats.focusMinutesToday / (bondStats.dailyGoalHours * 60)) * 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[#AFA28C] font-bold">
          <span>{Math.round((bondStats.focusMinutesToday / (bondStats.dailyGoalHours * 60)) * 100)}% of daily goal</span>
          <span>{bondStats.dailyGoalHours}h goal</span>
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-[#3E2B18] border-2 border-[#5C4229] shadow-md">
        <div className="flex items-center gap-2 text-[11px] font-pixel font-bold uppercase tracking-wider text-[#AFA28C] mb-2">
          <Droplets className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span>Breaks Today</span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-pixel font-bold text-[#EDE6D6]">
            {bondStats.breaksToday}
          </span>
          <span className="text-xs text-[#AFA28C] font-semibold">break taken</span>
        </div>

        <div className="flex items-center gap-3 text-lg">
          <span className="text-[#3B82F6]">💧</span>
          <span className="text-[#64503C]">💧</span>
          <span className="text-[#64503C]">💧</span>
          <span className="text-[#64503C]">💧</span>
          <span className="text-[#64503C]">💧</span>
          <span className="text-[#64503C]">💧</span>
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-[#3E2B18] border-2 border-[#5C4229] shadow-md">
        <div className="flex items-center gap-2 text-[11px] font-pixel font-bold uppercase tracking-wider text-[#AFA28C] mb-2">
          <Flame className="w-3.5 h-3.5 text-[#D96B43]" />
          <span>Streak</span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-pixel font-bold text-[#EDE6D6]">
            {bondStats.streakDays}
          </span>
          <span className="text-xs text-[#AFA28C] font-semibold">days in a row</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysList.map((d, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div
                className={`w-full h-10 rounded-xl flex items-center justify-center border transition-all ${
                  d.active
                    ? 'bg-[#D96B43] border-[#B85732] text-white shadow-xs'
                    : 'bg-[#24190E] border-[#4E391F] text-[#64503C]'
                }`}
              >
                {d.active && <Flame className="w-4 h-4 fill-white" />}
              </div>
              <span className="text-[10px] font-pixel font-bold text-[#AFA28C]">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-[#3E2B18] border-2 border-[#5C4229] shadow-md">
        <div className="flex items-center gap-2 text-[11px] font-pixel font-bold uppercase tracking-wider text-[#AFA28C] mb-2">
          <span>🌸</span>
          <span>Garden Health</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-pixel font-bold text-[#EDE6D6]">Sprouting</span>
          <span className="text-lg">🌿</span>
        </div>

        <div className="flex items-center gap-2.5 mb-3 text-base">
          <span>🌸</span>
          <span>🌸</span>
          <span className="w-4 h-4 rounded-full border-2 border-[#64503C]" />
          <span className="w-4 h-4 rounded-full border-2 border-[#64503C]" />
          <span className="w-4 h-4 rounded-full border-2 border-[#64503C]" />
        </div>

        <p className="text-xs text-[#98C992] font-bold mb-3">
          Your garden is growing well!
        </p>

        <div className="p-3 rounded-2xl bg-[#24190E] border border-[#4E391F] flex items-center gap-2 text-xs font-bold text-[#EDE6D6]">
          <span className="text-[#3B82F6]">💧</span>
          <span>{dewDrops || bondStats.waterDrops} water drops collected from breaks</span>
        </div>
      </div>
    </div>
  );
};
""")

with open("src/components/chat/ChatView.tsx", "w", encoding="utf-8") as f:
    f.write("""import React, { useState, useRef, useEffect } from 'react';
import { useKinetic } from '../../context/KineticContext';
import { useGarden } from '../../context/GardenContext';
import { ChatMessage } from '../../types';
import { CompanionAvatar } from '../garden/CompanionAvatar';
import { sendToLumi } from '../../api';

export const ChatView: React.FC = () => {
  const {
    bondStats,
    currentMood,
    timerData,
    setIsBreakReminderOpen,
    setIsBreathingModalOpen,
    addWaterDrop,
  } = useKinetic();

  const { fertilizeGarden } = useGarden();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'lumi',
      text: "Hey there! I'm Lumi, your wellness companion. 💙",
      timestamp: 'Just now',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showChatBox, setShowChatBox] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (showChatBox) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, showChatBox]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userText = inputText;
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setInputText('');
    setIsTyping(true);

    try {
      const lumi = await sendToLumi(userText, timerData);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'lumi',
          text: lumi.reply || "I'm right here with you! 🌿",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      if (lumi.suggestedAction === 'take_break') {
        setIsBreakReminderOpen(true);
      } else if (lumi.suggestedAction === 'breathing_exercise') {
        setIsBreathingModalOpen(true);
      } else if (lumi.suggestedAction === 'drink_water') {
        addWaterDrop();
        fertilizeGarden();
      }
    } catch (e) {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'lumi',
          text: "I'm having trouble connecting, but I'm here! 💙",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-3 animate-in fade-in duration-500 select-none pb-6">
      <div className="p-6 rounded-3xl bg-[#243322] border-2 border-[#3E563C] text-center flex flex-col items-center shadow-lg">
        <div className="mb-2">
          <CompanionAvatar mood={currentMood} size="lg" showBubble={false} />
        </div>

        <h1 className="font-pixel text-xl font-bold text-[#EDE6D6] tracking-wide mb-0.5">
          Fern
        </h1>
        <p className="text-xs text-[#A8C79E] font-semibold mb-3">
          Your Forest Companion
        </p>

        <div className="px-4 py-1 rounded-full bg-[#1D2A1C] border border-[#3E563C] text-[#96C898] text-xs font-bold font-sans shadow-2xs">
          Happy &amp; content
        </div>
      </div>

      <div className="p-4 rounded-3xl bg-[#3E2B18] border-2 border-[#5C4229] shadow-md flex items-center justify-between">
        <div>
          <div className="text-[10px] font-pixel font-bold uppercase tracking-wider text-[#AFA28C] mb-1">
            Did you know?
          </div>
          <p className="text-xs font-bold text-[#EDE6D6] flex items-center gap-1.5">
            <span>Fern's favorite season is autumn.</span>
            <span>🍂</span>
          </p>
        </div>
        <img
          src="/assets/trimmed/Extra decor/Watering can.png"
          alt="Watering Can"
          className="w-10 h-8 object-contain drop-shadow-2xs ml-2 flex-shrink-0"
        />
      </div>

      <div className="p-5 rounded-3xl bg-[#3E2B18] border-2 border-[#5C4229] shadow-md">
        <div className="text-[10px] font-pixel font-bold uppercase tracking-wider text-[#AFA28C] mb-3">
          Your Bond
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#2A1C0E] border border-[#483420] flex flex-col items-center justify-center text-center shadow-2xs">
            <span className="text-xl mb-0.5">🔥</span>
            <span className="font-pixel text-sm font-bold text-[#EDE6D6]">
              {bondStats.streakDays}d
            </span>
            <span className="text-[10px] text-[#AFA28C] font-bold">Streak</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#2A1C0E] border border-[#483420] flex flex-col items-center justify-center text-center shadow-2xs">
            <span className="text-xl mb-0.5">🌸</span>
            <span className="font-pixel text-sm font-bold text-[#EDE6D6]">
              {bondStats.sessionsCompleted}
            </span>
            <span className="text-[10px] text-[#AFA28C] font-bold">Sessions</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#2A1C0E] border border-[#483420] flex flex-col items-center justify-center text-center shadow-2xs">
            <span className="text-xl mb-0.5">💧</span>
            <span className="font-pixel text-sm font-bold text-[#EDE6D6]">
              {bondStats.waterDrops}
            </span>
            <span className="text-[10px] text-[#AFA28C] font-bold">Water Drops</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#2A1C0E] border border-[#483420] flex flex-col items-center justify-center text-center shadow-2xs">
            <span className="text-xl mb-0.5">🌿</span>
            <span className="font-pixel text-sm font-bold text-[#EDE6D6]">
              Stage {bondStats.gardenStage}
            </span>
            <span className="text-[10px] text-[#AFA28C] font-bold">Garden</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-3xl bg-[#3E2B18] border-2 border-[#5C4229] shadow-md flex items-center justify-between">
        <p className="text-xs font-bold text-[#EDE6D6]">
          We've done {bondStats.sessionsCompleted} session together! I'm so proud of you! 🌸
        </p>
        <button
          onClick={() => setShowChatBox(prev => !prev)}
          className="ml-2 px-3 py-1.5 rounded-full bg-[#486940] hover:bg-[#3D5C35] text-white text-[11px] font-bold transition-all cursor-pointer flex-shrink-0"
        >
          {showChatBox ? 'Hide Chat' : 'Talk with Lumi'}
        </button>
      </div>

      {showChatBox && (
        <div className="p-4 rounded-3xl bg-[#3E2B18] border-2 border-[#5C4229] shadow-md space-y-3 animate-in fade-in duration-200">
          <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
            {messages.map(msg => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-[#2A1C0E] border border-[#5C4229] flex items-center justify-center overflow-hidden flex-shrink-0 mt-0.5 shadow-xs">
                      <img
                        src="/assets/trimmed/lumi.png"
                        alt="Lumi"
                        className="w-full h-full object-contain p-0.5"
                      />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[80%] ${
                      isUser
                        ? 'bg-[#486940] text-white font-semibold rounded-tr-none'
                        : 'bg-[#2A1C0E] border border-[#5C4229] text-[#EDE6D6] rounded-tl-none font-medium'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2 justify-start items-center text-xs text-[#AFA28C] font-medium p-2">
                <span>Lumi is reflecting...</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#98C992] animate-bounce" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area flex items-center gap-2 pt-2 border-t border-[#5C4229]">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Say something to Lumi..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#2A1C0E] border border-[#5C4229] text-xs text-[#EDE6D6] placeholder-[#8C7A64] focus:outline-none focus:border-[#98C992]"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2.5 rounded-xl bg-[#486940] text-white text-xs font-bold hover:bg-[#3D5C35] transition-all cursor-pointer shadow-xs"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
""")

with open("src/components/modals/BreakReminderModal.tsx", "w", encoding="utf-8") as f:
    f.write("""import React from 'react';
import { useKinetic } from '../../context/KineticContext';
import { useGarden } from '../../context/GardenContext';
import { CompanionAvatar } from '../garden/CompanionAvatar';
import { Coffee, X } from 'lucide-react';

export const BreakReminderModal: React.FC = () => {
  const {
    isBreakReminderOpen,
    setIsBreakReminderOpen,
    setIsBreathingModalOpen,
    setPresenceStatus,
  } = useKinetic();

  const { fertilizeGarden } = useGarden();

  if (!isBreakReminderOpen) return null;

  const handleTakeBreak = () => {
    setIsBreakReminderOpen(false);
    setPresenceStatus('break');
    fertilizeGarden();
    setIsBreathingModalOpen(true);
  };

  const handleSnooze = () => {
    setIsBreakReminderOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300 select-none">
      <div className="relative w-full max-w-sm rounded-[32px] bg-[#1F2C1E] border-2 border-[#3A5237] p-6 shadow-2xl text-center flex flex-col items-center">
        <button
          onClick={() => setIsBreakReminderOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#AFA28C] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          title="Dismiss reminder"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-2">
          <CompanionAvatar mood="hyped" size="lg" showBubble={false} />
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141E13] border border-[#3A5237] text-[#98C992] text-[11px] font-pixel font-bold uppercase tracking-wider mb-2.5">
          <Coffee className="w-3 h-3 text-[#98C992]" />
          <span>Fern</span>
        </div>

        <h3 className="text-base font-pixel font-bold text-[#EDE6D6] mb-1.5">
          Hey!! It's time for a break! 🌸
        </h3>
        <p className="text-xs text-[#A8C79E] font-semibold leading-relaxed max-w-xs mb-5">
          You've been working hard. Let's take a little breather.
        </p>

        <div className="w-full grid grid-cols-2 gap-2.5">
          <button
            onClick={handleTakeBreak}
            className="py-2.5 px-4 rounded-2xl bg-[#3F633B] hover:bg-[#345230] border border-[#527F4D] text-white font-pixel text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>☕</span>
            <span>Take a Break</span>
          </button>

          <button
            onClick={handleSnooze}
            className="py-2.5 px-4 rounded-2xl bg-[#273525] hover:bg-[#202B1E] border border-[#3A5237] text-[#EDE6D6] font-pixel text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Later</span>
          </button>
        </div>
      </div>
    </div>
  );
};
""")
print("Gen3 complete")