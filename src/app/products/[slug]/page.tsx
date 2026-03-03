import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { mockProducts } from "@/lib/mock-products"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const product = mockProducts.find(
    (p) => p.slug === slug
  )

  if (!product) return notFound()

  return (
    
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Link
        href="/products"
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition"
      >
        <span className="mr-2">←</span>
        Back to Collection
      </Link>
    </div>
      <div className="pt-10">

        {/* Image + Info */}
        <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:gap-12 lg:px-8">
          
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={800}
              height={800}
              className="h-full w-full object-cover hover:scale-105 transition duration-300"
            />
          </div>

          <div className="mt-10 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <p className="mt-4 text-2xl font-semibold text-gray-900">
              Rs {product.price.toLocaleString()}
            </p>

            {!product.inStock && (
              <p className="mt-2 text-sm text-red-600 font-medium">
                Out of Stock
              </p>
            )}
            {/* Size Options */}
{product.sizes && product.sizes.length > 0 && (
  <div className="mt-8">
    <h3 className="text-sm font-medium text-gray-900">Size</h3>

    <div className="mt-4 grid grid-cols-3 gap-3">
      {product.sizes.map((size) => (
        <label
          key={size}
          className="group relative flex items-center justify-center rounded-md border border-gray-300 bg-white p-3 has-checked:border-black has-checked:text-white"
        >
          <input
            type="radio"
            name="size"
            value={size}
            className="absolute inset-0 appearance-none focus:outline-none"
          />
          <span className="text-sm font-medium text-gray-900">
            {size}
          </span>
        </label>
      ))}
    </div>
  </div>
)}

            <div className="mt-6">
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <button
              disabled={!product.inStock}
              className="mt-8 w-full rounded-md bg-black px-8 py-3 text-base font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Additional Images */}
        {product.images.length > 1 && (
          <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              {product.images.slice(1).map((img, index) => (
                <div
                  key={index}
                  className="aspect-square overflow-hidden rounded-lg bg-gray-100"
                >
                  <Image
                    src={img}
                    alt={`${product.name} image ${index + 2}`}
                    width={600}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        

      </div>
    </div>
  )
}