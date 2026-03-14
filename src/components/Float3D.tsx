"use client";

import { useRef, useEffect } from "react";
import { getGlobalMouse } from "@/hooks/useGlobalMouse";

interface Float3DProps {
  children: React.ReactNode;
  className?: string;
  side?: "left" | "right" | "center";
  intensity?: number;
  shadow?: boolean;
}

export default function Float3D({
  children,
  className = "",
  side = "center",
  intensity = 1,
  shadow = false,
}: Float3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  const baseRotateY = side === "left" ? 6 : side === "right" ? -6 : 0;

  useEffect(() => {
    const mouse = getGlobalMouse();

    const animate = () => {
      if (ref.current) {
        const offX = mouse.smoothX - 0.5;
        const offY = mouse.smoothY - 0.5;

        const rotY = baseRotateY + offX * 10 * intensity;
        const rotX = 1.5 + -offY * 6 * intensity;
        const tX = offX * -20 * intensity;
        const tY = offY * -12 * intensity;
        const tZ = -(Math.abs(offX) + Math.abs(offY)) * 8 * intensity;

        ref.current.style.transform = `
          perspective(900px)
          translate3d(${tX}px, ${tY}px, ${tZ}px)
          rotateY(${rotY}deg)
          rotateX(${rotX}deg)
        `;

        if (shadow) {
          const sX = offX * 25 * intensity;
          const sY = offY * 20 * intensity;
          const sBlur = 30 + (Math.abs(offX) + Math.abs(offY)) * 40 * intensity;
          const sAlpha = 0.06 + (Math.abs(offX) + Math.abs(offY)) * 0.08 * intensity;

          ref.current.style.boxShadow = `
            ${sX}px ${sY}px ${sBlur}px -5px rgba(0,0,0,${sAlpha}),
            ${sX * 0.3}px ${sY * 0.3}px ${sBlur * 0.4}px 0px rgba(0,0,0,${sAlpha * 0.5})
          `;
        }
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [baseRotateY, intensity, shadow]);

  return (
    <div
      ref={ref}
      className={`will-change-transform ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
        borderRadius: "inherit",
      }}
    >
      {children}
    </div>
  );
}
