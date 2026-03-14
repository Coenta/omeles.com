"use client";

import { motion } from "framer-motion";
import Float3D from "./Float3D";

interface ServiceListProps {
  services: string[];
}

export default function ServiceList({ services }: ServiceListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map((service, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.8,
            delay: i * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Float3D side={i % 2 === 0 ? "left" : "right"} intensity={0.7} shadow>
            <div className="flex items-start gap-4 p-5 border border-black/[0.06] rounded-lg hover:border-gold/30 transition-colors duration-300 group bg-white shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0 group-hover:scale-125 transition-transform duration-300" />
              <p className="text-text-primary/80 text-sm md:text-base leading-relaxed">
                {service}
              </p>
            </div>
          </Float3D>
        </motion.div>
      ))}
    </div>
  );
}
