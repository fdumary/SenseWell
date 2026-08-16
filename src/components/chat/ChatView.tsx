import React, { useState, useRef, useEffect } from 'react';
import { useKinetic } from '../../context/KineticContext';
import { useGarden } from '../../context/GardenContext';
import { ChatMessage } from '../../types';
import { CompanionAvatar } from '../garden/CompanionAvatar';
import { Send, Sparkles, Heart } from 'lucide-react';

export const ChatView: React.FC = () => {
  const { metrics, triggerMicroBreak } = useKinetic();
  const { fertilizeGarden } = useGarden();

  const [inputVal, setInputVal] = useState('');
  const [personality, setPersonality] = useState<'nurturing' | 'playful' | 'zen' | 'silent'>('nurturing');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'companion',
      text: "Hello friend. I've been quietly enjoying the garden breeze. How is your energy feeling right now?",
      timestamp: 'Just now',
      tag: 'casual',
    },
    {
      id: '2',
      sender: 'companion',
      text: metrics.tensionScore > 50
        ? "I noticed some rapid, sharp mouse movements a minute ago. No pressure to talk about it, but I'm here if you want to vent or pause."
        : "Your cursor kinetics have been so smooth and harmonious. The lotus flowers are blooming beautifully.",
      timestamp: 'Just now',
      tag: 'kinetic-insight',
      suggestedAction: metrics.tensionScore > 50
        ? { label: 'Take a 60-second Breath', actionType: 'breathe' }
        : { label: 'Celebrate Flow State', actionType: 'micro-win' },
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal('');

    // Generate contextually empathetic companion reply
    setTimeout(() => {
      let reply = '';
      let tag: ChatMessage['tag'] = 'casual';
      let action: ChatMessage['suggestedAction'] = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('stress') || lower.includes('overwhelm') || lower.includes('deadline') || lower.includes('hard')) {
        reply = personality === 'playful'
          ? "Deep breath, champion! Deadlines are tough, but you are tougher. Let's shake out those fingers and take a 30-second reset."
          : "That heavy feeling is valid. You don't have to carry the whole mountain at once—just the next tiny step. I'm right here with you.";
        tag = 'grounding';
        action = { label: '4-7-8 Breathing', actionType: 'breathe' };
      } else if (lower.includes('win') || lower.includes('done') || lower.includes('finished') || lower.includes('celebrate')) {
        reply = "YES! That is worth celebrating! I just bloomed another flower in your garden for that!";
        tag = 'micro-win';
        action = { label: 'See Bloom Progress', actionType: 'micro-win' };
        fertilizeGarden();
      } else if (lower.includes('tired') || lower.includes('exhausted') || lower.includes('sleepy')) {
        reply = "Your kinetic velocity has been very gentle. Maybe your eyes need a rest from the blue light? Close them for 30 seconds and listen to the ambient breeze.";
        tag = 'grounding';
        action = { label: 'Gentle Eye Rest', actionType: 'stretch' };
      } else {
        reply = personality === 'zen'
          ? "Every breath and keystroke is part of the flow. Be gentle with your pace today."
          : "I hear you. Remember that you don't have to fill out any daily mood forms here—I sense and support you effortlessly through your flow.";
        tag = 'casual';
      }

      const companionMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'companion',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tag,
        suggestedAction: action,
      };

      setMessages(prev => [...prev, companionMsg]);
    }, 800);
  };

  const quickPrompts = [
    { label: '🌿 Feeling overwhelmed by tasks', prompt: 'I am feeling overwhelmed with what I need to do right now.' },
    { label: '✨ Celebrate a small win', prompt: 'I just finished a tricky task and want to celebrate a small win!' },
    { label: '🧘 Help me ground myself', prompt: 'My thoughts are racing. Can you help me ground myself?' },
    { label: '☕ Taking a gentle 5-minute break', prompt: 'Just taking a gentle 5-minute break to sit in the garden.' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
      {/* Left Column: Companion Presence & Bio */}
      <div className="lg:col-span-1 space-y-5">
        <div className="p-6 rounded-3xl glass-panel border border-emerald-500/20 text-center flex flex-col items-center">
          <div className="mb-2">
            <CompanionAvatar mood={metrics.inferredMood} size="md" showBubble={false} />
          </div>

          <h3 className="text-xl font-bold font-display text-slate-100">Sprout</h3>
          <span className="text-xs text-emerald-400 font-medium mb-3">Garden Mood Companion</span>

          {/* Sensed mood status */}
          <div className="w-full py-2 px-3 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-xs text-slate-300 flex items-center justify-between mb-4">
            <span>Sensed Vibe:</span>
            <span className="font-semibold text-emerald-300 capitalize">{metrics.inferredMood}</span>
          </div>

          {/* Companion Tone Switcher */}
          <div className="w-full text-left">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
              Companion Tone
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {(['nurturing', 'playful', 'zen', 'silent'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setPersonality(t)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-medium capitalize transition-all ${
                    personality === t
                      ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/50'
                      : 'bg-emerald-950/30 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Zero Guilt Principle Card */}
        <div className="p-4 rounded-2xl glass-panel border border-emerald-500/15 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>No Form Logging Guilt</span>
          </div>
          <p>
            Sprout listens to your natural mouse kinetics. No mandatory daily questionnaires or 1-to-10 ratings.
          </p>
        </div>
      </div>

      {/* Right Column: Chat Stream */}
      <div className="lg:col-span-3 flex flex-col h-[600px] rounded-3xl glass-panel border border-emerald-500/20 p-5 overflow-hidden justify-between">
        {/* Chat Messages History */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-300 flex-shrink-0 mt-1">
                    🌱
                  </div>
                )}

                <div className={`max-w-md ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Message Bubble */}
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? 'bg-emerald-600 text-slate-950 font-medium rounded-tr-none'
                        : 'bg-emerald-950/70 border border-emerald-500/25 text-slate-100 rounded-tl-none backdrop-blur-md'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Action trigger button inside message */}
                    {msg.suggestedAction && (
                      <div className="mt-3 pt-2.5 border-t border-emerald-500/20 flex items-center justify-between">
                        <span className="text-xs text-emerald-300 font-medium">
                          Suggested Micro-Reset:
                        </span>
                        <button
                          onClick={triggerMicroBreak}
                          className="px-3 py-1 rounded-full bg-emerald-500/30 hover:bg-emerald-500/50 border border-emerald-400/40 text-xs text-emerald-200 font-semibold flex items-center gap-1 transition-all"
                        >
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>{msg.suggestedAction.label}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Timestamp & Tag */}
                  <div
                    className={`flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-500 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.tag && !isUser && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-500/20 text-emerald-400/80 capitalize">
                        {msg.tag.replace('-', ' ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="pt-3 pb-2 border-t border-emerald-950/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q.prompt)}
              className="px-3 py-1.5 rounded-full bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/20 text-xs text-emerald-300 whitespace-nowrap transition-all hover:scale-[1.02] flex-shrink-0"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="pt-2 flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Share a thought or just rest with Sprout..."
            className="flex-1 px-4 py-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 transition-all backdrop-blur-md"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputVal.trim()}
            className={`p-3 rounded-2xl transition-all flex items-center justify-center ${
              inputVal.trim()
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-glow-sm cursor-pointer'
                : 'bg-emerald-950/50 text-slate-600 cursor-not-allowed border border-emerald-500/10'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
