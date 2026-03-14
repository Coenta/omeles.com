"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionReveal from "@/components/SectionReveal";
import Float3D from "@/components/Float3D";

const blogPosts = [
  {
    id: "dusseldorf-boot-2026",
    title: "Düsseldorf Boot 2026",
    excerpt:
      "OMELES at the world's leading water sports trade fair — showcasing our latest maritime textile innovations and crew uniform collections.",
    date: "2026",
    category: "Events",
    images: [
      "/images/blog_IMG_3522.jpeg",
      "/images/blog_IMG_3530.jpeg",
      "/images/blog_IMG_3533.jpeg",
      "/images/blog_IMG_3539.jpeg",
      "/images/blog_IMG_3551.jpeg",
      "/images/blog_IMG_3561.jpeg",
      "/images/blog_IMG_3613.png",
    ],
  },
];

export default function BlogContent() {
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
                <em className="text-gold">Blog</em>
              </h1>
              <p className="text-text-secondary text-lg md:text-xl mt-6 max-w-xl">
                Insights, events, and stories from OMELES.
              </p>
            </div>
          </Float3D>
        </motion.div>

        {blogPosts.map((post) => (
          <SectionReveal key={post.id} side="center" intensity={0.8} shadow>
            <article className="border border-black/[0.06] rounded-lg overflow-hidden shadow-lg shadow-black/5">
              <div className="relative aspect-[21/9] overflow-hidden">
                <Image
                  src={post.images[0]}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                  <span className="text-xs font-sans uppercase tracking-widest text-gold border border-gold/40 px-3 py-1 rounded-full bg-white/90">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-10 bg-white">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-text-secondary text-sm">{post.date}</span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl mb-4 text-text-primary">
                  {post.title}
                </h2>
                <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-2xl mb-8">
                  {post.excerpt}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {post.images.slice(1).map((img, i) => (
                    <SectionReveal key={i} delay={i * 0.08} side={i % 2 === 0 ? "left" : "right"} intensity={0.7}>
                      <div className="relative aspect-square overflow-hidden rounded-lg border border-black/[0.06]">
                        <Image
                          src={img}
                          alt={`${post.title} ${i + 2}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </SectionReveal>
                  ))}
                </div>
              </div>
            </article>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}
