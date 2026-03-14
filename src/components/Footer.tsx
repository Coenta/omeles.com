import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-black/[0.06] bg-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-1">
            <Link href="/">
              <Image
                src="/images/omeles_logo.png"
                alt="OMELES"
                width={120}
                height={40}
                className="h-8 w-auto mb-6"
              />
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed">
              Beyond Products.
              <br />
              Into Operations.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                ["Home", "/"],
                ["Solutions", "/solutions"],
                ["About", "/about"],
                ["Story", "/story"],
                ["Blog", "/blog"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-text-primary/70 hover:text-gold text-sm transition-colors duration-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-6">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-text-primary/70">
              <li>
                <a
                  href="mailto:info@omeles.com"
                  className="hover:text-gold transition-colors duration-300"
                >
                  info@omeles.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/905319232262"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors duration-300"
                >
                  +90 531 923 22 62
                </a>
              </li>
              <li className="leading-relaxed">
                İstiklal Caddesi 56/58,
                <br />
                Beyoğlu/İstanbul
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-6">
              Working Hours
            </h4>
            <p className="text-sm text-text-primary/70 mb-8">
              Monday – Friday
              <br />
              09:00 – 17:00
            </p>
            <h4 className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-4">
              Follow Us
            </h4>
            <div className="flex gap-4">
              {["LinkedIn", "Instagram"].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="text-sm text-text-primary/70 hover:text-gold transition-colors duration-300"
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-black/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-secondary text-xs">
            &copy; {new Date().getFullYear()} OMELES. All rights reserved.
          </p>
          <Link
            href="#"
            className="text-text-secondary hover:text-text-primary text-xs transition-colors duration-300"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
