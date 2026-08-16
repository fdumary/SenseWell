import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { KineticMetrics, MoodState, UserPresenceStatus, BondStats } from '../types';
import { getTimerStatus, doCheckIn, recordActivity, TimerBackendData } from '../api';

interface KineticContextType {
  metrics: KineticMetrics;
  recentVelocities: number[];
  recentJitters: number[];
  presenceStatus: UserPresenceStatus;
  setPresenceStatus: (status: UserPresenceStatus) => void;
  currentMood: MoodState;
  setMood: (mood: MoodState) => void;
  simulateMood: (mood: MoodState | 'live') => void;
  resetTelemetry: () => void;
  isSimulating: boolean;
  activeSimulationState: MoodState | null;
  triggerMicroBreak: () => void;
  isBreathingModalOpen: boolean;
  setIsBreathingModalOpen: (open: boolean) => void;
  isBreakReminderOpen: boolean;
  setIsBreakReminderOpen: (open: boolean) => void;
  triggerBreakReminder: () => void;
  // Focus Session Overlay State
  isFocusSessionActive: boolean;
  isSessionPaused: boolean;
  sessionRemainingSeconds: number;
  startFocusSession: () => void;
  pauseFocusSession: () => void;
  resumeFocusSession: () => void;
  endFocusSession: () => void;
  // Bond & Progression Stats
  bondStats: BondStats;
  addWaterDrop: () => void;
  // Backend Timer Data
  timerData: TimerBackendData | null;
}

const defaultMetrics: KineticMetrics = {
  velocity: 0.45,
  acceleration: 0.05,
  jitterIndex: 12,
  pauseFrequency: 4.2,
  smoothnessScore: 88,
  tensionScore: 16,
  inferredMood: 'happy',
  sampleCount: 0,
  isSimulated: false,
};

const KineticContext = createContext<KineticContextType | undefined>(undefined);

