"use client";

import { useRef, useEffect, useState } from "react";
import { getGlobalMouse } from "@/hooks/useGlobalMouse";

export default function HeroMesh() {
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

    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio, 2);
    let W = 0, H = 0;

    const COLS = isMobile ? 30 : 60;
    const ROWS = isMobile ? 20 : 35;
    const TOTAL = COLS * ROWS;

    const baseX = new Float32Array(TOTAL);
    const baseY = new Float32Array(TOTAL);
    const curX = new Float32Array(TOTAL);
    const curY = new Float32Array(TOTAL);
    const depth = new Float32Array(TOTAL);
    const phase = new Float32Array(TOTAL);
    const isGold = new Uint8Array(TOTAL);

    // Normalized positions (0-1) — generated once, never randomized again
    const normX = new Float32Array(TOTAL);
    const normY = new Float32Array(TOTAL);
    let initialized = false;

    function seed() {
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const i = r * COLS + c;
          normX[i] = c / (COLS - 1) + (Math.random() - 0.5) * (1 / (COLS - 1)) * 0.25;
          normY[i] = r / (ROWS - 1) + (Math.random() - 0.5) * (1 / (ROWS - 1)) * 0.25;
          depth[i] = Math.random();
          phase[i] = Math.random() * Math.PI * 2;
          isGold[i] = Math.random() < 0.15 ? 1 : 0;
        }
      }
      initialized = true;
    }

    function resize() {
      if (!canvas) return;
      const newW = canvas.clientWidth * dpr;
      const newH = canvas.clientHeight * dpr;
      // Skip if dimensions barely changed (mobile address bar)
      if (initialized && Math.abs(newW - W) < 2 && Math.abs(newH - H) < 50) return;
      W = newW;
      H = newH;
      canvas.width = W;
      canvas.height = H;

      // Scale normalized positions to current canvas size
      for (let i = 0; i < TOTAL; i++) {
        baseX[i] = normX[i] * W;
        baseY[i] = normY[i] * H;
        curX[i] = baseX[i];
        curY[i] = baseY[i];
      }
    }

    seed();
    resize();
    window.addEventListener("resize", resize);

    const globalMouse = getGlobalMouse();

    let time = 0;

    const render = () => {
      if (document.hidden) { animRef.current = requestAnimationFrame(render); return; }

      time += 0.003;

      const offX = globalMouse.smoothX - 0.5;
      const offY = globalMouse.smoothY - 0.5;
      const mx = globalMouse.smoothX * W;
      const my = globalMouse.smoothY * H;
      const mR = isMobile ? 80 : 180 * dpr;
      const mR2 = mR * mR;

      ctx.clearRect(0, 0, W, H);

      // Update positions
      for (let i = 0; i < TOTAL; i++) {
        const bx = baseX[i], by = baseY[i], d = depth[i], p = phase[i];
        const sp = 0.3 + d * 0.5;
        const amp = 2 + d * 8;

        const w1 = Math.sin(bx * 0.002 + time * 0.6 * sp + p) * amp;
        const w2 = Math.cos(by * 0.0022 + time * 0.45 * sp) * (amp * 0.5);
        const br = Math.sin(time * 0.12 + p + d * 2) * (1.5 + d * 2);

        const ps = d * 0.08 + 0.005;
        let nx = bx + w2 * 0.15 + offX * W * ps;
        let ny = by + w1 * 0.18 + br + offY * H * ps * 0.5;

        // Mouse repel
        const dx = nx - mx, dy = ny - my;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < mR2 && dist2 > 1) {
          const dist = Math.sqrt(dist2);
          const f = 1 - dist / mR;
          const s = f * f * (3 - 2 * f);
          const str = s * (8 + d * 15);
          const ang = Math.atan2(dy, dx) + s * 0.2;
          nx += Math.cos(ang) * str;
          ny += Math.sin(ang) * str;
        }

        curX[i] = nx;
        curY[i] = ny;
      }

      // Draw threads
      const goldLines = new Path2D();
      const grayLines = new Path2D();

      // Horizontal
      const hMax = (W / (COLS - 1)) * 1.5;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS - 1; c++) {
          const i = r * COLS + c, j = i + 1;
          if (Math.abs(depth[i] - depth[j]) > 0.4) continue;
          const ddx = curX[j] - curX[i], ddy = curY[j] - curY[i];
          const dd = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dd >= hMax) continue;
          const target = (isGold[i] || isGold[j]) ? goldLines : grayLines;
          target.moveTo(curX[i], curY[i]);
          target.lineTo(curX[j], curY[j]);
        }
      }

      // Vertical
      const vMax = (H / (ROWS - 1)) * 1.5;
      for (let r = 0; r < ROWS - 1; r++) {
        for (let c = 0; c < COLS; c++) {
          const i = r * COLS + c, j = i + COLS;
          if (Math.abs(depth[i] - depth[j]) > 0.4) continue;
          const ddx = curX[j] - curX[i], ddy = curY[j] - curY[i];
          const dd = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dd >= vMax) continue;
          const target = (isGold[i] || isGold[j]) ? goldLines : grayLines;
          target.moveTo(curX[i], curY[i]);
          target.lineTo(curX[j], curY[j]);
        }
      }

      ctx.lineWidth = 0.8 * dpr;
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = "rgba(184, 148, 95, 1)";
      ctx.stroke(goldLines);
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = "rgba(0, 0, 0, 1)";
      ctx.stroke(grayLines);
      ctx.globalAlpha = 1;

      // Draw dots
      for (let i = 0; i < TOTAL; i++) {
        const x = curX[i], y = curY[i], d = depth[i];
        const size = (0.6 + d * 1.5) * dpr;
        const alpha = 0.1 + d * 0.3;

        // Mouse proximity boost
        const mdx = x - mx, mdy = y - my;
        const mDist2 = mdx * mdx + mdy * mdy;
        const boost = mDist2 < mR2 ? (1 - Math.sqrt(mDist2) / mR) * 0.3 : 0;

        ctx.globalAlpha = alpha + boost;
        ctx.fillStyle = isGold[i] ? "rgba(184, 148, 95, 1)" : "rgba(0, 0, 0, 1)";
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Subtle cursor glow
      const glowR = isMobile ? mR * 0.8 : mR * 0.5;
      const cg = ctx.createRadialGradient(mx, my, 0, mx, my, glowR);
      cg.addColorStop(0, "rgba(184, 148, 95, 0.06)");
      cg.addColorStop(1, "rgba(184, 148, 95, 0)");
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(mx, my, glowR, 0, Math.PI * 2);
      ctx.fill();

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
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
