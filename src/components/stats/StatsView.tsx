import React, { useState } from 'react';
import { useGarden } from '../../context/GardenContext';
import { DailyStatPoint, MicroWin } from '../../types';
import { Zap, Wind, Flower2, Trophy, Sparkles, TrendingUp, Heart } from 'lucide-react';

export const StatsView: React.FC = () => {
  const { gardenHealth, dewDrops } = useGarden();

  const [activeRange, setActiveRange] = useState<'today' | '7days'>('today');

  const hourlyTimeline: DailyStatPoint[] = [
    { time: '09:00', flow: 75, jitter: 18, bloom: 82, interventions: 0 },
    { time: '10:00', flow: 90, jitter: 12, bloom: 95, interventions: 0 },
    { time: '11:00', flow: 85, jitter: 22, bloom: 90, interventions: 0 },
    { time: '12:00', flow: 40, jitter: 15, bloom: 80, interventions: 0 }, // Lunch break
    { time: '13:00', flow: 65, jitter: 35, bloom: 74, interventions: 1 },
    { time: '14:00', flow: 50, jitter: 68, bloom: 55, interventions: 2 }, // High tension task
    { time: '15:00', flow: 88, jitter: 16, bloom: 89, interventions: 0 }, // Post-rest recovery
    { time: '16:00', flow: 92, jitter: 10, bloom: 96, interventions: 0 },
    { time: '17:00', flow: 80, jitter: 20, bloom: 91, interventions: 0 },
  ];

  const weeklyData = [
    { day: 'Mon', flowHours: 4.2, strainEvents: 1, bloom: 88 },
    { day: 'Tue', flowHours: 5.1, strainEvents: 2, bloom: 94 },
    { day: 'Wed', flowHours: 3.8, strainEvents: 3, bloom: 78 },
    { day: 'Thu', flowHours: 5.6, strainEvents: 0, bloom: 98 },
    { day: 'Fri', flowHours: 4.9, strainEvents: 1, bloom: 91 },
    { day: 'Sat', flowHours: 2.1, strainEvents: 0, bloom: 85 },
    { day: 'Sun', flowHours: 1.5, strainEvents: 0, bloom: 90 },
  ];

  const microWinsList: MicroWin[] = [
    {
      id: '1',
      title: 'Smooth 45-minute deep focus arc without erratic jitter',
      timeAgo: '28m ago',
      category: 'focus',
      iconName: 'zap',
    },
    {
      id: '2',
      title: 'Paused for 4-7-8 breathing after 14:00 tension cluster',
      timeAgo: '2h ago',
      category: 'grounding',
      iconName: 'wind',
    },
    {
      id: '3',
      title: 'Nourished full lotus bloom in the morning session',
      timeAgo: '4h ago',
      category: 'stride',
      iconName: 'flower',
    },
    {
      id: '4',
      title: 'Kept consistent posture during 10:00 sprint',
      timeAgo: '6h ago',
      category: 'rest',
      iconName: 'shield',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Zero Form Philosophy Banner */}
      <div className="p-5 rounded-3xl glass-panel-glow border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <Heart className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-slate-100">
              Zero-Form Kinetic Telemetry
            </h3>
            <p className="text-xs text-slate-400">
              All metrics are passively inferred from your cursor physics. No manual ratings or guilt.
            </p>
          </div>
        </div>

        {/* Range Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-emerald-950/70 border border-emerald-500/20 text-xs">
          <button
            onClick={() => setActiveRange('today')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeRange === 'today'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveRange('7days')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeRange === '7days'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Last 7 Days
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Flow Time */}
        <div className="p-5 rounded-3xl glass-panel border border-emerald-500/15 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Deep Flow Time
            </span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-display text-slate-100 my-1">
            4h 18m
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+35m more than yesterday</span>
          </div>
        </div>

        {/* Garden Bloom */}
        <div className="p-5 rounded-3xl glass-panel border border-emerald-500/15 flex flex-col justify-between">
          <div className="flex items-center justify-between text-teal-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Garden Health
            </span>
            <Flower2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-extrabold font-display text-slate-100 my-1">
            {gardenHealth}%
          </div>
          <div className="text-[11px] text-teal-300">
            <span>{dewDrops} Dewdrops accumulated</span>
          </div>
        </div>

        {/* Stress Interventions */}
        <div className="p-5 rounded-3xl glass-panel border border-emerald-500/15 flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tension Calmed
            </span>
            <Wind className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold font-display text-slate-100 my-1">
            2 Resets
          </div>
          <div className="text-[11px] text-slate-400">
            <span>Recovered flow in &lt; 3 mins</span>
          </div>
        </div>

        {/* Micro-Wins */}
        <div className="p-5 rounded-3xl glass-panel border border-emerald-500/15 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Micro-Wins Noted
            </span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-display text-slate-100 my-1">
            4 Wins
          </div>
          <div className="text-[11px] text-amber-400">
            <span>Captured without self-nagging</span>
          </div>
        </div>
      </div>

      {/* Hourly / Weekly Visual Kinetic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Visual Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-panel border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold font-display text-slate-100">
                {activeRange === 'today' ? 'Today’s Kinetic Rhythm & Flow' : 'Weekly Flow Hours'}
              </h4>
              <p className="text-xs text-slate-400">
                {activeRange === 'today'
                  ? 'Green = Flow State, Orange = High Jitter Tension'
                  : 'Daily hours of seamless, effortless focus'}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-400" />
                <span className="text-slate-300">Flow</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-400" />
                <span className="text-slate-300">Tension</span>
              </div>
            </div>
          </div>

          {/* Bar chart representation */}
          {activeRange === 'today' ? (
            <div className="space-y-3 my-2">
              <div className="h-44 flex items-end gap-2 pt-6 pb-2 border-b border-emerald-950">
                {hourlyTimeline.map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="w-full flex items-end justify-center gap-0.5 h-32">
                      {/* Flow Bar */}
                      <div
                        className="w-1/2 bg-emerald-500/70 group-hover:bg-emerald-400 rounded-t-md transition-all"
                        style={{ height: `${item.flow}%` }}
                        title={`${item.time} Flow: ${item.flow}%`}
                      />
                      {/* Jitter Bar */}
                      <div
                        className="w-1/2 bg-rose-500/70 group-hover:bg-rose-400 rounded-t-md transition-all"
                        style={{ height: `${item.jitter}%` }}
                        title={`${item.time} Jitter: ${item.jitter}%`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 group-hover:text-slate-200">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-44 flex items-end gap-3 pt-6 pb-2 border-b border-emerald-950">
              {weeklyData.map((w, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full flex items-end justify-center h-32">
                    <div
                      className="w-3/4 bg-emerald-500/70 group-hover:bg-emerald-400 rounded-t-md transition-all relative"
                      style={{ height: `${(w.flowHours / 6) * 100}%` }}
                    >
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        {w.flowHours}h
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">{w.day}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <span>Key Peak: 10:00 - 11:30 (Deep uninterrupted flow)</span>
            <span className="text-emerald-400">Garden thrived at 96%</span>
          </div>
        </div>

        {/* Micro-Wins Stream */}
        <div className="p-6 rounded-3xl glass-panel border border-emerald-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold font-display text-slate-100 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>Captured Micro-Wins</span>
              </h4>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Auto-Noted
              </span>
            </div>

            <div className="space-y-3">
              {microWinsList.map(win => (
                <div
                  key={win.id}
                  className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/15 flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-200 leading-snug">{win.title}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">{win.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-emerald-950 text-center">
            <span className="text-xs text-slate-400">Sprout will keep celebrating you quietly</span>
          </div>
        </div>
      </div>
    </div>
  );
};