export const KineticProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [metrics, setMetrics] = useState<KineticMetrics>(defaultMetrics);
  const [currentMood, setCurrentMood] = useState<MoodState>('happy');
  const [presenceStatus, setPresenceStatus] = useState<UserPresenceStatus>('working');
  const [recentVelocities, setRecentVelocities] = useState<number[]>([0.2, 0.4, 0.5, 0.3, 0.45, 0.6, 0.4]);
  const [recentJitters, setRecentJitters] = useState<number[]>([10, 15, 12, 8, 14, 11, 13]);
  const [activeSimulationState, setActiveSimulationState] = useState<MoodState | null>(null);
  const [isBreathingModalOpen, setIsBreathingModalOpen] = useState<boolean>(false);
  const [isBreakReminderOpen, setIsBreakReminderOpen] = useState<boolean>(false);

  // Focus Session State
  const [isFocusSessionActive, setIsFocusSessionActive] = useState<boolean>(false);
  const [isSessionPaused, setIsSessionPaused] = useState<boolean>(false);
  const [sessionRemainingSeconds, setSessionRemainingSeconds] = useState<number>(25 * 60);

  // UI defaults are replaced by live Flask timer data as soon as it responds.
  const [bondStats, setBondStats] = useState<BondStats>({
    streakDays: 3,
    sessionsCompleted: 1,
    waterDrops: 3,
    gardenStage: 2,
    focusMinutesToday: 0,
    dailyGoalHours: 4,
    breaksToday: 0,
  });

  const [timerData, setTimerData] = useState<TimerBackendData | null>(null);

  // ===== 1. FETCH TIMER EVERY 5 SECONDS =====
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getTimerStatus();
        setTimerData(data);
        if (typeof data?.todayFocusMs === 'number') {
          const mins = Math.floor(data.todayFocusMs / 60000);
          setBondStats(b => ({ ...b, focusMinutesToday: mins, breaksToday: data.breaks?.length || 0 }));
        }
        if (data?.breakDue) {
          setIsBreakReminderOpen(true);
        }
      } catch (e) {
        // Timer offline fallback - silent
      }
    };

    recordActivity().catch(() => {});
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // ===== 2. ACTIVITY PING (Amber's requirement) =====
  useEffect(() => {
    let lastActive = Date.now();

    const updateActive = () => {
      lastActive = Date.now();
    };

    ['mousemove', 'keydown', 'click'].forEach(event =>
      window.addEventListener(event, updateActive)
    );

    const pingInterval = setInterval(() => {
      if (Date.now() - lastActive < 30000 && document.visibilityState === 'visible') {
        recordActivity().catch(() => {});
      }
    }, 10000);

    return () => {
      ['mousemove', 'keydown', 'click'].forEach(event =>
        window.removeEventListener(event, updateActive)
      );
      clearInterval(pingInterval);
    };
  }, []);

  // ===== 3. 30-MIN CHECK-IN =====
  useEffect(() => {
    const checkInInterval = setInterval(async () => {
      if (!timerData) return;
      try {
        await doCheckIn(timerData);
      } catch (e) {
        // Check-in failed - silent
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(checkInInterval);
  }, [timerData]);

  // Mouse trajectory tracking refs
  const lastPos = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastAngle = useRef<number | null>(null);
  const samplesRef = useRef<Array<{ v: number; jitter: number; t: number }>>([]);

  const calculateInferredMood = (jitter: number, velocity: number, tension: number): MoodState => {
    if (velocity > 0.8 && tension < 35) return 'hyped';
    if (tension > 55 || jitter > 50) return 'meh';
    if (velocity < 0.18 && tension > 35) return 'tired';
    if (tension < 20 && jitter < 15) return 'calm';
    return 'happy';
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (activeSimulationState !== null) return;

    const now = performance.now();
    const currentPos = { x: e.clientX, y: e.clientY, time: now };

    if (!lastPos.current) {
      lastPos.current = currentPos;
      return;
    }

    const dt = Math.max(now - lastPos.current.time, 1);
    const dx = currentPos.x - lastPos.current.x;
    const dy = currentPos.y - lastPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    const instantVelocity = dist / dt;

    let currentJitter = 0;
    const currentAngle = Math.atan2(dy, dx);
    if (lastAngle.current !== null && dist > 3) {
      let angleDiff = Math.abs(currentAngle - lastAngle.current);
      if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
      currentJitter = (angleDiff / Math.PI) * 100;
    }

    lastPos.current = currentPos;
    lastAngle.current = currentAngle;

    samplesRef.current.push({ v: instantVelocity, jitter: currentJitter, t: now });
    if (samplesRef.current.length > 30) {
      samplesRef.current.shift();
    }

    if (samplesRef.current.length >= 6) {
      const avgVel = samplesRef.current.reduce((acc, s) => acc + s.v, 0) / samplesRef.current.length;
      const avgJitter = samplesRef.current.reduce((acc, s) => acc + s.jitter, 0) / samplesRef.current.length;
      
      const tension = Math.min(100, Math.max(0, Math.round(avgJitter * 0.7 + avgVel * 20)));
      const smoothness = Math.min(100, Math.max(0, 100 - tension));
      const mood = calculateInferredMood(avgJitter, avgVel, tension);

      setMetrics(prev => ({
        velocity: Number(avgVel.toFixed(2)),
        acceleration: 0.04,
        jitterIndex: Math.round(avgJitter),
        pauseFrequency: 3.5,
        smoothnessScore: smoothness,
        tensionScore: tension,
        inferredMood: mood,
        sampleCount: prev.sampleCount + 1,
        isSimulated: false,
      }));

      setRecentVelocities(prev => [...prev.slice(-15), Number(avgVel.toFixed(2))]);
      setRecentJitters(prev => [...prev.slice(-15), Math.round(avgJitter)]);
    }
  }, [activeSimulationState]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Focus Timer Countdown effect
  useEffect(() => {
    let timer: number | null = null;
    if (isFocusSessionActive && !isSessionPaused) {
      timer = window.setInterval(() => {
        setSessionRemainingSeconds(prev => {
          if (prev <= 1) {
            setIsFocusSessionActive(false);
            setBondStats(b => ({
              ...b,
              sessionsCompleted: b.sessionsCompleted + 1,
              focusMinutesToday: b.focusMinutesToday + 25,
              waterDrops: b.waterDrops + 1,
            }));
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isFocusSessionActive, isSessionPaused]);

  const setMood = (mood: MoodState) => {
    setCurrentMood(mood);
    setMetrics(prev => ({ ...prev, inferredMood: mood }));
  };

  const simulateMood = (mood: MoodState | 'live') => {
    if (mood === 'live') {
      setActiveSimulationState(null);
      setMetrics(prev => ({ ...prev, isSimulated: false }));
      return;
    }

    setActiveSimulationState(mood);
    setCurrentMood(mood);
    setMetrics(prev => ({ ...prev, inferredMood: mood, isSimulated: true }));
  };

  const resetTelemetry = () => {
    setActiveSimulationState(null);
    setMetrics(defaultMetrics);
    setCurrentMood('happy');
  };

  const triggerMicroBreak = () => {
    setIsBreathingModalOpen(true);
  };

  const triggerBreakReminder = () => {
    setIsBreakReminderOpen(true);
  };

  const startFocusSession = () => {
    setSessionRemainingSeconds(23 * 60 + 47); // Start around 23:47 like mockup
    setIsSessionPaused(false);
    setIsFocusSessionActive(true);
    setPresenceStatus('working');
  };

  const pauseFocusSession = () => {
    setIsSessionPaused(true);
  };

  const resumeFocusSession = () => {
    setIsSessionPaused(false);
  };

  const endFocusSession = () => {
    setIsFocusSessionActive(false);
    setIsSessionPaused(false);
  };

  const addWaterDrop = () => {
    setBondStats(prev => ({ ...prev, waterDrops: prev.waterDrops + 1 }));
  };

  return (
    <KineticContext.Provider
      value={{
        metrics,
        recentVelocities,
        recentJitters,
        presenceStatus,
        setPresenceStatus,
        currentMood,
        setMood,
        simulateMood,
        resetTelemetry,
        isSimulating: activeSimulationState !== null,
        activeSimulationState,
        triggerMicroBreak,
        isBreathingModalOpen,
        setIsBreathingModalOpen,
        isBreakReminderOpen,
        setIsBreakReminderOpen,
        triggerBreakReminder,
        isFocusSessionActive,
        isSessionPaused,
        sessionRemainingSeconds,
        startFocusSession,
        pauseFocusSession,
        resumeFocusSession,
        endFocusSession,
        bondStats,
        addWaterDrop,
        timerData,
      }}
    >
      {children}
    </KineticContext.Provider>
  );
};

export const useKinetic = () => {
  const context = useContext(KineticContext);
  if (!context) {
    throw new Error('useKinetic must be used within a KineticProvider');
  }
  return context;
};
