"use client";

import { sectors } from "@/data/sectors";
import SectorCard from "./SectorCard";
import SectionReveal from "./SectionReveal";

export default function SectorGrid() {
  return (
    <section className="relative z-10 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <SectionReveal side="left" intensity={0.8}>
          <div className="mb-16">
            <span className="text-text-secondary text-xs font-sans uppercase tracking-widest">
              Industries We Serve
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mt-4 text-text-primary">
              Textile <em className="text-gold">Solutions</em>
            </h2>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectors.map((sector, i) => (
            <SectorCard key={sector.id} sector={sector} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
