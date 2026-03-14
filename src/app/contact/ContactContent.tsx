"use client";

import { motion } from "framer-motion";
import ContactForm from "@/components/ContactForm";
import SectionReveal from "@/components/SectionReveal";
import Float3D from "@/components/Float3D";

const contactInfo = [
  {
    label: "Company",
    value: "OMELES Hospitality Brand Creation",
  },
  {
    label: "Address",
    value:
      "Hüseyinağa Mahallesi, İstiklal Caddesi 56/58, Grand Pera E-Ofis, Beyoğlu/İstanbul, Türkiye",
  },
  {
    label: "Email",
    value: "info@omeles.com",
    href: "mailto:info@omeles.com",
  },
  {
    label: "WhatsApp",
    value: "+90 531 923 22 62",
    href: "https://wa.me/905319232262",
  },
  {
    label: "Working Hours",
    value: "Monday – Friday, 09:00 – 17:00",
  },
];

export default function ContactContent() {
  return (
    <section className="pt-32 pb-24 md:pt-44 md:pb-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: "-30vh", rotateX: 15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 2.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 md:mb-28"
        >
          <Float3D side="left" intensity={0.8}>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight text-text-primary">
              Stay <em className="text-gold">connected...</em>
            </h1>
            <p className="text-text-secondary text-lg md:text-xl mt-6 max-w-xl">
              Let&apos;s bring performance, precision, and elegance to your
              professional world.
            </p>
          </Float3D>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <SectionReveal side="left" intensity={0.8}>
              <div className="space-y-8">
                {contactInfo.map((item) => (
                  <div key={item.label}>
                    <span className="text-text-secondary text-xs font-sans uppercase tracking-widest block mb-2">
                      {item.label}
                    </span>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={
                          item.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          item.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="text-text-primary text-base md:text-lg hover:text-gold transition-colors duration-300"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-text-primary text-base md:text-lg">
                        {item.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>

          <div>
            <SectionReveal side="right" delay={0.15} intensity={0.8}>
              <ContactForm />
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
