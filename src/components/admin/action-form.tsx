"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/server/admin/mutations";

export function ActionForm({
  action,
  children,
  className,
  confirm,
}: {
  action: (previous: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  className?: string;
  confirm?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form
      action={formAction}
      className={className}
      onSubmit={(event) => {
        if (confirm && !window.confirm(confirm)) event.preventDefault();
      }}
    >
      {children}
      {state ? (
        <p role="status" className={state.ok ? "text-sm text-forest" : "text-sm text-clay"}>
          {state.message}
        </p>
      ) : null}
      {pending ? <p className="text-sm">Saving…</p> : null}
    </form>
  );
}
