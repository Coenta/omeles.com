"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionReveal from "@/components/SectionReveal";
import Float3D from "@/components/Float3D";

const sections = [
  {
    label: "Vision",
    title: "To unlock Brand",
    titleAccent: "performance.",
    description:
      "We envision a future where service operations are supported through integrated systems, not isolated solutions. OMELES begins with identity, continues through textile solutions, provides advisory support, and connects with insurance solutions for protection and resilience.",
    image: "/images/vision_background.png",
  },
  {
    label: "Mission",
    title: "Head-to-toe organic",
    titleAccent: "thinking!",
    description:
      "At OMELES, our mission is to foster innovation, responsibility, and meaningful change through a holistic way of thinking that connects identity, operations, and protection.",
    image: "/images/mission_background.png",
  },
  {
    label: "Why OMELES",
    title: "Long-term resilience and collective",
    titleAccent: "well-being",
    description:
      "OMELES offers integrated solutions that bring together identity, textiles, guidance, and assurance within a single structured system. We are not simply a provider of products, but a partner in building a long-term, responsible way of operating.",
    image: "/images/why_omeles_background.png",
  },
];

export default function AboutContent() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-44 md:pb-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: "-30vh", rotateX: 15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 2.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Float3D side="left" intensity={0.8}>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight text-text-primary">
                About <em className="text-gold">OMELES</em>
              </h1>
              <p className="text-text-secondary text-lg md:text-xl mt-6 max-w-2xl">
                Identity. Textiles. Guidance. Assurance. A system designed for
                service excellence.
              </p>
            </Float3D>
          </motion.div>
        </div>
      </section>

      {/* Sections */}
      {sections.map((section, i) => (
        <section
          key={section.label}
          className={`py-24 md:py-32 ${
            i > 0 ? "border-t border-black/[0.06]" : ""
          }`}
        >
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <SectionReveal delay={0.1} side={i % 2 === 1 ? "right" : "left"} intensity={0.8}>
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <span className="text-gold text-xs font-sans uppercase tracking-widest mb-6 block">
                    {section.label}
                  </span>
                  <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl leading-tight mb-8 text-text-primary">
                    {section.title}{" "}
                    <em className="text-gold">{section.titleAccent}</em>
                  </h2>
                  <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-xl">
                    {section.description}
                  </p>
                </div>
              </SectionReveal>

              <SectionReveal delay={0.3} side={i % 2 === 1 ? "left" : "right"} intensity={0.8} shadow>
                <div
                  className={`relative aspect-[4/3] overflow-hidden rounded-lg border border-black/[0.06] shadow-lg shadow-black/5 ${
                    i % 2 === 1 ? "lg:order-1" : ""
                  }`}
                >
                  <Image
                    src={section.image}
                    alt={section.label}
                    fill
                    className="object-cover"
                  />
                </div>
              </SectionReveal>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
