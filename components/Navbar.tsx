"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <span className="text-sm font-bold text-white">T</span>
          </div>
          <span className="text-lg font-bold text-foreground">Trend</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm text-muted transition-colors hover:text-foreground">
            Ana Sayfa
          </Link>
          <Link href="/explore" className="text-sm text-muted transition-colors hover:text-foreground">
            Keşfet
          </Link>
          <Link href="/explore?trending=true" className="text-sm text-muted transition-colors hover:text-foreground">
            Trend
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/explore"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            Keşfet →
          </Link>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg className="h-4 w-4 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/" className="text-sm text-muted transition-colors hover:text-foreground" onClick={() => setMobileOpen(false)}>
              Ana Sayfa
            </Link>
            <Link href="/explore" className="text-sm text-muted transition-colors hover:text-foreground" onClick={() => setMobileOpen(false)}>
              Keşfet
            </Link>
            <Link href="/explore?trending=true" className="text-sm text-muted transition-colors hover:text-foreground" onClick={() => setMobileOpen(false)}>
              Trend
            </Link>
            <Link
              href="/explore"
              className="mt-2 rounded-full bg-accent px-4 py-2 text-center text-sm font-medium text-white"
              onClick={() => setMobileOpen(false)}
            >
              Keşfet →
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
