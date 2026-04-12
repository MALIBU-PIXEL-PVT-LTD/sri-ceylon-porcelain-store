import type { Product, ProductColor } from "@/types/product";

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

export type PublicProductVariant = {
  id: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  price: number;
  images: string[];
  quantity: number;
  color: string;
  size: string;
};

export type PublicProductGroup = {
  groupSlug: string;
  name: string;
  shortDescription: string;
  description: string;
  variants: PublicProductVariant[];
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

export function colorLabelToHex(label: string): string {
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

export function colorIdFromLabel(label: string): string {
  const t = String(label || "").trim();
  if (!t) return "default";
  return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "color";
}

export function colorsFromVariants(variants: PublicProductVariant[]): ProductColor[] {
  const seen = new Map<string, ProductColor>();
  for (const v of variants) {
    const label = String(v.color || "").trim();
    if (!label) continue;
    const id = colorIdFromLabel(label);
    if (!seen.has(id)) {
      seen.set(id, { id, label, hex: colorLabelToHex(label) });
    }
  }
  return [...seen.values()];
}

export function sizesForColorSelection(
  variants: PublicProductVariant[],
  colorId?: string
): string[] {
  const set = new Set<string>();
  for (const v of variants) {
    if (colorId != null && colorId !== "") {
      if (colorIdFromLabel(String(v.color || "")) !== colorId) continue;
    }
    const sz = String(v.size || "").trim();
    if (sz) set.add(sz);
  }
  return [...set].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export function findVariantBySelection(
  variants: PublicProductVariant[],
  colorId?: string,
  size?: string
): PublicProductVariant | null {
  const sz = size !== undefined ? String(size).trim() : undefined;
  return (
    variants.find((v) => {
      if (colorId != null && colorId !== "") {
        if (colorIdFromLabel(String(v.color || "")) !== colorId) return false;
      }
      if (sz !== undefined && String(v.size || "").trim() !== sz) return false;
      return true;
    }) ?? null
  );
}

export function pickDefaultVariant(variants: PublicProductVariant[]): PublicProductVariant {
  const inStock = variants.filter((v) => v.quantity > 0);
  const pool = inStock.length ? inStock : variants;
  return pool[0];
}

/** Single-variant `Product` for cart + PDP (variant copy, incl. descriptions per swatch). */
export function variantToCartProduct(
  v: PublicProductVariant,
  group: PublicProductGroup
): Product {
  const colorId = colorIdFromLabel(v.color);
  const shortDesc = String(v.shortDescription || "").trim() || group.shortDescription;
  const longDesc = String(v.description || "").trim() || group.description;
  return {
    id: v.id,
    slug: group.groupSlug,
    name: group.name,
    shortDescription: shortDesc,
    description: longDesc,
    price: v.price,
    images: v.images.length > 0 ? v.images : ["/placeholder.jpg"],
    sizes: v.size ? [String(v.size).trim()] : [],
    colors: v.color
      ? [{ id: colorId, label: String(v.color).trim(), hex: colorLabelToHex(v.color) }]
      : [],
    inStock: v.quantity > 0,
    availableQuantity: v.quantity,
    sku: v.sku,
  };
}

/** One card per product title; links use `groupSlug`. */
export function publicProductGroupToListProduct(g: PublicProductGroup): Product {
  const prices = g.variants.map((v) => v.price);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const inStock = g.variants.some((v) => v.quantity > 0);
  const hero = g.variants.find((v) => v.quantity > 0) ?? g.variants[0];
  const images = hero.images?.length ? hero.images : ["/placeholder.jpg"];

  return {
    id: g.groupSlug,
    slug: g.groupSlug,
    name: g.name,
    shortDescription: g.shortDescription,
    description: g.description,
    price: minP,
    images,
    sizes: [],
    colors: [],
    inStock,
    priceRangeMax: maxP > minP ? maxP : undefined,
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

export async function fetchPublicProductGroups(): Promise<PublicProductGroup[]> {
  const data = await graphqlFetch<{ publicProductGroups: PublicProductGroup[] }>(`
    query {
      publicProductGroups {
        groupSlug
        name
        shortDescription
        description
        variants {
          id
          slug
          sku
          shortDescription
          description
          price
          images
          quantity
          color
          size
        }
      }
    }
  `);
  return data.publicProductGroups ?? [];
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

export async function fetchPublicProductGroupBySlug(
  slug: string
): Promise<PublicProductGroup | null> {
  const data = await graphqlFetch<{ publicProductGroupBySlug: PublicProductGroup | null }>(
    `
    query PublicProductGroupBySlug($slug: String!) {
      publicProductGroupBySlug(slug: $slug) {
        groupSlug
        name
        shortDescription
        description
        variants {
          id
          slug
          sku
          shortDescription
          description
          price
          images
          quantity
          color
          size
        }
      }
    }
  `,
    { slug }
  );
  return data.publicProductGroupBySlug ?? null;
}
