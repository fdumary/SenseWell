export type MoodState = 'happy' | 'hyped' | 'calm' | 'tired' | 'meh';

export type UserPresenceStatus = 'working' | 'break' | 'away';

export interface KineticMetrics {
  velocity: number; // px / ms
  acceleration: number;
  jitterIndex: number; // 0 to 100
  pauseFrequency: number;
  smoothnessScore: number; // 0 to 100
  tensionScore: number; // 0 to 100
  inferredMood: MoodState;
  sampleCount: number;
  isSimulated: boolean;
}

export interface GardenFlora {
  id: string;
  type: 'lotus' | 'sun-fern' | 'glow-spore' | 'willow-reed' | 'crystal-orchid';
  x: number;
  y: number;
  size: number;
  bloomProgress: number; // 0 to 1
  hue: number;
  petals: number;
}

export interface CompanionEmotion {
  state: MoodState;
  expression: 'happy' | 'hyped' | 'calm' | 'tired' | 'meh';
  quote: string;
  statusText: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'companion';
  text: string;
  timestamp: string;
  tag?: 'kinetic-insight' | 'micro-win' | 'grounding' | 'casual';
  suggestedAction?: {
    label: string;
    actionType: 'breathe' | 'stretch' | 'hydrate' | 'micro-win';
  };
}

export interface BondStats {
  streakDays: number;
  sessionsCompleted: number;
  waterDrops: number;
  gardenStage: number;
  focusMinutesToday: number;
  dailyGoalHours: number;
  breaksToday: number;
}

export interface DailyStatPoint {
  time: string;
  flow: number;
  jitter: number;
  bloom: number;
  interventions: number;
}

export interface MicroWin {
  id: string;
  title: string;
  timeAgo: string;
  category: 'focus' | 'rest' | 'stride' | 'grounding';
  iconName: string;
}
