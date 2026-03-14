export interface Sector {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  categories: string[];
  services: string[];
  image: string;
  featured: boolean;
}

export const sectors: Sector[] = [
  {
    id: "yachts",
    title: "Yachts",
    slug: "yachts",
    tagline: "From crew to suit",
    description:
      "In the refined world of superyachts and mega yachts, OMELES delivers tailored uniform and textile solutions that reflect luxury, functionality, and performance. From bridge to bow, our advanced garments and intelligent onboard textiles ensure elevated aesthetics, ergonomic comfort, and technical excellence.",
    categories: ["Uniforms", "Smart Textiles", "Crew Fittings"],
    services: [
      "High-performance crew uniforms (breathable, quick-dry, UV-protective)",
      "Stain-repellent & non-iron fabrics",
      "Lightweight and fast-drying towels and bedding",
      "Embroidery & logo personalization",
      "Crew-specific fittings and modular collections",
      "Smart layering options for changing climates",
      "Linen sets for fast turnover and durability",
      "Onboard delivery & consultation",
      "Fabric intelligence & textile R&D",
    ],
    image: "/images/yachts.png",
    featured: true,
  },
  {
    id: "casinos",
    title: "Casinos",
    slug: "casinos",
    tagline: "Luxury in every deal",
    description:
      "In the high-stakes atmosphere of casinos, every detail reflects excellence. OMELES provides tailored uniforms and intelligent textiles engineered for long shifts, elegant appearances, and seamless movement.",
    categories: ["Staff Collections", "Table Lining", "Brand Accessories"],
    services: [
      "Tailor-made collections for croupiers, hosts, security, VIP staff",
      "Luxurious yet breathable fabrics (stain & odor resistant)",
      "Ergonomic cuts for long shifts",
      "Quick-dry, non-iron materials",
      "Gender-inclusive silhouettes",
      "Embroidery and logo design",
      "Custom play table lining",
      "Seasonal capsule updates",
      "Coordinated accessories with casino branding",
    ],
    image: "/images/casinos.png",
    featured: true,
  },
  {
    id: "restaurants",
    title: "Restaurants",
    slug: "restaurants",
    tagline: "Refined Function, Elevated Service",
    description:
      "From the heat of the kitchen to the elegance of fine dining, our garments are crafted to enhance mobility, hygiene, and professional identity.",
    categories: ["Chefwear", "Service Uniforms", "Table Linens"],
    services: [
      "Chefwear and service uniforms (custom cut & fit)",
      "Heat-resistant, breathable, stain-repellent fabrics",
      "Ergonomic designs for active teams",
      "Aprons, jackets, shirts, pants with branding",
      "Wrinkle-free and quick-dry technologies",
      "Anti-bacterial, odor-control finishes",
      "Sustainable and long-life fabrics",
      "Easy-wash napkins, table linens, towel sets",
      "Smart textile R&D (franchise chains)",
      "Full customization: embroidery, labels, colorway",
    ],
    image: "/images/restaurants.png",
    featured: true,
  },
  {
    id: "hotels",
    title: "Hotels",
    slug: "hotels",
    tagline: "Elegant Durability, Smart Utility",
    description:
      "OMELES provides premium hospitality textiles and staffwear designed with advanced performance fabrics and smart functional finishes.",
    categories: ["Staff Uniforms", "Bed Linens", "Towels & Textiles"],
    services: [
      "Smart performance hotel staff uniforms",
      "Custom-tailored fit and function designs",
      "Wrinkle-free, quick-dry, breathable fabrics",
      "Sustainable material choices",
      "Bed linen and duvet cover sets",
      "Quick-dry sheet systems",
      "High-quality functional towels",
      "Anti-bacterial and odor-control finishes",
      "Intelligent textiles for high-frequency use",
      "Custom branding, embroidery & labeling",
    ],
    image: "/images/hotels.png",
    featured: true,
  },
];

export function getSectorBySlug(slug: string): Sector | undefined {
  return sectors.find((s) => s.slug === slug);
}
