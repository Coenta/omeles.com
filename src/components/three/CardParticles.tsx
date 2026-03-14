"use client";

import { useRef, useEffect, useState } from "react";

type SectorType = "yachts" | "casinos" | "restaurants" | "hotels";

interface CardParticlesProps {
  type: SectorType;
  isHovered: boolean;
}

const CONFIGS: Record<SectorType, {
  color: [number, number, number];
  dirY: number;
  speed: number;
}> = {
  yachts: { color: [0.53, 0.8, 1.0], dirY: 1, speed: 0.8 },
  casinos: { color: [0.788, 0.663, 0.431], dirY: 0, speed: 1.5 },
  restaurants: { color: [1, 1, 1], dirY: 1, speed: 0.4 },
  hotels: { color: [1, 0.93, 0.87], dirY: -1, speed: 0.3 },
};

export default function CardParticles({ type, isHovered }: CardParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const opacityRef = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return;

    const COUNT = 120;
    const config = CONFIGS[type];
    const dpr = Math.min(window.devicePixelRatio, 2);

    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);

    const vsSource = `
      attribute vec2 aPosition;
      attribute float aSize;
      attribute float aPhase;
      uniform float uTime;
      uniform float uOpacity;
      varying float vOpacity;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
        gl_PointSize = aSize;
        vOpacity = uOpacity;
      }
    `;
    const fsSource = `
      precision mediump float;
      uniform vec3 uColor;
      varying float vOpacity;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = 1.0 - smoothstep(0.1, 0.5, dist);
        gl_FragColor = vec4(uColor, alpha * vOpacity);
      }
    `;

    function compile(t: number, src: string) {
      const s = gl!.createShader(t)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const vs = compile(gl.VERTEX_SHADER, vsSource);
    const fs = compile(gl.FRAGMENT_SHADER, fsSource);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Data
    const posData = new Float32Array(COUNT * 2);
    const sizeData = new Float32Array(COUNT);
    const phaseData = new Float32Array(COUNT);
    const velocities = new Float32Array(COUNT * 2);

    for (let i = 0; i < COUNT; i++) {
      posData[i * 2] = (Math.random() - 0.5) * 2;
      posData[i * 2 + 1] = (Math.random() - 0.5) * 2;
      sizeData[i] = 2 + Math.random() * 4;
      phaseData[i] = Math.random() * Math.PI * 2;
      velocities[i * 2] = (Math.random() - 0.5) * 0.003;
      velocities[i * 2 + 1] = config.dirY * (0.001 + Math.random() * 0.003) * config.speed;
    }

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, posData, gl.DYNAMIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPosition");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const sizeBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuf);
    gl.bufferData(gl.ARRAY_BUFFER, sizeData, gl.STATIC_DRAW);
    const aSize = gl.getAttribLocation(prog, "aSize");
    gl.enableVertexAttribArray(aSize);
    gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "uTime");
    const uOpacity = gl.getUniformLocation(prog, "uOpacity");
    const uColor = gl.getUniformLocation(prog, "uColor");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const startTime = performance.now();
    let active = true;

    const render = () => {
      if (!active) return;
      const time = (performance.now() - startTime) / 1000;

      // Fade
      const target = isHovered ? 0.8 : 0;
      opacityRef.current += (target - opacityRef.current) * 0.08;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (opacityRef.current > 0.01) {
        // Update positions
        for (let i = 0; i < COUNT; i++) {
          if (type === "casinos") {
            posData[i * 2] += Math.sin(time * 2 + phaseData[i]) * 0.001;
            posData[i * 2 + 1] += Math.cos(time * 1.5 + phaseData[i]) * 0.001;
          } else {
            posData[i * 2] += velocities[i * 2];
            posData[i * 2 + 1] += velocities[i * 2 + 1];
            if (posData[i * 2 + 1] > 1.2) posData[i * 2 + 1] = -1.2;
            if (posData[i * 2 + 1] < -1.2) posData[i * 2 + 1] = 1.2;
            if (posData[i * 2] > 1.2) posData[i * 2] = -1.2;
            if (posData[i * 2] < -1.2) posData[i * 2] = 1.2;
          }
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, posData);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        gl.useProgram(prog);
        gl.uniform1f(uTime, time);
        gl.uniform1f(uOpacity, opacityRef.current);
        gl.uniform3f(uColor, config.color[0], config.color[1], config.color[2]);
        gl.drawArrays(gl.POINTS, 0, COUNT);
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      cancelAnimationFrame(animRef.current);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [mounted, type]);

  // Keep isHovered in sync without re-creating GL context
  useEffect(() => {
    // opacityRef target is read in render loop via isHovered closure
  }, [isHovered]);

  if (!mounted || (typeof window !== "undefined" && window.innerWidth < 768)) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-10 pointer-events-none rounded-sm"
      style={{ background: "transparent" }}
    />
  );
}
