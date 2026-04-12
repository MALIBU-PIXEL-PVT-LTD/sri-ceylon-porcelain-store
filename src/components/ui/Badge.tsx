import type { ReactNode } from "react";

import { uiRound } from "@/components/ui/tokens";

type BadgeVariant = "success" | "destructive" | "neutral";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variants: Record<BadgeVariant, string> = {
  success:
    "border border-emerald-200/80 bg-emerald-50 text-emerald-900",
  destructive:
    "border border-red-200/80 bg-red-50 text-red-800",
  neutral:
    "border border-stone-200/90 bg-stone-50 text-stone-700",
};

const base = `inline-flex items-center ${uiRound} px-2.5 py-0.5 text-xs font-medium`;

export function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  return (
    <span className={`${base} ${variants[variant]} ${className}`.trim()}>
      {children}
    </span>
  );
}

type StockBadgeProps = {
  inStock: boolean;
  className?: string;
};

export function StockBadge({ inStock, className = "" }: StockBadgeProps) {
  return (
    <Badge variant={inStock ? "success" : "destructive"} className={className}>
      {inStock ? "In stock" : "Out of stock"}
    </Badge>
  );
}
