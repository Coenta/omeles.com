"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COUNT = 800;

function generateTextTargets(): Float32Array {
  const targets = new Float32Array(COUNT * 2);

  const letterPixels: number[][][] = [
    [[0,4],[1,4],[2,4],[3,4], [0,3],[3,3], [0,2],[3,2], [0,1],[3,1], [0,0],[1,0],[2,0],[3,0]],
    [[0,0],[0,1],[0,2],[0,3],[0,4], [1,3], [2,2], [3,3], [4,0],[4,1],[4,2],[4,3],[4,4]],
    [[0,0],[0,1],[0,2],[0,3],[0,4], [1,4],[2,4],[3,4], [1,2],[2,2], [1,0],[2,0],[3,0]],
    [[0,0],[0,1],[0,2],[0,3],[0,4], [1,0],[2,0],[3,0]],
    [[0,0],[0,1],[0,2],[0,3],[0,4], [1,4],[2,4],[3,4], [1,2],[2,2], [1,0],[2,0],[3,0]],
    [[1,4],[2,4],[3,4], [0,3], [0,2],[1,2],[2,2],[3,2], [3,1], [0,0],[1,0],[2,0]],
  ];

  const allPts: [number, number][] = [];
  let offX = 0;
  for (const letter of letterPixels) {
    const maxX = Math.max(...letter.map(p => p[0]));
    for (const [x, y] of letter) {
      allPts.push([x + offX, y]);
    }
    offX += maxX + 2;
  }

  const totalW = offX - 2;
  const scale = 0.07;

  for (let i = 0; i < COUNT; i++) {
    if (i < allPts.length * 8) {
      const pt = allPts[i % allPts.length];
      const jitter = 0.018;
      targets[i * 2] = (pt[0] - totalW / 2) * scale + (Math.random() - 0.5) * jitter;
      targets[i * 2 + 1] = (pt[1] - 2) * scale + (Math.random() - 0.5) * jitter;
    } else {
      targets[i * 2] = (Math.random() - 0.5) * totalW * scale * 1.3;
      targets[i * 2 + 1] = (Math.random() - 0.5) * 5 * scale * 1.5;
    }
  }

  return targets;
}

