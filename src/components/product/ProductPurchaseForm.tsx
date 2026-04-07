"use client";

import { useState } from "react";

import { Button } from "@/components/ui";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

type ProductPurchaseFormProps = {
  product: Product;
  selectedSize?: string;
  onSelectedSizeChange?: (size: string) => void;
};

export function ProductPurchaseForm({
  product,
  selectedSize,
  onSelectedSizeChange,
}: ProductPurchaseFormProps) {
  const { addItem } = useCart();
  const sizes = product.sizes ?? [];
  const [internalSelectedSize, setInternalSelectedSize] = useState<string | undefined>(
    sizes[0]
  );
  const activeSize = selectedSize ?? internalSelectedSize;

  function handleSizeChange(size: string) {
    if (onSelectedSizeChange) {
      onSelectedSizeChange(size);
      return;
    }
    setInternalSelectedSize(size);
  }

  function handleAddToCart() {
    if (!product.inStock) return;
    if (sizes.length > 0 && !activeSize) return;
    addItem(product, sizes.length > 0 ? activeSize : undefined);
  }

  return (
    <div className="mt-10">
      {sizes.length > 0 && (
        <section aria-labelledby="size-heading">
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
        disabled={!product.inStock || (sizes.length > 0 && !activeSize)}
        className="mt-10 w-full"
        onClick={handleAddToCart}
      >
        Add to Cart
      </Button>
    </div>
  );
}
