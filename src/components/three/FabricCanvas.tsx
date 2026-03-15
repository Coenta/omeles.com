"use client";

import { useRef, useEffect, useState } from "react";
import { getGlobalMouse } from "@/hooks/useGlobalMouse";

export default function FabricCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mouse = getGlobalMouse();
    const dpr = Math.min(window.devicePixelRatio, 2);
    const isMobile = window.innerWidth < 768;

    let W = 0, H = 0;
    const COLS = isMobile ? 40 : 80;
    const ROWS = isMobile ? 30 : 60;

    // Grid points
    const px = new Float32Array(COLS * ROWS);
    const py = new Float32Array(COLS * ROWS);

    function resize() {
      if (!canvas) return;
      W = canvas.clientWidth * dpr;
      H = canvas.clientHeight * dpr;
      canvas.width = W;
      canvas.height = H;
    }

    resize();
    window.addEventListener("resize", resize);

    let time = 0;

    const render = () => {
      if (document.hidden) { animRef.current = requestAnimationFrame(render); return; }

      time += 0.008;
      ctx.clearRect(0, 0, W, H);

      const mx = mouse.smoothX;
      const my = mouse.smoothY;
      const spX = W / (COLS - 1);
      const spY = H / (ROWS - 1);

      // Calculate grid positions with fabric wave deformation
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const i = r * COLS + c;
          const u = c / (COLS - 1); // 0-1
          const v = r / (ROWS - 1); // 0-1

          const baseX = c * spX;
          const baseY = r * spY;

          // Layered sine waves — simulates draping fabric
          const wave1 = Math.sin(u * 4 + time * 0.7 + v * 2) * (12 + v * 20);
          const wave2 = Math.cos(v * 3.5 + time * 0.5 + u * 1.5) * (8 + u * 15);
          const wave3 = Math.sin((u + v) * 5 + time * 0.9) * 6;
          const wave4 = Math.cos(u * 7 - time * 0.3) * Math.sin(v * 6 + time * 0.4) * 4;

          // Mouse influence — fabric pulls toward cursor
          const dx = mx - u;
          const dy = my - v;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pull = Math.max(0, 1 - dist / 0.4);
          const pullStrength = pull * pull * 35;

          px[i] = baseX + wave2 * 0.6 + wave4 + dx * pullStrength;
          py[i] = baseY + wave1 * 0.8 + wave3 + dy * pullStrength * 0.5;
        }
      }

      // Draw fabric surface — filled quads with lighting
      for (let r = 0; r < ROWS - 1; r++) {
        for (let c = 0; c < COLS - 1; c++) {
          const i = r * COLS + c;
          const tl = i;
          const tr = i + 1;
          const bl = i + COLS;
          const br = i + COLS + 1;

          // Surface normal approximation for lighting
          const dxH = px[tr] - px[tl];
          const dyH = py[tr] - py[tl];
          const dxV = px[bl] - px[tl];
          const dyV = py[bl] - py[tl];

          // Cross product z-component gives us a pseudo-normal
          const normalZ = dxH * dyV - dyH * dxV;
          const normalMag = Math.sqrt(dxH * dxH + dyH * dyH) * Math.sqrt(dxV * dxV + dyV * dyV);
          const facing = normalMag > 0 ? normalZ / normalMag : 1;

          // Lighting: combination of facing angle and position
          const u = c / (COLS - 1);
          const v = r / (ROWS - 1);
          const baseLum = 0.12 + facing * 0.08;

          // Gold shimmer based on wave peaks
          const shimmer = Math.sin(u * 4 + time * 0.7 + v * 2);
          const shimmerIntensity = Math.max(0, shimmer) * 0.15;

          // Mouse proximity glow
          const mdx = mx - u;
          const mdy = my - v;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          const glow = Math.max(0, 1 - mDist / 0.35) * 0.12;

          const luminance = baseLum + shimmerIntensity + glow;

          // Color: dark base with gold highlights
          const goldR = 184, goldG = 148, goldB = 95;
          const baseR = 20, baseG = 18, baseB = 16;

          const goldMix = shimmerIntensity * 2 + glow * 1.5;
          const r2 = Math.round(baseR + (goldR - baseR) * goldMix + luminance * 60);
          const g2 = Math.round(baseG + (goldG - baseG) * goldMix + luminance * 50);
          const b2 = Math.round(baseB + (goldB - baseB) * goldMix + luminance * 40);
          const a = 0.85 + facing * 0.15;

          ctx.fillStyle = `rgba(${Math.min(255, r2)},${Math.min(255, g2)},${Math.min(255, b2)},${a})`;
          ctx.beginPath();
          ctx.moveTo(px[tl], py[tl]);
          ctx.lineTo(px[tr], py[tr]);
          ctx.lineTo(px[br], py[br]);
          ctx.lineTo(px[bl], py[bl]);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Thread lines — horizontal (subtle fabric weave texture)
      ctx.lineWidth = 0.5 * dpr;
      for (let r = 0; r < ROWS; r += 2) {
        ctx.beginPath();
        ctx.strokeStyle = r % 4 === 0
          ? "rgba(184, 148, 95, 0.12)"
          : "rgba(255, 255, 255, 0.04)";
        for (let c = 0; c < COLS; c++) {
          const i = r * COLS + c;
          if (c === 0) ctx.moveTo(px[i], py[i]);
          else ctx.lineTo(px[i], py[i]);
        }
        ctx.stroke();
      }

      // Thread lines — vertical
      for (let c = 0; c < COLS; c += 2) {
        ctx.beginPath();
        ctx.strokeStyle = c % 4 === 0
          ? "rgba(184, 148, 95, 0.08)"
          : "rgba(255, 255, 255, 0.03)";
        for (let r = 0; r < ROWS; r++) {
          const i = r * COLS + c;
          if (r === 0) ctx.moveTo(px[i], py[i]);
          else ctx.lineTo(px[i], py[i]);
        }
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}
