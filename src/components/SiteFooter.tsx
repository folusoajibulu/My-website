import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="rule-top bg-cream">
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr] md:gap-14">
          <div className="max-w-sm">
            <p className="font-serif text-2xl text-navy">Foluso Ajibulu</p>
            <p className="eyebrow mt-3">Historian · Writer · Public Affairs Commentator</p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Thoughtful perspectives on history, governance, leadership and contemporary
              affairs.
            </p>
          </div>

          <div>
            <p className="eyebrow">Explore</p>
            <ul className="mt-5 space-y-3 text-sm text-navy">
              <li>
                <Link href="/commentary" className="transition-colors hover:text-gold">
                  Commentary
                </Link>
              </li>
              <li>
                <Link href="/#areas-of-thought" className="transition-colors hover:text-gold">
                  Topics
                </Link>
              </li>
              <li>
                <Link href="/#career" className="transition-colors hover:text-gold">
                  Career
                </Link>
              </li>
              <li>
                <Link href="/#engage" className="transition-colors hover:text-gold">
                  Speaking
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">Enquire</p>
            <ul className="mt-5 space-y-3 text-sm text-navy">
              <li>
                <a
                  href="mailto:info@folusoajibulu.com"
                  className="transition-colors hover:text-gold"
                >
                  info@folusoajibulu.com
                </a>
              </li>
              <li className="text-muted-foreground">
                Lectures, interviews and public discussion.
              </li>
            </ul>
          </div>
        </div>

        <p className="rule-top mt-14 pt-6 text-xs text-muted-foreground md:mt-16">
          © {new Date().getFullYear()} Foluso Ajibulu. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
