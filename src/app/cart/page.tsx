"use client";

import Link from "next/link";

import { CartItem, CartSummary } from "@/components/cart";
import { Button } from "@/components/ui";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { lines, updateQuantity, removeLine } = useCart();

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
        <Link
          href="/products"
          className="text-sm text-stone-500 transition-colors hover:text-stone-900"
        >
          Continue shopping
        </Link>
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
            <Button className="w-full" type="button">
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
