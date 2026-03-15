"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { sectors } from "@/data/sectors";
import Float3D from "@/components/Float3D";

export default function ClientContent() {
  const [active, setActive] = useState<string | null>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const mouse = useRef({ x: 0.5, y: 0.5, sx: 0.5, sy: 0.5 });

  const activeSector = sectors.find((s) => s.slug === active);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove);

    let t = 0;
    const animate = () => {
      t += 0.008;

      const m = mouse.current;
      m.sx += (m.x - m.sx) * 0.06;
      m.sy += (m.y - m.sy) * 0.06;

      // Mouse contribution
      const offX = m.sx - 0.5;
      const offY = m.sy - 0.5;

      // Autonomous drift
      const autoRotY = Math.sin(t * 0.7) * 4 + Math.sin(t * 0.3) * 2;
      const autoRotX = Math.cos(t * 0.5) * 2.5 + Math.cos(t * 0.2) * 1.5;
      const autoTx = Math.sin(t * 0.4) * 10;
      const autoTy = Math.cos(t * 0.6) * 7;

      const rotateY = offX * 14 + autoRotY;
      const rotateX = -offY * 9 + autoRotX;
      const tx = offX * -28 + autoTx;
      const ty = offY * -18 + autoTy;
      const dist = Math.sqrt(offX * offX + offY * offY);
      const tz = -dist * 35;
      const scale = 1 - dist * 0.05;

      if (titleRef.current) {
        titleRef.current.style.transform = `
          perspective(600px)
          translate3d(${tx}px, ${ty}px, ${tz}px)
          rotateY(${rotateY}deg)
          rotateX(${rotateX}deg)
          scale(${scale})
        `;
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background video */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/fabric-flow-ping.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Sector card — slides in from left when sector active */}
        <div
          className="fixed left-0 top-0 h-full z-20 flex items-center pointer-events-none"
          style={{ paddingLeft: "clamp(40px, 8vw, 120px)" }}
        >
          <div
            style={{
              opacity: activeSector ? 1 : 0,
              transform: activeSector ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
              transition: "opacity 0.35s ease, transform 0.35s ease",
              pointerEvents: activeSector ? "auto" : "none",
              width: "clamp(280px, 28vw, 420px)",
            }}
          >
            {activeSector && (
              <Float3D side="left" intensity={1.2} shadow>
                <Link href={`/solutions/${activeSector.slug}`} className="group block relative">
                  <div
                    className="relative overflow-hidden rounded-lg border border-white/10 shadow-2xl shadow-black/40"
                    style={{ aspectRatio: "3/4" }}
                  >
                    <Image
                      src={activeSector.image}
                      alt={activeSector.title}
                      fill
                      quality={95}
                      priority
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 1280px) 320px, 420px"
                    />
                    <div className="absolute inset-0 bg-black/35 group-hover:bg-black/50 transition-colors duration-500" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                      <h3 className="font-serif text-3xl text-white mb-1">{activeSector.title}</h3>
                      <p className="text-gold text-sm font-sans mb-4">{activeSector.tagline}</p>
                      <div className="flex flex-wrap gap-2 mb-5">
                        {activeSector.categories.map((cat) => (
                          <span key={cat} className="text-xs font-sans uppercase tracking-wider text-white/70 border border-white/20 px-3 py-1 rounded-full">
                            {cat}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-white/70 group-hover:text-gold transition-colors duration-300">
                        <span className="text-xs font-sans uppercase tracking-widest">Discover</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-300 group-hover:translate-x-1">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </Float3D>
            )}
          </div>
        </div>

        {/* Tagline — left aligned, 3D mouse parallax, fades when sector active */}
        <div
          className="fixed left-0 top-0 h-full z-10 flex items-center pointer-events-none"
          style={{
            paddingLeft: "clamp(40px, 8vw, 120px)",
            opacity: active ? 0 : 1,
            transition: "opacity 0.4s ease",
          }}
        >
          <div
            ref={titleRef}
            className="will-change-transform"
            style={{ transformStyle: "preserve-3d", transformOrigin: "left center" }}
          >
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white">
              Beyond Products.
              <br />
              <em style={{ color: "#C9A84C" }}>Into Operations.</em>
            </h2>
          </div>
        </div>

        {/* Sector buttons — right side, vertically centered */}
        <div
          className="fixed right-0 top-0 h-full z-20 flex flex-col items-end justify-center gap-0"
          style={{ paddingRight: "clamp(40px, 8vw, 120px)" }}
        >
          {sectors.map((sector, i) => (
            <Link
              key={sector.slug}
              href={`/solutions/${sector.slug}`}
              onMouseEnter={() => setActive(sector.slug)}
              onMouseLeave={() => setActive(null)}
              className="group flex items-center gap-4 py-5 text-right"
              style={{ opacity: active && active !== sector.slug ? 0.3 : 1, transition: "opacity 0.3s ease" }}
            >
              <span className="text-white/25 text-[10px] font-sans tabular-nums">
                0{i + 1}
              </span>
              <span
                className="font-serif transition-all duration-300"
                style={{
                  fontSize: "clamp(28px, 3.5vw, 52px)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                  color: active === sector.slug ? "#C9A84C" : "white",
                }}
              >
                {sector.title}
              </span>
              <span
                style={{
                  display: "block",
                  width: active === sector.slug ? "32px" : "0px",
                  height: "1px",
                  background: "#C9A84C",
                  transition: "width 0.3s ease",
                  flexShrink: 0,
                }}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
