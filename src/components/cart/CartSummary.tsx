"use client";

import type { ReactNode } from "react";

import { useCurrency } from "@/context/CurrencyContext";
import type { CartLine } from "@/types/cart";

type CartSummaryProps = {
  /** Either pass lines (subtotal computed) or an explicit total. */
  lines?: CartLine[];
  total?: number;
  className?: string;
  /** When both are set, show subtotal + shipping + taxes + grand total (checkout). */
  shipping?: number;
  taxes?: number;
  /** Final total; defaults to subtotal + shipping + taxes when breakdown is shown. */
  grandTotal?: number;
  /** Rendered under the title (e.g. read-only line items). */
  items?: ReactNode;
  /** Rendered under totals (e.g. confirm button). */
  footer?: ReactNode;
};

function sumLines(lines: CartLine[]) {
  return lines.reduce((acc, line) => acc + line.price * line.quantity, 0);
}

function Money({
  amount,
  currency,
  formatAmount,
}: {
  amount: number;
  currency: string;
  formatAmount: (amountLkr: number) => string;
}) {
  return (
    <>
      <span className="text-[0.65rem] uppercase tracking-[0.14em] text-stone-400">
        {currency}
      </span>{" "}
      {formatAmount(amount)}
    </>
  );
}

export function CartSummary({
  lines,
  total,
  className = "",
  shipping,
  taxes,
  grandTotal,
  items,
  footer,
}: CartSummaryProps) {
  const { currency, formatAmount } = useCurrency();
  const subtotal =
    total !== undefined ? total : lines !== undefined ? sumLines(lines) : 0;

  const showBreakdown = shipping !== undefined && taxes !== undefined;
  const resolvedGrand = showBreakdown
    ? grandTotal ?? subtotal + shipping + taxes
    : subtotal;

  return (
    <aside
      className={`border border-stone-200/90 bg-white/60 p-6 sm:p-8 ${className}`.trim()}
    >
      <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
        Order summary
      </h2>

      {items != null && <div className="mt-6 border-b border-stone-100 pb-6">{items}</div>}

      {showBreakdown ? (
        <dl className={`space-y-3 text-sm ${items != null ? "mt-6" : "mt-8"}`}>
          <div className="flex justify-between gap-4">
            <dt className="text-stone-600">Subtotal</dt>
            <dd className="font-medium tabular-nums text-stone-900">
              <Money amount={subtotal} currency={currency} formatAmount={formatAmount} />
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-stone-600">Shipping</dt>
            <dd className="font-medium tabular-nums text-stone-900">
              {shipping === 0 ? (
                "Free"
              ) : (
                <Money amount={shipping} currency={currency} formatAmount={formatAmount} />
              )}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-stone-600">Taxes (est.)</dt>
            <dd className="font-medium tabular-nums text-stone-900">
              <Money amount={taxes} currency={currency} formatAmount={formatAmount} />
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-stone-100 pt-4 text-base">
            <dt className="font-medium text-stone-900">Total</dt>
            <dd className="font-medium tabular-nums tracking-tight text-stone-900">
              <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-stone-400">
                {currency}
              </span>{" "}
              {formatAmount(resolvedGrand)}
            </dd>
          </div>
        </dl>
      ) : (
        <>
          <div className="mt-8 flex items-baseline justify-between gap-4">
            <span className="text-base font-medium text-stone-900">Total</span>
            <span className="text-xl font-medium tabular-nums tracking-tight text-stone-900">
              <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-stone-400">
                {currency}
              </span>{" "}
              {formatAmount(resolvedGrand)}
            </span>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-stone-500">
            Shipping and taxes calculated at checkout.
          </p>
        </>
      )}

      {footer != null && <div className="mt-8">{footer}</div>}
    </aside>
  );
}
