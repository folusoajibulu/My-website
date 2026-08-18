"use client";

import { useEffect, useState } from "react";

export function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (!url) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border py-8">
      <p className="eyebrow">Share</p>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs uppercase tracking-[0.14em] text-navy transition-colors hover:text-gold"
      >
        X
      </a>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs uppercase tracking-[0.14em] text-navy transition-colors hover:text-gold"
      >
        WhatsApp
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="text-xs uppercase tracking-[0.14em] text-navy transition-colors hover:text-gold"
      >
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
