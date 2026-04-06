import type { ReactNode } from "react";

type ProductGridProps = {
  children: ReactNode;
  className?: string;
};

export function ProductGrid({ children, className = "" }: ProductGridProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
