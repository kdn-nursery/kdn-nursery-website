"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/server/admin/login-action";
import { Button } from "@/components/ui/button";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, null);

  return (
    <form action={action} className="grid max-w-md gap-3">
      <label className="grid gap-1 text-sm">
        Current password
        <input name="current" type="password" autoComplete="current-password" required className="min-h-11 rounded-xl border border-border px-3" />
      </label>
      <label className="grid gap-1 text-sm">
        New password
        <input name="next" type="password" autoComplete="new-password" required className="min-h-11 rounded-xl border border-border px-3" />
      </label>
      {state ? <p role="alert">{state.message}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Change password"}
      </Button>
      <p className="text-sm text-muted-foreground">Changing the password signs out every admin session.</p>
    </form>
  );
}
