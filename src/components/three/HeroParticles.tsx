"use client";

import { useRef, useEffect, useState } from "react";

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const scrollRef = useRef({ current: 0, smooth: 0 });
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

    const COLS = isMobile ? 40 : 90;
    const ROWS = isMobile ? 25 : 50;
    const TOTAL = COLS * ROWS;

    const baseX = new Float32Array(TOTAL);
    const baseY = new Float32Array(TOTAL);
    const curX = new Float32Array(TOTAL);
    const curY = new Float32Array(TOTAL);
    const sizes = new Float32Array(TOTAL);
    const isGold = new Uint8Array(TOTAL);
    const opacity = new Float32Array(TOTAL);
    const phase = new Float32Array(TOTAL);
    const depth = new Float32Array(TOTAL);

    function init() {
      if (!canvas) return;
      W = canvas.clientWidth * dpr;
      H = canvas.clientHeight * dpr;
      canvas.width = W;
      canvas.height = H;

      const spX = W / (COLS - 1);
      const spY = H / (ROWS - 1);

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const i = r * COLS + c;
          baseX[i] = c * spX + (Math.random() - 0.5) * spX * 0.35;
          baseY[i] = r * spY + (Math.random() - 0.5) * spY * 0.35;
          curX[i] = baseX[i];
          curY[i] = baseY[i];
          depth[i] = Math.random();
          sizes[i] = (0.3 + depth[i] * 1.2) * dpr;
          isGold[i] = Math.random() < 0.12 ? 1 : 0;
          opacity[i] = 0.06 + depth[i] * 0.45;
          phase[i] = Math.random() * Math.PI * 2;
        }
      }
    }

    init();
    window.addEventListener("resize", init);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / window.innerWidth;
      mouseRef.current.targetY = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMouse);

    const onScroll = () => { scrollRef.current.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    let time = 0;

    const render = () => {
      if (document.hidden) { animRef.current = requestAnimationFrame(render); return; }

      time += 0.004;

      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.015;
      m.y += (m.targetY - m.y) * 0.015;

      const sc = scrollRef.current;
      sc.smooth += (sc.current - sc.smooth) * 0.03;
      const scrollShift = sc.smooth * 0.12 * dpr;

      const mOffX = m.x - 0.5;
      const mOffY = m.y - 0.5;
      const mx = m.x * W;
      const my = m.y * H;
      const mouseR = isMobile ? 80 : 200 * dpr;
      const mouseR2 = mouseR * mouseR;

      ctx.clearRect(0, 0, W, H);

      // Gold sweep wave
      const goldCenter = (Math.sin(time * 0.15) * 0.5 + 0.5) * W;
      const goldW = W * 0.25;

      // Update positions
      for (let i = 0; i < TOTAL; i++) {
        const bx = baseX[i], by = baseY[i], d = depth[i], p = phase[i];
        const sp = 0.4 + d * 0.7;
        const amp = 3 + d * 12;

        const w1 = Math.sin(bx * 0.002 + time * 0.7 * sp + p) * amp;
        const w2 = Math.cos(by * 0.0022 + time * 0.5 * sp) * (amp * 0.6);
        const w3 = Math.sin((bx + by) * 0.001 + time * 0.3 * sp) * (amp * 0.35);
        const br = Math.sin(time * 0.14 + p + d * 2) * (2 + d * 3);

        const ps = d * 0.12 + 0.01;
        let nx = bx + w2 * 0.18 + w3 * 0.1 + mOffX * W * ps;
        let ny = by + w1 * 0.22 + br + w3 * 0.08 + mOffY * H * ps * 0.6 + scrollShift * (0.15 + d * 0.85);

        const dx = nx - mx, dy = ny - my;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < mouseR2 && dist2 > 1) {
          const dist = Math.sqrt(dist2);
          const f = 1 - dist / mouseR;
          const s = f * f * (3 - 2 * f);
          const str = s * (12 + d * 25);
          const ang = Math.atan2(dy, dx) + s * 0.3;
          nx += Math.cos(ang) * str;
          ny += Math.sin(ang) * str;
        }

        curX[i] = nx;
        curY[i] = ny;
      }

      // Batch draw threads
      const hMaxD = (W / (COLS - 1)) * 1.5;
      const vMaxD = (H / (ROWS - 1)) * 1.5;

      // Horizontal - batch by color
      ctx.lineWidth = 0.3 * dpr;
      let goldPath = "";
      let whitePath = "";

      // Use Path2D for batching
      const goldLines = new Path2D();
      const whiteLines = new Path2D();

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS - 1; c++) {
          const i = r * COLS + c, j = i + 1;
          if (Math.abs(depth[i] - depth[j]) > 0.35) continue;
          const ddx = curX[j] - curX[i], ddy = curY[j] - curY[i];
          const dd = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dd >= hMaxD) continue;

          const g = isGold[i] || isGold[j];
          if (g) {
            goldLines.moveTo(curX[i], curY[i]);
            goldLines.lineTo(curX[j], curY[j]);
          } else {
            whiteLines.moveTo(curX[i], curY[i]);
            whiteLines.lineTo(curX[j], curY[j]);
          }
        }
      }

      // Vertical
      for (let r = 0; r < ROWS - 1; r++) {
        for (let c = 0; c < COLS; c++) {
          const i = r * COLS + c, j = i + COLS;
          if (Math.abs(depth[i] - depth[j]) > 0.35) continue;
          const ddx = curX[j] - curX[i], ddy = curY[j] - curY[i];
          const dd = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dd >= vMaxD) continue;

          const g = isGold[i] || isGold[j];
          if (g) {
            goldLines.moveTo(curX[i], curY[i]);
            goldLines.lineTo(curX[j], curY[j]);
          } else {
            whiteLines.moveTo(curX[i], curY[i]);
            whiteLines.lineTo(curX[j], curY[j]);
          }
        }
      }

      // Draw batched lines
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = "rgba(201, 169, 110, 1)";
      ctx.stroke(goldLines);
      ctx.globalAlpha = 0.03;
      ctx.strokeStyle = "rgba(255, 255, 255, 1)";
      ctx.stroke(whiteLines);
      ctx.globalAlpha = 1;

      // Draw particles
      for (let i = 0; i < TOTAL; i++) {
        const x = curX[i], y = curY[i], d = depth[i];
        let a = opacity[i];

        // Twinkle
        a *= 0.7 + 0.3 * Math.sin(time * (1 + d * 1.5) + phase[i] * 5);

        // Gold wave boost
        const wDist = Math.abs(x - goldCenter);
        const inWave = wDist < goldW;
        const waveFactor = inWave ? 1 - wDist / goldW : 0;

        // Mouse proximity
        const mdx = x - mx, mdy = y - my;
        const mDist2 = mdx * mdx + mdy * mdy;
        const mouseGlow = mDist2 < mouseR2 ? (1 - Math.sqrt(mDist2) / mouseR) * 0.3 : 0;

        // Front layer glow
        if (d > 0.8) {
          const gs = sizes[i] * 5;
          const grad = ctx.createRadialGradient(x, y, 0, x, y, gs);
          const glowA = (a * 0.12 + mouseGlow * 0.08) * (1 + waveFactor * 0.4);
          if (isGold[i] || waveFactor > 0.5) {
            grad.addColorStop(0, `rgba(201, 169, 110, ${glowA})`);
          } else {
            grad.addColorStop(0, `rgba(255, 255, 255, ${glowA * 0.7})`);
          }
          grad.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, gs, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = Math.min(1, a + mouseGlow + waveFactor * 0.15);
        ctx.fillStyle = (isGold[i] || waveFactor > 0.6) ? "#c9a96e" : "#ffffff";
        ctx.beginPath();
        ctx.arc(x, y, sizes[i] * (1 + mouseGlow * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Cursor glow
      if (!isMobile) {
        const cg = ctx.createRadialGradient(mx, my, 0, mx, my, mouseR * 0.6);
        cg.addColorStop(0, "rgba(201, 169, 110, 0.035)");
        cg.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(mx, my, mouseR * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Light vignette
      const vig = ctx.createRadialGradient(W * 0.5, H * 0.5, W * 0.15, W * 0.5, H * 0.5, W * 0.7);
      vig.addColorStop(0, "rgba(10, 10, 10, 0)");
      vig.addColorStop(1, "rgba(10, 10, 10, 0.3)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, [mounted]);

  if (!mounted) return <div className="absolute inset-0 bg-background" />;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "#0a0a0a" }}
    />
  );
}
