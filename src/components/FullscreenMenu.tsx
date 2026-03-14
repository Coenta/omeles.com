"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { navigation } from "@/data/navigation";

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FullscreenMenu({ isOpen, onClose }: FullscreenMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 bg-[#1a1a1a] flex items-center"
          style={{ zIndex: 9998 }}
        >
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full">
            <nav className="flex flex-col gap-2 md:gap-4">
              {navigation.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 25 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-baseline gap-4 py-2 md:py-3"
                  >
                    <span className="text-white/40 font-sans text-sm tracking-widest">
                      {item.number}
                    </span>
                    <span className="font-serif text-4xl md:text-6xl lg:text-7xl text-white group-hover:text-gold transition-colors duration-300">
                      {item.label}
                    </span>
                  </Link>

                  {item.children && (
                    <div className="flex flex-wrap gap-4 ml-12 md:ml-16 mt-1 mb-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className="text-white/50 hover:text-gold text-sm font-sans uppercase tracking-widest transition-colors duration-300"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-12 md:mt-16 border-t border-white/10 pt-8"
            >
              <a
                href="mailto:info@omeles.com"
                className="text-white/50 hover:text-gold font-sans text-sm tracking-widest transition-colors duration-300"
              >
                info@omeles.com
              </a>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
