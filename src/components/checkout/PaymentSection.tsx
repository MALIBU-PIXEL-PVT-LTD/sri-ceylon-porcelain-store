"use client";

import { useCallback, useState } from "react";

import { CheckoutFormField } from "./CheckoutFormField";

export type PaymentMethodId = "card" | "cod";

const OPTIONS: { id: PaymentMethodId; label: string }[] = [
  { id: "card", label: "Credit or debit card" },
  { id: "cod", label: "Cash on delivery" },
];

type PaymentSectionProps = {
  value?: PaymentMethodId;
  defaultValue?: PaymentMethodId;
  onChange?: (id: PaymentMethodId) => void;
  name?: string;
  className?: string;
};

export function PaymentSection({
  value: valueProp,
  defaultValue = "card",
  onChange,
  name = "payment",
  className = "",
}: PaymentSectionProps) {
  const [internalId, setInternalId] = useState<PaymentMethodId>(defaultValue);
  const isControlled = valueProp !== undefined;
  const selectedId = isControlled ? valueProp : internalId;

  const select = useCallback(
    (id: PaymentMethodId) => {
      if (!isControlled) {
        setInternalId(id);
      }
      onChange?.(id);
    },
    [isControlled, onChange]
  );

  return (
    <div className={className}>
      <div className="space-y-3" role="radiogroup" aria-label="Payment method">
        {OPTIONS.map((opt) => {
          const selected = selectedId === opt.id;
          return (
            <label
              key={opt.id}
              className="flex cursor-pointer items-center gap-3 rounded-sm border border-stone-200 bg-white p-4 transition-colors has-[:checked]:border-stone-900 has-[:checked]:bg-stone-50"
            >
              <input
                type="radio"
                name={name}
                value={opt.id}
                checked={selected}
                onChange={() => select(opt.id)}
                className="border-stone-300 text-stone-900 focus:ring-stone-900"
              />
              <span className="text-sm font-medium text-stone-900">{opt.label}</span>
            </label>
          );
        })}
      </div>

      {selectedId === "card" && (
        <div className="mt-6 space-y-4 rounded-sm border border-stone-100 bg-stone-50/50 p-4">
          <CheckoutFormField
            id="cardNumber"
            label="Card number"
            autoComplete="cc-number"
            required
          />
          <CheckoutFormField
            id="cardName"
            label="Name on card"
            autoComplete="cc-name"
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <CheckoutFormField
              id="cardExpiry"
              label="Expiry (MM/YY)"
              autoComplete="cc-exp"
              required
            />
            <CheckoutFormField id="cardCvc" label="CVC" autoComplete="cc-csc" required />
          </div>
        </div>
      )}
    </div>
  );
}
