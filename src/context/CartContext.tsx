"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { CartLine } from "@/types/cart";
import type { Product } from "@/types/product";

function lineId(product: Product, size?: string, colorId?: string) {
  const parts: string[] = [product.id];
  if (product.sizes?.length && size) parts.push(size);
  if (product.colors?.length && colorId) parts.push(colorId);
  return parts.join("__");
}

function productToLine(product: Product, size?: string, colorId?: string): CartLine {
  const colorLabel = product.colors?.find((c) => c.id === colorId)?.label;
  return {
    id: lineId(product, size, colorId),
    slug: product.slug,
    name: product.name,
    image: product.images[0] ?? "/placeholder.jpg",
    price: product.price,
    quantity: 1,
    size: product.sizes?.length ? size : undefined,
    color: colorLabel,
  };
}

type CartContextValue = {
  lines: CartLine[];
  totalQuantity: number;
  totalPrice: number;
  cartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addItem: (product: Product, size?: string, colorId?: string) => void;
  updateQuantity: (lineId: string, delta: number) => void;
  removeLine: (lineId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const openCartDrawer = useCallback(() => setCartDrawerOpen(true), []);
  const closeCartDrawer = useCallback(() => setCartDrawerOpen(false), []);

  const addItem = useCallback((product: Product, size?: string, colorId?: string) => {
    if (!product.inStock) return;
    if (product.sizes?.length && !size) return;
    if (product.colors?.length && !colorId) return;

    const id = lineId(product, size, colorId);
    setLines((prev) => {
      const i = prev.findIndex((l) => l.id === id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + 1 };
        return next;
      }
      return [...prev, productToLine(product, size, colorId)];
    });
    setCartDrawerOpen(true);
  }, []);

  const updateQuantity = useCallback((lineId: string, delta: number) => {
    setLines((prev) =>
      prev
        .map((line) =>
          line.id === lineId
            ? { ...line, quantity: Math.max(0, line.quantity + delta) }
            : line
        )
        .filter((line) => line.quantity > 0)
    );
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((line) => line.id !== lineId));
  }, []);

  const totalQuantity = useMemo(
    () => lines.reduce((s, l) => s + l.quantity, 0),
    [lines]
  );

  const totalPrice = useMemo(
    () => lines.reduce((s, l) => s + l.price * l.quantity, 0),
    [lines]
  );

  const value = useMemo(
    () => ({
      lines,
      totalQuantity,
      totalPrice,
      cartDrawerOpen,
      openCartDrawer,
      closeCartDrawer,
      addItem,
      updateQuantity,
      removeLine,
    }),
    [
      lines,
      totalQuantity,
      totalPrice,
      cartDrawerOpen,
      openCartDrawer,
      closeCartDrawer,
      addItem,
      updateQuantity,
      removeLine,
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
