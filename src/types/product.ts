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
}