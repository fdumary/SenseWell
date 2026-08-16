export type MoodState = 'deep-flow' | 'serene' | 'wandering' | 'stressed' | 'fatigued';

export interface KineticMetrics {
  velocity: number; // px / ms
  acceleration: number;
  jitterIndex: number; // 0 (smooth glides) to 100 (frantic jitter/erratic micro-corrections)
  pauseFrequency: number; // seconds between active motion
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
  bloomProgress: number; // 0 (wilted/closed) to 1 (full vibrant bloom)
  hue: number;
  petals: number;
}

export interface CompanionEmotion {
  state: MoodState;
  expression: 'happy' | 'gentle' | 'curious' | 'concerned' | 'cozy' | 'sleeping';
  quote: string;
  actionPrompt?: string;
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

export interface DailyStatPoint {
  time: string; // e.g. "09:00", "11:00"
  flow: number; // 0 - 100
  jitter: number; // 0 - 100
  bloom: number; // 0 - 100
  interventions: number;
}

export interface MicroWin {
  id: string;
  title: string;
  timeAgo: string;
  category: 'focus' | 'rest' | 'stride' | 'grounding';
  iconName: string;
}