export default function IntroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const visited = sessionStorage.getItem("omeles-intro-done");
    if (!visited) {
      setShow(true);
      document.body.style.overflow = "hidden";
    }
  }, []);

  const dismiss = useCallback(() => {
    sessionStorage.setItem("omeles-intro-done", "true");
    setFading(true);
    setTimeout(() => {
      document.body.style.overflow = "";
      setShow(false);
      setFading(false);
    }, 1200);
  }, []);

  useEffect(() => {
    if (!show || !mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) { dismiss(); return; }

    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    const W = canvas.width;
    const H = canvas.height;

    const textTargets = generateTextTargets();

    const posX = new Float32Array(COUNT);
    const posY = new Float32Array(COUNT);
    const startX = new Float32Array(COUNT);
    const startY = new Float32Array(COUNT);
    const targetX = new Float32Array(COUNT);
    const targetY = new Float32Array(COUNT);
    const sizes = new Float32Array(COUNT);
    const isGoldArr = new Uint8Array(COUNT);
    const particlePhase = new Float32Array(COUNT);
    const delay = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.6 + Math.random() * 1.5;
      startX[i] = Math.cos(angle) * radius;
      startY[i] = Math.sin(angle) * radius;
      posX[i] = startX[i];
      posY[i] = startY[i];

      targetX[i] = textTargets[i * 2];
      targetY[i] = textTargets[i * 2 + 1];

      sizes[i] = (1.5 + Math.random() * 3.5) * dpr;
      isGoldArr[i] = Math.random() < 0.3 ? 1 : 0;
      particlePhase[i] = Math.random() * Math.PI * 2;

      const distFromCenter = Math.sqrt(targetX[i] * targetX[i] + targetY[i] * targetY[i]);
      delay[i] = distFromCenter * 2 + Math.random() * 0.5;
    }

    let maxDelay = 0;
    for (let i = 0; i < COUNT; i++) {
      if (delay[i] > maxDelay) maxDelay = delay[i];
    }
    for (let i = 0; i < COUNT; i++) {
      delay[i] = delay[i] / maxDelay;
    }

    const startTime = performance.now();

    const fadeInDuration = 800;
    const convergeDuration = 4000;
    const holdDuration = 1500;
    const fadeOutDuration = 800;
    const totalDuration = fadeInDuration + convergeDuration + holdDuration + fadeOutDuration;

    let active = true;

    const render = () => {
      if (!active) return;
      const elapsed = performance.now() - startTime;

      const fadeInT = Math.min(1, elapsed / fadeInDuration);
      const convergeElapsed = Math.max(0, elapsed - fadeInDuration);
      const convergeT = Math.min(1, convergeElapsed / convergeDuration);
      const holdElapsed = Math.max(0, elapsed - fadeInDuration - convergeDuration);
      const fadeOutElapsed = Math.max(0, elapsed - fadeInDuration - convergeDuration - holdDuration);
      const fadeOutT = Math.min(1, fadeOutElapsed / fadeOutDuration);

      let globalAlpha = 1;
      if (elapsed < fadeInDuration) {
        globalAlpha = fadeInT;
      } else if (fadeOutElapsed > 0) {
        globalAlpha = 1 - fadeOutT;
      }

      if (convergeT < 1) {
        ctx.fillStyle = `rgba(10, 10, 10, ${convergeT < 0.5 ? 0.15 : 0.3})`;
        ctx.fillRect(0, 0, W, H);
      } else {
        ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
        ctx.fillRect(0, 0, W, H);
      }

      const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

      ctx.globalAlpha = globalAlpha;

      for (let i = 0; i < COUNT; i++) {
        const particleConvergeT = Math.max(0, Math.min(1,
          (convergeT - delay[i] * 0.4) / (1 - delay[i] * 0.4)
        ));
        const eased = easeOutQuart(particleConvergeT);

        const cx = startX[i] + (targetX[i] - startX[i]) * eased;
        const cy = startY[i] + (targetY[i] - startY[i]) * eased;

        const floatAmount = eased * holdElapsed * 0.0001;
        const fx = cx + Math.sin(particlePhase[i] + elapsed * 0.001) * floatAmount * 0.02;
        const fy = cy + Math.cos(particlePhase[i] * 1.3 + elapsed * 0.0008) * floatAmount * 0.015;

        const screenX = (fx + 1) * 0.5 * W;
        const screenY = (1 - (fy + 1) * 0.5) * H + H * 0.15;
        const s = sizes[i] * (0.4 + eased * 0.6);

        posX[i] = screenX;
        posY[i] = screenY;

        const particleAlpha = 0.2 + eased * 0.8;

        if (s > 2.5 * dpr) {
          const gs = s * 5;
          const grad = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, gs);
          if (isGoldArr[i]) {
            grad.addColorStop(0, `rgba(201, 169, 110, ${particleAlpha * 0.12})`);
          } else {
            grad.addColorStop(0, `rgba(255, 255, 255, ${particleAlpha * 0.08})`);
          }
          grad.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(screenX, screenY, gs, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = globalAlpha * particleAlpha;
        ctx.fillStyle = isGoldArr[i] ? "#c9a96e" : "#ffffff";
        ctx.beginPath();
        ctx.arc(screenX, screenY, s, 0, Math.PI * 2);
        ctx.fill();

        if (particleConvergeT > 0.05 && particleConvergeT < 0.95) {
          const trailLength = (1 - eased) * 0.3;
          const prevX = (startX[i] + (targetX[i] - startX[i]) * Math.max(0, eased - trailLength) + 1) * 0.5 * W;
          const prevY = (1 - (startY[i] + (targetY[i] - startY[i]) * Math.max(0, eased - trailLength) + 1) * 0.5) * H + H * 0.15;

          ctx.globalAlpha = globalAlpha * particleAlpha * 0.15;
          ctx.strokeStyle = isGoldArr[i] ? "#c9a96e" : "#ffffff";
          ctx.lineWidth = s * 0.5;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(screenX, screenY);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;

      if (convergeT > 0.7) {
        const glowAlpha = (convergeT - 0.7) / 0.3 * 0.15 * globalAlpha;
        const centerGlow = ctx.createRadialGradient(W * 0.5, H * 0.55, 0, W * 0.5, H * 0.55, W * 0.25);
        centerGlow.addColorStop(0, `rgba(201, 169, 110, ${glowAlpha})`);
        centerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = centerGlow;
        ctx.fillRect(0, 0, W, H);
      }

      if (elapsed < totalDuration) {
        requestAnimationFrame(render);
      } else {
        dismiss();
      }
    };

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, W, H);
    requestAnimationFrame(render);
    return () => { active = false; };
  }, [show, mounted, dismiss]);

  if (!mounted || !show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: fading ? 0 : 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[1000] bg-background"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ background: "#0a0a0a" }}
          />
          <button
            onClick={dismiss}
            className="absolute bottom-8 right-8 text-text-secondary hover:text-white text-xs font-sans uppercase tracking-widest transition-colors duration-300 cursor-pointer z-10"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
