import type { CartLine } from "@/types/cart";

/** Demo cart — replace with real state / API later. */
export const mockCartLines: CartLine[] = [
  {
    id: "1",
    slug: "classic-porcelain-plate",
    name: "Classic Porcelain Plate",
    image: "/products/classic-porcelain-plate-1.jpg",
    price: 2500,
    quantity: 2,
    size: '10"',
  },
  {
    id: "2",
    slug: "premium-porcelain-cup",
    name: "Premium Porcelain Cup",
    image: "/products/premium-porcelain-cup-1.jpg",
    price: 1800,
    quantity: 1,
    size: "200ml",
  },
  {
    id: "3",
    slug: "porcelain-serving-bowl",
    name: "Porcelain Serving Bowl",
    image: "/products/porcelain-serving-bowl-1.jpg",
    price: 4200,
    quantity: 1,
  },
];
