import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { KineticMetrics, MoodState, UserPresenceStatus } from '../types';

interface KineticContextType {
  metrics: KineticMetrics;
  recentVelocities: number[];
  recentJitters: number[];
  presenceStatus: UserPresenceStatus;
  setPresenceStatus: (status: UserPresenceStatus) => void;
  simulateMood: (mood: MoodState | 'live') => void;
  resetTelemetry: () => void;
  isSimulating: boolean;
  activeSimulationState: MoodState | null;
  triggerMicroBreak: () => void;
  isBreathingModalOpen: boolean;
  setIsBreathingModalOpen: (open: boolean) => void;
}

const defaultMetrics: KineticMetrics = {
  velocity: 0.45,
  acceleration: 0.05,
  jitterIndex: 12,
  pauseFrequency: 4.2,
  smoothnessScore: 88,
  tensionScore: 16,
  inferredMood: 'serene',
  sampleCount: 0,
  isSimulated: false,
};

const KineticContext = createContext<KineticContextType | undefined>(undefined);

export const KineticProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [metrics, setMetrics] = useState<KineticMetrics>(defaultMetrics);
  const [presenceStatus, setPresenceStatus] = useState<UserPresenceStatus>('working');
  const [recentVelocities, setRecentVelocities] = useState<number[]>([0.2, 0.4, 0.5, 0.3, 0.45, 0.6, 0.4]);
  const [recentJitters, setRecentJitters] = useState<number[]>([10, 15, 12, 8, 14, 11, 13]);
  const [activeSimulationState, setActiveSimulationState] = useState<MoodState | null>(null);
  const [isBreathingModalOpen, setIsBreathingModalOpen] = useState<boolean>(false);

  // Mouse trajectory tracking refs
  const lastPos = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastAngle = useRef<number | null>(null);
  const samplesRef = useRef<Array<{ v: number; jitter: number; t: number }>>([]);
  const lastMoveTimeRef = useRef<number>(Date.now());

  const calculateInferredMood = (jitter: number, velocity: number, tension: number): MoodState => {
    if (tension > 65 || jitter > 55) return 'stressed';
    if (tension < 30 && velocity > 0.3 && jitter < 28) return 'deep-flow';
    if (tension < 25 && jitter < 20) return 'serene';
    if (velocity < 0.15 && tension > 40) return 'fatigued';
    return 'wandering';
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (activeSimulationState !== null) return; // In simulation mode, skip live override

    const now = performance.now();
    const currentPos = { x: e.clientX, y: e.clientY, time: now };
    lastMoveTimeRef.current = Date.now();

    if (!lastPos.current) {
      lastPos.current = currentPos;
      return;
    }

    const dt = Math.max(now - lastPos.current.time, 1);
    const dx = currentPos.x - lastPos.current.x;
    const dy = currentPos.y - lastPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Velocity in px per millisecond
    const instantVelocity = dist / dt;

    // Angle change (jitter detection)
    let currentJitter = 0;
    const currentAngle = Math.atan2(dy, dx);
    if (lastAngle.current !== null && dist > 3) {
      let angleDiff = Math.abs(currentAngle - lastAngle.current);
      if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
      // Frequent sharp turns (> 70 degrees) over short distance = high jitter
      currentJitter = (angleDiff / Math.PI) * 100;
    }

    lastPos.current = currentPos;
    lastAngle.current = currentAngle;

    samplesRef.current.push({ v: instantVelocity, jitter: currentJitter, t: now });
    if (samplesRef.current.length > 30) {
      samplesRef.current.shift();
    }

    // Process every few samples
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

  // Simulation mode switcher
  const simulateMood = (mood: MoodState | 'live') => {
    if (mood === 'live') {
      setActiveSimulationState(null);
      setMetrics(prev => ({ ...prev, isSimulated: false }));
      return;
    }

    setActiveSimulationState(mood);
    let simulated: KineticMetrics;

    switch (mood) {
      case 'stressed':
        simulated = {
          velocity: 1.85,
          acceleration: 0.32,
          jitterIndex: 78,
          pauseFrequency: 1.2,
          smoothnessScore: 24,
          tensionScore: 82,
          inferredMood: 'stressed',
          sampleCount: 150,
          isSimulated: true,
        };
        setRecentJitters([45, 60, 85, 72, 90, 80, 88, 76]);
        setRecentVelocities([1.2, 1.9, 2.4, 1.7, 2.1, 1.8]);
        break;
      case 'deep-flow':
        simulated = {
          velocity: 0.85,
          acceleration: 0.03,
          jitterIndex: 14,
          pauseFrequency: 5.8,
          smoothnessScore: 92,
          tensionScore: 12,
          inferredMood: 'deep-flow',
          sampleCount: 220,
          isSimulated: true,
        };
        setRecentJitters([12, 15, 11, 14, 10, 16, 12]);
        setRecentVelocities([0.8, 0.9, 0.85, 0.82, 0.88]);
        break;
      case 'fatigued':
        simulated = {
          velocity: 0.18,
          acceleration: 0.01,
          jitterIndex: 38,
          pauseFrequency: 11.4,
          smoothnessScore: 54,
          tensionScore: 48,
          inferredMood: 'fatigued',
          sampleCount: 95,
          isSimulated: true,
        };
        setRecentJitters([30, 42, 35, 40, 48, 32]);
        setRecentVelocities([0.2, 0.15, 0.12, 0.22, 0.14]);
        break;
      case 'wandering':
        simulated = {
          velocity: 0.52,
          acceleration: 0.08,
          jitterIndex: 44,
          pauseFrequency: 4.0,
          smoothnessScore: 61,
          tensionScore: 41,
          inferredMood: 'wandering',
          sampleCount: 130,
          isSimulated: true,
        };
        setRecentJitters([38, 45, 41, 50, 42, 46]);
        setRecentVelocities([0.4, 0.6, 0.5, 0.7, 0.45]);
        break;
      case 'serene':
      default:
        simulated = {
          velocity: 0.38,
          acceleration: 0.02,
          jitterIndex: 8,
          pauseFrequency: 4.8,
          smoothnessScore: 95,
          tensionScore: 8,
          inferredMood: 'serene',
          sampleCount: 180,
          isSimulated: true,
        };
        setRecentJitters([8, 6, 9, 7, 10, 8, 6]);
        setRecentVelocities([0.35, 0.4, 0.38, 0.36, 0.42]);
        break;
    }

    setMetrics(simulated);
  };

  const resetTelemetry = () => {
    setActiveSimulationState(null);
    setMetrics(defaultMetrics);
  };

  const triggerMicroBreak = () => {
    setIsBreathingModalOpen(true);
  };

  return (
    <KineticContext.Provider
      value={{
        metrics,
        recentVelocities,
        recentJitters,
        presenceStatus,
        setPresenceStatus,
        simulateMood,
        resetTelemetry,
        isSimulating: activeSimulationState !== null,
        activeSimulationState,
        triggerMicroBreak,
        isBreathingModalOpen,
        setIsBreathingModalOpen,
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
