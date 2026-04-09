import type { ReactNode } from "react";

type CheckoutFormSectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function CheckoutFormSection({
  title,
  children,
  className = "",
}: CheckoutFormSectionProps) {
  return (
    <section
      className={`border-t border-stone-100 pt-10 first:border-t-0 first:pt-0 ${className}`.trim()}
    >
      <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
        {title}
      </h2>
      <div className="mt-6 space-y-4">{children}</div>
    </section>
  );
}
