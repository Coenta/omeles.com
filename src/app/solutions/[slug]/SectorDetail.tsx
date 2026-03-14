"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Sector } from "@/data/sectors";
import ServiceList from "@/components/ServiceList";
import SectionReveal from "@/components/SectionReveal";
import Float3D from "@/components/Float3D";

interface SectorDetailProps {
  sector: Sector;
}

function formatTagline(tagline: string) {
  const words = tagline.split(" ");
  const lastWord = words.pop();
  return (
    <>
      {words.join(" ")} <em className="text-gold">{lastWord}</em>
    </>
  );
}

export default function SectorDetail({ sector }: SectorDetailProps) {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden flex items-end">
        <div
          className="absolute inset-0 z-0"
          style={{
            maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
          }}
        >
          <Image
            src={sector.image}
            alt={sector.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-white/30" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full pb-16 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: "-30vh", rotateX: 15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Float3D side="left" intensity={0.8}>
              <Link
                href="/solutions"
                className="text-text-secondary text-xs font-sans uppercase tracking-widest mb-6 block hover:text-gold transition-colors duration-300"
              >
                &larr; Solutions
              </Link>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight mb-4 text-text-primary">
                {formatTagline(sector.tagline)}
              </h1>
              <div className="flex flex-wrap gap-2 mt-6">
                {sector.categories.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs font-sans uppercase tracking-wider text-text-secondary border border-black/10 px-4 py-1.5 rounded-full bg-white/80"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </Float3D>
          </motion.div>
        </div>
      </section>

      {/* Description */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <SectionReveal side="left" intensity={0.8}>
            <p className="font-serif text-xl md:text-2xl lg:text-3xl leading-relaxed text-text-primary/80 max-w-4xl">
              {sector.description}
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Services */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <SectionReveal side="left" intensity={0.8}>
            <div className="mb-12">
              <span className="text-text-secondary text-xs font-sans uppercase tracking-widest">
                What We Offer
              </span>
              <h2 className="font-serif text-3xl md:text-4xl mt-4 text-text-primary">
                Our <em className="text-gold">Services</em>
              </h2>
            </div>
          </SectionReveal>

          <ServiceList services={sector.services} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 border-t border-black/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <SectionReveal intensity={0.8}>
            <h2 className="font-serif text-3xl md:text-5xl mb-6 text-text-primary">
              Ready to elevate your{" "}
              <em className="text-gold">{sector.title.toLowerCase()}</em>?
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto mb-10">
              Let&apos;s discuss how OMELES can transform your textile and
              uniform solutions.
            </p>
            <Link
              href="/contact"
              className="inline-block px-10 py-4 border border-gold text-gold font-sans text-xs uppercase tracking-widest hover:bg-gold hover:text-white transition-all duration-500"
            >
              Get in Touch
            </Link>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
