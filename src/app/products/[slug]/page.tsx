import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductDetailsClient, ProductGallery } from "@/components/product";
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

        <ProductDetailsClient product={product} />
      </article>
    </div>
  );
}
