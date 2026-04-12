import type { InputHTMLAttributes } from "react";

import { inputFieldClassName } from "@/components/ui";

const inputClassName = `mt-1.5 ${inputFieldClassName}`;

export type CheckoutFormFieldProps = {
  id: string;
  label: string;
  wrapperClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className" | "name">;

export function CheckoutFormField({
  id,
  label,
  wrapperClassName = "",
  ...inputProps
}: CheckoutFormFieldProps) {
  return (
    <div className={wrapperClassName}>
      <label htmlFor={id} className="text-xs font-medium text-stone-600">
        {label}
      </label>
      <input {...inputProps} id={id} name={id} className={inputClassName} />
    </div>
  );
}
