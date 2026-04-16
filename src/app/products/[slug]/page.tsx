import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { ProductGroupDetailClient } from "@/components/product";
import { SetProductBreadcrumbTitle } from "@/context/ProductBreadcrumbContext";
import { fetchPublicProductGroupBySlug } from "@/lib/products-api";

export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let group = null;
  let loadFailed = false;
  try {
    group = await fetchPublicProductGroupBySlug(slug);
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
          className="mt-4 inline-flex items-center gap-2 text-sm text-stone-600 underline hover:text-stone-900"
        >
          <span>Back To Collection</span>
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </Link>
      </div>
    );
  }

  if (!group) return notFound();

  if (group.groupSlug !== slug) {
    redirect(`/products/${group.groupSlug}`);
  }

  return (
    <div>
      <SetProductBreadcrumbTitle title={group.name} />

      <ProductGroupDetailClient group={group} />
    </div>
  );
}
