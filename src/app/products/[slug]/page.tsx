import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGallery, ProductInfo } from "@/components/product";
import { Button } from "@/components/ui";
import { mockProducts } from "@/lib/mock-products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = mockProducts.find((p) => p.slug === slug);

  if (!product) return notFound();

  return (
    <div>
      <nav aria-label="Back to collection">
        <Link
          href="/products"
          className="inline-flex items-center text-sm text-stone-500 transition-colors hover:text-stone-900"
        >
          <span className="mr-2" aria-hidden>
            ←
          </span>
          Back to Collection
        </Link>
      </nav>

      <article className="mt-8 grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
        <ProductGallery images={product.images} alt={product.name} />

        <div>
          <ProductInfo product={product} />

          {product.sizes && product.sizes.length > 0 && (
            <section className="mt-10" aria-labelledby="size-heading">
              <h2
                id="size-heading"
                className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500"
              >
                Size
              </h2>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {product.sizes.map((size) => (
                  <label
                    key={size}
                    className="relative flex cursor-pointer items-center justify-center rounded-sm border border-stone-200 bg-white p-3 transition-colors has-[:checked]:border-stone-900 has-[:checked]:bg-stone-900"
                  >
                    <input
                      type="radio"
                      name="size"
                      value={size}
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
            disabled={!product.inStock}
            className="mt-10 w-full"
          >
            Add to Cart
          </Button>
        </div>
      </article>
    </div>
  );
}
