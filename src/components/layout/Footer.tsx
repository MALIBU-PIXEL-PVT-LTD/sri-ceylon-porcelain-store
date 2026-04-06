import Link from "next/link";

import { Container } from "@/components/ui";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-stone-200/90 bg-white/60">
      <Container className="py-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-stone-900 sm:text-xs">
              Sri Ceylon Porcelain
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-500">
              Fine tableware and porcelain, curated with a quiet, timeless
              sensibility.
            </p>
          </div>

          <nav
            className="flex flex-wrap gap-x-8 gap-y-2"
            aria-label="Footer"
          >
            {footerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-stone-500 transition-colors hover:text-stone-900"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-stone-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-stone-400">
            © {year} Sri Ceylon Porcelain. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
