import type { InputHTMLAttributes } from "react";

import { inputFieldClassName } from "@/components/ui/tokens";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className={[inputFieldClassName, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
