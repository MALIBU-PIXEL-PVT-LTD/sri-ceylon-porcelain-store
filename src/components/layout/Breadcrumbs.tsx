"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useProductBreadcrumbTitle } from "@/context/ProductBreadcrumbContext";

const SEGMENT_LABELS: Record<string, string> = {
  products: "Products",
  cart: "Cart",
  checkout: "Checkout",
  "sign-in": "Sign in",
};

function formatSlugLabel(segment: string) {
  try {
    const decoded = decodeURIComponent(segment);
    return decoded
      .split("-")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  } catch {
    return segment;
  }
}

function labelForSegment(
  segment: string,
  index: number,
  segments: string[]
): string {
  const mapped = SEGMENT_LABELS[segment];
  if (mapped) return mapped;
  if (index > 0 && segments[index - 1] === "products") {
    return formatSlugLabel(segment);
  }
  return formatSlugLabel(segment);
}

export function Breadcrumbs() {
  const pathname = usePathname() ?? "/";
  const { productDetailTitle } = useProductBreadcrumbTitle();

  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const crumbs: { href: string; label: string; current: boolean }[] = [
    { href: "/", label: "Home", current: false },
  ];

  let pathAcc = "";
  for (let i = 0; i < segments.length; i++) {
    pathAcc += `/${segments[i]}`;
    const isLast = i === segments.length - 1;
    const isProductDetail =
      isLast &&
      segments[0] === "products" &&
      segments.length === 2 &&
      productDetailTitle;
    crumbs.push({
      href: pathAcc,
      label: isProductDetail
        ? productDetailTitle
        : labelForSegment(segments[i], i, segments),
      current: isLast,
    });
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-y-1 text-sm text-stone-500">
        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex items-center">
            {crumb.href !== "/" ? (
              <ChevronRight
                className="mx-1.5 h-3.5 w-3.5 shrink-0 text-stone-400"
                strokeWidth={2}
                aria-hidden
              />
            ) : null}
            {crumb.current ? (
              <span
                className="font-medium text-stone-800"
                aria-current="page"
                suppressHydrationWarning
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="transition-colors hover:text-stone-900"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
