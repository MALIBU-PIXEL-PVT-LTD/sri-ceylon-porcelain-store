"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";

import { CartItem, CartSummary } from "@/components/cart";
import {
  CheckoutFormSection,
  ContactForm,
  DeliveryMethod,
  PaymentSection,
  ShippingForm,
  shippingForDeliveryMethod,
  type DeliveryMethodId,
  type PaymentMethodId,
} from "@/components/checkout";
import { Button } from "@/components/ui";
import { useCart } from "@/context/CartContext";

const TAX_RATE = 0.08;

export default function CheckoutPage() {
  const { lines } = useCart();
  const [deliveryId, setDeliveryId] = useState<DeliveryMethodId>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("card");
  const [submitted, setSubmitted] = useState(false);

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [lines]
  );

  const shipping = useMemo(
    () => shippingForDeliveryMethod(deliveryId),
    [deliveryId]
  );

  const taxableBase = subtotal + shipping;
  const taxes = Math.round(taxableBase * TAX_RATE);
  const orderTotal = subtotal + shipping + taxes;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-2xl font-medium tracking-tight text-stone-900">
          Checkout
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-500">
          Your cart is empty. Add items before checking out.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-sm bg-stone-900 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400"
        >
          <span>Browse Products</span>
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-stone-900 sm:text-3xl">
            Checkout
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Complete your details to place your order.
          </p>
        </div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-stone-900"
        >
          <span>Back To Cart</span>
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </Link>
      </div>

      {submitted && (
        <div
          className="mt-8 rounded-sm border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900"
          role="status"
        >
          Thank you — your order request was received.
        </div>
      )}

      <form
        className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-14"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className="space-y-10 lg:col-span-7">
          <ContactForm />
          <ShippingForm />

          <CheckoutFormSection title="Delivery method">
            <DeliveryMethod
              value={deliveryId}
              onChange={setDeliveryId}
              name="delivery"
            />
          </CheckoutFormSection>

          <CheckoutFormSection title="Payment">
            <PaymentSection
              value={paymentMethod}
              onChange={setPaymentMethod}
              name="payment"
            />
          </CheckoutFormSection>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <CartSummary
              lines={lines}
              shipping={shipping}
              taxes={taxes}
              grandTotal={orderTotal}
              items={lines.map((line) => (
                <CartItem
                  key={line.id}
                  line={line}
                  embedded
                  readOnly
                  className="py-5 first:!pt-0 last:!pb-0 sm:py-6"
                />
              ))}
              footer={
                <>
                  <Button type="submit" className="w-full" disabled={submitted}>
                    {submitted ? "Order Submitted" : "Confirm Order"}
                  </Button>
                  <p className="mt-4 text-center text-xs text-stone-500">
                    By confirming, you agree to our terms for this demo store.
                  </p>
                </>
              }
            />
          </div>
        </div>
      </form>
    </div>
  );
}
