"use client";

import { motion } from "framer-motion";
import CategoryFilter from "@/components/CategoryFilter";
import Float3D from "@/components/Float3D";

export default function SolutionsContent() {
  return (
    <section className="pt-32 pb-24 md:pt-44 md:pb-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: "-30vh", rotateX: 15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 2.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Float3D side="left" intensity={0.8}>
            <div className="mb-16 md:mb-20">
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight text-text-primary">
                Textile <em className="text-gold">Solutions</em>
              </h1>
              <p className="text-text-secondary text-lg md:text-xl mt-6 max-w-xl">
                Engineered for performance. Designed for identity.
              </p>
            </div>
          </Float3D>
        </motion.div>

        <CategoryFilter />
      </div>
    </section>
  );
}
