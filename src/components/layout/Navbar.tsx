"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { CartDrawer } from "@/components/cart";
import { Container } from "@/components/ui";
import { useCart } from "@/context/CartContext";

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
] as const;

function CartIconWithBadge({ count }: { count: number }) {
  return (
    <span className="relative inline-flex shrink-0">
      <ShoppingCart className="h-5 w-5" strokeWidth={1.5} aria-hidden />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-0.5 text-[10px] font-semibold tabular-nums leading-none text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    totalQuantity,
    cartDrawerOpen,
    openCartDrawer,
    closeCartDrawer,
  } = useCart();

  const cartActive =
    pathname === "/cart" || pathname.startsWith("/cart/");
  const cartHighlighted = cartDrawerOpen || cartActive;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-stone-200/90 bg-white/85 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between gap-6">
          <Link
            href="/"
            className="shrink-0 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-stone-900 sm:text-xs"
            onClick={() => setMenuOpen(false)}
          >
            Sri Ceylon Porcelain
          </Link>

          <nav
            className="hidden items-center gap-10 md:flex"
            aria-label="Main"
          >
            {mainLinks.map(({ href, label }) => {
              const active =
                href === "/"
                  ? pathname === "/"
                  : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm transition-colors ${
                    active
                      ? "text-stone-900"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <button
              type="button"
              className={`relative -mr-1 inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors ${
                cartHighlighted
                  ? "text-stone-900"
                  : "text-stone-500 hover:text-stone-900"
              }`}
              aria-label={`Cart, ${totalQuantity} items`}
              aria-expanded={cartDrawerOpen}
              aria-controls="cart-drawer"
              onClick={openCartDrawer}
            >
              <CartIconWithBadge count={totalQuantity} />
            </button>
          </nav>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="sr-only">Menu</span>
            {menuOpen ? (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </Container>

        <div
          id="mobile-nav"
          className={`border-t border-stone-200/90 bg-white/95 backdrop-blur-md md:hidden ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <Container className="py-4">
            <nav
              className="flex flex-col divide-y divide-stone-100"
              aria-label="Mobile"
            >
              {mainLinks.map(({ href, label }) => {
                const active =
                  href === "/"
                    ? pathname === "/"
                    : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`block py-3 text-sm ${
                      active
                        ? "text-stone-900"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                );
              })}
              <button
                type="button"
                className={`flex w-full items-center py-3 text-left text-sm ${
                  cartHighlighted
                    ? "text-stone-900"
                    : "text-stone-500 hover:text-stone-900"
                }`}
                aria-label={`Cart, ${totalQuantity} items`}
                aria-expanded={cartDrawerOpen}
                aria-controls="cart-drawer"
                onClick={() => {
                  openCartDrawer();
                  setMenuOpen(false);
                }}
              >
                <CartIconWithBadge count={totalQuantity} />
              </button>
            </nav>
          </Container>
        </div>
      </header>

      <CartDrawer open={cartDrawerOpen} onClose={closeCartDrawer} />
    </>
  );
}
