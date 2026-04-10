import { ProductCard, ProductGrid } from "@/components/product";
import { fetchPublicProducts, publicProductToProduct } from "@/lib/products-api";

export const revalidate = 60;

export default async function ProductsPage() {
  let loadError: string | null = null;
  let products: ReturnType<typeof publicProductToProduct>[] = [];

  try {
    const api = await fetchPublicProducts();
    products = api.map(publicProductToProduct);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Could not load products";
  }

  return (
    <section aria-labelledby="collection-heading">
      <h1
        id="collection-heading"
        className="text-2xl font-medium tracking-tight text-stone-900 sm:text-3xl"
      >
        Our Collection
      </h1>

      {loadError ? (
        <p className="mt-6 text-sm text-red-700" role="alert">
          {loadError}
        </p>
      ) : null}

      <ProductGrid className="mt-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductGrid>

      {!loadError && products.length === 0 ? (
        <p className="mt-10 text-sm text-stone-500">
          No products are listed yet. Add inventory from the staff portal to show items here.
        </p>
      ) : null}
    </section>
  );
}
