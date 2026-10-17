import Link from "next/link";
import { DatabaseSetup } from "@/components/admin/database-setup";
import { formatInr } from "@/lib/money";
import { adminPrisma } from "@/server/admin/guard";

export default async function AdminDashboardPage() {
  const prisma = adminPrisma();
  if (!prisma) return <DatabaseSetup />;
  const [total, published, drafts, available, outOfStock, orders, paid] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: "PUBLISHED" } }),
    prisma.product.count({ where: { status: "DRAFT" } }),
    prisma.product.count({ where: { availability: "AVAILABLE", status: { not: "ARCHIVED" } } }),
    prisma.product.count({ where: { availability: "OUT_OF_STOCK", status: { not: "ARCHIVED" } } }),
    prisma.order.count(),
    prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { totalPaise: true }, _count: true }),
  ]);
  const recent = orders > 0 ? await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }) : [];
  const cards = [
    ["Plants", total],
    ["Published", published],
    ["Drafts", drafts],
    ["Available", available],
    ["Out of stock", outOfStock],
    ["Orders", orders],
  ];

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, value]) => (
          <article key={String(label)} className="rounded-[1.4rem] border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 font-display text-4xl text-forest">{value}</p>
          </article>
        ))}
      </div>
      <article className="rounded-[1.4rem] border border-border bg-card p-5">
        <h2 className="font-display text-2xl text-forest">Verified sales</h2>
        {paid._count === 0 ? (
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            No verified payments yet. Checkout is not available, so this total stays empty rather than showing sample orders.
          </p>
        ) : (
          <p className="mt-3 font-display text-4xl text-forest">{formatInr(paid._sum.totalPaise ?? 0, "en")}</p>
        )}
      </article>
      <article className="rounded-[1.4rem] border border-border bg-card p-5">
        <h2 className="font-display text-2xl text-forest">Recent orders</h2>
        {recent.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No orders have been placed.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {recent.map((order) => (
              <li key={order.id}>
                <Link href={`/admin/orders/${order.id}`} className="underline">
                  {order.orderNumber}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </article>
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/products/new" className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-primary-foreground">
          Add a plant
        </Link>
        <Link href="/admin/products?availability=OUT_OF_STOCK" className="inline-flex min-h-11 items-center rounded-full border border-border px-5">
          Update stock
        </Link>
        <Link href="/admin/media" className="inline-flex min-h-11 items-center rounded-full border border-border px-5">
          Manage photographs
        </Link>
      </div>
    </div>
  );
}
