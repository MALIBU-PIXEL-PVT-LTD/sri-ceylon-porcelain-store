import { ArrowRight } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { uiRound } from "@/components/ui/tokens";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  rightIcon?: ReactNode;
};

const variants = {
  primary:
    "bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-45 disabled:hover:bg-stone-900",
  secondary:
    "border border-stone-300 bg-transparent text-stone-800 hover:border-stone-400 hover:bg-stone-50 disabled:opacity-45",
} as const;

const base = `inline-flex items-center justify-center gap-2 ${uiRound} px-8 py-3.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400 disabled:cursor-not-allowed`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      className = "",
      type = "button",
      rightIcon = <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />,
      children,
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={`${base} ${variants[variant]} ${className}`.trim()}
        {...props}
      >
        <span>{children}</span>
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
