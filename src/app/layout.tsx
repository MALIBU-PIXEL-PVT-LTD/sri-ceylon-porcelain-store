import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col text-stone-900">
        <CartProvider>
          <Navbar />

          <main className="flex-1 py-10">
            <Container>{children}</Container>
          </main>

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}