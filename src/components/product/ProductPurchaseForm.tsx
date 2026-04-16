"use client";

import { useState } from "react";

import { Button, uiRound } from "@/components/ui";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

type ProductPurchaseFormProps = {
  product: Product;
  /** When set, add-to-cart uses this product (e.g. resolved variant in a group). */
  cartProduct?: Product;
  /** Override swatch list (grouped PDP). */
  colorOptions?: Product["colors"];
  /** Override size list (grouped PDP). */
  sizeOptions?: string[];
  selectedSize?: string;
  onSelectedSizeChange?: (size: string) => void;
  selectedColorId?: string;
  onSelectedColorChange?: (colorId: string) => void;
};

export function ProductPurchaseForm({
  product,
  cartProduct,
  colorOptions,
  sizeOptions,
  selectedSize,
  onSelectedSizeChange,
  selectedColorId,
  onSelectedColorChange,
}: ProductPurchaseFormProps) {
  const { addItem } = useCart();
  const sizes = sizeOptions ?? product.sizes ?? [];
  const colors = colorOptions ?? product.colors ?? [];
  const lineProduct = cartProduct ?? product;

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
    if (!lineProduct.inStock) return;
    if (sizes.length > 0 && !activeSize) return;
    if (colors.length > 0 && !activeColorId) return;
    if (cartProduct) {
      addItem(
        cartProduct,
        cartProduct.sizes?.[0],
        cartProduct.colors?.[0]?.id
      );
      return;
    }
    addItem(
      product,
      sizes.length > 0 ? activeSize : undefined,
      colors.length > 0 ? activeColorId : undefined
    );
  }

  const canSubmit =
    lineProduct.inStock &&
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
            <span className="ml-0.5 text-red-600" aria-hidden="true">
              *
            </span>
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
                    `h-8 w-8 shrink-0 border border-stone-300/90 shadow-[inset_0_1px_2px_rgba(28,25,23,0.06)] transition-[box-shadow,ring-color] outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 ${uiRound}`,
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
            <span className="ml-0.5 text-red-600" aria-hidden="true">
              *
            </span>
          </h2>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {sizes.map((size) => (
              <label
                key={size}
                className={`relative flex cursor-pointer items-center justify-center border border-stone-200 bg-white p-3 transition-colors has-[:checked]:border-stone-900 has-[:checked]:bg-stone-900 ${uiRound}`}
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
        Add To Cart
      </Button>
    </div>
  );
}