import React, { useState, useRef, useEffect } from 'react';
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
      {/* Top Hero Card in Buttercream (Screenshot 6) */}
      <div className="p-6 rounded-3xl bg-[#F9E8B6] border border-[#ECD59B] text-center flex flex-col items-center shadow-sm">
        {/* Companion Avatar */}
        <div className="mb-2">
          <CompanionAvatar mood={currentMood} size="lg" showBubble={false} />
        </div>

        <h1 className="font-pixel text-xl font-bold text-[#2D3748] tracking-wide mb-0.5">
          Fern
        </h1>
        <p className="text-xs text-[#6B5A38] font-semibold mb-3">
          Your Forest Companion
        </p>

        {/* Mood Badge */}
        <div className="px-4 py-1 rounded-full bg-[#FFF5DA] border border-[#ECD59B] text-[#5C4A26] text-xs font-bold font-sans shadow-2xs">
          Happy &amp; content
        </div>
      </div>

      {/* Card 2: DID YOU KNOW? in Buttercream */}
      <div className="p-4 rounded-3xl bg-[#F9E8B6] border border-[#ECD59B] shadow-sm flex items-center justify-between">
        <div>
          <div className="text-[10px] font-pixel font-bold uppercase tracking-wider text-[#6B5A38] mb-1">
            Did you know?
          </div>
          <p className="text-xs font-bold text-[#2D3748] flex items-center gap-1.5">
            <span>Fern&apos;s favorite season is autumn.</span>
            <span>🍂</span>
          </p>
        </div>
        <img
          src="/assets/trimmed/Extra decor/Watering can.png"
          alt="Watering Can"
          className="w-10 h-8 object-contain drop-shadow-2xs ml-2 flex-shrink-0"
        />
      </div>

      {/* Card 3: YOUR BOND in Buttercream with Ice Blue Sub-boxes */}
      <div className="p-5 rounded-3xl bg-[#F9E8B6] border border-[#ECD59B] shadow-sm">
        <div className="text-[10px] font-pixel font-bold uppercase tracking-wider text-[#6B5A38] mb-3">
          Your Bond
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Streak Box in Ice Blue */}
          <div className="p-3.5 rounded-2xl bg-[#D4E9F5] border border-[#B8DAED] flex flex-col items-center justify-center text-center shadow-2xs">
            <span className="text-xl mb-0.5">🔥</span>
            <span className="font-pixel text-sm font-bold text-[#1F3847]">
              {bondStats.streakDays}d
            </span>
            <span className="text-[10px] text-[#486B80] font-bold">Streak</span>
          </div>

          {/* Sessions Box in Ice Blue */}
          <div className="p-3.5 rounded-2xl bg-[#D4E9F5] border border-[#B8DAED] flex flex-col items-center justify-center text-center shadow-2xs">
            <span className="text-xl mb-0.5">🌸</span>
            <span className="font-pixel text-sm font-bold text-[#1F3847]">
              {bondStats.sessionsCompleted}
            </span>
            <span className="text-[10px] text-[#486B80] font-bold">Sessions</span>
          </div>

          {/* Water Drops Box in Ice Blue */}
          <div className="p-3.5 rounded-2xl bg-[#D4E9F5] border border-[#B8DAED] flex flex-col items-center justify-center text-center shadow-2xs">
            <span className="text-xl mb-0.5">💧</span>
            <span className="font-pixel text-sm font-bold text-[#1F3847]">
              {bondStats.waterDrops}
            </span>
            <span className="text-[10px] text-[#486B80] font-bold">Water Drops</span>
          </div>

          {/* Stage Box in Ice Blue */}
          <div className="p-3.5 rounded-2xl bg-[#D4E9F5] border border-[#B8DAED] flex flex-col items-center justify-center text-center shadow-2xs">
            <span className="text-xl mb-0.5">🌿</span>
            <span className="font-pixel text-sm font-bold text-[#1F3847]">
              Stage {bondStats.gardenStage}
            </span>
            <span className="text-[10px] text-[#486B80] font-bold">Garden</span>
          </div>
        </div>
      </div>

      {/* Bottom Affirmation Card in Buttercream */}
      <div className="p-4 rounded-3xl bg-[#F9E8B6] border border-[#ECD59B] shadow-sm flex items-center justify-between">
        <p className="text-xs font-bold text-[#2D3748]">
          We&apos;ve done {bondStats.sessionsCompleted} session together! I&apos;m so proud of you! 🌸
        </p>
        <button
          onClick={() => setShowChatBox(prev => !prev)}
          className="ml-2 px-3 py-1.5 rounded-full bg-[#5C4A26] hover:bg-[#4A3B1E] text-white text-[11px] font-bold transition-all cursor-pointer flex-shrink-0"
        >
          {showChatBox ? 'Hide Chat' : 'Talk with Lumi'}
        </button>
      </div>

      {/* Interactive Chat Stream in Buttercream card */}
      {showChatBox && (
        <div className="p-4 rounded-3xl bg-[#F9E8B6] border border-[#ECD59B] shadow-sm space-y-3 animate-in fade-in duration-200">
          <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
            {messages.map(msg => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-[#D4E9F5] border border-[#B8DAED] flex items-center justify-center overflow-hidden flex-shrink-0 mt-0.5 shadow-xs">
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
                        ? 'bg-[#5C4A26] text-white font-semibold rounded-tr-none'
                        : 'bg-[#FFF5DA] border border-[#ECD59B] text-[#2D3748] rounded-tl-none font-medium'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2 justify-start items-center text-xs text-[#6B5A38] font-medium p-2">
                <span>Lumi is reflecting...</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#5C4A26] animate-bounce" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Requested Chat Input Area */}
          <div className="chat-input-area flex items-center gap-2 pt-2 border-t border-[#ECD59B]">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Say something to Lumi..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FFF5DA] border border-[#ECD59B] text-xs text-[#2D3748] focus:outline-none focus:border-[#5C4A26]"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2.5 rounded-xl bg-[#5C4A26] text-white text-xs font-bold hover:bg-[#4A3B1E] transition-all cursor-pointer shadow-xs"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
