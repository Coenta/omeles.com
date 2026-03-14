"use client";

import { useRef, useEffect, useState } from "react";

const GOLD_R = 0.788, GOLD_G = 0.663, GOLD_B = 0.431;

export default function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
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

    const COUNT = 200;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const vsSource = `
      attribute vec2 aPosition;
      attribute float aSize;
      attribute float aOpacity;
      attribute float aColorMix;
      varying float vOpacity;
      varying float vColorMix;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
        gl_PointSize = aSize;
        vOpacity = aOpacity;
        vColorMix = aColorMix;
      }
    `;
    const fsSource = `
      precision mediump float;
      varying float vOpacity;
      varying float vColorMix;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = 1.0 - smoothstep(0.15, 0.5, dist);
        vec3 white = vec3(1.0);
        vec3 gold = vec3(${GOLD_R}, ${GOLD_G}, ${GOLD_B});
        vec3 color = mix(white, gold, vColorMix);
        gl_FragColor = vec4(color, alpha * vOpacity * 0.35);
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

    const posData = new Float32Array(COUNT * 2);
    const sizeData = new Float32Array(COUNT);
    const opacityData = new Float32Array(COUNT);
    const colorData = new Float32Array(COUNT);
    const velY = new Float32Array(COUNT);
    const velX = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      posData[i * 2] = (Math.random() - 0.5) * 2.2;
      posData[i * 2 + 1] = (Math.random() - 0.5) * 2.2;
      sizeData[i] = 1.5 + Math.random() * 2.5;
      opacityData[i] = 0.15 + Math.random() * 0.3;
      colorData[i] = Math.random() < 0.1 ? 0.5 + Math.random() * 0.5 : 0;
      velY[i] = 0.0002 + Math.random() * 0.0005;
      velX[i] = (Math.random() - 0.5) * 0.0003;
    }

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, posData, gl.DYNAMIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPosition");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    function createStaticBuf(data: Float32Array, attrib: string, size: number) {
      const buf = gl!.createBuffer();
      gl!.bindBuffer(gl!.ARRAY_BUFFER, buf);
      gl!.bufferData(gl!.ARRAY_BUFFER, data, gl!.STATIC_DRAW);
      const loc = gl!.getAttribLocation(prog, attrib);
      if (loc >= 0) {
        gl!.enableVertexAttribArray(loc);
        gl!.vertexAttribPointer(loc, size, gl!.FLOAT, false, 0, 0);
      }
    }

    createStaticBuf(sizeData, "aSize", 1);
    createStaticBuf(opacityData, "aOpacity", 1);
    createStaticBuf(colorData, "aColorMix", 1);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    let active = true;
    const render = () => {
      if (!active) return;
      if (document.hidden) {
        animRef.current = requestAnimationFrame(render);
        return;
      }

      for (let i = 0; i < COUNT; i++) {
        posData[i * 2] += velX[i];
        posData[i * 2 + 1] += velY[i];
        if (posData[i * 2 + 1] > 1.2) posData[i * 2 + 1] = -1.2;
        if (posData[i * 2] > 1.2) posData[i * 2] = -1.2;
        if (posData[i * 2] < -1.2) posData[i * 2] = 1.2;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, posData);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.drawArrays(gl.POINTS, 0, COUNT);
      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
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
