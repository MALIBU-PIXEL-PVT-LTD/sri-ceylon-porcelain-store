import type { Product } from "@/types/product";

export type PublicProductApi = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  images: string[];
  quantity: number;
  color: string;
  size: string;
  sku: string;
};

const DEFAULT_PORTAL_GRAPHQL = "https://portal.sriceylonporcelain.com/api/graphql";

function graphqlEndpoint(): string {
  return (
    process.env.GRAPHQL_URL ||
    process.env.NEXT_PUBLIC_GRAPHQL_URL ||
    DEFAULT_PORTAL_GRAPHQL
  );
}

async function graphqlFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(graphqlEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });
  const json = await res.json();
  if (!res.ok || json.errors?.length) {
    throw new Error(json.errors?.[0]?.message || "Failed to load products");
  }
  return json.data as T;
}

function colorLabelToHex(label: string): string {
  const key = label.trim().toLowerCase();
  const map: Record<string, string> = {
    white: "#fafaf9",
    black: "#1c1917",
    yellow: "#eab308",
    grey: "#78716c",
    gray: "#78716c",
    blue: "#2563eb",
    red: "#dc2626",
    green: "#16a34a",
  };
  return map[key] || "#78716c";
}

export function publicProductToProduct(p: PublicProductApi): Product {
  const slugId = p.color
    ? p.color.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "color"
    : "default";

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    description: p.description,
    price: p.price,
    images: p.images.length > 0 ? p.images : ["/placeholder.jpg"],
    sizes: p.size ? [p.size] : [],
    colors: p.color
      ? [{ id: slugId, label: p.color, hex: colorLabelToHex(p.color) }]
      : [],
    inStock: p.quantity > 0,
    availableQuantity: p.quantity,
    sku: p.sku,
  };
}

export async function fetchPublicProducts(): Promise<PublicProductApi[]> {
  const data = await graphqlFetch<{ publicProducts: PublicProductApi[] }>(`
    query {
      publicProducts {
        id
        slug
        name
        shortDescription
        description
        price
        images
        quantity
        color
        size
        sku
      }
    }
  `);
  return data.publicProducts ?? [];
}

export async function fetchPublicProductBySlug(slug: string): Promise<PublicProductApi | null> {
  const data = await graphqlFetch<{ publicProductBySlug: PublicProductApi | null }>(
    `
    query PublicProductBySlug($slug: String!) {
      publicProductBySlug(slug: $slug) {
        id
        slug
        name
        shortDescription
        description
        price
        images
        quantity
        color
        size
        sku
      }
    }
  `,
    { slug }
  );
  return data.publicProductBySlug ?? null;
}
