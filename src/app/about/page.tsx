import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About",
  description:
    "Vision, Mission, and the philosophy behind OMELES — integrated solutions for identity, textiles, guidance, and assurance.",
};

export default function AboutPage() {
  return <AboutContent />;
}
