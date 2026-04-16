import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-11 w-11",
} as const;

const base =
  "inline-flex items-center justify-center rounded-full transition-colors hover:bg-stone-100 active:bg-stone-200/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400 disabled:cursor-not-allowed disabled:opacity-45";

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, size = "md", className = "", type = "button", children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`${base} ${sizeClasses[size]} ${className}`.trim()}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
});

IconButton.displayName = "IconButton";
