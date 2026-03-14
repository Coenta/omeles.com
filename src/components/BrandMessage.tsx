"use client";

import SectionReveal from "./SectionReveal";

export default function BrandMessage() {
  return (
    <section className="relative z-10 py-24 md:py-40 border-t border-black/[0.06]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <SectionReveal side="left" intensity={0.8}>
          <div className="max-w-4xl">
            <span className="text-text-secondary text-xs font-sans uppercase tracking-widest mb-8 block">
              Our Philosophy
            </span>
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl leading-relaxed text-text-primary/85">
              We create systems where identity, materials, guidance, and
              protection work together. Where design meets function. Where form
              meets responsibility.{" "}
              <em className="text-gold">
                Quiet, structured, and human-centered
              </em>{" "}
              — built not for display, but for real life.
            </p>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
