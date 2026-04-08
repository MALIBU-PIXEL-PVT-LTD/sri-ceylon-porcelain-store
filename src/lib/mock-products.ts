import type { Product } from "@/types/product";

export const mockProducts: Product[] = [
  {
    id: "1",
    slug: "classic-porcelain-plate",
    name: "Classic Porcelain Plate",
    shortDescription:
      "Elegant white porcelain dinner plate with a smooth glazed finish, perfect for everyday use and refined table settings.",
    description: "Timeless in form and flawless in finish, this elegant white porcelain dinner plate brings quiet sophistication to every table setting. Crafted for both daily use and special occasions, its smooth glazed surface and balanced weight make it a staple piece that never goes out of style.",
    price: 2500,
    images: [
      "/products/classic-porcelain-plate-1.jpg",
      "/products/classic-porcelain-plate-2.jpg",
    ],
    sizes: ['8"', '10"', '12"'],
    colors: [{ id: "white", label: "White", hex: "#fafaf9" }],
    inStock: true,
  },
  {
    id: "2",
    slug: "premium-porcelain-cup",
    name: "Premium Porcelain Cup",
    shortDescription:
      "Minimalist porcelain cup with clean lines and a refined feel, ideal for daily coffee or afternoon tea rituals.",
    description: "Stripped of all excess, this minimalist porcelain cup is designed to let the ritual take center stage — whether it's your morning coffee or an afternoon tea. Its clean lines and delicate walls offer a refined drinking experience that feels as good in the hand as it looks on the shelf.",
    price: 1800,
    images: [
      "/products/premium-porcelain-cup-1.jpg",
      "/products/premium-porcelain-cup-2.jpg",
    ],
    sizes: ['200ml', '250ml', '300ml'],
    colors: [
      { id: "black", label: "Black", hex: "#1c1917", linkedSize: "200ml" },
      { id: "white", label: "White", hex: "#fafaf9", linkedSize: "250ml" },
      { id: "yellow", label: "Yellow", hex: "#eab308", linkedSize: "300ml" },
    ],
    inStock: true,
  },
  {
    id: "3",
    slug: "porcelain-serving-bowl",
    name: "Porcelain Serving Bowl",
    shortDescription:
      "Generous porcelain serving bowl that moves seamlessly from everyday family meals to elevated table presentations.",
    description: "A versatile piece that combines form and function, this porcelain serving bowl is perfect for everything from salads to pasta. Its generous size and elegant shape make it a standout on any dining table, while the durable glaze ensures it can handle both everyday meals and special gatherings with ease.",
    price: 4200,
    images: [
      "/products/porcelain-serving-bowl-1.jpg",
      "/products/porcelain-serving-bowl-2.jpg",
    ],
    sizes: ['8"', '10"', '12"'],
    inStock: true,
  },
  {
    id: "4",
    slug: "artisan-porcelain-mug",
    name: "Artisan Porcelain Mug",
    shortDescription:
      "Handcrafted porcelain mug with subtle artisanal character, made to bring warmth and texture to daily sipping.",
    description: "Handcrafted with care, this artisan porcelain mug is a celebration of craftsmanship and individuality. Each piece is unique, with subtle variations in shape and glaze that tell the story of its creation. Perfect for sipping your favorite hot beverage, this mug adds a touch of artistry to your daily routine.",
    price: 2200,
    images: [
      "/products/artisan-porcelain-mug-1.jpg",
      "/products/artisan-porcelain-mug-2.jpg",
    ],
    inStock: false,
    sizes: ['200ml', '250ml', '300ml'],
  },
];