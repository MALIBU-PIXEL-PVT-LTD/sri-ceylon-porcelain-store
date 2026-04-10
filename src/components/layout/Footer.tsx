import { Container } from "@/components/ui";

type FooterColumn = {
  id: string;
  title?: string;
  links: readonly { href: string; label: string }[];
};

const footerColumns: readonly FooterColumn[] = [
  {
    id: "collections",
    title: "Collections",
    links: [
      { href: "#", label: "Category 1" },
      { href: "#", label: "Category 2" },
      { href: "#", label: "Category 3" },
    ],
  },
  { id: "reserved", title: undefined, links: [] },
  {
    id: "company",
    title: "Company",
    links: [
      { href: "#", label: "About" },
      { href: "#", label: "Vacancies" },
      { href: "#", label: "News" },
      { href: "#", label: "Testimonials" },
    ],
  },
  {
    id: "legal",
    title: "Legal Policies",
    links: [
      { href: "#", label: "Privacy" },
      { href: "#", label: "Terms & Conditions" },
      { href: "#", label: "Refunds & Returns" },
    ],
  },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558a5.797 5.797 0 002.126-1.384c.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.717-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.07 4.859-.07zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <svg
        viewBox="0 0 448 512"
        className="h-5 w-5 shrink-0"
        fill="currentColor"
        aria-hidden
        preserveAspectRatio="xMidYMid meet"
      >
        <path d="M448 209.91a210.13 210.13 0 0 1-122.77-39.18V349.38A162.56 162.56 0 1 1 185 188.31v89.89a74.89 74.89 0 1 0 52.23 71.18c 0 -.05 0 -.1 0 -.15V0h88a121.18 121.18 0 0 0 1.51 20.2A122.18 122.18 0 0 0 448 209.91z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
] as const;

const linkClass =
  "text-sm text-stone-600 transition-colors hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-stone-200 bg-white">
      <Container className="py-14 sm:py-16 lg:py-20">
        <div className="max-w-xl">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-stone-900 sm:text-xs">
            Sri Ceylon Porcelain
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-500">
            Fine tableware and porcelain, curated with a quiet, timeless
            sensibility.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3" aria-label="Social media">
            {socialLinks.map(({ label, href, icon }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-stone-600 transition-colors hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400"
                  aria-label={label}
                >
                  {icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav
          className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
          aria-label="Footer links"
        >
          {footerColumns.map((column) => (
            <div
              key={column.id}
              className={
                column.id === "reserved"
                  ? "hidden min-h-0 lg:block"
                  : "min-h-0"
              }
            >
              {column.title ? (
                <h2 className="text-sm font-semibold text-stone-900">
                  {column.title}
                </h2>
              ) : null}
              {column.links.length > 0 ? (
                <ul
                  className={
                    column.title ? "mt-4 space-y-3" : "mt-0 space-y-3"
                  }
                >
                  {column.links.map(({ href, label }) => (
                    <li key={label}>
                      <a href={href} className={linkClass}>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </nav>

        <div className="mt-14 border-t border-stone-200 pt-8 lg:mt-16">
          <p className="text-sm text-stone-600">
            © {year} Sri Ceylon Porcelain, Inc. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
