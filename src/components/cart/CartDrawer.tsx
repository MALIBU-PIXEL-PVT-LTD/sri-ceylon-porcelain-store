"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

import { CartItem } from "@/components/cart/CartItem";
import { Button, uiRound } from "@/components/ui";
import { useCart } from "@/context/CartContext";

const motionEasing = "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { lines, totalPrice, updateQuantity } = useCart();

  const handleCheckout = useCallback(() => {
    onClose();
    router.push("/cart");
  }, [onClose, router]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[100] transition-[visibility] ${motionEasing} motion-reduce:transition-none ${
        open ? "visible" : "invisible pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={`absolute inset-0 z-0 bg-stone-900/45 backdrop-blur-[2px] transition-opacity ${motionEasing} motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Close cart"
        onClick={onClose}
      />

      <aside
        id="cart-drawer"
        className={`absolute right-0 top-0 z-10 flex h-full w-full max-w-md flex-col bg-[#fafaf9] shadow-[0_0_0_1px_rgba(28,25,23,0.06),-12px_0_48px_-12px_rgba(0,0,0,0.14)] transition-transform ${motionEasing} motion-reduce:transition-none ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-stone-200/80 bg-white/90 px-6 py-5 sm:px-7 backdrop-blur-sm">
          <h2
            id="cart-drawer-title"
            className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-stone-500"
          >
            Your cart
          </h2>
          <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center text-stone-400 transition-colors duration-200 hover:bg-stone-100 hover:text-stone-800 ${uiRound}`}
            onClick={onClose}
            aria-label="Close cart"
          >
            <X className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
          <div className={`flex flex-col divide-y divide-stone-200/90 border border-stone-200/70 bg-white p-4 shadow-sm sm:p-5 ${uiRound}`}>
            {lines.length === 0 ? (
              <p className="py-8 text-center text-sm text-stone-500">
                Your cart is empty.
              </p>
            ) : (
              lines.map((line) => (
                <CartItem
                  key={line.id}
                  line={line}
                  embedded
                  onProductNavigate={onClose}
                  onIncrement={() => updateQuantity(line.id, 1)}
                  onDecrement={() => updateQuantity(line.id, -1)}
                />
              ))
            )}
          </div>
        </div>

        <footer className="shrink-0 border-t border-stone-200/80 bg-white/95 px-6 py-6 shadow-[0_-8px_32px_-8px_rgba(28,25,23,0.08)] backdrop-blur-sm sm:px-7">
          <div className="space-y-1">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-stone-400">
              Total
            </p>
            <p className="text-[1.75rem] font-medium leading-none tracking-tight text-stone-900 tabular-nums">
              <span className="mr-1.5 align-baseline text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
                LKR
              </span>
              {totalPrice.toLocaleString()}
            </p>
          </div>

          <Button
            className="mt-8 w-full py-3.5 text-[0.9375rem] font-medium tracking-wide shadow-sm transition-shadow duration-200 hover:shadow-md"
            type="button"
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        </footer>
      </aside>
    </div>
  );
}
