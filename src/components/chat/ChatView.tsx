import React, { useState, useRef, useEffect } from 'react';
import { useKinetic } from '../../context/KineticContext';
import { useGarden } from '../../context/GardenContext';
import { ChatMessage } from '../../types';
import { CompanionAvatar } from '../garden/CompanionAvatar';
import { Send } from 'lucide-react';

export const ChatView: React.FC = () => {
  const { bondStats, currentMood } = useKinetic();
  const { fertilizeGarden } = useGarden();

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showChatBox, setShowChatBox] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'companion',
      text: "Hello! I am Fern, your forest companion. I'm keeping the garden blooming while you work.",
      timestamp: 'Just now',
      tag: 'casual',
    },
    {
      id: '2',
      sender: 'companion',
      text: "Whenever you feel ready to pause, take a quick breath and I'll water the flowers for you! 💧",
      timestamp: 'Just now',
      tag: 'kinetic-insight',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (showChatBox) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, showChatBox]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();
      if (lower.includes('stress') || lower.includes('tired') || lower.includes('break')) {
        reply = "Take a gentle pause with me! Even a 2-minute stretch will give your mind fresh energy. 🌿";
      } else if (lower.includes('win') || lower.includes('done') || lower.includes('finish')) {
        reply = "Yay! I am so proud of you! I just bloomed another flower on our trellis! 🌸";
        fertilizeGarden();
      } else {
        reply = "I'm right here with you in the garden. Keep flowing at your own cozy pace! 🍃";
      }

      const companionMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'companion',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, companionMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-in fade-in duration-500 select-none pb-6">
      {/* Top Hero Card matching Screenshot 2 */}
      <div className="p-6 rounded-3xl figma-panel-green text-center flex flex-col items-center shadow-sm">
        {/* Fern Avatar */}
        <div className="mb-2">
          <CompanionAvatar mood={currentMood} size="lg" showBubble={false} />
        </div>

        <h1 className="font-pixel text-xl font-bold text-[#2D3748] tracking-wide mb-0.5">
          Fern
        </h1>
        <p className="text-xs text-[#718096] font-semibold mb-3">
          Your Forest Companion
        </p>

        {/* Mood Badge */}
        <div className="px-4 py-1 rounded-full bg-[#EAE6DC]/90 text-[#4A5568] text-xs font-bold font-sans">
          Happy &amp; content
        </div>
      </div>

      {/* Card 2: DID YOU KNOW? */}
      <div className="p-4 rounded-3xl bg-[#FFFDF9] border border-[#EAE6DC] shadow-sm">
        <div className="text-[10px] font-pixel font-bold uppercase tracking-wider text-[#718096] mb-1">
          Did you know?
        </div>
        <p className="text-xs font-bold text-[#2D3748] flex items-center gap-1.5">
          <span>Fern waters the garden whenever you take a break.</span>
          <span className="text-[#60A5FA]">💧</span>
        </p>
      </div>

      {/* Card 3: YOUR BOND (4-grid stat boxes) */}
      <div className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#EAE6DC] shadow-sm">
        <div className="text-[10px] font-pixel font-bold uppercase tracking-wider text-[#718096] mb-3">
          Your Bond
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Streak Box */}
          <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E8E3D7] flex flex-col items-center justify-center text-center">
            <span className="text-xl mb-0.5">🔥</span>
            <span className="font-pixel text-sm font-bold text-[#2D3748]">
              {bondStats.streakDays}d
            </span>
            <span className="text-[10px] text-[#718096] font-bold">Streak</span>
          </div>

          {/* Sessions Box */}
          <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E8E3D7] flex flex-col items-center justify-center text-center">
            <span className="text-xl mb-0.5">🌸</span>
            <span className="font-pixel text-sm font-bold text-[#2D3748]">
              {bondStats.sessionsCompleted}
            </span>
            <span className="text-[10px] text-[#718096] font-bold">Sessions</span>
          </div>

          {/* Water Drops Box */}
          <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E8E3D7] flex flex-col items-center justify-center text-center">
            <span className="text-xl mb-0.5">💧</span>
            <span className="font-pixel text-sm font-bold text-[#2D3748]">
              {bondStats.waterDrops}
            </span>
            <span className="text-[10px] text-[#718096] font-bold">Water Drops</span>
          </div>

          {/* Stage Box */}
          <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E8E3D7] flex flex-col items-center justify-center text-center">
            <span className="text-xl mb-0.5">🌿</span>
            <span className="font-pixel text-sm font-bold text-[#2D3748]">
              Stage {bondStats.gardenStage}
            </span>
            <span className="text-[10px] text-[#718096] font-bold">Garden</span>
          </div>
        </div>
      </div>

      {/* Bottom Affirmation Card */}
      <div className="p-4 rounded-3xl bg-[#FFFDF9] border border-[#EAE6DC] shadow-sm flex items-center justify-between">
        <p className="text-xs font-bold text-[#2D3748]">
          We&apos;ve done {bondStats.sessionsCompleted} session together! I&apos;m so proud of you! 🌸
        </p>
        <button
          onClick={() => setShowChatBox(prev => !prev)}
          className="ml-2 px-3 py-1.5 rounded-full bg-[#4A7C59] hover:bg-[#3D684A] text-white text-[11px] font-bold transition-all cursor-pointer flex-shrink-0"
        >
          {showChatBox ? 'Hide Chat' : 'Talk with Fern'}
        </button>
      </div>

      {/* Interactive Chat Stream when toggled */}
      {showChatBox && (
        <div className="p-4 rounded-3xl bg-[#FFFDF9] border border-[#EAE6DC] shadow-sm space-y-3 animate-in fade-in duration-200">
          <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
            {messages.map(msg => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-full bg-[#EEF4ED] border border-[#DCE8D8] flex items-center justify-center text-xs flex-shrink-0 mt-1">
                      🌿
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[80%] ${
                      isUser
                        ? 'bg-[#4A7C59] text-white font-semibold rounded-tr-none'
                        : 'bg-[#FAF7F0] border border-[#E8E3D7] text-[#2D3748] rounded-tl-none font-medium'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2 justify-start items-center text-xs text-[#718096] font-medium p-2">
                <span>Fern is reflecting...</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A7C59] animate-bounce" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="pt-2 flex items-center gap-2 border-t border-[#EAE6DC]">
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Chat with Fern..."
              className="flex-1 px-3 py-2 rounded-xl bg-[#FAF7F0] border border-[#E8E3D7] text-xs text-[#2D3748] focus:outline-none focus:border-[#4A7C59]"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputVal.trim()}
              className="p-2 rounded-xl bg-[#4A7C59] text-white disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
