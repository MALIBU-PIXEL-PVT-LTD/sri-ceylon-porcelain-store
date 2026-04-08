"use client";

import { useState } from "react";

import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductPurchaseForm } from "@/components/product/ProductPurchaseForm";
import type { Product } from "@/types/product";

type ProductDetailsClientProps = {
  product: Product;
};

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const sizes = product.sizes ?? [];
  const colors = product.colors ?? [];
  const [selectedSize, setSelectedSize] = useState<string | undefined>(sizes[0]);
  const [selectedColorId, setSelectedColorId] = useState<string | undefined>(
    colors[0]?.id
  );

  return (
    <div>
      <ProductInfo product={product} selectedSize={selectedSize} />
      <ProductPurchaseForm
        product={product}
        selectedSize={selectedSize}
        onSelectedSizeChange={setSelectedSize}
        selectedColorId={selectedColorId}
        onSelectedColorChange={setSelectedColorId}
      />
    </div>
  );
}
