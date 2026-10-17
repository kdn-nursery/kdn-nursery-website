"use client";

import { useSyncExternalStore } from "react";
import { parseCartLines, parseWishlist, type CartLine } from "@/lib/cart";

const CART_KEY = "kdn.cart.v1";
const WISHLIST_KEY = "kdn.wishlist.v1";
const emptyCart: CartLine[] = [];
const emptyWishlist: string[] = [];

function createJsonStore<T>(key: string, fallback: T, parse: (value: unknown) => T) {
  const listeners = new Set<() => void>();
  let raw: string | null | undefined;
  let snapshot = fallback;

  function read(): T {
    const nextRaw = window.localStorage.getItem(key);
    if (nextRaw === raw) return snapshot;
    raw = nextRaw;
    if (!nextRaw) {
      snapshot = fallback;
      return snapshot;
    }
    try {
      snapshot = parse(JSON.parse(nextRaw) as unknown);
    } catch {
      snapshot = fallback;
    }
    return snapshot;
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      const onStorage = (event: StorageEvent) => {
        if (event.key !== key && event.key !== null) return;
        raw = undefined;
        listeners.forEach((item) => item());
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot() {
      return read();
    },
    getServerSnapshot() {
      return fallback;
    },
    set(value: T) {
      const encoded = JSON.stringify(value);
      window.localStorage.setItem(key, encoded);
      raw = encoded;
      snapshot = value;
      listeners.forEach((listener) => listener());
    },
  };
}

const cartStore = createJsonStore(CART_KEY, emptyCart, parseCartLines);
const wishlistStore = createJsonStore(WISHLIST_KEY, emptyWishlist, parseWishlist);

export function useCartLines(): CartLine[] {
  return useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
}

export function setCartLines(lines: CartLine[]) {
  cartStore.set(lines);
}

export function useWishlistIds(): string[] {
  return useSyncExternalStore(
    wishlistStore.subscribe,
    wishlistStore.getSnapshot,
    wishlistStore.getServerSnapshot,
  );
}

export function setWishlistIds(ids: string[]) {
  wishlistStore.set(ids);
}

const noopSubscribe = () => () => {};

export function useHasMounted(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
