"use client";

import { useActionState } from "react";
import { loginAction } from "@/server/admin/login-action";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <form action={action} className="grid gap-4">
      <label className="grid gap-1 text-sm">
        Username
        <input name="username" autoComplete="username" required className="min-h-11 rounded-xl border border-border bg-card px-3" />
      </label>
      <label className="grid gap-1 text-sm">
        Password
        <input name="password" type="password" autoComplete="current-password" required className="min-h-11 rounded-xl border border-border bg-card px-3" />
      </label>
      {state?.error ? (
        <p role="alert" className="text-sm text-clay">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
