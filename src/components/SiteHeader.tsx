"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  { label: "Commentary", to: "/commentary" },
  { label: "Areas of Thought", to: "/#areas-of-thought" },
  { label: "Career", to: "/#career" },
  { label: "Engage", to: "/#engage" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-[1200px] items-center justify-between px-6 md:h-20">
        <Link href="/" className="leading-none">
          <span className="block font-serif text-xl tracking-tight text-navy">
            Foluso Ajibulu
          </span>
          <span className="eyebrow mt-1 block text-[0.5625rem]">
            Historian · Writer · Commentator
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {nav.map((item) => {
            const active =
              item.to === "/commentary" && pathname.startsWith("/commentary");
            return (
              <Link
                key={item.label}
                href={item.to}
                className={`text-[0.75rem] font-medium uppercase tracking-[0.16em] transition-colors hover:text-gold ${
                  active ? "text-navy" : "text-muted-foreground"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
          className="text-[0.75rem] uppercase tracking-[0.16em] text-navy md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-border bg-cream px-6 py-5 md:hidden"
          aria-label="Mobile"
        >
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.to}
              onClick={() => setOpen(false)}
              className="block border-b border-border/70 py-3.5 text-[0.8125rem] uppercase tracking-[0.16em] text-navy last:border-b-0"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
