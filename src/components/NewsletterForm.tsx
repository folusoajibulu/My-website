"use client";

import { FormEvent, useState } from "react";

export function NewsletterForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <p className="max-w-md font-serif text-xl leading-snug text-navy">
        Thank you. New essays will arrive here when the list opens.
      </p>
    );
  }

  return (
    <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="email">
        Email address
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Email address"
        className="w-full border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-gold"
      />
      <button type="submit" className="btn-solid shrink-0">
        Subscribe
      </button>
    </form>
  );
}
