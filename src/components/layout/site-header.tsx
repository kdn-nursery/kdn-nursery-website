import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { Wordmark } from "@/components/brand/plant-art";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { StoreLinks } from "@/components/layout/store-links";
import { Link } from "@/i18n/navigation";

const links = [
  ["/", "home"],
  ["/shop", "shop"],
  ["/plant-care", "plantCare"],
  ["/about", "about"],
  ["/contact", "contact"],
] as const;

export async function SiteHeader() {
  const t = await getTranslations("Nav");

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
        <Link href="/" className="flex min-h-11 items-center gap-3">
          <Wordmark />
          <span>
            <span className="block font-display text-lg leading-none text-forest">KDN Nursery</span>
            <span className="mt-1 block text-xs text-muted-foreground">Kaviyadevan Nursery Garden</span>
          </span>
        </Link>
        <nav aria-label={t("primary")} className="ml-6 hidden items-center gap-1 md:flex">
          {links.map(([href, key]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-3 py-2 text-sm hover:bg-secondary"
            >
              {t(key)}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Suspense fallback={<div className="h-11 w-36 rounded-full bg-muted" />}>
            <LanguageSwitcher />
          </Suspense>
          <StoreLinks />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
