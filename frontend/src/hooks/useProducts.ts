"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ProductSchema } from "@/schemas/productSchema";

export type ProductFormData = ProductSchema;

export type Product = {
  id: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  productName: string;
  description?: string;
  basePrice: number;
  variants: ProductFormData["variants"];
};

const STORAGE_KEY = "products";

function getFromStorage(): Product[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as Product[];
  } catch {
    return [];
  }
}

function setToStorage(products: Product[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProducts(getFromStorage());
    setIsLoaded(true);
  }, []);

  const sync = useCallback((next: Product[]) => {
    setToStorage(next);
    setProducts(next);
  }, []);

  const add = useCallback(
    (product: ProductFormData): void => {
      const now = new Date().toISOString();
      const newProduct: Product = {
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        productName: product.productName,
        description: product.description,
        basePrice: product.basePrice,
        variants: product.variants,
      };

      sync([newProduct, ...products]);
    },
    [products, sync],
  );

  const update = useCallback(
    (id: string, product: ProductFormData): void => {
      const now = new Date().toISOString();
      const next = products.map((p) =>
        p.id === id
          ? {
              ...p,
              productName: product.productName,
              description: product.description,
              basePrice: product.basePrice,
              variants: product.variants,
              updatedAt: now,
            }
          : p,
      );

      sync(next);
    },
    [products, sync],
  );

  const remove = useCallback(
    (id: string): void => {
      const next = products.filter((p) => p.id !== id);
      sync(next);
    },
    [products, sync],
  );

  const getById = useCallback(
    (id: string): Product | undefined => {
      return products.find((p) => p.id === id);
    },
    [products],
  );

  const api = useMemo(
    () => ({
      products,
      isLoaded,
      getAll: () => products,
      getById,
      add,
      update,
      remove,
    }),
    [add, getById, isLoaded, products, remove, update],
  );

  return api;
}
