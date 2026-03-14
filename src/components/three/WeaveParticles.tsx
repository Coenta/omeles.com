"use client";

import { useRef, useEffect, useState } from "react";

const GOLD_R = 0.788, GOLD_G = 0.663, GOLD_B = 0.431;

export default function WeaveParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const scrollRef = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) return; // skip mobile

    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return;

    const COUNT = 1200;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? Math.min(1, window.scrollY / (max * 0.8)) : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const vsSource = `
      attribute vec2 aStart;
      attribute vec2 aEnd;
      attribute float aSize;
      attribute float aColorMix;
      attribute float aOpacity;

      uniform float uProgress;
      uniform vec2 uResolution;

      varying float vColorMix;
      varying float vOpacity;

      // Ease in-out quad
      float ease(float t) {
        return t < 0.5 ? 2.0 * t * t : 1.0 - pow(-2.0 * t + 2.0, 2.0) / 2.0;
      }

      void main() {
        float t = ease(clamp(uProgress, 0.0, 1.0));
        vec2 pos = mix(aStart, aEnd, t);
        gl_Position = vec4(pos, 0.0, 1.0);
        gl_PointSize = aSize * (uResolution.y / 900.0);
        vColorMix = aColorMix;
        vOpacity = aOpacity * (0.4 + t * 0.6);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying float vColorMix;
      varying float vOpacity;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = 1.0 - smoothstep(0.15, 0.5, dist);
        vec3 white = vec3(1.0);
        vec3 gold = vec3(${GOLD_R}, ${GOLD_G}, ${GOLD_B});
        vec3 color = mix(white, gold, vColorMix);
        gl_FragColor = vec4(color, alpha * vOpacity);
      }
    `;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
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

    // Generate data
    const starts = new Float32Array(COUNT * 2);
    const ends = new Float32Array(COUNT * 2);
    const sizes = new Float32Array(COUNT);
    const colorMixes = new Float32Array(COUNT);
    const opacities = new Float32Array(COUNT);

    const cols = Math.ceil(Math.sqrt(COUNT * 1.5));
    const rows = Math.ceil(COUNT / cols);

    for (let i = 0; i < COUNT; i++) {
      // Random start
      starts[i * 2] = (Math.random() - 0.5) * 2.4;
      starts[i * 2 + 1] = (Math.random() - 0.5) * 2.4;

      // Grid end (weave)
      const col = i % cols;
      const row = Math.floor(i / cols);
      ends[i * 2] = ((col / cols) - 0.5) * 1.8;
      ends[i * 2 + 1] = ((row / rows) - 0.5) * 1.6;

      sizes[i] = 1.5 + Math.random() * 2.5;
      colorMixes[i] = row % 2 === 0 ? 0.6 + Math.random() * 0.4 : Math.random() * 0.15;
      opacities[i] = 0.3 + Math.random() * 0.5;
    }

    function createBuf(data: Float32Array, attrib: string, size: number) {
      const buf = gl!.createBuffer();
      gl!.bindBuffer(gl!.ARRAY_BUFFER, buf);
      gl!.bufferData(gl!.ARRAY_BUFFER, data, gl!.STATIC_DRAW);
      const loc = gl!.getAttribLocation(prog, attrib);
      if (loc >= 0) {
        gl!.enableVertexAttribArray(loc);
        gl!.vertexAttribPointer(loc, size, gl!.FLOAT, false, 0, 0);
      }
    }

    createBuf(starts, "aStart", 2);
    createBuf(ends, "aEnd", 2);
    createBuf(sizes, "aSize", 1);
    createBuf(colorMixes, "aColorMix", 1);
    createBuf(opacities, "aOpacity", 1);

    const uProgress = gl.getUniformLocation(prog, "uProgress");
    const uResolution = gl.getUniformLocation(prog, "uResolution");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const render = () => {
      if (document.hidden) {
        animRef.current = requestAnimationFrame(render);
        return;
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.uniform1f(uProgress, scrollRef.current);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.drawArrays(gl.POINTS, 0, COUNT);
      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
}
