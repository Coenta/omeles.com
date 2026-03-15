"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import Image from "next/image";

const Fabric3D = dynamic(() => import("@/components/three/Fabric3D"), { ssr: false });

const ITEMS = [
  {
    type: "video" as const,
    src: "/videos/fabric-flow.mp4",
    title: "OMELES",
    sub: "Premium Textile Solutions",
  },
  {
    type: "card" as const,
    title: "Yachts",
    sub: "Superyacht & Luxury Marine",
    desc: "Tailored uniforms and intelligent onboard textiles for the world's finest vessels.",
    image: "/images/yachts.png",
  },
  {
    type: "card" as const,
    title: "Casinos",
    sub: "Gaming & Hospitality",
    desc: "Elegant staffwear engineered for long shifts and high-stakes environments.",
    image: "/images/casinos.png",
  },
  {
    type: "card" as const,
    title: "Restaurants",
    sub: "Fine Dining & Culinary",
    desc: "From kitchen to table — performance fabric with refined aesthetic.",
    image: "/images/restaurants.png",
  },
  {
    type: "card" as const,
    title: "Hotels",
    sub: "Premium Hospitality",
    desc: "Smart functional finishes and custom branding for world-class hotels.",
    image: "/images/hotels.png",
  },
];

const N = ITEMS.length;          // 5
const TWO_PI = Math.PI * 2;
const ORBIT_RX = 340;
const STEP_Y = 160;
const CARD_W = 300;
const CARD_H = 190;
// N cards × 100vh each + 1 hold section = 6 × 100vh
const SCENE_VH = N + 1;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export default function FabricDemoContent() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const clothRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;

    const animate = () => {
      const maxScroll = (SCENE_VH - 1) * window.innerHeight;
      const raw = maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0;

      // Parallax background — slow downward drift reveals descent
      if (bgRef.current) {
        const drift = window.scrollY * 0.4;
        bgRef.current.style.backgroundPosition = `center ${drift}px`;
      }


      // Orbit angle: each 1/N of scroll = one 72° step, capped at Hotels (step N-1)
      // At step i, card i is at angle 0 (front center)
      const orbitStep = Math.min(raw * N, N - 1);           // 0 → N-1 (smooth)
      const orbitAngle = -orbitStep * (TWO_PI / N);          // ring rotates so next card is front

      // Sort back-to-front for z-index
      const sorted = ITEMS.map((_, i) => {
        const a = (i / N) * TWO_PI + orbitAngle;
        return { i, z: Math.cos(a) };
      }).sort((a, b) => a.z - b.z);

      sorted.forEach(({ i }, zRank) => {
        const card = cardRefs.current[i];
        if (!card) return;

        // Card i is fully revealed once orbit has reached step i
        const revealRaw = Math.min(1, Math.max(0, orbitStep - (i - 1)));
        const revealT = easeInOut(Math.min(1, revealRaw));

        const angle = (i / N) * TWO_PI + orbitAngle;
        const x = Math.sin(angle) * ORBIT_RX;
        const z = Math.cos(angle);
        const depth = (z + 1) / 2;                          // 0 back → 1 front

        // Active card always at center Y — staircase shifts up as you descend
        const finalY = (i - orbitStep) * STEP_Y;
        const y = finalY + (1 - revealT) * 120;             // slide down from above on reveal

        const scale = 0.6 + depth * 0.5;                    // back: 0.6 → front: 1.1
        const isBehind = z < 0;
        const opacity = revealT < 0.05
          ? (isBehind ? 0.12 : 0.30)
          : revealT * (isBehind ? 0.25 : 0.35 + depth * 0.5);

        const blur = isBehind ? (1 - depth) * 6 : 0;

        card.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`;
        card.style.opacity = String(opacity);
        card.style.filter = blur > 0 ? `blur(${blur.toFixed(1)}px)` : "";
        card.style.zIndex = String(zRank);
      });

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ height: `${SCENE_VH * 100}vh` }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* Parallax line grid — descent indicator, sits above fabric */}
        <div
          ref={bgRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 5,
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            backgroundPosition: "center 0px",
          }}
        />

        <div ref={clothRef} className="absolute inset-0 z-0" style={{ willChange: "transform" }}>
          <Fabric3D />
        </div>

        <div className="absolute inset-0 z-10 pointer-events-none">
          {ITEMS.map((item, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: CARD_W,
                height: CARD_H,
                opacity: 0,
                willChange: "transform, opacity",
                pointerEvents: "auto",
              }}
            >
              {item.type === "video" ? (
                <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-2xl border border-white/20">
                  <video src={item.src} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-5">
                    <p className="text-white/55 text-[10px] uppercase tracking-widest mb-1">{item.sub}</p>
                    <h3 className="text-white text-xl font-semibold">{item.title}</h3>
                  </div>
                </div>
              ) : (
                <div
                  className="w-full h-full rounded-2xl shadow-2xl overflow-hidden relative"
                  style={{ border: "1px solid rgba(255,255,255,0.18)" }}
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="300px"
                      quality={90}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <p className="text-white/55 text-[10px] uppercase tracking-widest mb-1">{item.sub}</p>
                    <h3 className="text-white text-xl font-semibold leading-tight">{item.title}</h3>
                    <p className="text-white/70 text-xs mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <span className="text-white/40 text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-px h-8 bg-white/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
