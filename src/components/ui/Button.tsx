import { forwardRef, type ButtonHTMLAttributes } from "react";

import { uiRound } from "@/components/ui/tokens";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

const variants = {
  primary:
    "bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-45 disabled:hover:bg-stone-900",
  secondary:
    "border border-stone-300 bg-transparent text-stone-800 hover:border-stone-400 hover:bg-stone-50 disabled:opacity-45",
} as const;

const base = `inline-flex items-center justify-center ${uiRound} px-8 py-3.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400 disabled:cursor-not-allowed`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", className = "", type = "button", ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={`${base} ${variants[variant]} ${className}`.trim()}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
