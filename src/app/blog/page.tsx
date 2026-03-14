import type { Metadata } from "next";
import BlogContent from "./BlogContent";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights and stories from OMELES — hospitality, maritime, and textile innovation.",
};

export default function BlogPage() {
  return <BlogContent />;
}
