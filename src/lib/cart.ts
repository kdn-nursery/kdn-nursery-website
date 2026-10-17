import type { Availability } from "@/server/catalogue/types";

export type CartLine = {
  productId: string;
  quantity: number;
};

export type CartProduct = {
  id: string;
  stockQuantity: number;
  availability: Availability;
  pricePaise: number;
};

export type CartChange =
  | { ok: true; lines: CartLine[] }
  | { ok: false; lines: CartLine[]; reason: "out_of_stock" | "exceeds_stock" | "missing" };

function lineFor(lines: CartLine[], productId: string): CartLine | undefined {
  return lines.find((line) => line.productId === productId);
}

function replaceLine(lines: CartLine[], productId: string, quantity: number): CartLine[] {
  const remaining = lines.filter((line) => line.productId !== productId);
  if (quantity < 1) return remaining;
  return [...remaining, { productId, quantity }];
}

export function addToCart(
  lines: CartLine[],
  product: CartProduct | undefined,
  quantity = 1,
): CartChange {
  if (!product) return { ok: false, lines, reason: "missing" };
  if (product.availability !== "available" || product.stockQuantity < 1) {
    return { ok: false, lines, reason: "out_of_stock" };
  }

  const current = lineFor(lines, product.id)?.quantity ?? 0;
  const next = current + quantity;
  if (next > product.stockQuantity) {
    return { ok: false, lines, reason: "exceeds_stock" };
  }

  return { ok: true, lines: replaceLine(lines, product.id, next) };
}

export function setCartQuantity(
  lines: CartLine[],
  product: CartProduct | undefined,
  quantity: number,
): CartChange {
  if (!product) return { ok: false, lines, reason: "missing" };
  if (quantity < 1) return { ok: true, lines: replaceLine(lines, product.id, 0) };
  if (product.availability !== "available" || product.stockQuantity < 1) {
    return { ok: false, lines, reason: "out_of_stock" };
  }
  if (quantity > product.stockQuantity) {
    return { ok: false, lines, reason: "exceeds_stock" };
  }
  return { ok: true, lines: replaceLine(lines, product.id, quantity) };
}

export function removeFromCart(lines: CartLine[], productId: string): CartLine[] {
  return lines.filter((line) => line.productId !== productId);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

export function indicativeLineTotal(product: CartProduct, quantity: number): number | null {
  if (product.availability !== "available" || product.stockQuantity < 1) return null;
  const capped = Math.min(quantity, product.stockQuantity);
  return product.pricePaise * capped;
}

export function parseCartLines(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const productId = "productId" in entry ? entry.productId : undefined;
    const quantity = "quantity" in entry ? entry.quantity : undefined;
    if (typeof productId !== "string" || !productId) return [];
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1) {
      return [];
    }
    return [{ productId, quantity }];
  });
}

export function toggleWishlist(ids: string[], productId: string): string[] {
  return ids.includes(productId)
    ? ids.filter((id) => id !== productId)
    : [...ids, productId];
}

export function parseWishlist(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
}
