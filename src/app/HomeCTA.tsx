"use client";

import Link from "next/link";
import Image from "next/image";
import SectionReveal from "@/components/SectionReveal";

export default function HomeCTA() {
  return (
    <section className="relative z-10 py-24 md:py-32 border-t border-black/[0.06]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SectionReveal delay={0} side="left" intensity={0.8} shadow>
            <Link href="/story" className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-black/[0.06] shadow-lg shadow-black/5">
                <Image
                  src="/images/visual_identity.png"
                  alt="Our Story"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 h-[40%]" style={{ background: "linear-gradient(to top, transparent, rgba(0,0,0,0.1))" }} />
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                  <span className="text-white/60 text-xs font-sans uppercase tracking-widest mb-3">
                    Our Story
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-white mb-3">
                    Woven with Purpose —{" "}
                    <em className="text-gold">United as One</em>
                  </h3>
                  <p className="text-white/60 text-sm max-w-md">
                    Discover the philosophy and heritage behind OMELES.
                  </p>
                </div>
              </div>
            </Link>
          </SectionReveal>

          <SectionReveal delay={0.15} side="right" intensity={0.8} shadow>
            <Link href="/contact" className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-black/[0.06] bg-surface shadow-lg shadow-black/5">
                <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-10">
                  <span className="text-text-secondary text-xs font-sans uppercase tracking-widest mb-3">
                    Get in Touch
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-text-primary mb-4">
                    Let&apos;s build something{" "}
                    <em className="text-gold">exceptional</em>
                  </h3>
                  <p className="text-text-secondary text-sm max-w-md mb-6">
                    Bring performance, precision, and elegance to your
                    professional world.
                  </p>
                  <div className="flex items-center gap-2 text-gold text-xs font-sans uppercase tracking-widest group-hover:gap-3 transition-all duration-300">
                    <span>Contact Us</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
