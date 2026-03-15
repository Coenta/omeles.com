import type { Metadata } from "next";
import FabricDemoContent from "./FabricDemoContent";

export const metadata: Metadata = {
  title: "Fabric Demo — OMELES",
  description: "Interactive fabric canvas demo.",
};

export default function FabricDemoPage() {
  return <FabricDemoContent />;
}
