"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message. We will get back to you shortly.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-xs font-sans uppercase tracking-widest text-text-secondary mb-3"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          className="w-full bg-transparent border-b border-black/15 focus:border-gold py-3 text-text-primary outline-none transition-colors duration-300 text-base"
          placeholder="Your name"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-xs font-sans uppercase tracking-widest text-text-secondary mb-3"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          className="w-full bg-transparent border-b border-black/15 focus:border-gold py-3 text-text-primary outline-none transition-colors duration-300 text-base"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-xs font-sans uppercase tracking-widest text-text-secondary mb-3"
        >
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, message: e.target.value }))
          }
          className="w-full bg-transparent border-b border-black/15 focus:border-gold py-3 text-text-primary outline-none transition-colors duration-300 resize-none text-base"
          placeholder="Tell us about your project..."
        />
      </div>

      <button
        type="submit"
        className="mt-4 px-10 py-4 border border-gold text-gold font-sans text-xs uppercase tracking-widest hover:bg-gold hover:text-white transition-all duration-500"
      >
        Send Message
      </button>
    </motion.form>
  );
}
