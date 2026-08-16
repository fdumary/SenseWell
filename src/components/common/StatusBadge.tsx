import React, { useState, useRef, useEffect } from 'react';
import { useKinetic } from '../../context/KineticContext';
import { UserPresenceStatus } from '../../types';
import { ChevronDown, Check } from 'lucide-react';

export const StatusBadge: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { presenceStatus, setPresenceStatus, setIsBreathingModalOpen } = useKinetic();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statuses: Array<{
    id: UserPresenceStatus;
    label: string;
    emoji: string;
    dotClass: string;
    bgClass: string;
    borderClass: string;
    textColor: string;
    description: string;
  }> = [
    {
      id: 'working',
      label: 'Working',
      emoji: '🟢',
      dotClass: 'bg-emerald-400 animate-pulse',
      bgClass: 'bg-emerald-950/80',
      borderClass: 'border-emerald-500/40',
      textColor: 'text-emerald-300',
      description: 'Focusing on tasks & kinetics',
    },
    {
      id: 'break',
      label: 'On Break',
      emoji: '🟡',
      dotClass: 'bg-amber-400 animate-pulse',
      bgClass: 'bg-amber-950/80',
      borderClass: 'border-amber-500/40',
      textColor: 'text-amber-300',
      description: 'Zoning out / resting',
    },
    {
      id: 'away',
      label: 'Away',
      emoji: '⚪',
      dotClass: 'bg-slate-300',
      bgClass: 'bg-slate-900/80',
      borderClass: 'border-slate-500/30',
      textColor: 'text-slate-300',
      description: 'Stepped away from desk',
    },
  ];

  const current = statuses.find(s => s.id === presenceStatus) || statuses[0];

  const handleSelect = (id: UserPresenceStatus) => {
    setPresenceStatus(id);
    if (id === 'break') {
      setIsBreathingModalOpen(true);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left select-none" ref={dropdownRef}>
      {/* Clickable Badge Trigger */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border backdrop-blur-md transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 ${current.bgClass} ${current.borderClass}`}
        title="Click to update status"
      >
        <span className="text-xs">{current.emoji}</span>
        {!compact && (
          <span className={`text-xs font-bold tracking-tight ${current.textColor}`}>
            {current.label}
          </span>
        )}
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0e1813] border border-emerald-500/30 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-emerald-950/80 mb-1">
            Set Presence Status
          </div>

          <div className="space-y-1">
            {statuses.map(item => {
              const isSelected = item.id === presenceStatus;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-950/90 border border-emerald-500/40 text-slate-100'
                      : 'text-slate-300 hover:bg-emerald-950/40 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{item.emoji}</span>
                    <div>
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.description}</div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
