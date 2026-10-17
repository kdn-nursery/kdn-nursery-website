import Link from "next/link";
import { DatabaseSetup } from "@/components/admin/database-setup";
import { adminPrisma } from "@/server/admin/guard";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; payment?: string; fulfilment?: string }>;
}) {
  const query = await searchParams;
  const q = query.q?.trim() ?? "";
  const payments = ["UNPAID", "PENDING", "AUTHORIZED", "PAID", "FAILED", "REFUNDED"] as const;
  const fulfilments = ["PENDING", "CONFIRMED", "PACKED", "DISPATCHED", "READY_FOR_PICKUP", "DELIVERED", "PICKED_UP", "CANCELLED"] as const;
  const payment = payments.find((status) => status === query.payment);
  const fulfilment = fulfilments.find((status) => status === query.fulfilment);
  const prisma = adminPrisma();
  if (!prisma) return <DatabaseSetup />;
  const orders = await prisma.order.findMany({
    where: {
      ...(q ? { orderNumber: { contains: q, mode: "insensitive" } } : {}),
      ...(payment ? { paymentStatus: payment } : {}),
      ...(fulfilment ? { fulfilmentStatus: fulfilment } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="grid gap-4">
      <h2 className="font-display text-3xl text-forest">Orders</h2>
      <p className="text-sm leading-6 text-muted-foreground">
        Checkout and Razorpay are not available yet. This list stays empty until a verified order exists. Payment status cannot be marked paid from this panel.
      </p>
      <form className="grid gap-3 md:grid-cols-4">
        <input name="q" defaultValue={q} aria-label="Order number" placeholder="Order number" className="min-h-11 rounded-xl border border-border px-3" />
        <select name="payment" defaultValue={query.payment ?? ""} aria-label="Payment status" className="min-h-11 rounded-xl border border-border px-3">
          <option value="">Any payment</option>
          {["UNPAID", "PENDING", "AUTHORIZED", "PAID", "FAILED", "REFUNDED"].map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <select name="fulfilment" defaultValue={query.fulfilment ?? ""} aria-label="Fulfilment status" className="min-h-11 rounded-xl border border-border px-3">
          <option value="">Any fulfilment</option>
          {["PENDING", "CONFIRMED", "PACKED", "DISPATCHED", "READY_FOR_PICKUP", "DELIVERED", "PICKED_UP", "CANCELLED"].map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <button className="min-h-11 rounded-full border border-border">Filter</button>
      </form>
      {orders.length === 0 ? (
        <p className="rounded-[1.4rem] border border-dashed border-border p-6">No orders to show.</p>
      ) : (
        <ul className="grid gap-2">
          {orders.map((order) => (
            <li key={order.id}>
              <Link href={`/admin/orders/${order.id}`} className="block rounded-xl border border-border p-4">
                {order.orderNumber} · {order.paymentStatus} · {order.fulfilmentStatus}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
