export const locales = ["en", "ta"] as const;

export type Locale = (typeof locales)[number];

export type Availability = "available" | "out_of_stock";

export type ReviewStatus = "unverified" | "verified";

export type DataOrigin = "development" | "owner_confirmed";

export type PlaceholderArt = "herb" | "flower" | "fruit";

export type LocalizedText = {
  en: string;
  ta: string;
};

export type Category = {
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  sortOrder: number;
};

export type ProductImage = {
  id: string;
  alt: LocalizedText;
  sortOrder: number;
  storageKey: string;
  art: PlaceholderArt;
};

export type BulkPriceTier = {
  minQuantity: number;
  pricePaise: number;
};

export type Product = {
  id: string;
  slug: string;
  categorySlug: string;
  name: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  care: LocalizedText;
  pricePaise: number;
  stockQuantity: number;
  availability: Availability;
  featured: boolean;
  featuredOrder: number | null;
  images: ProductImage[];
  bulkPriceTiers: BulkPriceTier[];
  translationStatus: ReviewStatus;
  dataOrigin: DataOrigin;
};

export type CareGuide = {
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  body: LocalizedText;
  sortOrder: number;
  translationStatus: ReviewStatus;
};

export type CatalogueSnapshot = {
  categories: Category[];
  products: Product[];
  careGuides: CareGuide[];
};

export type CatalogueQuery = {
  locale: Locale;
  categorySlug?: string;
  search?: string;
  availability?: Availability | "all";
  sort?: "featured" | "name" | "price-asc" | "price-desc";
};

export function textFor(value: LocalizedText, locale: Locale): string {
  return value[locale];
}
