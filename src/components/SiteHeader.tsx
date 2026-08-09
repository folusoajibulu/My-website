import { Link } from "@tanstack/react-router";
import { useState } from "react";

const nav = [
  { label: "Commentary", to: "/commentary" },
  { label: "Areas of Thought", to: "/#areas-of-thought" },
  { label: "Career", to: "/#career" },
  { label: "Engage", to: "/#engage" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-6">
        <Link to="/" className="leading-none">
          <span className="block font-serif text-xl tracking-tight text-navy">
            Foluso Ajibulu
          </span>
          <span className="eyebrow mt-1 block text-[0.5625rem]">
            Historian · Writer · Commentator
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.to}
              className="text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-gold"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
          className="text-[0.8125rem] uppercase tracking-[0.14em] text-navy md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-border bg-cream px-6 py-4 md:hidden">
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.to}
              onClick={() => setOpen(false)}
              className="block py-3 text-[0.8125rem] uppercase tracking-[0.14em] text-navy"
            >
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
