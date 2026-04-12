"use client";

import { onAuthStateChanged } from "firebase/auth";
import { CircleUserRound, LogIn, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CartDrawer } from "@/components/cart";
import { Container, uiRound } from "@/components/ui";
import { useCart } from "@/context/CartContext";
import { auth } from "@/lib/firebase/firebase";

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
] as const;

function CartIconWithBadge({ count }: { count: number }) {
  return (
    <span className="relative inline-flex shrink-0">
      <ShoppingCart className="h-5 w-5" strokeWidth={1.5} aria-hidden />
      {count > 0 && (
        <span className={`absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center bg-red-600 px-0.5 text-[10px] font-semibold tabular-nums leading-none text-white ${uiRound}`}>
          {count > 99 ? "99+" : count}
        </span>
      )}
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const {
    totalQuantity,
    cartDrawerOpen,
    openCartDrawer,
    closeCartDrawer,
  } = useCart();

  const cartActive =
    pathname === "/cart" || pathname.startsWith("/cart/");
  const cartHighlighted = cartDrawerOpen || cartActive;
  const signInActive = pathname === "/sign-in";
  const isLoggedIn = Boolean(userEmail);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserName(user?.displayName ?? null);
      setUserEmail(user?.email ?? null);
      if (!user) {
        setProfileOpen(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!profileRef.current) {
        return;
      }
      if (!profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setProfileOpen(false);
    setMenuOpen(false);
  };

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

          <div className="hidden items-center gap-8 md:flex">
            <nav
              className="flex h-16 items-end"
              aria-label="Main"
            >
              <div className="flex gap-8 border-b border-stone-200/90">
                {mainLinks.map(({ href, label }) => {
                  const active =
                    href === "/"
                      ? pathname === "/"
                      : pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <Link
                      key={href}
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "-mb-px inline-flex items-center border-b-2 px-1 pb-3 pt-1 text-sm font-medium transition-colors",
                        active
                          ? "border-stone-900 text-stone-900"
                          : "border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-800",
                      ].join(" ")}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </nav>
            <button
              type="button"
              className={`-mr-1 inline-flex h-10 w-10 items-center justify-center ${uiRound} transition-colors ${
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
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                className={`inline-flex h-10 max-w-[12rem] items-center gap-2 px-3 transition-colors ${uiRound} ${
                  profileOpen
                    ? "text-stone-900"
                    : "text-stone-500 hover:text-stone-900"
                }`}
                aria-label="Profile"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((open) => !open)}
              >
                <CircleUserRound className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                {isLoggedIn ? (
                  <span className="max-w-[8rem] truncate text-sm">
                    {userName || "Profile"}
                  </span>
                ) : null}
              </button>
              {profileOpen ? (
                <div className={`absolute right-0 top-12 w-64 border border-stone-200 bg-white p-3 shadow-md ${uiRound}`}>
                  {isLoggedIn ? (
                    <>
                      <p className="truncate text-sm font-semibold text-stone-900">
                        {userName || "User"}
                      </p>
                      <p className="mt-1 truncate text-xs text-stone-500">
                        {userEmail || "-"}
                      </p>
                      <button
                        type="button"
                        className={`mt-3 w-full border border-stone-300 px-3 py-2 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-50 ${uiRound}`}
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/sign-in"
                      className={`block w-full border border-stone-300 px-3 py-2 text-center text-sm font-medium text-stone-800 transition-colors hover:bg-stone-50 ${uiRound}`}
                      onClick={() => setProfileOpen(false)}
                    >
                      Sign in
                    </Link>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center border border-stone-200 text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50 md:hidden ${uiRound}`}
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
              className="flex flex-col border-b border-stone-200/90"
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
                    aria-current={active ? "page" : undefined}
                    className={[
                      "-mb-px border-b-2 py-3 text-sm font-medium transition-colors first:pt-0",
                      active
                        ? "border-stone-900 text-stone-900"
                        : "border-transparent text-stone-500 hover:border-stone-200 hover:text-stone-800",
                    ].join(" ")}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                );
              })}
              <button
                type="button"
                className={`mt-1 flex w-full items-center gap-3 border-t border-stone-100 py-3 pt-4 text-left text-sm font-medium ${
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
                <span>Cart</span>
              </button>
              {isLoggedIn ? (
                <div className="py-3">
                  <div className="flex items-start gap-3 text-sm text-stone-900">
                    <CircleUserRound
                      className="mt-0.5 h-5 w-5 shrink-0"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{userName || "User"}</p>
                      <p className="truncate text-xs text-stone-500">
                        {userEmail || "-"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`mt-3 w-full border border-stone-300 px-3 py-2 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-50 ${uiRound}`}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  className={`flex items-center gap-3 py-3 text-sm ${
                    signInActive
                      ? "text-stone-900"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <LogIn className="h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden />
                  Sign in
                </Link>
              )}
            </nav>
          </Container>
        </div>
      </header>

      <CartDrawer open={cartDrawerOpen} onClose={closeCartDrawer} />
    </>
  );
}
