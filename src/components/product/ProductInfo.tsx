import { StockBadge } from "@/components/ui";
import { getSkuForProductSize } from "@/lib/sku";
import type { Product } from "@/types/product";

type ProductInfoProps = {
  product: Product;
  selectedSize?: string;
  className?: string;
};

export function ProductInfo({
  product,
  selectedSize,
  className = "",
}: ProductInfoProps) {
  const sku = getSkuForProductSize(product.slug, selectedSize);

  return (
    <div className={className}>
      <h1 className="text-2xl font-medium tracking-tight text-stone-900 sm:text-3xl">
        {product.name}
      </h1>
      {sku && (
        <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-stone-500">
          {sku}
        </p>
      )}

      <p className="mt-5 flex items-baseline gap-2 text-stone-800">
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-stone-400">
          LKR
        </span>
        <span className="text-2xl font-medium tabular-nums tracking-tight sm:text-[1.65rem]">
          {product.price.toLocaleString()}
        </span>
      </p>

      <p className="mt-4">
        <StockBadge inStock={product.inStock} />
      </p>

      <div className="mt-8 border-t border-stone-100 pt-8">
        <h2 className="sr-only">Description</h2>
        <p className="text-sm leading-relaxed text-stone-600 sm:text-[0.9375rem]">
          {product.description}
        </p>
      </div>
    </div>
  );
}
