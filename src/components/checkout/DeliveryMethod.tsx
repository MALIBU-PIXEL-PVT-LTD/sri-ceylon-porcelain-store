"use client";

import { useCallback, useState } from "react";

export type DeliveryMethodId = "standard" | "express";

const OPTIONS: {
  id: DeliveryMethodId;
  label: string;
  description: string;
  amount: number;
}[] = [
  {
    id: "standard",
    label: "Standard",
    description: "5–7 business days",
    amount: 0,
  },
  {
    id: "express",
    label: "Express",
    description: "2–3 business days",
    amount: 450,
  },
];

export function shippingForDeliveryMethod(id: DeliveryMethodId): number {
  return OPTIONS.find((o) => o.id === id)?.amount ?? 0;
}

type DeliveryMethodProps = {
  /** Controlled selection. */
  value?: DeliveryMethodId;
  /** Uncontrolled default. */
  defaultValue?: DeliveryMethodId;
  /** Called whenever the selection changes (controlled or internal state). */
  onChange?: (id: DeliveryMethodId) => void;
  /** Radio group `name` for forms. */
  name?: string;
  className?: string;
};

export function DeliveryMethod({
  value: valueProp,
  defaultValue = "standard",
  onChange,
  name = "delivery",
  className = "",
}: DeliveryMethodProps) {
  const [internalId, setInternalId] = useState<DeliveryMethodId>(defaultValue);
  const isControlled = valueProp !== undefined;
  const selectedId = isControlled ? valueProp : internalId;

  const select = useCallback(
    (id: DeliveryMethodId) => {
      if (!isControlled) {
        setInternalId(id);
      }
      onChange?.(id);
    },
    [isControlled, onChange]
  );

  return (
    <div
      className={className}
      role="radiogroup"
      aria-label="Delivery method"
    >
      <div className="space-y-3">
        {OPTIONS.map((opt) => {
          const selected = selectedId === opt.id;
          return (
            <label
              key={opt.id}
              className="flex cursor-pointer items-start gap-3 rounded-sm border border-stone-200 bg-white p-4 transition-colors has-[:checked]:border-stone-900 has-[:checked]:bg-stone-50"
            >
              <input
                type="radio"
                name={name}
                value={opt.id}
                checked={selected}
                onChange={() => select(opt.id)}
                className="mt-1 border-stone-300 text-stone-900 focus:ring-stone-900"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-stone-900">
                  {opt.label}
                </span>
                <span className="mt-0.5 block text-xs text-stone-500">
                  {opt.description}
                </span>
              </span>
              <span className="shrink-0 text-sm font-medium tabular-nums text-stone-800">
                {opt.amount === 0 ? "Free" : `LKR ${opt.amount.toLocaleString()}`}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
