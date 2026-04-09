import type { InputHTMLAttributes } from "react";

const inputClassName =
  "mt-1.5 w-full rounded-sm border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900";

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
