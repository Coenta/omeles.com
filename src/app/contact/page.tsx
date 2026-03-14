import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with OMELES — Let's bring performance, precision, and elegance to your professional world.",
};

export default function ContactPage() {
  return <ContactContent />;
}
