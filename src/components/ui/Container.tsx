import type { ReactNode } from "react";

const base =
  "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={className ? `${base} ${className}` : base}>
      {children}
    </div>
  );
}
