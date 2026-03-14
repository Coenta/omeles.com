import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fafafa",
        surface: "#f0f0f0",
        gold: "#b8945f",
        "gold-dark": "#9a7a4a",
        "text-primary": "#1a1a1a",
        "text-secondary": "#777777",
        border: "rgba(0,0,0,0.08)",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.2em",
      },
    },
  },
  plugins: [],
};
export default config;
