import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  FaqCenteredAccordion,
  OurClients,
  TestimonialsSideBySide,
} from "@/components/marketing";
import { ProductCard } from "@/components/product";
import { uiRound } from "@/components/ui";
import { fetchPublicProductGroups, publicProductGroupToListProduct } from "@/lib/products-api";

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
  let featured = [] as ReturnType<typeof publicProductGroupToListProduct>[];

  try {
    const api = await fetchPublicProductGroups();
    featured = api
      .map(publicProductGroupToListProduct)
      .filter((p) => p.inStock)
      .slice(0, 4);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Could not load featured products";
  }

  return (
    <div>
      <section
        aria-labelledby="hero-heading"
        className="relative -mt-10 ml-[calc(50%-50vw)] flex min-h-[100svh] w-screen max-w-[100vw] flex-col justify-center overflow-x-clip"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/products/porcelain-serving-bowl-2.jpg')] bg-cover bg-center"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-stone-950/75 via-stone-900/55 to-stone-950/80"
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-4 pb-16 pt-20 text-center sm:px-6 sm:pb-20 sm:pt-24 lg:px-8">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-stone-300">
            Sri Ceylon Porcelain
          </p>
          <h1
            id="hero-heading"
            className="type-h1 mt-6 text-white"
          >
            Porcelain made for tables that value calm, clarity, and craft.
          </h1>
          <p className="type-p mt-6 max-w-xl text-stone-200">
            A curated collection of glazed ceramics—understated forms, honest
            materials, and a finish that feels as refined as it looks.
          </p>
          <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/products"
              className={`inline-flex h-11 items-center justify-center gap-2 bg-white px-8 text-sm font-medium tracking-wide text-stone-900 transition-colors hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 ${uiRound}`}
            >
              <span>Shop The Collection</span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
            <Link
              href="/products"
              className={`inline-flex h-11 items-center justify-center gap-2 border border-white/40 bg-white/5 px-8 text-sm font-medium text-white backdrop-blur-[2px] transition-colors hover:border-white/60 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 ${uiRound}`}
            >
              <span>View All Products</span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-24 space-y-24 pb-8 sm:mt-28 sm:space-y-28 sm:pb-12">
        <section aria-labelledby="featured-heading">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="featured-heading"
                className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-stone-500"
              >
                Featured
              </h2>
              <p className="type-h4 mt-2 text-stone-900">
                Pieces we love right now
              </p>
            </div>
            <Link
              href="/products"
              className="mt-4 inline-flex items-center gap-2 text-sm text-stone-500 underline-offset-4 transition-colors hover:text-stone-900 hover:underline sm:mt-0"
            >
              <span>See Full Collection</span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                imageSizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
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
          <p className="type-h4 mt-2 max-w-xl text-stone-900">
            Explore the range by how you use it
          </p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-6">
            {categories.map((cat) => (
              <li key={cat.title}>
                <Link
                  href="/products"
                  className="group flex h-full flex-col rounded-sm border border-stone-200/90 bg-white/40 p-6 transition-colors hover:border-stone-300 hover:bg-white/80 sm:p-8"
                >
                  <span className="text-base font-medium text-stone-900">
                    {cat.title}
                  </span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-stone-500">
                    {cat.description}
                  </span>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-medium tracking-wider text-stone-600 transition-colors group-hover:text-stone-900">
                    <span>Browse Products</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <OurClients />

        <TestimonialsSideBySide />

        <FaqCenteredAccordion />
      </div>
    </div>
  );
}
