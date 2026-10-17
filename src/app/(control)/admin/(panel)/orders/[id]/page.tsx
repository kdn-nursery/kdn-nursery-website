import { notFound } from "next/navigation";
import { ActionForm } from "@/components/admin/action-form";
import { addOrderNote, updateFulfilment } from "@/server/admin/mutations";
import { DatabaseSetup } from "@/components/admin/database-setup";
import { adminPrisma } from "@/server/admin/guard";
import { formatInr } from "@/lib/money";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prisma = adminPrisma();
  if (!prisma) return <DatabaseSetup />;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, events: { orderBy: { createdAt: "asc" } }, notes: { orderBy: { createdAt: "desc" } } },
  });
  if (!order) notFound();

  return (
    <div className="grid gap-6">
      <h2 className="font-display text-3xl text-forest">{order.orderNumber}</h2>
      <p>Payment: {order.paymentStatus}. This panel cannot mark an order as Razorpay paid or refunded.</p>
      <p>Fulfilment: {order.fulfilmentStatus}</p>
      <p>
        {order.customerName} · {order.customerPhone}
        <br />
        {order.deliveryLine} {order.pincode}
      </p>
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>
            {item.nameEn} / {item.nameTa} × {item.quantity} · {formatInr(item.lineTotalPaise, "en")}
          </li>
        ))}
      </ul>
      <ActionForm action={updateFulfilment} className="grid gap-3 rounded-[1.4rem] border border-border p-4">
        <input type="hidden" name="id" value={order.id} />
        <input type="hidden" name="version" value={order.version} />
        <label className="grid gap-1 text-sm">
          Next fulfilment status
          <select name="fulfilment" className="min-h-11 rounded-xl border border-border px-3">
            {["CONFIRMED", "PACKED", "DISPATCHED", "READY_FOR_PICKUP", "DELIVERED", "PICKED_UP", "CANCELLED"].map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <input name="courierName" defaultValue={order.courierName} aria-label="Courier name" placeholder="Courier" className="min-h-11 rounded-xl border border-border px-3" />
        <input name="trackingNumber" defaultValue={order.trackingNumber} aria-label="Tracking number" placeholder="Tracking number" className="min-h-11 rounded-xl border border-border px-3" />
        <input name="trackingUrl" defaultValue={order.trackingUrl} aria-label="Tracking URL" placeholder="https://" className="min-h-11 rounded-xl border border-border px-3" />
        <button className="min-h-11 rounded-full bg-primary px-5 text-primary-foreground">Update fulfilment</button>
        <p className="text-sm text-muted-foreground">Cancellation of a paid order stays unavailable until a real refund workflow exists. Receipt printing is not available yet.</p>
      </ActionForm>
      <section>
        <h3 className="font-display text-2xl">History</h3>
        {order.events.length === 0 ? <p className="text-sm">No status history yet.</p> : null}
        <ul className="mt-2 space-y-1 text-sm">
          {order.events.map((event) => (
            <li key={event.id}>{event.createdAt.toISOString()} · {event.summary}</li>
          ))}
        </ul>
      </section>
      <ActionForm action={addOrderNote} className="grid gap-2">
        <input type="hidden" name="id" value={order.id} />
        <textarea name="body" aria-label="Internal note" className="rounded-xl border border-border px-3 py-2" />
        <button className="min-h-11 rounded-full border border-border px-4">Save internal note</button>
      </ActionForm>
      <ul className="text-sm">
        {order.notes.map((note) => (
          <li key={note.id}>{note.createdAt.toISOString()} · {note.body}</li>
        ))}
      </ul>
    </div>
  );
}
