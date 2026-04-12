import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { uiRound } from "@/components/ui";
import { getSkuForProductSize } from "@/lib/sku";
import type { CartLine } from "@/types/cart";

type CartItemProps = {
  line: CartLine;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
  /** Fired when the product image or title link is clicked (e.g. close a drawer). */
  onProductNavigate?: () => void;
  /** Flat row inside an outer card (e.g. cart drawer). */
  embedded?: boolean;
  /** No quantity stepper or remove; quantity shown as text (e.g. checkout review). */
  readOnly?: boolean;
  className?: string;
};

export function CartItem({
  line,
  onIncrement,
  onDecrement,
  onRemove,
  onProductNavigate,
  embedded = false,
  readOnly = false,
  className = "",
}: CartItemProps) {
  const lineTotal = line.price * line.quantity;
  const sku = getSkuForProductSize(line.slug, line.size);

  const shellClass = embedded
    ? "flex items-start gap-4 border-0 bg-transparent py-6 first:pt-2 last:pb-2 sm:gap-5 sm:py-7"
    : `mb-4 flex items-start gap-4 border border-stone-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(28,25,23,0.04),0_8px_24px_-8px_rgba(28,25,23,0.08)] last:mb-0 sm:gap-5 sm:p-5 ${uiRound}`;

  return (
    <article className={`${shellClass} ${className}`.trim()}>
      <Link
        href={`/products/${line.slug}`}
        className={`relative h-16 w-16 shrink-0 overflow-hidden bg-stone-100 shadow-[inset_0_1px_2px_rgba(28,25,23,0.06)] ring-1 ring-stone-200/60 ${uiRound}`}
        onClick={onProductNavigate}
      >
        <Image
          src={line.image}
          alt={line.name}
          fill
          sizes="64px"
          className="object-cover object-center"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <div className="min-w-0 space-y-1.5">
          <Link
            href={`/products/${line.slug}`}
            className="block min-w-0 break-words text-[0.9375rem] font-semibold leading-snug tracking-tight text-stone-900 transition-colors duration-200 hover:text-stone-600 sm:text-base"
            onClick={onProductNavigate}
          >
            {line.name}
          </Link>
          {(line.size || line.color) && (
            <p className="text-[0.8125rem] leading-relaxed text-stone-500">
              {line.color && (
                <>
                  <span className="text-[0.625rem] font-medium uppercase tracking-[0.18em] text-stone-400">
                    Color
                  </span>{" "}
                  <span className="text-stone-700">{line.color}</span>
                  {line.size ? " · " : null}
                </>
              )}
              {line.size && (
                <>
                  <span className="text-[0.625rem] font-medium uppercase tracking-[0.18em] text-stone-400">
                    Size
                  </span>{" "}
                  <span className="text-stone-700">{line.size}</span>
                </>
              )}
            </p>
          )}
          {sku && (
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.12em] text-stone-500">
              {sku}
            </p>
          )}
        </div>

        {readOnly ? (
          <p className="text-sm text-stone-600">
            <span className="text-[0.625rem] font-medium uppercase tracking-[0.22em] text-stone-400">
              Qty
            </span>{" "}
            <span className="font-semibold tabular-nums text-stone-900">{line.quantity}</span>
            <span className="mx-2 text-stone-300" aria-hidden>
              ·
            </span>
            <span className="text-[0.625rem] font-medium uppercase tracking-[0.22em] text-stone-400">
              Each
            </span>{" "}
            <span className="font-medium tabular-nums text-stone-800">
              <span className="text-[0.65rem] uppercase tracking-[0.14em] text-stone-400">
                LKR
              </span>{" "}
              {line.price.toLocaleString()}
            </span>
          </p>
        ) : (
          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <div className="min-w-0 space-y-2">
              <p className="text-[0.625rem] font-medium uppercase tracking-[0.22em] text-stone-400">
                Unit price
              </p>
              <p className="text-sm font-medium tabular-nums text-stone-800">
                <span className="mr-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-stone-400">
                  LKR
                </span>
                {line.price.toLocaleString()}
                <span className="ml-1.5 whitespace-nowrap text-[0.8125rem] font-normal text-stone-500">
                  / each
                </span>
              </p>
            </div>

            <div className="min-w-0 shrink-0 space-y-2">
              <p className="text-[0.625rem] font-medium uppercase tracking-[0.22em] text-stone-400">
                Quantity
              </p>
              <div
                className={`inline-flex h-9 items-stretch overflow-hidden border border-stone-200/90 bg-white shadow-sm ${uiRound}`}
                role="group"
                aria-label="Quantity"
              >
                <button
                  type="button"
                  onClick={onDecrement}
                  disabled={!onDecrement}
                  className="flex w-9 shrink-0 items-center justify-center text-stone-500 transition-colors duration-200 hover:bg-stone-50 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                </button>
                <span className="flex min-w-[2.5rem] items-center justify-center border-x border-stone-200/80 px-2 text-sm font-semibold tabular-nums text-stone-900">
                  {line.quantity}
                </span>
                <button
                  type="button"
                  onClick={onIncrement}
                  disabled={!onIncrement}
                  className="flex w-9 shrink-0 items-center justify-center text-stone-500 transition-colors duration-200 hover:bg-stone-50 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          className={
            embedded || readOnly
              ? "flex min-w-0 items-center justify-between gap-3 border-t border-stone-100/90 pt-5 sm:gap-4"
              : `flex min-w-0 items-center justify-between gap-3 border border-stone-100/80 bg-gradient-to-b from-stone-50/80 to-stone-50/40 px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] sm:gap-4 ${uiRound}`
          }
        >
          <span className="min-w-0 shrink text-[0.8125rem] font-medium text-stone-500">
            Line total
          </span>
          <p
            className={
              readOnly
                ? "shrink-0 text-lg font-semibold tabular-nums tracking-tight text-stone-900"
                : "shrink-0 text-xl font-semibold tabular-nums tracking-tight text-stone-900"
            }
          >
            <span className="mr-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-stone-400">
              LKR
            </span>
            {lineTotal.toLocaleString()}
          </p>
        </div>

        {onRemove && (
          <div className="flex justify-end pt-0.5">
            <button
              type="button"
              onClick={onRemove}
              className="text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-stone-400 transition-colors duration-200 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </article>
  );
}