import { useEffect, useRef } from 'react';

type ThemeMode = 'dark' | 'light';

interface DashParticle {
  bx: number;
  by: number;
  vx: number;
  vy: number;
  cos: number;
  sin: number;
  halfLen: number;
  colorIdx: number;
  restT: number;
  ox: number;
  oy: number;
  alpha: number;
}

const DASH_COLORS = ['#7FB3DE', '#3C6E96', '#A9D1F0', '#C84B31'] as const;
const PARTICLE_COUNT = 180;
const DASH_WIDTH = 1.5;
const EDGE_MARGIN = 12;
const MOUSE_RADIUS = 140;
const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;
const MAX_PUSH_PX = 18;

function restAlphaFor(restT: number, theme: ThemeMode): number {
  return theme === 'light' ? 0.45 + restT * 0.35 : 0.25 + restT * 0.15;
}

function createParticles(width: number, height: number, theme: ThemeMode): DashParticle[] {
  const safeW = Math.max(width, 320);
  const safeH = Math.max(height, 320);
  const list: DashParticle[] = new Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.2 + Math.random() * 0.3;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const restT = Math.random();

    list[i] = {
      bx: Math.random() * safeW,
      by: Math.random() * safeH,
      vx: cos * speed,
      vy: sin * speed,
      cos,
      sin,
      halfLen: (3 + Math.random() * 3) / 2,
      colorIdx: i % 12 === 0 ? 3 : i % 3,
      restT,
      ox: 0,
      oy: 0,
      alpha: restAlphaFor(restT, theme),
    };
  }

  return list;
}

/**
 * Fixed full-screen Antigravity-style dash field positioned behind UI content.
 * Reacts gently within 140px of the cursor, pauses when hidden, and stays static
 * under prefers-reduced-motion.
 */
