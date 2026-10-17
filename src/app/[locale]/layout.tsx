import type { Metadata } from "next";
import { Fraunces, Noto_Sans_Tamil, Source_Sans_3 } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { routing } from "@/i18n/routing";
import { CatalogueConfigError, resolveCatalogueMode } from "@/server/catalogue/mode";
import "../globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source",
});

const tamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  variable: "--font-tamil",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: {
      default: t("siteName"),
      template: `%s · ${t("siteName")}`,
    },
    description: t("description"),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  let demo = false;
  try {
    demo = resolveCatalogueMode() === "demo";
  } catch (error) {
    if (error instanceof CatalogueConfigError) {
      return (
        <html lang={locale} className={`${display.variable} ${sans.variable} ${tamil.variable}`}>
          <body className="min-h-full bg-background px-6 py-16 font-sans text-foreground">
            <main className="mx-auto max-w-xl">
              <p className="text-sm tracking-[0.16em] text-clay uppercase">KDN Nursery</p>
              <h1 className="mt-3 font-display text-4xl text-forest">Catalogue configuration needed</h1>
              <p className="mt-4 leading-7 text-muted-foreground">{error.message}</p>
            </main>
          </body>
        </html>
      );
    }
    throw error;
  }

  const messages = await getMessages();
  const demoText = await getTranslations("Demo");
  const nav = await getTranslations("Nav");

  return (
    <html lang={locale} className={`${display.variable} ${sans.variable} ${tamil.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            {nav("skip")}
          </a>
          {demo ? (
            <div className="bg-forest px-4 py-2 text-center text-sm text-ivory">
              <strong className="font-medium">{demoText("label")}.</strong> {demoText("body")}
            </div>
          ) : null}
          <SiteHeader />
          <main id="content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
