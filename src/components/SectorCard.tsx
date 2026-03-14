"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Sector } from "@/data/sectors";
import Float3D from "./Float3D";

interface SectorCardProps {
  sector: Sector;
  index: number;
}

export default function SectorCard({ sector, index }: SectorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 1,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Float3D side={index < 2 ? "left" : "right"} intensity={0.8} shadow>
        <Link
          href={`/solutions/${sector.slug}`}
          className="group block relative"
        >
          <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-lg border border-black/[0.06] shadow-lg shadow-black/5">
            <Image
              src={sector.image}
              alt={sector.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />

            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-20">
              <h3 className="font-serif text-3xl md:text-4xl text-white mb-2">
                {sector.title}
              </h3>
              <p className="text-gold text-sm font-sans mb-4">{sector.tagline}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {sector.categories.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs font-sans uppercase tracking-wider text-white/70 border border-white/20 px-3 py-1 rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-white/70 group-hover:text-gold transition-colors duration-300">
                <span className="text-xs font-sans uppercase tracking-widest">
                  Discover
                </span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </Float3D>
    </motion.div>
  );
}
