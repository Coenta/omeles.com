import type { Metadata } from "next";
import StoryContent from "./StoryContent";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Woven with Purpose — United as One. The philosophy and heritage behind OMELES.",
};

export default function StoryPage() {
  return <StoryContent />;
}
