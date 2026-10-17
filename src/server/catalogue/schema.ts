import { z } from "zod";

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase slug");

const localized = z.object({
  en: z.string().trim().min(1),
  ta: z.string().trim().min(1),
});

export const categorySchema = z.object({
  slug,
  name: localized,
  description: localized,
  sortOrder: z.number().int(),
});

export const productImageSchema = z.object({
  id: z.string().min(1),
  alt: localized,
  sortOrder: z.number().int().nonnegative(),
  storageKey: z.string().regex(/^(?:placeholder:coming-soon|local:\/plants\/[a-z0-9-]+\.webp)$/),
  art: z.enum(["herb", "flower", "fruit"]),
});

export const bulkPriceTierSchema = z.object({
  minQuantity: z.number().int().min(2),
  pricePaise: z.number().int().nonnegative(),
});

export const productSchema = z
  .object({
    id: z.string().min(1),
    slug,
    categorySlug: slug,
    name: localized,
    summary: localized,
    description: localized,
    care: localized,
    pricePaise: z.number().int().nonnegative(),
    stockQuantity: z.number().int().nonnegative(),
    availability: z.enum(["available", "out_of_stock"]),
    featured: z.boolean(),
    featuredOrder: z.number().int().nullable(),
    images: z.array(productImageSchema).min(1),
    bulkPriceTiers: z.array(bulkPriceTierSchema),
    translationStatus: z.enum(["unverified", "verified"]),
    dataOrigin: z.enum(["development", "owner_confirmed"]),
  })
  .superRefine((product, context) => {
    if (product.availability === "out_of_stock" && product.stockQuantity !== 0) {
      context.addIssue({
        code: "custom",
        path: ["stockQuantity"],
        message: "Out-of-stock products must record zero stock",
      });
    }

    if (product.availability === "available" && product.stockQuantity < 1) {
      context.addIssue({
        code: "custom",
        path: ["stockQuantity"],
        message: "Available products need a stock quantity",
      });
    }

    if (product.featured && product.featuredOrder === null) {
      context.addIssue({
        code: "custom",
        path: ["featuredOrder"],
        message: "Featured products need a display order",
      });
    }
  });

export const careGuideSchema = z.object({
  slug,
  title: localized,
  summary: localized,
  body: localized,
  sortOrder: z.number().int(),
  translationStatus: z.enum(["unverified", "verified"]),
});

export const catalogueSnapshotSchema = z
  .object({
    categories: z.array(categorySchema).min(1),
    products: z.array(productSchema).min(1),
    careGuides: z.array(careGuideSchema).min(1),
  })
  .superRefine((catalogue, context) => {
    const categorySlugs = new Set(catalogue.categories.map((category) => category.slug));
    const productKeys = new Set<string>();

    for (const product of catalogue.products) {
      if (!categorySlugs.has(product.categorySlug)) {
        context.addIssue({
          code: "custom",
          message: `Unknown category ${product.categorySlug} on ${product.slug}`,
        });
      }

      const key = `${product.categorySlug}/${product.slug}`;
      if (productKeys.has(key)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate product route ${key}`,
        });
      }
      productKeys.add(key);
    }
  });