export function CursorDotField({ theme }: { theme: ThemeMode }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef<ThemeMode>(theme);
  const drawOnceRef = useRef<(() => void) | null>(null);

  themeRef.current = theme;

  useEffect(() => {
    drawOnceRef.current?.();
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointerMq = window.matchMedia('(hover: none) and (pointer: coarse)');
    const finePointerMq = window.matchMedia('(pointer: fine)');

    const isTouchDevice = () =>
      coarsePointerMq.matches || (navigator.maxTouchPoints > 0 && !finePointerMq.matches);

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const particles = createParticles(width, height, themeRef.current);

    let rafId = 0;
    let lastTime = performance.now();
    let frameCostAccum = 0;
    let frameCostSamples = 0;

    let mouseActive = false;
    let mouseX = -9999;
    let mouseY = -9999;

    const applyCanvasSize = () => {
      const nextW = window.innerWidth;
      const nextH = window.innerHeight;
      const prevW = Math.max(width, 1);
      const prevH = Math.max(height, 1);

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = nextW;
      height = nextH;

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (prevW !== nextW || prevH !== nextH) {
        const scaleX = nextW / prevW;
        const scaleY = nextH / prevH;
        for (let i = 0; i < particles.length; i++) {
          particles[i].bx *= scaleX;
          particles[i].by *= scaleY;
        }
      }
    };

    const renderFrame = (dtSec: number, animateMotion: boolean) => {
      const startMs = performance.now();
      const activeTheme = themeRef.current;
      const allowMouse = animateMotion && !isTouchDevice() && mouseActive;

      const frameScale = dtSec * 60;
      const pushLerp = 1 - Math.exp(-dtSec / 0.09);
      const returnLerp = 1 - Math.exp(-dtSec / 0.18);
      const alphaLerp = 1 - Math.exp(-dtSec / 0.15);

      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = DASH_WIDTH;
      ctx.lineCap = 'round';

      const wrapW = width + EDGE_MARGIN * 2;
      const wrapH = height + EDGE_MARGIN * 2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const baseAlpha = restAlphaFor(p.restT, activeTheme);

        if (animateMotion) {
          p.bx += p.vx * frameScale;
          p.by += p.vy * frameScale;

          if (p.bx < -EDGE_MARGIN) p.bx += wrapW;
          else if (p.bx > width + EDGE_MARGIN) p.bx -= wrapW;

          if (p.by < -EDGE_MARGIN) p.by += wrapH;
          else if (p.by > height + EDGE_MARGIN) p.by -= wrapH;

          let tx = 0;
          let ty = 0;
          let targetAlpha = baseAlpha;

          if (allowMouse) {
            const dx = p.bx - mouseX;
            const dy = p.by - mouseY;
            const distSq = dx * dx + dy * dy;

            if (distSq < MOUSE_RADIUS_SQ) {
              const dist = Math.sqrt(distSq);
              const t = 1 - dist / MOUSE_RADIUS;
              const push = MAX_PUSH_PX * t;
              if (dist > 0.001) {
                tx = (dx / dist) * push;
                ty = (dy / dist) * push;
              } else {
                tx = p.cos * push;
                ty = p.sin * push;
              }
              targetAlpha = baseAlpha + (0.95 - baseAlpha) * t;
            }
          }

          const posFactor = tx !== 0 || ty !== 0 ? pushLerp : returnLerp;
          p.ox += (tx - p.ox) * posFactor;
          p.oy += (ty - p.oy) * posFactor;
          p.alpha += (targetAlpha - p.alpha) * alphaLerp;
        } else {
          p.ox = 0;
          p.oy = 0;
          p.alpha = baseAlpha;
        }

        const x = p.bx + p.ox;
        const y = p.by + p.oy;
        const hx = p.cos * p.halfLen;
        const hy = p.sin * p.halfLen;

        ctx.globalAlpha = p.alpha;
        ctx.strokeStyle = DASH_COLORS[p.colorIdx];
        ctx.beginPath();
        ctx.moveTo(x - hx, y - hy);
        ctx.lineTo(x + hx, y + hy);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      const elapsed = performance.now() - startMs;
      frameCostAccum += elapsed;
      frameCostSamples += 1;
      if (frameCostSamples >= 30 || !animateMotion) {
        canvas.dataset.avgFrameMs = (frameCostAccum / frameCostSamples).toFixed(3);
        frameCostAccum = 0;
        frameCostSamples = 0;
      }
    };

    const stopLoop = () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const tick = (now: number) => {
      rafId = 0;
      if (document.hidden || reducedMotionMq.matches) return;

      const dtSec = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      renderFrame(dtSec, true);
      rafId = window.requestAnimationFrame(tick);
    };

    const syncLoopState = () => {
      if (reducedMotionMq.matches) {
        stopLoop();
        mouseActive = false;
        renderFrame(0, false);
        return;
      }
      if (document.hidden) {
        stopLoop();
        return;
      }
      if (rafId === 0) {
        lastTime = performance.now();
        rafId = window.requestAnimationFrame(tick);
      }
    };

    drawOnceRef.current = () => {
      renderFrame(0, !reducedMotionMq.matches);
    };

    const handleResize = () => {
      applyCanvasSize();
      renderFrame(0, !reducedMotionMq.matches);
    };

    const handleVisibility = () => {
      syncLoopState();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (reducedMotionMq.matches || isTouchDevice()) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseActive = true;
    };

    const handleMouseLeave = () => {
      mouseActive = false;
    };

    const handleModeChange = () => {
      syncLoopState();
    };

    applyCanvasSize();
    syncLoopState();

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    reducedMotionMq.addEventListener('change', handleModeChange);
    coarsePointerMq.addEventListener('change', handleModeChange);
    finePointerMq.addEventListener('change', handleModeChange);

    return () => {
      stopLoop();
      drawOnceRef.current = null;
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      reducedMotionMq.removeEventListener('change', handleModeChange);
      coarsePointerMq.removeEventListener('change', handleModeChange);
      finePointerMq.removeEventListener('change', handleModeChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
