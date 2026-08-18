import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export default function NotFound() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-[720px] px-6 py-28 text-center md:py-36">
        <p className="eyebrow">Page not found</p>
        <h1 className="mt-5 font-serif text-4xl leading-tight text-navy sm:text-5xl">
          This page is not in the archive.
        </h1>
        <p className="mx-auto mt-6 max-w-md leading-relaxed text-muted-foreground">
          The address may have changed, or the essay has not been published.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/commentary" className="btn-solid">
            Browse commentary
          </Link>
          <Link href="/" className="btn-ghost">
            Return home
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
