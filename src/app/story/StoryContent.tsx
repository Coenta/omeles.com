"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionReveal from "@/components/SectionReveal";
import Float3D from "@/components/Float3D";

export default function StoryContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-start justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
          }}
        >
          <Image
            src="/images/home_store.png"
            alt="OMELES Story"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-white/40" />
        </div>

        <div className="relative z-10 max-w-[1000px] mx-auto px-6 md:px-12 text-center pt-40 md:pt-52 pb-32">
          <Float3D side="center" intensity={0.8}>
            <span className="text-gold text-xs font-sans uppercase tracking-widest mb-8 block">
              Our Story
            </span>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight mb-8 text-text-primary">
              Woven with Purpose —{" "}
              <em className="text-gold">United as One</em>
            </h1>
          </Float3D>
        </div>
      </section>

      {/* Main narrative */}
      <section className="py-24 md:py-40">
        <div className="max-w-[900px] mx-auto px-6 md:px-12">
          <SectionReveal side="left" intensity={0.8}>
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl leading-relaxed text-text-primary/85 mb-16">
              In ancient times, Athena — goddess of wisdom — was not only a
              strategist, but a maker. She understood that those who serve,
              organize, protect, and sustain daily life deserve more than
              visibility — they deserve{" "}
              <em className="text-gold">dignity, structure, and care.</em>
            </p>
          </SectionReveal>

          <SectionReveal delay={0.2} side="right" intensity={0.8}>
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl leading-relaxed text-text-primary/85 mb-16">
              Her craft was never only about fabric. It was about{" "}
              <em className="text-gold">
                preparation, protection, and foresight.
              </em>{" "}
              That same spirit shapes OMELES today.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.3} side="left" intensity={0.7}>
            <div className="border-l-2 border-gold pl-8 md:pl-12">
              <p className="text-text-secondary text-lg md:text-xl leading-relaxed italic">
                We don&apos;t just create products — we build systems that
                connect identity, materials, guidance, and protection. Each
                thread carries intention. Each solution is part of a larger
                whole.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Closing */}
      <section className="py-24 md:py-32 border-t border-black/[0.06]">
        <div className="max-w-[900px] mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <Float3D side="center" intensity={0.8}>
              <p className="font-serif text-3xl md:text-4xl lg:text-5xl text-gold italic">
                And thus, OMELES was born...
              </p>
            </Float3D>
          </motion.div>
        </div>
      </section>
    </>
  );
}
