import type { Metadata } from "next";
import ClientContent from "./ClientContent";

export const metadata: Metadata = {
  title: "Client Portal — OMELES",
  description: "Explore OMELES services and solutions.",
};

export default function ClientPage() {
  return <ClientContent />;
}
