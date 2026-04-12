"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { CartItem, CartSummary } from "@/components/cart";
import { Button, uiRound } from "@/components/ui";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { lines, updateQuantity, removeLine, clearCart } = useCart();
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const titleId = useId();
  const descId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const closeClearModal = useCallback(() => setClearModalOpen(false), []);

  useEffect(() => {
    if (!clearModalOpen) return;
    cancelRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeClearModal();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [clearModalOpen, closeClearModal]);

  function confirmClearCart() {
    clearCart();
    setClearModalOpen(false);
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-2xl font-medium tracking-tight text-stone-900">
          Cart
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-500">
          Your cart is empty. Browse our products to add pieces you love.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center justify-center rounded-sm bg-stone-900 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-2xl font-medium tracking-tight text-stone-900 sm:text-3xl">
          Cart
        </h1>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:justify-end">
          <button
            type="button"
            onClick={() => setClearModalOpen(true)}
            className="text-sm text-stone-500 underline-offset-4 transition-colors hover:text-stone-900 hover:underline"
          >
            Clear cart
          </button>
          <Link
            href="/products"
            className="text-sm text-stone-500 underline-offset-4 transition-colors hover:text-stone-900 hover:underline"
          >
            Continue shopping
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-12">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {lines.map((line) => (
            <CartItem
              key={line.id}
              line={line}
              onIncrement={() => updateQuantity(line.id, 1)}
              onDecrement={() => updateQuantity(line.id, -1)}
              onRemove={() => removeLine(line.id)}
            />
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6 self-start">
            <CartSummary lines={lines} />
            <Link
              href="/checkout"
              className="inline-flex w-full items-center justify-center rounded-sm bg-stone-900 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400"
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>

      {clearModalOpen ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
          aria-hidden={false}
        >
          <button
            type="button"
            className="absolute inset-0 bg-stone-900/45 backdrop-blur-[1px] transition-opacity"
            aria-label="Close dialog"
            onClick={closeClearModal}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            className={`relative w-full max-w-md border border-stone-200 bg-white p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)] sm:p-8 ${uiRound}`}
          >
            <h2
              id={titleId}
              className="text-lg font-medium tracking-tight text-stone-900"
            >
              Clear cart?
            </h2>
            <p id={descId} className="mt-2 text-sm leading-relaxed text-stone-600">
              All line items will be removed. You can add products again from the
              collection anytime.
            </p>
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-3">
              <Button
                ref={cancelRef}
                type="button"
                variant="secondary"
                className="w-full px-5 sm:w-auto"
                onClick={closeClearModal}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                className="w-full px-5 sm:w-auto"
                onClick={confirmClearCart}
              >
                Remove all items
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
