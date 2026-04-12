/** Optional `linkedSize` ties a swatch to a size (e.g. cup SKU: color ↔ capacity). */
export interface ProductColor {
    id: string
    label: string
    /** CSS color for the swatch fill */
    hex: string
    linkedSize?: string
}

export interface Product {
    id: string
    slug: string
    name: string
    shortDescription: string
    description: string
    price: number
    images: string[]
    sizes?: string[]
    colors?: ProductColor[]
    inStock: boolean
    /** On-hand quantity from inventory (when loaded from API). */
    availableQuantity?: number
    /** Primary SKU when sourced from inventory. */
    sku?: string
    /** When set, listing shows a price range (e.g. grouped variants). */
    priceRangeMax?: number
}