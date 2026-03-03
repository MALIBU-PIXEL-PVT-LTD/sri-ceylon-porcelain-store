export interface Product {
    id: string
    slug: string
    name: string
    description: string
    price: number
    images: string[]
    sizes?: string[]
    inStock: boolean
}