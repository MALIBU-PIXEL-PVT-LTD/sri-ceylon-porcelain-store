import type { CartLine } from "@/types/cart";

type CartSummaryProps = {
  /** Either pass lines (subtotal computed) or an explicit total. */
  lines?: CartLine[];
  total?: number;
  className?: string;
};

function sumLines(lines: CartLine[]) {
  return lines.reduce((acc, line) => acc + line.price * line.quantity, 0);
}

export function CartSummary({ lines, total, className = "" }: CartSummaryProps) {
  const subtotal =
    total !== undefined ? total : lines !== undefined ? sumLines(lines) : 0;

  return (
    <aside
      className={`border border-stone-200/90 bg-white/60 p-6 sm:p-8 ${className}`.trim()}
    >
      <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
        Order summary
      </h2>

      <div className="mt-8 flex items-baseline justify-between gap-4">
        <span className="text-base font-medium text-stone-900">Total</span>
        <span className="text-xl font-medium tabular-nums tracking-tight text-stone-900">
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-stone-400">
            Rs
          </span>{" "}
          {subtotal.toLocaleString()}
        </span>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-stone-500">
        Shipping and taxes calculated at checkout.
      </p>
    </aside>
  );
}
