import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductDetailsClient, ProductGallery } from "@/components/product";
import { fetchPublicProductBySlug, publicProductToProduct } from "@/lib/products-api";

export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product = null;
  let loadFailed = false;
  try {
    const row = await fetchPublicProductBySlug(slug);
    if (row) product = publicProductToProduct(row);
  } catch {
    loadFailed = true;
  }

  if (loadFailed) {
    return (
      <div>
        <p className="text-sm text-red-700" role="alert">
          We could not load this product. Please try again later.
        </p>
        <Link
          href="/products"
          className="mt-4 inline-block text-sm text-stone-600 underline hover:text-stone-900"
        >
          Back to collection
        </Link>
      </div>
    );
  }

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
