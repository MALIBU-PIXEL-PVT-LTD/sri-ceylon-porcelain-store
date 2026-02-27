export const revalidate = 3600

export default function ProductPage({
    params,
}: {
    params: { slug: string }
}) {
    return (
        <main className="p-10">
            <h1 className="text-3xl font-bold">
                Product: {params.slug}
            </h1>
        </main>
    )
}