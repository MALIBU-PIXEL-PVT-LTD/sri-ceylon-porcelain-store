import { ProductCard, ProductGrid } from "@/components/product";
import { mockProducts } from "@/lib/mock-products";

export default function ProductsPage() {
  return (
    <section aria-labelledby="collection-heading">
      <h1
        id="collection-heading"
        className="text-2xl font-medium tracking-tight text-stone-900 sm:text-3xl"
      >
        Our Collection
      </h1>

      <ProductGrid className="mt-10">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductGrid>
    </section>
  );
}
