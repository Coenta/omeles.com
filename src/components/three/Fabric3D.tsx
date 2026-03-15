"use client";

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const COLS = 50;
const ROWS = 80;
const SIZE_W = 320;  // horizontal
const SIZE_H = 600;  // vertical — fills viewport height


interface P { x: number; y: number; z: number; px: number; py: number; pz: number; pinned?: boolean; }

function makeFabricNormalMap(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  const d = img.data;

  const T = 10; // thread width in pixels

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const row = Math.floor(y / T);
      const col = Math.floor(x / T);
      const u = (x % T) / T; // 0..1 along thread width
      const v = (y % T) / T;
      const isWeftOver = (row + col) % 2 === 0;

      let nx = 0, ny = 0, nz = 1;

      if (isWeftOver) {
        // Weft thread on top — bump runs horizontally, slope in Y
        const t = v * 2 - 1; // -1..1
        ny = -t * 0.85;
        nz = Math.sqrt(Math.max(0.01, 1 - ny * ny));
      } else {
        // Warp thread underneath — bump runs vertically, slope in X
        const t = u * 2 - 1;
        nx = -t * 0.85;
        nz = Math.sqrt(Math.max(0.01, 1 - nx * nx)) * 0.7; // slightly recessed
      }

      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      const idx = (y * size + x) * 4;
      d[idx]     = Math.round((nx / len * 0.5 + 0.5) * 255);
      d[idx + 1] = Math.round((ny / len * 0.5 + 0.5) * 255);
      d[idx + 2] = Math.round((nz / len * 0.5 + 0.5) * 255);
      d[idx + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(18, 18);
  return tex;
}

function makeFabricRoughnessMap(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  const d = img.data;

  const T = 10;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const row = Math.floor(y / T);
      const col = Math.floor(x / T);
      const isWeftOver = (row + col) % 2 === 0;
      // Over thread: smoother peak (lower roughness), edges rougher
      const u = (x % T) / T;
      const v = (y % T) / T;
      const edgeDist = isWeftOver
        ? Math.min(v, 1 - v)
        : Math.min(u, 1 - u);
      const roughness = isWeftOver
        ? 0.55 + (1 - edgeDist * 2) * 0.15 // 0.55..0.70
        : 0.80; // under thread is rougher/flatter
      const val = Math.round(roughness * 255);
      const idx = (y * size + x) * 4;
      d[idx] = d[idx + 1] = d[idx + 2] = val;
      d[idx + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(18, 18);
  return tex;
}

export default function Fabric3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    const container = containerRef.current;

    const W = container.clientWidth || window.innerWidth;
    const H = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 2000);
    camera.position.set(0, 120, 580);
    camera.lookAt(0, -60, 0);



    // Lighting
    scene.add(new THREE.AmbientLight(0xb0c4d8, 0.55));

    // Cool blue key from front-left (main light)
    const keyLight = new THREE.DirectionalLight(0xd0e4ff, 2.8);
    keyLight.position.set(-200, 200, 500);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -500; keyLight.shadow.camera.right = 500;
    keyLight.shadow.camera.top = 500; keyLight.shadow.camera.bottom = -500;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    // Warm amber backlight
    const backLight = new THREE.DirectionalLight(0xe09040, 3.2);
    backLight.position.set(100, -100, -500);
    scene.add(backLight);

    // Soft fill from right
    const rimLight = new THREE.DirectionalLight(0xeef4ff, 1.2);
    rimLight.position.set(400, 100, 300);
    scene.add(rimLight);

    // Subtle top fill
    const topLight = new THREE.DirectionalLight(0xffffff, 0.6);
    topLight.position.set(0, 400, 100);
    scene.add(topLight);

    // Procedural normal map for weave
    const normalMap = makeFabricNormalMap();
    const roughnessMap = makeFabricRoughnessMap();

    // Color map: warp = warm ivory, weft = cool blue-gray
    const colorSize = 512;
    const colorCanvas = document.createElement("canvas");
    colorCanvas.width = colorSize; colorCanvas.height = colorSize;
    const colorCtx = colorCanvas.getContext("2d")!;
    const colorImg = colorCtx.createImageData(colorSize, colorSize);
    const cd = colorImg.data;
    const T = 10;
    // Warp: warm ivory/linen  Weft: cool blue-gray
    const warpR = 240, warpG = 232, warpB = 210;
    const weftR = 180, weftG = 196, weftB = 218;
    for (let y = 0; y < colorSize; y++) {
      for (let x = 0; x < colorSize; x++) {
        const row = Math.floor(y / T);
        const col = Math.floor(x / T);
        const isWeftOver = (row + col) % 2 === 0;
        const idx = (y * colorSize + x) * 4;
        cd[idx]     = isWeftOver ? weftR : warpR;
        cd[idx + 1] = isWeftOver ? weftG : warpG;
        cd[idx + 2] = isWeftOver ? weftB : warpB;
        cd[idx + 3] = 255;
      }
    }
    colorCtx.putImageData(colorImg, 0, 0);
    const colorMap = new THREE.CanvasTexture(colorCanvas);
    colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
    colorMap.repeat.set(18, 18);

    // Particles
    const pts: P[] = [];
    for (let r = 0; r <= ROWS; r++)
      for (let c = 0; c <= COLS; c++) {
        const x = (c / COLS - 0.5) * SIZE_W;
        const y = (1 - r / ROWS) * SIZE_H - SIZE_H / 2;
        pts.push({ x, y, z: 0, px: x, py: y, pz: 0 });
      }
    const get = (r: number, c: number) => pts[r * (COLS + 1) + c];

    const REST_H = SIZE_W / COLS, REST_V = SIZE_H / ROWS;
    const REST_D = Math.sqrt(REST_H * REST_H + REST_V * REST_V);

    const satisfy = (a: P, b: P, rest: number, s = 1.0) => {
      const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.0001;
      const f = (d - rest) / d * 0.5 * s;
      if (!a.pinned) { a.x += dx * f; a.y += dy * f; a.z += dz * f; }
      if (!b.pinned) { b.x -= dx * f; b.y -= dy * f; b.z -= dz * f; }
    };

    // Mesh geometry
    const indices: number[] = [];
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        const a = r * (COLS + 1) + c;
        const b = a + 1;
        const cc = a + (COLS + 1);
        const d = cc + 1;
        indices.push(a, b, cc, b, d, cc);
      }

    const posArr = new Float32Array((COLS + 1) * (ROWS + 1) * 3);
    const uvArr  = new Float32Array((COLS + 1) * (ROWS + 1) * 2);

    for (let r = 0; r <= ROWS; r++)
      for (let c = 0; c <= COLS; c++) {
        const i = r * (COLS + 1) + c;
        uvArr[i * 2]     = c / COLS;
        uvArr[i * 2 + 1] = 1 - r / ROWS;
      }

    // Initialize positions
    for (let i = 0; i < pts.length; i++) {
      posArr[i * 3]     = pts[i].x;
      posArr[i * 3 + 1] = pts[i].y;
      posArr[i * 3 + 2] = pts[i].z;
    }

    const geo = new THREE.BufferGeometry();
    geo.setIndex(indices);
    const posAttr = new THREE.BufferAttribute(posArr, 3);
    geo.setAttribute("position", posAttr);
    geo.setAttribute("uv", new THREE.BufferAttribute(uvArr, 2));
    geo.computeVertexNormals();

    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: colorMap,
      side: THREE.DoubleSide,
      roughness: 0.88,
      metalness: 0.0,
      sheen: 0.25,
      sheenRoughness: 0.7,
      sheenColor: new THREE.Color(0xa8c4e0),
      normalMap,
      normalScale: new THREE.Vector2(0.5, 0.5),
      roughnessMap,
      envMapIntensity: 0.5,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // Vertical streaks — clearly show descent as camera moves down
    const STREAK_COUNT = 120;
    const STREAK_LEN = 60;   // length of each vertical line
    const streakPositions = new Float32Array(STREAK_COUNT * 6); // 2 points per line
    const partRange = { x: 700, y: 1400, z: 500 };
    for (let i = 0; i < STREAK_COUNT; i++) {
      const x = (Math.random() - 0.5) * partRange.x;
      const y = (Math.random() - 0.5) * partRange.y;
      const z = (Math.random() - 0.5) * partRange.z - 100; // slightly behind cloth
      streakPositions[i * 6]     = x;
      streakPositions[i * 6 + 1] = y;
      streakPositions[i * 6 + 2] = z;
      streakPositions[i * 6 + 3] = x;
      streakPositions[i * 6 + 4] = y + STREAK_LEN;
      streakPositions[i * 6 + 5] = z;
    }
    const partGeo = new THREE.BufferGeometry();
    const partAttr = new THREE.BufferAttribute(streakPositions, 3);
    partGeo.setAttribute("position", partAttr);
    const partMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
    });
    const particles = new THREE.LineSegments(partGeo, partMat);
    scene.add(particles);

    // Mouse in world space (XY plane at z=0)
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      const ny = ((e.clientY - rect.top)  / rect.height) * 2 - 1;
      // unproject to world at z=0
      const vec = new THREE.Vector3(nx, -ny, 0.5).unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      mouse.x = camera.position.x + dir.x * dist;
      mouse.y = camera.position.y + dir.y * dist;
    };
    container.addEventListener("mousemove", onMouseMove);

    let t = 0;
    let prevScrollY = window.scrollY;
    let scrollWind = 0;
    const DAMP = 0.992;
    const MOUSE_RADIUS = 80;
    const MOUSE_STRENGTH = 0.18;

    const update = () => {
      t += 0.005;

      // Scroll speed → wind burst on cloth
      const scrollDelta = window.scrollY - prevScrollY;
      prevScrollY = window.scrollY;
      scrollWind += scrollDelta * 0.005;  // accumulate scroll impulse
      scrollWind *= 0.92;                // decay

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const vx = (p.x - p.px) * DAMP;
        const vy = (p.y - p.py) * DAMP;
        const vz = (p.z - p.pz) * DAMP;
        p.px = p.x; p.py = p.y; p.pz = p.z;

        // Zero gravity — pure turbulent flow
        const ix = i * 0.009;
        const flowX = Math.sin(t * 0.35 + ix * 1.1) * 0.18
                    + Math.sin(t * 0.8  + ix * 2.3) * 0.09;
        const flowY = Math.sin(t * 0.28 + ix * 1.7) * 0.14
                    + Math.cos(t * 0.6  + ix * 0.9) * 0.07;
        const flowZ = Math.sin(t * 0.45 + ix * 1.3) * 0.22
                    + Math.cos(t * 0.9  + ix * 2.1) * 0.11;

        // Edge repulsion
        const BX = 220, BY = 180, BZ = 140, EDGE = 60, EF = 0.003;
        const bx = p.x > BX - EDGE ? -(p.x - (BX - EDGE)) * EF : p.x < -BX + EDGE ? (-BX + EDGE - p.x) * EF : 0;
        const by = p.y > BY - EDGE ? -(p.y - (BY - EDGE)) * EF : p.y < -BY + EDGE ? (-BY + EDGE - p.y) * EF : 0;
        const bz = p.z > BZ - EDGE ? -(p.z - (BZ - EDGE)) * EF : p.z < -BZ + EDGE ? (-BZ + EDGE - p.z) * EF : 0;

        // Mouse interaction — push particles away gently
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        let mx = 0, my = 0, mz = 0;
        if (mdist < MOUSE_RADIUS && mdist > 0.01) {
          const falloff = 1 - mdist / MOUSE_RADIUS;
          const force = falloff * falloff * MOUSE_STRENGTH;
          mx = (mdx / mdist) * force;
          my = (mdy / mdist) * force;
          mz = falloff * force * 1.5; // push toward camera slightly
        }

        // Scroll wind: rotational burst — X and Z vary by particle position
        const swX = scrollWind * Math.cos(ix * 3.0 + t);
        const swZ = scrollWind * Math.sin(ix * 3.0 + t) * 0.7;

        p.x += vx + flowX + 0.002 + bx + mx + swX;
        p.y += vy + flowY + 0.001 + by + my;
        p.z += vz + flowZ + bz + mz + swZ;
      }

      for (let iter = 0; iter < 14; iter++) {
        for (let r = 0; r <= ROWS; r++)
          for (let c = 0; c < COLS; c++) satisfy(get(r, c), get(r, c + 1), REST_H);
        for (let r = 0; r < ROWS; r++)
          for (let c = 0; c <= COLS; c++) satisfy(get(r, c), get(r + 1, c), REST_V);
        for (let r = 0; r < ROWS; r++)
          for (let c = 0; c < COLS; c++) {
            satisfy(get(r, c), get(r + 1, c + 1), REST_D);
            satisfy(get(r + 1, c), get(r, c + 1), REST_D);
          }
        // Bending
        for (let r = 0; r <= ROWS; r++)
          for (let c = 0; c < COLS - 1; c++) satisfy(get(r, c), get(r, c + 2), REST_H * 2, 0.9);
        for (let r = 0; r < ROWS - 1; r++)
          for (let c = 0; c <= COLS; c++) satisfy(get(r, c), get(r + 2, c), REST_V * 2, 0.9);
      }

      for (let i = 0; i < pts.length; i++) posAttr.setXYZ(i, pts[i].x, pts[i].y, pts[i].z);
      posAttr.needsUpdate = true;
      geo.computeVertexNormals();
    };

    const camBaseY = 0;
    const animate = () => {
      // Cloth + camera fall together based on scroll
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
      const fallOffset = (window.scrollY / maxScroll) * 300;
      mesh.position.y = -fallOffset;
      camera.position.y = camBaseY - fallOffset;
      camera.lookAt(0, camBaseY - fallOffset, 0);

      // Streaks drift upward continuously — camera falling = streaks rising past view
      const driftY = (t * 60) % partRange.y;
      particles.position.set(0, camBaseY - fallOffset - driftY, 0);

      update();
      renderer.render(scene, camera);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    const onResize = () => {
      const W2 = container.clientWidth || window.innerWidth;
      const H2 = container.clientHeight || window.innerHeight;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mousemove", onMouseMove);
      normalMap.dispose();
      roughnessMap.dispose();
      colorMap.dispose();
      renderer.dispose();
      [geo, mat, partGeo, partMat].forEach((o) => o.dispose());
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [mounted]);

  if (!mounted) return null;
  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "transparent" }}
    />
  );
}
