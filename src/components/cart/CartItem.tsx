import Image from "next/image";
import Link from "next/link";

import type { CartLine } from "@/types/cart";

type CartItemProps = {
  line: CartLine;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
  /** Fired when the product image or title link is clicked (e.g. close a drawer). */
  onProductNavigate?: () => void;
  className?: string;
};

export function CartItem({
  line,
  onIncrement,
  onDecrement,
  onRemove,
  onProductNavigate,
  className = "",
}: CartItemProps) {
  const lineTotal = line.price * line.quantity;

  return (
    <article
      className={`flex gap-4 border-b border-stone-200/90 py-6 last:border-b-0 sm:gap-6 ${className}`.trim()}
    >
      <Link
        href={`/products/${line.slug}`}
        className="relative h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-stone-100 ring-1 ring-stone-200/80 sm:h-28 sm:w-24"
        onClick={onProductNavigate}
      >
        <Image
          src={line.image}
          alt={line.name}
          fill
          sizes="96px"
          className="object-cover object-center"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="min-w-0">
          <Link
            href={`/products/${line.slug}`}
            className="text-sm font-medium leading-snug text-stone-900 transition-colors hover:text-stone-600"
            onClick={onProductNavigate}
          >
            {line.name}
          </Link>
          {line.size && (
            <p className="mt-1 text-xs text-stone-500">Size: {line.size}</p>
          )}
          <p className="mt-2 text-sm text-stone-500">
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-stone-400">
              Rs
            </span>{" "}
            <span className="tabular-nums text-stone-700">
              {line.price.toLocaleString()}
            </span>
            <span className="text-stone-400"> each</span>
          </p>
        </div>

        <div className="mt-4 flex flex-shrink-0 items-center gap-4 sm:mt-0">
          <div className="flex items-center border border-stone-200 bg-white">
            <button
              type="button"
              onClick={onDecrement}
              disabled={!onDecrement}
              className="flex h-9 w-9 items-center justify-center text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-[2.25rem] text-center text-sm font-medium tabular-nums text-stone-900">
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={onIncrement}
              disabled={!onIncrement}
              className="flex h-9 w-9 items-center justify-center text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <div className="text-right sm:min-w-[5.5rem]">
            <p className="text-xs uppercase tracking-wider text-stone-400">
              Line total
            </p>
            <p className="mt-0.5 text-sm font-medium tabular-nums text-stone-900">
              <span className="text-[0.65rem] font-medium uppercase tracking-[0.15em] text-stone-400">
                Rs
              </span>{" "}
              {lineTotal.toLocaleString()}
            </p>
          </div>

          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-xs font-medium text-stone-400 underline-offset-2 transition-colors hover:text-red-700 hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
