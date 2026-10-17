"use client";

import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/server/admin/login-action";

const links = [
  ["Dashboard", "/admin"],
  ["Plants", "/admin/products"],
  ["Categories", "/admin/categories"],
  ["Orders", "/admin/orders"],
  ["Media", "/admin/media"],
  ["Website content", "/admin/content"],
  ["Settings", "/admin/settings"],
  ["Password", "/admin/account"],
];

export function AdminFrame({
  username,
  title,
  children,
}: {
  username: string;
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen md:grid md:grid-cols-[16rem_1fr]">
      <aside className="hidden border-r border-border bg-card md:block">
        <Nav username={username} />
      </aside>
      <div>
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <p className="text-xs tracking-[0.14em] text-clay uppercase">Admin</p>
            <h1 className="font-display text-2xl text-forest">{title}</h1>
          </div>
          <button type="button" className="min-h-11 rounded-full border border-border px-4 md:hidden" onClick={() => setOpen(true)}>
            Menu
          </button>
        </header>
        <div className="px-4 py-6 md:px-6">{children}</div>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" className="absolute inset-0 bg-forest/40" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-card p-4">
            <Nav username={username} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Nav({ username, onNavigate }: { username: string; onNavigate?: () => void }) {
  return (
    <nav className="flex h-full flex-col gap-1 p-4" aria-label="Admin">
      <p className="px-3 font-display text-xl text-forest">KDN</p>
      <p className="px-3 pb-3 text-xs text-muted-foreground">{username}</p>
      {links.map(([label, href]) => (
        <Link key={href} href={href} onClick={onNavigate} className="min-h-11 rounded-xl px-3 py-2 hover:bg-secondary">
          {label}
        </Link>
      ))}
      <Link href="/en" className="min-h-11 rounded-xl px-3 py-2 hover:bg-secondary">
        View website
      </Link>
      <form action={logoutAction} className="mt-auto">
        <button type="submit" className="min-h-11 w-full rounded-xl px-3 text-left hover:bg-secondary">
          Log out
        </button>
      </form>
    </nav>
  );
}
