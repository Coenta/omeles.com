"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { sectors } from "@/data/sectors";
import SectorCard from "./SectorCard";

const solutionTypes = ["All", "Visual Identity Creation", "Uniform & Textile Sourcing"];
const sectors_ = ["All", "Yachts", "Casinos", "Restaurants", "Hotels"];

// Map solution types to relevant services keywords
const solutionKeywords: Record<string, string[]> = {
  "Visual Identity Creation": ["embroidery", "logo", "branding", "brand", "labeling", "label", "colorway", "identity"],
  "Uniform & Textile Sourcing": ["uniform", "fabric", "textile", "linen", "towel", "bedding", "napkin", "sheet"],
};

export default function CategoryFilter() {
  const [activeSolution, setActiveSolution] = useState("All");
  const [activeSector, setActiveSector] = useState("All");

  const filtered = sectors.filter((s) => {
    const sectorMatch = activeSector === "All" || s.title.toLowerCase() === activeSector.toLowerCase();
    const solutionMatch =
      activeSolution === "All" ||
      s.services.some((svc) =>
        solutionKeywords[activeSolution]?.some((kw) => svc.toLowerCase().includes(kw))
      );
    return sectorMatch && solutionMatch;
  });

  return (
    <div>
      {/* Solution type tabs */}
      <div className="mb-8">
        <span className="text-text-secondary text-[10px] font-sans uppercase tracking-widest block mb-4">
          Solution Type
        </span>
        <div className="flex flex-wrap gap-3">
          {solutionTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveSolution(type)}
              className={`px-6 py-2.5 text-xs font-sans uppercase tracking-widest border transition-all duration-300 cursor-pointer ${
                activeSolution === type
                  ? "border-gold text-gold bg-gold/10"
                  : "border-black/10 text-text-secondary hover:border-black/30 hover:text-text-primary"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Sector filters */}
      <div className="flex flex-wrap gap-3 mb-16">
        <span className="text-text-secondary text-[10px] font-sans uppercase tracking-widest self-center mr-2">
          Sector
        </span>
        {sectors_.map((sector) => (
          <button
            key={sector}
            onClick={() => setActiveSector(sector)}
            className={`px-6 py-2.5 text-xs font-sans uppercase tracking-widest border rounded-full transition-all duration-300 cursor-pointer ${
              activeSector === sector
                ? "border-gold text-gold bg-gold/10"
                : "border-black/10 text-text-secondary hover:border-black/30 hover:text-text-primary"
            }`}
          >
            {sector}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((sector, i) => (
          <SectorCard key={sector.id} sector={sector} index={i} />
        ))}
      </motion.div>
    </div>
  );
}
