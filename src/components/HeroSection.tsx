"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { getGlobalMouse } from "@/hooks/useGlobalMouse";

const HeroMesh = dynamic(() => import("./three/HeroMesh"), { ssr: false });

export default function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const vidElRef = useRef<HTMLVideoElement>(null);
  const animRef = useRef<number>(0);

  const [hovered, setHovered] = useState(false);
  const [muted, setMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleMute = useCallback(() => {
    if (vidElRef.current) {
      vidElRef.current.muted = !vidElRef.current.muted;
      setMuted(vidElRef.current.muted);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    const container = vidElRef.current?.closest(".aspect-video") as HTMLElement;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    const mouse = getGlobalMouse();

    const animate = () => {
      const offX = mouse.smoothX - 0.5;
      const offY = mouse.smoothY - 0.5;

      const rotateY = offX * 12;
      const rotateX = -offY * 8;
      const translateX = offX * -30;
      const translateY = offY * -20;
      const distFromCenter = Math.sqrt(offX * offX + offY * offY);
      const scale = 1 - distFromCenter * 0.06;
      const translateZ = -distFromCenter * 40;

      // Dynamic shadow
      const sX = offX * 25;
      const sY = offY * 20;
      const sBlur = 30 + distFromCenter * 80;
      const sAlpha = 0.06 + distFromCenter * 0.12;
      const shadow = `${sX}px ${sY}px ${sBlur}px -5px rgba(0,0,0,${sAlpha}), ${sX * 0.3}px ${sY * 0.3}px ${sBlur * 0.4}px 0px rgba(0,0,0,${sAlpha * 0.5})`;

      if (contentRef.current) {
        contentRef.current.style.transform = `
          perspective(500px)
          translate3d(${translateX}px, ${translateY}px, ${translateZ}px)
          rotateY(${rotateY}deg)
          rotateX(${rotateX}deg)
          scale(${scale})
        `;
      }

      if (videoRef.current) {
        videoRef.current.style.transform = `
          perspective(500px)
          translate3d(${translateX}px, ${translateY}px, ${translateZ}px)
          rotateY(${rotateY}deg)
          rotateX(${rotateX}deg)
          scale(${scale})
        `;
        videoRef.current.style.boxShadow = shadow;
      }

      if (scrollRef.current) {
        scrollRef.current.style.transform = `
          perspective(800px)
          translate3d(${offX * -25}px, ${offY * -18}px, ${-distFromCenter * 35}px)
          rotateY(${offX * 10}deg)
          rotateX(${-offY * 6}deg)
        `;
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-visible flex flex-col items-center justify-center gap-12 py-32">
      {/* Text */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full will-change-transform text-center flex flex-col items-center"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: "-30vh", rotateX: 15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 2.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] tracking-tight mb-8 text-text-primary">
            Beyond Products.
            <br />
            <em className="text-gold">Into Operations.</em>
          </h1>

          <p className="max-w-xl mx-auto text-text-secondary text-sm md:text-base leading-relaxed">
            Structured solutions combining identity, textiles, protection, and
            guidance — supporting service businesses from brand expression to
            day-to-day operations for hospitality and maritime services.
          </p>
        </motion.div>
      </div>

      {/* Video Frame */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[900px] mx-auto px-6 md:px-12"
      >
        <div
          ref={videoRef}
          className="will-change-transform"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
          }}
        >
          <div className="relative rounded-lg overflow-hidden shadow-2xl shadow-black/10 border border-black/[0.06]">
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/10 to-transparent z-10 flex items-center px-4 gap-1.5">
              <div className="w-2 h-2 rounded-full bg-black/15" />
              <div className="w-2 h-2 rounded-full bg-black/15" />
              <div className="w-2 h-2 rounded-full bg-black/15" />
            </div>

            <div
              className="aspect-video bg-surface relative group/video"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <video
                ref={vidElRef}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/videos/hero-video.mp4" type="video/mp4" />
              </video>

              {/* Hover controls */}
              <div
                className={`absolute bottom-0 left-0 right-0 flex items-center justify-end gap-3 px-4 py-3 bg-gradient-to-t from-black/40 to-transparent transition-opacity duration-500 ${
                  hovered ? "opacity-100" : "opacity-0"
                }`}
                style={{ pointerEvents: hovered ? "auto" : "none" }}
              >
                {/* Mute / Unmute */}
                <button
                  onClick={toggleMute}
                  className="text-white/80 hover:text-white transition-colors duration-300 cursor-pointer"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 5L6 9H2v6h4l5 4V5z" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 5L6 9H2v6h4l5 4V5z" />
                      <path d="M19.07 4.93a10 10 0 010 14.14" />
                      <path d="M15.54 8.46a5 5 0 010 7.07" />
                    </svg>
                  )}
                </button>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="text-white/80 hover:text-white transition-colors duration-300 cursor-pointer"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3v3a2 2 0 01-2 2H3" />
                      <path d="M21 8h-3a2 2 0 01-2-2V3" />
                      <path d="M3 16h3a2 2 0 012 2v3" />
                      <path d="M16 21v-3a2 2 0 012-2h3" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3H5a2 2 0 00-2 2v3" />
                      <path d="M21 8V5a2 2 0 00-2-2h-3" />
                      <path d="M3 16v3a2 2 0 002 2h3" />
                      <path d="M16 21h3a2 2 0 002-2v-3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold/40" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold/40" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold/40" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold/40" />
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: "2.5s" }}>
          <span className="text-text-secondary/60 text-[10px] font-sans uppercase tracking-[0.25em]">
            Scroll
          </span>
          <div className="w-[1px] h-6 bg-gradient-to-b from-black/20 to-transparent" />
        </div>
      </div>
    </section>
  );
}
