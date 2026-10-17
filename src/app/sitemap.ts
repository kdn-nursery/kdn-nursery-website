import type { MetadataRoute } from "next";
import { policySlugs } from "@/i18n/locale";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const paths = ["", "/shop", "/about", "/contact", "/plant-care", "/cart", "/wishlist"];
  for (const slug of policySlugs) paths.push(`/policies/${slug}`);
  return ["en", "ta"].flatMap((locale) =>
    paths.map((path) => ({
      url: `${site}/${locale}${path}`,
    })),
  );
}
