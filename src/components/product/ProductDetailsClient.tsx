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
  const [selectedSize, setSelectedSize] = useState<string | undefined>(sizes[0]);

  return (
    <div>
      <ProductInfo product={product} selectedSize={selectedSize} />
      <ProductPurchaseForm
        product={product}
        selectedSize={selectedSize}
        onSelectedSizeChange={setSelectedSize}
      />
    </div>
  );
}
