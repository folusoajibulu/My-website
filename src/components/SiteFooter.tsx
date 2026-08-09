import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="rule-top bg-cream">
      <div className="mx-auto max-w-[1200px] px-6 py-20">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr]">
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
                <Link to="/commentary" className="hover:text-gold">
                  Commentary
                </Link>
              </li>
              <li>
                <a href="/#areas-of-thought" className="hover:text-gold">
                  Topics
                </a>
              </li>
              <li>
                <a href="/#career" className="hover:text-gold">
                  Career
                </a>
              </li>
              <li>
                <a href="/#engage" className="hover:text-gold">
                  Speaking
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">Connect</p>
            <ul className="mt-5 space-y-3 text-sm text-navy">
              <li>
                <a href="mailto:info@folusoajibulu.com" className="hover:text-gold">
                  Email
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold">
                  X
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="rule-top mt-16 pt-6 text-xs text-muted-foreground">
          © 2026 Foluso Ajibulu. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
