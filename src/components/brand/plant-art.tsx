import type { PlaceholderArt } from "@/server/catalogue/types";
import { cn } from "@/lib/utils";

const wash: Record<PlaceholderArt, string> = {
  herb: "bg-[#e4f0e4]",
  flower: "bg-[#f8e7e0]",
  fruit: "bg-[#f4ead4]",
};

export function PlantArt({
  art,
  label,
  className,
}: {
  art: PlaceholderArt;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative overflow-hidden rounded-[1.4rem]",
        wash[art],
        className,
      )}
    >
      <svg viewBox="0 0 200 250" className="h-full w-full" aria-hidden="true">
        <path
          d="M100 230 C100 180 70 160 70 120 C70 80 100 70 100 40"
          fill="none"
          stroke="#1b4332"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {art === "herb" ? (
          <>
            <ellipse cx="78" cy="150" rx="28" ry="12" fill="#3d6b4f" transform="rotate(-30 78 150)" />
            <ellipse cx="124" cy="128" rx="30" ry="12" fill="#2f5a40" transform="rotate(28 124 128)" />
            <ellipse cx="86" cy="104" rx="24" ry="10" fill="#4e7d5c" transform="rotate(-24 86 104)" />
            <ellipse cx="118" cy="82" rx="22" ry="9" fill="#1b4332" transform="rotate(20 118 82)" />
          </>
        ) : null}
        {art === "flower" ? (
          <>
            <circle cx="100" cy="78" r="14" fill="#8c5340" />
            <circle cx="100" cy="52" r="16" fill="#f7f3ea" />
            <circle cx="124" cy="68" r="16" fill="#f3d2c6" />
            <circle cx="116" cy="96" r="16" fill="#f7f3ea" />
            <circle cx="84" cy="96" r="16" fill="#f3d2c6" />
            <circle cx="76" cy="68" r="16" fill="#f7f3ea" />
            <ellipse cx="70" cy="150" rx="26" ry="12" fill="#3d6b4f" transform="rotate(-25 70 150)" />
            <ellipse cx="132" cy="146" rx="26" ry="12" fill="#2f5a40" transform="rotate(25 132 146)" />
          </>
        ) : null}
        {art === "fruit" ? (
          <>
            <circle cx="100" cy="86" r="28" fill="#c46b4a" />
            <path d="M100 62 C108 48 120 46 124 40" fill="none" stroke="#1b4332" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="112" cy="48" rx="10" ry="5" fill="#3d6b4f" transform="rotate(20 112 48)" />
            <ellipse cx="68" cy="160" rx="24" ry="11" fill="#3d6b4f" transform="rotate(-20 68 160)" />
            <ellipse cx="136" cy="154" rx="24" ry="11" fill="#2f5a40" transform="rotate(22 136 154)" />
          </>
        ) : null}
        <path d="M40 214 H160" stroke="#1b4332" strokeOpacity="0.25" strokeWidth="2" />
      </svg>
    </div>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={cn("size-9", className)} aria-hidden="true">
      <rect width="36" height="36" rx="12" fill="#1b4332" />
      <path
        d="M18 28 C18 20 12 17 12 11 C15 13 17 12 18 8 C19 12 21 13 24 11 C24 17 18 20 18 28Z"
        fill="#f3eee4"
      />
    </svg>
  );
}
