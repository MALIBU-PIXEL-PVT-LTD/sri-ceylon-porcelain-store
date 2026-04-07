import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const src = product.images[0] ?? "/placeholder.jpg";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400"
    >
      <article>
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-stone-100 ring-1 ring-inset ring-stone-200/70 transition-[box-shadow,ring-color] duration-500 ease-out group-hover:shadow-[0_20px_40px_-20px_rgba(28,25,23,0.15)] group-hover:ring-stone-300/90">
          <Image
            src={src}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
          />
        </div>

        <div className="mt-5 space-y-2">
          <h3 className="text-[0.9375rem] font-medium leading-snug tracking-tight text-stone-900 transition-colors duration-300 group-hover:text-stone-600">
            {product.name}
          </h3>
          <p className="text-sm leading-relaxed text-stone-500">
            {product.shortDescription}
          </p>
          <p className="flex items-baseline gap-1.5 text-sm tabular-nums text-stone-800">
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-stone-400">
              LKR
            </span>
            <span className="font-medium tracking-tight">
              {product.price.toLocaleString()}
            </span>
          </p>
        </div>
      </article>
    </Link>
  );
}