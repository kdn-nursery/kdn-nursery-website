import type { CatalogueRepository } from "@/server/catalogue/demo-repository";
import { listFeatured, queryProducts } from "@/server/catalogue/query";
import type {
  CareGuide,
  CatalogueQuery,
  Category,
  PlaceholderArt,
  Product,
} from "@/server/catalogue/types";
import { getPrismaClient } from "@/server/db";

function artFromStorageKey(storageKey: string): PlaceholderArt {
  if (storageKey.endsWith(":flower") || storageKey.endsWith("/flower")) return "flower";
  if (storageKey.endsWith(":fruit") || storageKey.endsWith("/fruit")) return "fruit";
  if (storageKey.endsWith(":herb") || storageKey.endsWith("/herb")) return "herb";
  return "herb";
}

type ProductRow = {
  slug: string;
  nameEn: string;
  nameTa: string;
  summaryEn: string;
  summaryTa: string;
  descriptionEn: string;
  descriptionTa: string;
  careEn: string;
  careTa: string;
  pricePaise: number;
  stockQuantity: number;
  availability: "AVAILABLE" | "OUT_OF_STOCK";
  isFeatured: boolean;
  featuredOrder: number | null;
  translationStatus: "UNVERIFIED" | "VERIFIED";
  dataOrigin: "DEVELOPMENT" | "OWNER_CONFIRMED";
  category: { slug: string };
  images: Array<{
    id: string;
    altEn: string;
    altTa: string;
    sortOrder: number;
    storageKey: string;
  }>;
  bulkPriceTiers: Array<{ minQuantity: number; pricePaise: number }>;
};

function mapProduct(row: ProductRow): Product {
  const images = row.images.length
    ? row.images
    : [
        {
          id: `${row.slug}-placeholder`,
          altEn: row.nameEn,
          altTa: row.nameTa,
          sortOrder: 0,
          storageKey: "placeholder:herb",
        },
      ];

  return {
    id: row.slug,
    slug: row.slug,
    categorySlug: row.category.slug,
    name: { en: row.nameEn, ta: row.nameTa },
    summary: { en: row.summaryEn, ta: row.summaryTa },
    description: { en: row.descriptionEn, ta: row.descriptionTa },
    care: { en: row.careEn, ta: row.careTa },
    pricePaise: row.pricePaise,
    stockQuantity: row.stockQuantity,
    availability: row.availability === "AVAILABLE" ? "available" : "out_of_stock",
    featured: row.isFeatured,
    featuredOrder: row.featuredOrder,
    images: images.map((image) => ({
      id: image.id,
      alt: { en: image.altEn, ta: image.altTa },
      sortOrder: image.sortOrder,
      storageKey: image.storageKey,
      art: artFromStorageKey(image.storageKey),
    })),
    bulkPriceTiers: row.bulkPriceTiers.map((tier) => ({
      minQuantity: tier.minQuantity,
      pricePaise: tier.pricePaise,
    })),
    translationStatus: row.translationStatus === "VERIFIED" ? "verified" : "unverified",
    dataOrigin: row.dataOrigin === "OWNER_CONFIRMED" ? "owner_confirmed" : "development",
  };
}

async function loadProducts(): Promise<Product[]> {
  const rows = await getPrismaClient().product.findMany({
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      bulkPriceTiers: { orderBy: { minQuantity: "asc" } },
    },
  });
  return rows.map(mapProduct);
}

export function createPrismaCatalogueRepository(): CatalogueRepository {
  return {
    mode: "database",
    async listCategories() {
      const rows = await getPrismaClient().category.findMany({
        orderBy: { sortOrder: "asc" },
      });
      return rows.map(
        (row): Category => ({
          slug: row.slug,
          name: { en: row.nameEn, ta: row.nameTa },
          description: { en: row.descriptionEn, ta: row.descriptionTa },
          sortOrder: row.sortOrder,
        }),
      );
    },
    async listProducts(query: CatalogueQuery) {
      return queryProducts(await loadProducts(), query);
    },
    async getProduct(categorySlug, productSlug) {
      const products = await loadProducts();
      return (
        products.find(
          (product) =>
            product.categorySlug === categorySlug && product.slug === productSlug,
        ) ?? null
      );
    },
    async listFeatured() {
      return listFeatured(await loadProducts());
    },
    async listCareGuides() {
      const rows = await getPrismaClient().careGuide.findMany({
        orderBy: { sortOrder: "asc" },
      });
      return rows.map(
        (row): CareGuide => ({
          slug: row.slug,
          title: { en: row.titleEn, ta: row.titleTa },
          summary: { en: row.summaryEn, ta: row.summaryTa },
          body: { en: row.bodyEn, ta: row.bodyTa },
          sortOrder: row.sortOrder,
          translationStatus: row.translationStatus === "VERIFIED" ? "verified" : "unverified",
        }),
      );
    },
    async getCareGuide(slug) {
      const guides = await this.listCareGuides();
      return guides.find((guide) => guide.slug === slug) ?? null;
    },
  };
}
