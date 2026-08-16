import React, { useState, useRef, useEffect } from 'react';
import { useKinetic } from '../../context/KineticContext';
import { useGarden } from '../../context/GardenContext';
import { ChatMessage } from '../../types';
import { CompanionAvatar } from '../garden/CompanionAvatar';
import { TaskManager } from '../tasks/TaskManager';
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
      if (lumi.task) window.dispatchEvent(new Event('sensewell:tasks-updated'));
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

      <TaskManager />

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
