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
                  href="mailto:folusoajibulu8@gmail.com"
                  className="transition-colors hover:text-gold block"
                >
                  folusoajibulu8@gmail.com
                </a>
                <a
                  href="mailto:folusoajibulu9@gmail.com"
                  className="transition-colors hover:text-gold block mt-2"
                >
                  folusoajibulu9@gmail.com
                </a>
              </li>
              <li className="text-muted-foreground">
                Lectures, interviews and public discussion.
              </li>
            </ul>
          </div>
        </div>

        <div className="rule-top mt-14 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground md:mt-16 space-y-4 md:space-y-0">
          <p>
            © {new Date().getFullYear()} Foluso Ajibulu. All rights reserved.
          </p>
          <p>
            Powered by <a href="https://yusufsaka.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors underline underline-offset-2">Yusuf</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
