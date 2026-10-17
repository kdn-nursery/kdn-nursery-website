import { describe, expect, it } from "vitest";
import { addToCart, indicativeLineTotal, parseCartLines, setCartQuantity, toggleWishlist } from "@/lib/cart";
import { formatInr } from "@/lib/money";
import { parseShopQuery } from "@/lib/shop-query";
import { whatsappEnquiryHref } from "@/lib/whatsapp";
import { demoCatalogueWrite } from "@/server/catalogue/demo-repository";
import {
  CatalogueConfigError,
  DemoWriteError,
  resolveCatalogueMode,
} from "@/server/catalogue/mode";
import { queryProducts } from "@/server/catalogue/query";
import { sampleCatalogue } from "@/server/catalogue/sample-data";

const products = sampleCatalogue.products;

describe("catalogue search", () => {
  it("matches English and Tamil product names", () => {
    const english = queryProducts(products, { locale: "en", search: "mint" });
    const tamil = queryProducts(products, { locale: "ta", search: "புதினா" });

    expect(english.map((product) => product.slug)).toEqual(["mint"]);
    expect(tamil.map((product) => product.slug)).toEqual(["mint"]);
  });

  it("filters by category and keeps every initial category represented", () => {
    const slugs = new Set(sampleCatalogue.categories.map((category) => category.slug));
    for (const slug of slugs) {
      expect(
        queryProducts(products, { locale: "en", categorySlug: slug }).length,
      ).toBeGreaterThan(0);
    }
  });

  it("uses a licensed photo only when the plant identity is verified", () => {
    const awaiting = ["hybrid-hibiscus", "december-flower", "fig", "water-apple"];
    for (const product of products) {
      const key = product.images[0]?.storageKey;
      if (awaiting.includes(product.slug)) {
        expect(key).toBe("placeholder:coming-soon");
      } else {
        expect(key).toBe(`local:/plants/${product.slug}.webp`);
      }
    }
  });

  it("marks sample copy and prices as development data", () => {
    expect(products.every((product) => product.dataOrigin === "development")).toBe(true);
    expect(products.every((product) => product.translationStatus === "unverified")).toBe(true);
    expect(products.every((product) => product.pricePaise % 1 === 0)).toBe(true);
  });
});

describe("cart rules", () => {
  const rosemary = products.find((product) => product.slug === "rosemary");
  const waterApple = products.find((product) => product.slug === "water-apple");

  it("refuses out-of-stock products and quantities above stock", () => {
    expect(rosemary?.stockQuantity).toBe(2);
    expect(waterApple?.availability).toBe("out_of_stock");

    const blocked = addToCart([], waterApple, 1);
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) expect(blocked.reason).toBe("out_of_stock");

    const first = addToCart([], rosemary, 2);
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const second = addToCart(first.lines, rosemary, 1);
    expect(second.ok).toBe(false);
    expect(indicativeLineTotal(waterApple!, 1)).toBeNull();
  });

  it("persists only valid cart and wishlist values", () => {
    expect(parseCartLines([{ productId: "mint", quantity: 2 }, { productId: "", quantity: 1 }])).toEqual([
      { productId: "mint", quantity: 2 },
    ]);
    expect(toggleWishlist(["mint"], "mint")).toEqual([]);
    expect(toggleWishlist(["mint"], "guava")).toEqual(["mint", "guava"]);
  });

  it("removes a line when quantity is set to zero", () => {
    const changed = setCartQuantity(
      [{ productId: "mint", quantity: 1 }],
      products.find((product) => product.slug === "mint"),
      0,
    );
    expect(changed).toEqual({ ok: true, lines: [] });
  });
});

describe("catalogue mode", () => {
  it("requires an explicit source and never falls back to demo", () => {
    expect(() => resolveCatalogueMode({ NODE_ENV: "development" })).toThrow(CatalogueConfigError);
    expect(() =>
      resolveCatalogueMode({
        NODE_ENV: "development",
        CATALOGUE_DATA_SOURCE: "database",
      }),
    ).toThrow(/DATABASE_URL/);
  });

  it("allows demo only when asked, and blocks it in production unless preview is explicit", () => {
    expect(
      resolveCatalogueMode({ NODE_ENV: "development", CATALOGUE_DATA_SOURCE: "demo" }),
    ).toBe("demo");
    expect(() =>
      resolveCatalogueMode({ NODE_ENV: "production", CATALOGUE_DATA_SOURCE: "demo" }),
    ).toThrow(CatalogueConfigError);
    expect(
      resolveCatalogueMode({
        NODE_ENV: "production",
        CATALOGUE_DATA_SOURCE: "demo",
        ALLOW_DEMO_CATALOGUE: "true",
      }),
    ).toBe("demo");
  });

  it("refuses writes while the demo adapter is active", () => {
    expect(() => demoCatalogueWrite("reserve stock")).toThrow(DemoWriteError);
  });
});

describe("public configuration", () => {
  it("formats paise as rupees and hides WhatsApp until a number is configured", () => {
    expect(formatInr(14900, "en")).toContain("149");
    expect(whatsappEnquiryHref("Hello", null)).toBeNull();
    expect(whatsappEnquiryHref("Hello", "919876543210")).toContain(
      "https://wa.me/919876543210",
    );
  });

  it("drops invalid shop filters", () => {
    expect(parseShopQuery("ta", { sort: "discount", q: "  மா  " })).toMatchObject({
      locale: "ta",
      sort: "featured",
      search: "மா",
    });
  });
});
