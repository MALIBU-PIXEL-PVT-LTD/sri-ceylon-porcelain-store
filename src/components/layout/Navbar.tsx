"use client";

import { onAuthStateChanged } from "firebase/auth";
import { ArrowRight, CircleDollarSign, CircleUserRound, ChevronDown, LogIn, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CartDrawer } from "@/components/cart";
import { Container, IconButton, uiRound } from "@/components/ui";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { auth } from "@/lib/firebase/firebase";
import { getCurrencyLabel, getCurrencySymbol } from "@/lib/currency";

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
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const currencyDesktopRef = useRef<HTMLDivElement | null>(null);
  const currencyMobileRef = useRef<HTMLDivElement | null>(null);
  const { currency, setCurrency, availableCurrencies } = useCurrency();
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
  const userInitials = (userName || userEmail || "U")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserName(user?.displayName ?? null);
      setUserEmail(user?.email ?? null);
      setUserPhoto(user?.photoURL ?? null);
      // Keep navbar state stable when auth status flips.
      setProfileOpen(false);
      setMenuOpen(false);
      setCurrencyOpen(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setProfileOpen(false);
    setCurrencyOpen(false);
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

  useEffect(() => {
    if (!currencyOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const insideDesktop = currencyDesktopRef.current?.contains(target) ?? false;
      const insideMobile = currencyMobileRef.current?.contains(target) ?? false;
      if (!insideDesktop && !insideMobile) {
        setCurrencyOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [currencyOpen]);

  const handleLogout = async () => {
    await auth.signOut();
    setProfileOpen(false);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-800/90 bg-zinc-950/90 text-zinc-100 backdrop-blur-md">
        <Container className="relative flex h-16 min-w-0 items-center justify-between gap-2 sm:gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 md:flex-none">
            <IconButton
              icon={
                menuOpen ? (
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
                )
              }
              className="border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800 md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="sr-only">Menu</span>
            </IconButton>
            <Link
              href="/"
              className="min-w-0 truncate text-[0.58rem] font-medium uppercase tracking-[0.2em] text-zinc-100 sm:text-[0.65rem] sm:tracking-[0.24em] md:shrink-0 md:text-xs md:tracking-[0.28em]"
              onClick={() => setMenuOpen(false)}
            >
              Sri Ceylon Porcelain
            </Link>
          </div>

          <nav
            className="absolute left-1/2 hidden h-16 -translate-x-1/2 items-end md:flex"
            aria-label="Main"
          >
            <div className="flex gap-8 border-b border-zinc-800/90">
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
                        ? "border-zinc-100 text-zinc-100"
                        : "border-transparent text-zinc-400 hover:border-zinc-500 hover:text-zinc-200",
                    ].join(" ")}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
            <IconButton
              icon={<CartIconWithBadge count={totalQuantity} />}
              className={`${
                cartHighlighted
                  ? "bg-zinc-800/80 text-zinc-100 hover:bg-zinc-800"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              }`}
              size="sm"
              aria-label={`Cart, ${totalQuantity} items`}
              aria-expanded={cartDrawerOpen}
              aria-controls="cart-drawer"
              onClick={openCartDrawer}
            />
            <div className="relative" ref={currencyDesktopRef}>
              <IconButton
                icon={
                  <span className="inline-flex items-center gap-0.5">
                    <span className="text-[12px] font-semibold leading-none">
                      {getCurrencySymbol(currency)}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${currencyOpen ? "rotate-180" : ""}`}
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </span>
                }
                className="w-10 h-10 px-0 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 active:bg-zinc-700 active:text-zinc-100"
                size="md"
                aria-label={`Currency selector (current: ${getCurrencyLabel(currency)})`}
                aria-haspopup="listbox"
                aria-expanded={currencyOpen}
                aria-controls="currency-listbox-desktop"
                onClick={() => {
                  setProfileOpen(false);
                  setCurrencyOpen((o) => !o);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setCurrencyOpen(false);
                }}
              />
              {currencyOpen ? (
                <div
                  id="currency-listbox-desktop"
                  role="listbox"
                  aria-label="Currency"
                  className="absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 shadow-lg"
                >
                  {availableCurrencies.map((opt) => {
                    const selected = opt.code === currency;
                    return (
                      <button
                        key={opt.code}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className={[
                          "block w-full px-3 py-2 text-left text-sm transition-colors",
                          selected
                            ? "bg-zinc-800 text-zinc-100"
                            : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100",
                        ].join(" ")}
                        onClick={() => {
                          setCurrency(opt.code);
                          setCurrencyOpen(false);
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                className={`inline-flex h-9 w-9 items-center justify-center transition-colors sm:h-10 sm:w-10 lg:w-auto lg:gap-2 lg:px-2.5 ${uiRound} ${
                  profileOpen
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                }`}
                aria-label="Profile"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((open) => !open)}
              >
                {isLoggedIn ? (
                  userPhoto ? (
                    <img
                      src={userPhoto}
                      alt={userName || "User profile"}
                      className={`h-7 w-7 shrink-0 object-cover ${uiRound}`}
                    />
                  ) : (
                    <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center bg-zinc-700 text-xs font-semibold text-zinc-100 ${uiRound}`}>
                      {userInitials}
                    </span>
                  )
                ) : (
                  <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center bg-zinc-700/60 ${uiRound}`}>
                    <CircleUserRound className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </span>
                )}
                {isLoggedIn ? (
                  <span className="hidden max-w-[8rem] truncate text-sm lg:block">
                    {userName || "Profile"}
                  </span>
                ) : null}
              </button>
              {profileOpen ? (
                <div className={`absolute right-0 top-12 w-64 border border-zinc-700 bg-zinc-900 p-3 shadow-md ${uiRound}`}>
                  {isLoggedIn ? (
                    <>
                      <p className="truncate text-sm font-semibold text-zinc-100">
                        {userName || "User"}
                      </p>
                      <p className="mt-1 truncate text-xs text-zinc-400">
                        {userEmail || "-"}
                      </p>
                      <button
                        type="button"
                        className={`mt-3 inline-flex w-full items-center justify-center gap-2 border border-zinc-600 px-3 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-800 ${uiRound}`}
                        onClick={handleLogout}
                      >
                        <span>Log Out</span>
                        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/sign-in"
                      className={`inline-flex w-full items-center justify-center gap-2 border border-zinc-600 px-3 py-2 text-center text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-800 ${uiRound}`}
                      onClick={() => setProfileOpen(false)}
                    >
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                    </Link>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </Container>

        <div
          id="mobile-nav"
          className={`border-t border-zinc-800/90 bg-zinc-950/95 backdrop-blur-md md:hidden ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <Container className="py-4">
            <nav
              className="flex flex-col border-b border-zinc-800/90"
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
                        ? "border-zinc-100 text-zinc-100"
                        : "border-transparent text-zinc-400 hover:border-zinc-600 hover:text-zinc-200",
                    ].join(" ")}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                );
              })}
              <button
                type="button"
                className={`mt-1 flex w-full items-center gap-3 border-t border-zinc-800 py-3 pt-4 text-left text-sm font-medium ${
                  cartHighlighted
                    ? "text-zinc-100"
                    : "text-zinc-400 hover:text-zinc-100"
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
              <div className="relative" ref={currencyMobileRef}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-3 text-left text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 active:bg-zinc-700"
                  aria-label={`Currency selector (current: ${getCurrencyLabel(currency)})`}
                  aria-haspopup="listbox"
                  aria-expanded={currencyOpen}
                  aria-controls="currency-listbox-mobile"
                  onClick={() => {
                    setProfileOpen(false);
                    setCurrencyOpen((o) => !o);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setCurrencyOpen(false);
                  }}
                >
                  <span className="inline-flex items-center gap-3">
                    <CircleDollarSign className="h-6 w-6 shrink-0" strokeWidth={1.5} aria-hidden />
                    <span>Currency</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="text-sm font-semibold">{getCurrencySymbol(currency)}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${currencyOpen ? "rotate-180" : ""}`}
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </span>
                </button>
                {currencyOpen ? (
                  <div
                    id="currency-listbox-mobile"
                    role="listbox"
                    aria-label="Currency"
                    className="absolute left-0 right-0 top-[100%] z-50 mt-2 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 shadow-lg"
                  >
                    {availableCurrencies.map((opt) => {
                      const selected = opt.code === currency;
                      return (
                        <button
                          key={opt.code}
                          type="button"
                          role="option"
                          aria-selected={selected}
                          className={[
                            "block w-full px-3 py-2 text-left text-sm transition-colors",
                            selected
                              ? "bg-zinc-800 text-zinc-100"
                              : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100",
                          ].join(" ")}
                          onClick={() => {
                            setCurrency(opt.code);
                            setCurrencyOpen(false);
                            setMenuOpen(false);
                          }}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
              {isLoggedIn ? (
                <div className="py-3">
                  <div className="flex items-start gap-3 text-sm text-zinc-100">
                    {userPhoto ? (
                      <img
                        src={userPhoto}
                        alt={userName || "User profile"}
                        className={`mt-0.5 h-7 w-7 shrink-0 object-cover ${uiRound}`}
                      />
                    ) : (
                      <span className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center bg-zinc-700 text-xs font-semibold text-zinc-100 ${uiRound}`}>
                        {userInitials}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium">{userName || "User"}</p>
                      <p className="truncate text-xs text-zinc-400">
                        {userEmail || "-"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`mt-3 inline-flex w-full items-center justify-center gap-2 border border-zinc-600 px-3 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-800 ${uiRound}`}
                    onClick={handleLogout}
                  >
                    <span>Log Out</span>
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                  </button>
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  className={`flex items-center gap-2 py-3 text-sm ${
                    signInActive
                      ? "text-zinc-100"
                      : "text-zinc-400 hover:text-zinc-100"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>Sign In</span>
                  <LogIn className="h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden />
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
