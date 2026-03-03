import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-[#F5F5F5] to-white min-h-screen">
        <header className="border-b">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
            <h1 className="font-bold text-lg">
              Sri Ceylon Porcelain
            </h1>
            <nav className="space-x-6">
              <a href="/" className="hover:underline">Home</a>
              <a href="/products" className="hover:underline">Products</a>
            </nav>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {children}
        </div>

        <footer className="border-t mt-20 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Sri Ceylon Porcelain
        </footer>
      </body>
    </html>
  );
}