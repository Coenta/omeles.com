"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Float3D from "./Float3D";

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
  width?: "full" | "fit";
  side?: "left" | "right" | "center";
  intensity?: number;
  shadow?: boolean;
}

export default function SectionReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  width = "full",
  side = "center",
  intensity = 1,
  shadow = false,
}: SectionRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const initial = {
    opacity: 0,
    y: direction === "up" ? 80 : 0,
    x: direction === "left" ? -80 : direction === "right" ? 80 : 0,
  };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : initial}
      transition={{
        duration: 1.2,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`${width === "full" ? "w-full" : "w-fit"} ${className}`}
    >
      <Float3D side={side} intensity={intensity} shadow={shadow}>
        {children}
      </Float3D>
    </motion.div>
  );
}
