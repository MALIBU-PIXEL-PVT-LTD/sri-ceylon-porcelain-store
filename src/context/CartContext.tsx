"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { CartLine } from "@/types/cart";
import type { Product } from "@/types/product";

const CART_STORAGE_KEY = "sri-ceylon-porcelain-cart-v1";

function parseStoredLines(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(isCartLine);
  } catch {
    return [];
  }
}

function isCartLine(x: unknown): x is CartLine {
  if (x === null || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.slug === "string" &&
    typeof o.name === "string" &&
    typeof o.image === "string" &&
    typeof o.price === "number" &&
    typeof o.quantity === "number" &&
    (o.size === undefined || typeof o.size === "string") &&
    (o.color === undefined || typeof o.color === "string")
  );
}

function persistLines(lines: CartLine[]) {
  try {
    if (lines.length === 0) {
      localStorage.removeItem(CART_STORAGE_KEY);
    } else {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    }
  } catch {
    /* quota / private mode */
  }
}

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
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    setLines(parseStoredLines(localStorage.getItem(CART_STORAGE_KEY)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persistLines(lines);
  }, [lines, hydrated]);

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

  const clearCart = useCallback(() => {
    setLines([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      /* ignore */
    }
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
      clearCart,
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
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("must be used within a CartProvider");
  }
  return ctx;
}