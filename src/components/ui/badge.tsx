import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      tone: {
        available: "bg-secondary text-forest",
        stock: "bg-[#f6e7e1] text-clay",
        sample: "border border-clay/30 bg-ivory text-clay",
        draft: "border border-border bg-card text-muted-foreground",
      },
    },
    defaultVariants: { tone: "draft" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
