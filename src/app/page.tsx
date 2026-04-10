import Link from "next/link";

import { ProductCard } from "@/components/product";
import { fetchPublicProducts, publicProductToProduct } from "@/lib/products-api";

export const revalidate = 60;

const categories = [
  {
    title: "Dinnerware",
    description: "Plates and bowls for everyday meals and gatherings.",
  },
  {
    title: "Drinkware",
    description: "Cups and mugs shaped for quiet morning rituals.",
  },
  {
    title: "Serveware",
    description: "Pieces that elevate food is shared at the table.",
  },
] as const;

export default async function Home() {
  let loadError: string | null = null;
  let featured = [] as ReturnType<typeof publicProductToProduct>[];

  try {
    const api = await fetchPublicProducts();
    featured = api
      .map(publicProductToProduct)
      .filter((p) => p.inStock)
      .slice(0, 3);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Could not load featured products";
  }

  return (
    <div className="space-y-24 pb-8 sm:space-y-28 sm:pb-12">
      <section className="border-b border-stone-200/80 pb-16 sm:pb-20">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-stone-500">
          Sri Ceylon Porcelain
        </p>
        <h1 className="mt-6 max-w-2xl text-3xl font-medium leading-[1.15] tracking-tight text-stone-900 sm:text-4xl sm:leading-[1.1] lg:text-[2.75rem]">
          Porcelain made for tables that value calm, clarity, and craft.
        </h1>
        <p className="mt-6 max-w-lg text-sm leading-relaxed text-stone-500 sm:text-base">
          A curated collection of glazed ceramics—understated forms, honest
          materials, and a finish that feels as refined as it looks.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href="/products"
            className="inline-flex h-11 items-center justify-center bg-stone-900 px-8 text-sm font-medium tracking-wide text-white transition-colors hover:bg-stone-800"
          >
            Shop the collection
          </Link>
          <Link
            href="/products"
            className="inline-flex h-11 items-center justify-center border border-stone-300 bg-transparent px-8 text-sm font-medium text-stone-800 transition-colors hover:border-stone-400 hover:bg-stone-50"
          >
            View all products
          </Link>
        </div>
      </section>

      <section aria-labelledby="featured-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="featured-heading"
              className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-stone-500"
            >
              Featured
            </h2>
            <p className="mt-2 text-xl font-medium tracking-tight text-stone-900 sm:text-2xl">
              Pieces we love right now
            </p>
          </div>
          <Link
            href="/products"
            className="mt-4 text-sm text-stone-500 underline-offset-4 transition-colors hover:text-stone-900 hover:underline sm:mt-0"
          >
            See full collection
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {loadError ? (
          <p className="mt-6 text-sm text-red-700" role="alert">
            {loadError}
          </p>
        ) : null}
        {!loadError && featured.length === 0 ? (
          <p className="mt-6 text-sm text-stone-500">
            No featured products yet. Add in-stock items from inventory.
          </p>
        ) : null}
      </section>

      <section aria-labelledby="categories-heading">
        <h2
          id="categories-heading"
          className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-stone-500"
        >
          Shop by category
        </h2>
        <p className="mt-2 max-w-xl text-xl font-medium tracking-tight text-stone-900 sm:text-2xl">
          Explore the range by how you use it
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {categories.map((cat) => (
            <li key={cat.title}>
              <Link
                href="/products"
                className="group flex h-full flex-col border border-stone-200/90 bg-white/40 p-6 transition-colors hover:border-stone-300 hover:bg-white/80 sm:p-8"
              >
                <span className="text-base font-medium text-stone-900">
                  {cat.title}
                </span>
                <span className="mt-2 flex-1 text-sm leading-relaxed text-stone-500">
                  {cat.description}
                </span>
                <span className="mt-6 text-xs font-medium uppercase tracking-wider text-stone-600 transition-colors group-hover:text-stone-900">
                  Browse →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
