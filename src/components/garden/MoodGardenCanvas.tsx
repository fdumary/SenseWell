import React, { useRef, useEffect, useState } from 'react';
import { useGarden } from '../../context/GardenContext';
import { useKinetic } from '../../context/KineticContext';
import { CompanionAvatar } from './CompanionAvatar';
import { Sparkles, Sun, CloudRain, Moon, Wind, HeartHandshake } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

export const MoodGardenCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { flora, bloomFactor, weather, dewDrops, bloomFlower, fertilizeGarden } = useGarden();
  const { metrics, triggerMicroBreak } = useKinetic();

  const [mouseCoord, setMouseCoord] = useState<{ x: number; y: number }>({ x: 300, y: 200 });
  const [activeRipple, setActiveRipple] = useState<{ x: number; y: number; id: number } | null>(null);

  // Canvas particle engine for fireflies & spores
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = metrics.inferredMood === 'deep-flow' ? 45 : metrics.inferredMood === 'stressed' ? 12 : 28;
    const particles: Particle[] = [];
    const colors =
      metrics.inferredMood === 'stressed'
        ? ['#fb7185', '#94a3b8', '#64748b']
        : metrics.inferredMood === 'deep-flow'
        ? ['#34d399', '#6ee7b7', '#fde047', '#38bdf8']
        : ['#2dd4bf', '#a7f3d0', '#fef08a', '#c084fc'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.7 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let rainDrops: Array<{ x: number; y: number; len: number; speed: number }> = [];
    if (weather === 'storm-drizzle') {
      for (let i = 0; i < 40; i++) {
        rainDrops.push({
          x: Math.random() * width,
          y: Math.random() * height,
          len: Math.random() * 12 + 6,
          speed: Math.random() * 4 + 6,
        });
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Rain if stormy/stressed
      if (weather === 'storm-drizzle') {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        rainDrops.forEach(r => {
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x + 1, r.y + r.len);
          r.y += r.speed;
          if (r.y > height) {
            r.y = -10;
            r.x = Math.random() * width;
          }
        });
        ctx.stroke();
      }

      // Bioluminescent Firefly Particles
      particles.forEach(p => {
        // Gentle gravity towards mouse
        const dx = mouseCoord.x - p.x;
        const dy = mouseCoord.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180 && dist > 10) {
          p.vx += (dx / dist) * 0.015;
          p.vy += (dy / dist) * 0.015;
        }

        // Apply speed limits
        p.vx = Math.max(-1.2, Math.min(1.2, p.vx));
        p.vy = Math.max(-1.2, Math.min(1.2, p.vy));

        p.x += p.vx;
        p.y += p.vy;

        // Bounce at boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = p.radius * 4;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [weather, metrics.inferredMood, mouseCoord]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouseCoord({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleGardenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setActiveRipple({ x, y, id: Date.now() });
  };

  const getWeatherIcon = () => {
    switch (weather) {
      case 'dappled-sun':
        return <Sun className="w-4 h-4 text-amber-300" />;
      case 'storm-drizzle':
        return <CloudRain className="w-4 h-4 text-rose-300" />;
      case 'gentle-mist':
        return <Wind className="w-4 h-4 text-indigo-300" />;
      case 'starry-zen':
      default:
        return <Moon className="w-4 h-4 text-teal-300" />;
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleGardenClick}
      className="relative w-full h-[460px] rounded-3xl overflow-hidden glass-panel border border-emerald-500/20 shadow-2xl select-none group"
      style={{
        background:
          weather === 'storm-drizzle'
            ? 'radial-gradient(ellipse at 50% 30%, #1e1b2e 0%, #0d1117 75%)'
            : weather === 'dappled-sun'
            ? 'radial-gradient(ellipse at 50% 20%, #143526 0%, #08150f 75%)'
            : weather === 'gentle-mist'
            ? 'radial-gradient(ellipse at 50% 30%, #17252a 0%, #0a1114 75%)'
            : 'radial-gradient(ellipse at 50% 25%, #0d281f 0%, #060e0a 75%)',
      }}
    >
      {/* Background Canvas for Particles & Rain */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Ripple Animation on click */}
      {activeRipple && (
        <div
          key={activeRipple.id}
          className="absolute rounded-full border border-emerald-400/40 pointer-events-none animate-ping"
          style={{
            left: activeRipple.x - 25,
            top: activeRipple.y - 25,
            width: 50,
            height: 50,
          }}
        />
      )}

      {/* Top Garden Ambient HUD */}
      <div className="absolute top-4 left-5 right-5 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-xs text-emerald-200 backdrop-blur-md">
            {getWeatherIcon()}
            <span className="capitalize font-medium">{weather.replace('-', ' ')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Bloom: {Math.round(bloomFactor * 100)}%</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/20 text-xs text-emerald-300/80">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{dewDrops} Dewdrops</span>
          </div>
        </div>

        {/* Quick Garden Actions */}
        <div className="flex items-center gap-2">
          {metrics.inferredMood === 'stressed' && (
            <button
              onClick={e => {
                e.stopPropagation();
                triggerMicroBreak();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold hover:bg-rose-500/30 transition-all shadow-glow-rose animate-pulse"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Calm Sprout (Take Break)</span>
            </button>
          )}

          <button
            onClick={e => {
              e.stopPropagation();
              fertilizeGarden();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-xs text-emerald-200 hover:bg-emerald-800/80 transition-all"
            title="Nourish all plants with dewdrops"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden sm:inline">Nourish Garden</span>
          </button>
        </div>
      </div>

      {/* Procedural Living Flora Layer */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        {/* Hill / Ground Grass Curves */}
        <path
          d="M -20 460 Q 200 380 450 420 T 900 390 L 900 500 L -20 500 Z"
          fill="rgba(6, 40, 28, 0.75)"
        />
        <path
          d="M -20 470 Q 300 410 600 440 T 1000 410 L 1000 500 L -20 500 Z"
          fill="rgba(4, 25, 17, 0.9)"
        />

        {/* Mossy Center Pedestal for Companion */}
        <ellipse cx="50%" cy="84%" rx="90" ry="24" fill="#042217" stroke="rgba(52, 211, 153, 0.3)" strokeWidth="2" />
        <ellipse cx="50%" cy="83%" rx="70" ry="16" fill="#063a28" />

        {/* Individual Living Flowers */}
        {flora.map(flower => {
          const isBloom = flower.bloomProgress > 0.5;
          const scale = 0.6 + flower.bloomProgress * 0.45;
          const stemCurve = isBloom ? 0 : 15; // Wilt bends stem
          const petalOpacity = Math.max(0.35, flower.bloomProgress);

          return (
            <g
              key={flower.id}
              className="pointer-events-auto cursor-pointer transition-transform duration-700 hover:scale-110"
              onClick={e => {
                e.stopPropagation();
                bloomFlower(flower.id);
              }}
            >
              {/* Stem */}
              <path
                d={`M ${flower.x}% ${flower.y}% Q ${flower.x + stemCurve / 5}% ${flower.y + 12}% ${flower.x}% ${flower.y + 24}%`}
                fill="none"
                stroke={isBloom ? '#10b981' : '#475569'}
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Leaves on stem */}
              <ellipse
                cx={`${flower.x - 1.5}%`}
                cy={`${flower.y + 10}%`}
                rx="6"
                ry="3"
                fill={isBloom ? '#34d399' : '#64748b'}
                transform={`rotate(${isBloom ? -25 : 15} ${flower.x * 8} ${flower.y * 4})`}
              />

              {/* Flower Blossom Head */}
              <g transform={`translate(${flower.x * 8}, ${flower.y * 4}) scale(${scale})`}>
                {/* Petals */}
                {Array.from({ length: flower.petals }).map((_, i) => {
                  const angle = (i * 360) / flower.petals;
                  const petalColor = isBloom
                    ? `hsl(${flower.hue}, 80%, ${60 + (i % 2) * 10}%)`
                    : '#64748b';
                  return (
                    <ellipse
                      key={i}
                      cx="0"
                      cy={isBloom ? -16 : -8}
                      rx={isBloom ? 7 : 4}
                      ry={isBloom ? 14 : 9}
                      fill={petalColor}
                      fillOpacity={petalOpacity}
                      transform={`rotate(${angle})`}
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="0.5"
                    />
                  );
                })}
                {/* Flower Core Glowing Center */}
                <circle cx="0" cy="0" r={isBloom ? 6 : 4} fill={isBloom ? '#fde047' : '#94a3b8'} />
                {isBloom && (
                  <circle cx="0" cy="0" r="10" fill="#fde047" fillOpacity="0.3" className="animate-ping" />
                )}
              </g>
            </g>
          );
        })}
      </svg>

      {/* Companion Character Positioned in Center */}
      <div className="absolute left-1/2 bottom-8 -translate-x-1/2 z-20">
        <CompanionAvatar
          mood={metrics.inferredMood}
          size="lg"
          showBubble={true}
          onInteract={() => {
            fertilizeGarden();
          }}
        />
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-3 right-5 z-20 text-[11px] text-emerald-400/60 flex items-center gap-1.5 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Garden blooms with your smooth kinetic flow</span>
      </div>
    </div>
  );
};
