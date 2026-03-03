import Image from "next/image"
import Link from "next/link"
import { Product } from "@/types/product"

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group"
    >
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-[7/8]">
        <Image
          src={product.images[0] || "/placeholder.jpg"}
          alt={product.name}
          width={500}
          height={600}
          className="h-full w-full object-cover group-hover:opacity-75 transition"
        />
      </div>

      <h3 className="mt-4 text-sm text-gray-700">
        {product.name}
      </h3>

      <p className="mt-1 text-lg font-medium text-gray-900">
        Rs {product.price.toLocaleString()}
      </p>
    </Link>
  )
}