"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FullscreenMenu from "./FullscreenMenu";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const prevPath = useRef(pathname);

  useEffect(() => {
    const onScroll = () => {
      // 0 → 1 over 500px of scroll
      const progress = Math.min(window.scrollY / 500, 1);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      setVisible(false);
      prevPath.current = pathname;
      const timer = setTimeout(() => setVisible(true), 400);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${scrollProgress * 0.55})`,
          backdropFilter: `blur(${scrollProgress * 16}px)`,
          WebkitBackdropFilter: `blur(${scrollProgress * 16}px)`,
          borderBottom: `1px solid rgba(255,255,255,${scrollProgress * 0.15})`,
          pointerEvents: "auto",
          zIndex: 9999,
        }}
      >
        <AnimatePresence>
          {visible && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
                {/* Logo left */}
                <Link href="/" className="relative" style={{ pointerEvents: "auto", zIndex: 10000 }}>
                  <Image
                    src="/images/omeles_logo.png"
                    alt="OMELES"
                    width={160}
                    height={52}
                    className="h-11 w-auto"
                  />
                </Link>

                {/* Center brand */}
                <Link
                  href="/"
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{ pointerEvents: "auto", zIndex: 10000 }}
                >
                  <span className="font-sans text-[13px] md:text-[15px] tracking-[0.45em] uppercase text-text-primary font-medium">
                    O.M.E.L.E.S.
                  </span>
                </Link>

                {/* Menu button right */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="relative flex flex-col gap-[6px] group cursor-pointer"
                  style={{ pointerEvents: "auto", zIndex: 10000 }}
                  aria-label="Toggle menu"
                >
                  <span
                    className={`block w-7 h-[1.5px] bg-text-primary transition-all duration-500 ${
                      menuOpen ? "rotate-45 translate-y-[7.5px] !bg-white" : ""
                    }`}
                  />
                  <span
                    className={`block w-7 h-[1.5px] bg-text-primary transition-all duration-500 ${
                      menuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`block w-7 h-[1.5px] bg-text-primary transition-all duration-500 ${
                      menuOpen ? "-rotate-45 -translate-y-[7.5px] !bg-white" : ""
                    }`}
                  />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <FullscreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
