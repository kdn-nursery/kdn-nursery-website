"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@/i18n/navigation";

const links = [
  ["/", "home"],
  ["/shop", "shop"],
  ["/plant-care", "plantCare"],
  ["/about", "about"],
  ["/contact", "contact"],
] as const;

export function MobileMenu() {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-full hover:bg-secondary"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" aria-hidden="true" />
        <span className="sr-only">{t("menu")}</span>
      </button>
      {open
        ? createPortal(
            <div className="fixed inset-0 z-50 bg-forest-deep/40" onClick={() => setOpen(false)}>
              <div
                id="mobile-navigation"
                role="dialog"
                aria-modal="true"
                aria-label={t("primary")}
                className="ml-auto flex h-full w-[min(100%,20rem)] flex-col gap-2 bg-background p-4 shadow-xl"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  className="inline-flex size-11 items-center justify-center self-end rounded-full hover:bg-secondary"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-5" aria-hidden="true" />
                  <span className="sr-only">{t("closeMenu")}</span>
                </button>
                {links.map(([href, key]) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded-2xl px-3 py-3 text-lg hover:bg-secondary"
                    onClick={() => setOpen(false)}
                  >
                    {t(key)}
                  </Link>
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
