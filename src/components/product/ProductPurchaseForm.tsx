"use client";

import { useState } from "react";

import { Button } from "@/components/ui";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

type ProductPurchaseFormProps = {
  product: Product;
  selectedSize?: string;
  onSelectedSizeChange?: (size: string) => void;
  selectedColorId?: string;
  onSelectedColorChange?: (colorId: string) => void;
};

export function ProductPurchaseForm({
  product,
  selectedSize,
  onSelectedSizeChange,
  selectedColorId,
  onSelectedColorChange,
}: ProductPurchaseFormProps) {
  const { addItem } = useCart();
  const sizes = product.sizes ?? [];
  const colors = product.colors ?? [];

  const [internalSelectedSize, setInternalSelectedSize] = useState<string | undefined>(
    sizes[0]
  );
  const [internalColorId, setInternalColorId] = useState<string | undefined>(colors[0]?.id);

  const activeSize = selectedSize ?? internalSelectedSize;
  const activeColorId = selectedColorId ?? internalColorId;

  function handleSizeChange(size: string) {
    if (onSelectedSizeChange) {
      onSelectedSizeChange(size);
    } else {
      setInternalSelectedSize(size);
    }
    const linked = colors.find((c) => c.linkedSize === size);
    if (linked) {
      if (onSelectedColorChange) onSelectedColorChange(linked.id);
      else setInternalColorId(linked.id);
    }
  }

  function handleColorChange(colorId: string) {
    if (onSelectedColorChange) {
      onSelectedColorChange(colorId);
    } else {
      setInternalColorId(colorId);
    }
    const c = colors.find((x) => x.id === colorId);
    if (c?.linkedSize) {
      handleSizeChange(c.linkedSize);
    }
  }

  function handleAddToCart() {
    if (!product.inStock) return;
    if (sizes.length > 0 && !activeSize) return;
    if (colors.length > 0 && !activeColorId) return;
    addItem(
      product,
      sizes.length > 0 ? activeSize : undefined,
      colors.length > 0 ? activeColorId : undefined
    );
  }

  const canSubmit =
    product.inStock &&
    (sizes.length === 0 || !!activeSize) &&
    (colors.length === 0 || !!activeColorId);

  return (
    <div className="mt-10">
      {colors.length > 0 && (
        <section aria-labelledby="color-heading">
          <h2
            id="color-heading"
            className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500"
          >
            Color
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {colors.map((c) => {
              const selected = activeColorId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleColorChange(c.id)}
                  title={c.label}
                  aria-label={c.label}
                  aria-pressed={selected}
                  className={[
                    "h-8 w-8 shrink-0 rounded-full border border-stone-300/90 shadow-[inset_0_1px_2px_rgba(28,25,23,0.06)] transition-[box-shadow,ring-color] outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2",
                    selected
                      ? "ring-2 ring-stone-900 ring-offset-2 ring-offset-white"
                      : "hover:ring-1 hover:ring-stone-300 hover:ring-offset-2 hover:ring-offset-white",
                  ].join(" ")}
                  style={{ backgroundColor: c.hex }}
                />
              );
            })}
          </div>
        </section>
      )}

      {sizes.length > 0 && (
        <section
          className={colors.length > 0 ? "mt-10" : undefined}
          aria-labelledby="size-heading"
        >
          <h2
            id="size-heading"
            className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500"
          >
            Size
          </h2>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {sizes.map((size) => (
              <label
                key={size}
                className="relative flex cursor-pointer items-center justify-center rounded-sm border border-stone-200 bg-white p-3 transition-colors has-[:checked]:border-stone-900 has-[:checked]:bg-stone-900"
              >
                <input
                  type="radio"
                  name="size"
                  value={size}
                  checked={activeSize === size}
                  onChange={() => handleSizeChange(size)}
                  className="peer sr-only"
                />
                <span className="text-sm font-medium text-stone-900 peer-checked:text-white">
                  {size}
                </span>
              </label>
            ))}
          </div>
        </section>
      )}

      <Button
        type="button"
        disabled={!canSubmit}
        className="mt-10 w-full"
        onClick={handleAddToCart}
      >
        Add to Cart
      </Button>
    </div>
  );
}
