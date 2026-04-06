import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

const variants = {
  primary:
    "bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-45 disabled:hover:bg-stone-900",
  secondary:
    "border border-stone-300 bg-transparent text-stone-800 hover:border-stone-400 hover:bg-stone-50 disabled:opacity-45",
} as const;

const base =
  "inline-flex items-center justify-center rounded-sm px-8 py-3.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400 disabled:cursor-not-allowed";

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`.trim()}
      {...props}
    />
  );
}
