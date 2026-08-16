import React, { createContext, useContext, useState, useEffect } from 'react';
import { GardenFlora } from '../types';
import { useKinetic } from './KineticContext';

export type WeatherTheme = 'dappled-sun' | 'twilight-aurora' | 'gentle-mist' | 'storm-drizzle' | 'starry-zen';

interface GardenContextType {
  flora: GardenFlora[];
  bloomFactor: number; // 0 to 1
  weather: WeatherTheme;
  setWeather: (w: WeatherTheme) => void;
  gardenHealth: number; // 0 to 100
  dewDrops: number;
  bloomFlower: (id: string) => void;
  fertilizeGarden: () => void;
}

const initialFlora: GardenFlora[] = [
  { id: '1', type: 'lotus', x: 22, y: 70, size: 48, bloomProgress: 0.9, hue: 155, petals: 8 },
  { id: '2', type: 'crystal-orchid', x: 40, y: 62, size: 54, bloomProgress: 0.85, hue: 180, petals: 6 },
  { id: '3', type: 'sun-fern', x: 60, y: 74, size: 46, bloomProgress: 0.95, hue: 45, petals: 10 },
  { id: '4', type: 'glow-spore', x: 78, y: 65, size: 52, bloomProgress: 0.88, hue: 280, petals: 7 },
  { id: '5', type: 'willow-reed', x: 90, y: 78, size: 42, bloomProgress: 0.92, hue: 140, petals: 5 },
  { id: '6', type: 'lotus', x: 10, y: 80, size: 40, bloomProgress: 0.8, hue: 340, petals: 8 },
];

const GardenContext = createContext<GardenContextType | undefined>(undefined);

export const GardenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { metrics } = useKinetic();
  const [flora, setFlora] = useState<GardenFlora[]>(initialFlora);
  const [bloomFactor, setBloomFactor] = useState<number>(0.85);
  const [weather, setWeather] = useState<WeatherTheme>('dappled-sun');
  const [dewDrops, setDewDrops] = useState<number>(142);

  // Dynamically update garden atmosphere and bloom state based on passive kinetic tension
  useEffect(() => {
    let targetBloom = 0.85;
    let targetWeather: WeatherTheme = 'dappled-sun';

    switch (metrics.inferredMood) {
      case 'stressed':
        targetBloom = 0.28;
        targetWeather = 'storm-drizzle';
        break;
      case 'fatigued':
        targetBloom = 0.45;
        targetWeather = 'gentle-mist';
        break;
      case 'wandering':
        targetBloom = 0.65;
        targetWeather = 'twilight-aurora';
        break;
      case 'deep-flow':
        targetBloom = 0.98;
        targetWeather = 'dappled-sun';
        break;
      case 'serene':
      default:
        targetBloom = 0.90;
        targetWeather = 'starry-zen';
        break;
    }

    setBloomFactor(targetBloom);
    setWeather(targetWeather);

    setFlora(prev =>
      prev.map(item => ({
        ...item,
        bloomProgress: Math.max(0.15, Math.min(1, targetBloom + (Math.random() * 0.1 - 0.05))),
      }))
    );
  }, [metrics.inferredMood]);

  const bloomFlower = (id: string) => {
    setFlora(prev =>
      prev.map(f => (f.id === id ? { ...f, bloomProgress: Math.min(1, f.bloomProgress + 0.2) } : f))
    );
    setDewDrops(d => d + 5);
  };

  const fertilizeGarden = () => {
    setBloomFactor(1.0);
    setFlora(prev => prev.map(f => ({ ...f, bloomProgress: 1.0 })));
    setDewDrops(d => d + 20);
  };

  const gardenHealth = Math.round(bloomFactor * 100);

  return (
    <GardenContext.Provider
      value={{
        flora,
        bloomFactor,
        weather,
        setWeather,
        gardenHealth,
        dewDrops,
        bloomFlower,
        fertilizeGarden,
      }}
    >
      {children}
    </GardenContext.Provider>
  );
};

export const useGarden = () => {
  const context = useContext(GardenContext);
  if (!context) {
    throw new Error('useGarden must be used within a GardenProvider');
  }
  return context;
};
