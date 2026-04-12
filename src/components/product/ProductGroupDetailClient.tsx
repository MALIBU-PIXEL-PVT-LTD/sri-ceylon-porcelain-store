"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductPurchaseForm } from "@/components/product/ProductPurchaseForm";
import {
  colorIdFromLabel,
  colorsFromVariants,
  findVariantBySelection,
  pickDefaultVariant,
  sizesForColorSelection,
  variantToCartProduct,
  type PublicProductGroup,
} from "@/lib/products-api";

function initialSelection(group: PublicProductGroup) {
  const v = pickDefaultVariant(group.variants);
  const colorOpts = colorsFromVariants(group.variants);
  const colorId =
    colorOpts.length > 0 ? colorIdFromLabel(String(v.color || "")) : undefined;
  const size = String(v.size || "").trim() || undefined;
  return { colorId, size };
}

type ProductGroupDetailClientProps = {
  group: PublicProductGroup;
};

export function ProductGroupDetailClient({ group }: ProductGroupDetailClientProps) {
  const variants = group.variants;
  const colorOpts = useMemo(() => colorsFromVariants(variants), [variants]);

  const [{ colorId: initialColorId, size: initialSize }] = useState(() =>
    initialSelection(group)
  );
  const [colorId, setColorId] = useState<string | undefined>(initialColorId);
  const [size, setSize] = useState<string | undefined>(initialSize);

  const sizesForColor = useMemo(
    () => sizesForColorSelection(variants, colorId),
    [variants, colorId]
  );

  const hasColors = variants.some((v) => String(v.color || "").trim());
  const hasSizes = variants.some((v) => String(v.size || "").trim());

  useEffect(() => {
    if (sizesForColor.length === 0) return;
    if (size !== undefined && sizesForColor.includes(size)) return;
    setSize(sizesForColor[0]);
  }, [colorId, sizesForColor, size]);

  const defaultVariant = useMemo(() => pickDefaultVariant(variants), [variants]);

  const resolvedVariant = useMemo(() => {
    const byPair = findVariantBySelection(variants, colorId, size);
    if (byPair) return byPair;
    if (colorId) {
      const anyC = findVariantBySelection(variants, colorId);
      if (anyC) return anyC;
    }
    if (size) {
      const bySize = variants.find((v) => String(v.size || "").trim() === size);
      if (bySize) return bySize;
    }
    return defaultVariant;
  }, [variants, colorId, size, defaultVariant]);

  const cartProduct = useMemo(
    () => variantToCartProduct(resolvedVariant, group),
    [resolvedVariant, group]
  );

  const handleColor = useCallback(
    (nextColorId: string) => {
      setColorId(nextColorId);
      const nextSizes = sizesForColorSelection(variants, nextColorId);
      setSize(nextSizes[0]);
    },
    [variants]
  );

  const handleSize = useCallback(
    (nextSize: string) => {
      setSize(nextSize);
      if (!colorId) return;
      const match = findVariantBySelection(variants, colorId, nextSize);
      if (match) return;
      const withSize = variants.find((v) => String(v.size || "").trim() === nextSize);
      if (withSize) {
        setColorId(colorIdFromLabel(String(withSize.color || "")));
      }
    },
    [variants, colorId]
  );

  return (
    <article className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
      <ProductGallery
        key={resolvedVariant.id}
        images={cartProduct.images}
        alt={group.name}
      />

      <div>
        <ProductInfo product={cartProduct} selectedSize={size} />
        <ProductPurchaseForm
          product={cartProduct}
          cartProduct={cartProduct}
          colorOptions={hasColors && colorOpts.length > 0 ? colorOpts : undefined}
          sizeOptions={hasSizes ? sizesForColor : undefined}
          selectedSize={size}
          onSelectedSizeChange={handleSize}
          selectedColorId={colorId}
          onSelectedColorChange={handleColor}
        />
      </div>
    </article>
  );
}
