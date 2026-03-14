"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { sectors } from "@/data/sectors";
import SectorCard from "./SectorCard";

const filters = ["All", "Yachts", "Casinos", "Restaurants", "Hotels"];

export default function CategoryFilter() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? sectors
      : sectors.filter(
          (s) => s.title.toLowerCase() === active.toLowerCase()
        );

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-16">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActive(filter)}
            className={`px-6 py-2.5 text-xs font-sans uppercase tracking-widest border rounded-full transition-all duration-300 cursor-pointer ${
              active === filter
                ? "border-gold text-gold bg-gold/10"
                : "border-white/10 text-text-secondary hover:border-white/30 hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {filtered.map((sector, i) => (
          <SectorCard key={sector.id} sector={sector} index={i} />
        ))}
      </motion.div>
    </div>
  );
}
