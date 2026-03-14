import type { Metadata } from "next";
import SolutionsContent from "./SolutionsContent";

export const metadata: Metadata = {
  title: "Textile Solutions",
  description:
    "Engineered for performance. Designed for identity. Premium textile solutions for yachts, casinos, restaurants, and hotels.",
};

export default function SolutionsPage() {
  return <SolutionsContent />;
}
