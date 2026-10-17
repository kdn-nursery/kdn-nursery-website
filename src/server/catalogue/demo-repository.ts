import { listFeatured, queryProducts } from "@/server/catalogue/query";
import { refuseDemoWrite } from "@/server/catalogue/mode";
import { sampleCatalogue } from "@/server/catalogue/sample-data";
import type {
  CareGuide,
  CatalogueQuery,
  Category,
  Product,
} from "@/server/catalogue/types";

export type CatalogueRepository = {
  mode: "demo" | "database";
  listCategories(): Promise<Category[]>;
  listProducts(query: CatalogueQuery): Promise<Product[]>;
  getProduct(categorySlug: string, productSlug: string): Promise<Product | null>;
  listFeatured(): Promise<Product[]>;
  listCareGuides(): Promise<CareGuide[]>;
  getCareGuide(slug: string): Promise<CareGuide | null>;
};

function bySortOrder<T extends { sortOrder: number }>(items: T[]): T[] {
  return [...items].sort((left, right) => left.sortOrder - right.sortOrder);
}

export const demoCatalogueRepository: CatalogueRepository = {
  mode: "demo",
  async listCategories() {
    return bySortOrder(sampleCatalogue.categories);
  },
  async listProducts(query) {
    return queryProducts(sampleCatalogue.products, query);
  },
  async getProduct(categorySlug, productSlug) {
    return (
      sampleCatalogue.products.find(
        (product) =>
          product.categorySlug === categorySlug && product.slug === productSlug,
      ) ?? null
    );
  },
  async listFeatured() {
    return listFeatured(sampleCatalogue.products);
  },
  async listCareGuides() {
    return bySortOrder(sampleCatalogue.careGuides);
  },
  async getCareGuide(slug) {
    return sampleCatalogue.careGuides.find((guide) => guide.slug === slug) ?? null;
  },
};

export function demoCatalogueWrite(action: string): never {
  return refuseDemoWrite(action);
}
