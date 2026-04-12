"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ProductBreadcrumbContextValue = {
  productDetailTitle: string | null;
  setProductDetailTitle: (title: string | null) => void;
};

const ProductBreadcrumbContext = createContext<ProductBreadcrumbContextValue | null>(null);

export function ProductBreadcrumbProvider({ children }: { children: ReactNode }) {
  const [productDetailTitle, setProductDetailTitleState] = useState<string | null>(null);

  const setProductDetailTitle = useCallback((title: string | null) => {
    setProductDetailTitleState(title);
  }, []);

  const value = useMemo(
    () => ({ productDetailTitle, setProductDetailTitle }),
    [productDetailTitle, setProductDetailTitle]
  );

  return (
    <ProductBreadcrumbContext.Provider value={value}>
      {children}
    </ProductBreadcrumbContext.Provider>
  );
}

export function useProductBreadcrumbTitle() {
  const ctx = useContext(ProductBreadcrumbContext);
  if (!ctx) {
    throw new Error("useProductBreadcrumbTitle must be used within ProductBreadcrumbProvider");
  }
  return ctx;
}

/** Registers the catalog product title for the current product detail route (breadcrumb). */
export function SetProductBreadcrumbTitle({ title }: { title: string }) {
  const { setProductDetailTitle } = useProductBreadcrumbTitle();

  useLayoutEffect(() => {
    setProductDetailTitle(title);
    return () => setProductDetailTitle(null);
  }, [title, setProductDetailTitle]);

  return null;
}
