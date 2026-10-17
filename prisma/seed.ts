import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { sampleCatalogue } from "../src/server/catalogue/sample-data";

function assertSeedAllowed(): string {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error("Refusing to seed: DATABASE_URL is not set.");
  }

  if (process.env.NODE_ENV === "production" && process.env.SEED_DEVELOPMENT_DATABASE !== "true") {
    throw new Error(
      "Refusing to seed while NODE_ENV=production. Set SEED_DEVELOPMENT_DATABASE=true only for a development database.",
    );
  }

  return databaseUrl;
}

async function main() {
  const connectionString = assertSeedAllowed();
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  console.log("Seeding development catalogue. Prices, stock and Tamil copy are sample data.");

  try {
    for (const category of sampleCatalogue.categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        create: {
          slug: category.slug,
          nameEn: category.name.en,
          nameTa: category.name.ta,
          descriptionEn: category.description.en,
          descriptionTa: category.description.ta,
          sortOrder: category.sortOrder,
        },
        update: {
          nameEn: category.name.en,
          nameTa: category.name.ta,
          descriptionEn: category.description.en,
          descriptionTa: category.description.ta,
          sortOrder: category.sortOrder,
        },
      });
    }

    for (const product of sampleCatalogue.products) {
      const category = await prisma.category.findUniqueOrThrow({
        where: { slug: product.categorySlug },
      });

      const saved = await prisma.product.upsert({
        where: {
          categoryId_slug: { categoryId: category.id, slug: product.slug },
        },
        create: {
          slug: product.slug,
          categoryId: category.id,
          nameEn: product.name.en,
          nameTa: product.name.ta,
          summaryEn: product.summary.en,
          summaryTa: product.summary.ta,
          descriptionEn: product.description.en,
          descriptionTa: product.description.ta,
          careEn: product.care.en,
          careTa: product.care.ta,
          pricePaise: product.pricePaise,
          stockQuantity: product.stockQuantity,
          availability: product.availability === "available" ? "AVAILABLE" : "OUT_OF_STOCK",
          isFeatured: product.featured,
          featuredOrder: product.featuredOrder,
          translationStatus: "UNVERIFIED",
          dataOrigin: "DEVELOPMENT",
        },
        update: {
          nameEn: product.name.en,
          nameTa: product.name.ta,
          summaryEn: product.summary.en,
          summaryTa: product.summary.ta,
          descriptionEn: product.description.en,
          descriptionTa: product.description.ta,
          careEn: product.care.en,
          careTa: product.care.ta,
          pricePaise: product.pricePaise,
          stockQuantity: product.stockQuantity,
          availability: product.availability === "available" ? "AVAILABLE" : "OUT_OF_STOCK",
          isFeatured: product.featured,
          featuredOrder: product.featuredOrder,
          translationStatus: "UNVERIFIED",
          dataOrigin: "DEVELOPMENT",
        },
      });

      for (const image of product.images) {
        await prisma.productImage.upsert({
          where: { id: image.id },
          create: {
            id: image.id,
            productId: saved.id,
            altEn: image.alt.en,
            altTa: image.alt.ta,
            sortOrder: image.sortOrder,
            storageKey: image.storageKey,
          },
          update: {
            productId: saved.id,
            altEn: image.alt.en,
            altTa: image.alt.ta,
            sortOrder: image.sortOrder,
            storageKey: image.storageKey,
          },
        });
      }

      const tierQuantities = product.bulkPriceTiers.map((tier) => tier.minQuantity);
      await prisma.bulkPriceTier.deleteMany({
        where: {
          productId: saved.id,
          minQuantity: { notIn: tierQuantities.length ? tierQuantities : [-1] },
        },
      });

      for (const tier of product.bulkPriceTiers) {
        await prisma.bulkPriceTier.upsert({
          where: {
            productId_minQuantity: {
              productId: saved.id,
              minQuantity: tier.minQuantity,
            },
          },
          create: {
            productId: saved.id,
            minQuantity: tier.minQuantity,
            pricePaise: tier.pricePaise,
          },
          update: { pricePaise: tier.pricePaise },
        });
      }
    }

    for (const guide of sampleCatalogue.careGuides) {
      await prisma.careGuide.upsert({
        where: { slug: guide.slug },
        create: {
          slug: guide.slug,
          titleEn: guide.title.en,
          titleTa: guide.title.ta,
          summaryEn: guide.summary.en,
          summaryTa: guide.summary.ta,
          bodyEn: guide.body.en,
          bodyTa: guide.body.ta,
          sortOrder: guide.sortOrder,
          translationStatus: "UNVERIFIED",
        },
        update: {
          titleEn: guide.title.en,
          titleTa: guide.title.ta,
          summaryEn: guide.summary.en,
          summaryTa: guide.summary.ta,
          bodyEn: guide.body.en,
          bodyTa: guide.body.ta,
          sortOrder: guide.sortOrder,
          translationStatus: "UNVERIFIED",
        },
      });
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Seed failed");
  process.exit(1);
});
