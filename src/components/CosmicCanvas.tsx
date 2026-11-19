import React, { useEffect, useRef } from 'react';

interface CosmicCanvasProps {
  accentHex?: string;
  intensity?: 'hero' | 'quiz' | 'results';
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export const CosmicCanvas: React.FC<CosmicCanvasProps> = ({
  accentHex = '#2dd4bf',
  intensity = 'hero',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const targetRgbRef = useRef<[number, number, number]>(hexToRgb(accentHex));
  const currentRgbRef = useRef<[number, number, number]>(hexToRgb(accentHex));
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const intensityRef = useRef(intensity);

  useEffect(() => {
    targetRgbRef.current = hexToRgb(accentHex);
  }, [accentHex]);

  useEffect(() => {
    intensityRef.current = intensity;
  }, [intensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = (e.clientX / width - 0.5) * 2;
      mouseRef.current.ty = (e.clientY / height - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Generate Fibonacci sphere points (representing humanity around Earth)
    const spherePoints: Array<{
      x: number;
      y: number;
      z: number;
      size: number;
      highlight: boolean;
    }> = [];
    const numPoints = 320;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < numPoints; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / numPoints);
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta);
      spherePoints.push({
        x,
        y,
        z,
        size: i % 11 === 0 ? 2.2 : 1.25,
        highlight: i % 9 === 0,
      });
    }

    // Background deep-space stars
    const stars = Array.from({ length: 110 }, (_, i) => ({
      x: ((i * 733) % 1000) / 1000,
      y: ((i * 499 + 137) % 1000) / 1000,
      r: (i % 3) * 0.45 + 0.55,
      phase: i * 0.7,
      speed: 0.004 + (i % 5) * 0.002,
    }));

    let angle = 0;
    let tick = 0;

    const render = () => {
      tick += 1;
      if (!prefersReduced) {
        angle += 0.0022;
      }

      // Smoothly interpolate color
      const cur = currentRgbRef.current;
      const tgt = targetRgbRef.current;
      cur[0] += (tgt[0] - cur[0]) * 0.04;
      cur[1] += (tgt[1] - cur[1]) * 0.04;
      cur[2] += (tgt[2] - cur[2]) * 0.04;

      // Smooth mouse parallax
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const r = Math.round(cur[0]);
      const g = Math.round(cur[1]);
      const b = Math.round(cur[2]);

      const mode = intensityRef.current;
      const auraAlpha = mode === 'hero' ? 0.16 : mode === 'quiz' ? 0.13 : 0.11;

      // Ambient top-center atmospheric glow
      const cx =
        width * (mode === 'hero' ? 0.5 : 0.5) + mouseRef.current.x * 26;
      const cy =
        (mode === 'hero' ? height * 0.44 : height * 0.28) +
        mouseRef.current.y * 18;
      const glowRadius = Math.max(width, height) * 0.52;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${auraAlpha})`);
      grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${auraAlpha * 0.25})`);
      grad.addColorStop(1, 'rgba(5, 8, 17, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw drifting stars
      for (const s of stars) {
        const twinkle = 0.28 + 0.35 * Math.sin(tick * s.speed + s.phase);
        const sx = s.x * width + mouseRef.current.x * -10;
        const sy = s.y * height + mouseRef.current.y * -10;
        ctx.fillStyle = `rgba(226, 232, 240, ${twinkle})`;
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw 3D dotted planetary sphere
      const globeRadius =
        mode === 'hero'
          ? Math.min(width, height) * 0.34
          : Math.min(width, height) * 0.39;
      const globeCx = width * 0.5 + mouseRef.current.x * 16;
      const globeCy =
        (mode === 'hero' ? height * 0.52 : height * 0.54) +
        mouseRef.current.y * 14;
      const globeOpacity = mode === 'hero' ? 0.72 : mode === 'quiz' ? 0.34 : 0.26;

      // Subtle orbital ring
      ctx.save();
      ctx.translate(globeCx, globeCy);
      ctx.rotate(-0.24 + mouseRef.current.x * 0.04);
      ctx.scale(1, 0.32);
      ctx.beginPath();
      ctx.arc(0, 0, globeRadius * 1.24, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${globeOpacity * 0.24})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      const cosY = Math.cos(angle + mouseRef.current.x * 0.28);
      const sinY = Math.sin(angle + mouseRef.current.x * 0.28);
      const tiltX = 0.22 + mouseRef.current.y * 0.16;
      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);

      for (const p of spherePoints) {
        // Rotate around Y
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;
        // Tilt around X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        const depth = (z2 + 1.35) / 2.35; // 0..1
        if (depth < 0.12) continue;

        const px = globeCx + x1 * globeRadius;
        const py = globeCy + y2 * globeRadius;
        const dotAlpha = Math.pow(depth, 1.5) * globeOpacity;
        const dotSize = p.size * (0.65 + depth * 0.65);

        if (p.highlight && depth > 0.6) {
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${dotAlpha})`;
        } else {
          ctx.fillStyle = `rgba(203, 213, 225, ${dotAlpha * 0.68})`;
        }

        ctx.beginPath();
        ctx.arc(px, py, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
};
