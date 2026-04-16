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
  const isRequired = Boolean(inputProps.required);

  return (
    <div className={wrapperClassName}>
      <label htmlFor={id} className="text-xs font-medium text-stone-600">
        {label}
        {isRequired ? (
          <span className="ml-0.5 text-red-600" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      <input {...inputProps} id={id} name={id} className={inputClassName} />
    </div>
  );
}
